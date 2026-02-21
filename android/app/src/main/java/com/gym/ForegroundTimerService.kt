package com.gym

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.media.AudioManager
import android.media.MediaPlayer
import android.media.RingtoneManager
import android.media.ToneGenerator
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat

class ForegroundTimerService : Service() {

  private val handler = Handler(Looper.getMainLooper())
  private var ticker: Runnable? = null

  override fun onCreate() {
    super.onCreate()
    createNotificationChannel()
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    val hasPendingForegroundStart = synchronized(stateLock) { startRequested }

    if (intent?.action == null) {
      stopTimer(emitStoppedEvent = false)
      return START_NOT_STICKY
    }

    if (hasPendingForegroundStart) {
      ensureForegroundStarted()
    }

    when (intent?.action) {
      ACTION_STOP -> {
        stopTimer(emitStoppedEvent = true)
        return START_NOT_STICKY
      }

      ACTION_START -> {
        ensureForegroundStarted()

        synchronized(stateLock) {
          startRequested = false
        }

        val label = intent.getStringExtra(EXTRA_LABEL).orEmpty().ifBlank { "Timer" }
        val seconds = intent.getIntExtra(EXTRA_SECONDS, 0)
        val forceReplace = intent.getBooleanExtra(EXTRA_FORCE_REPLACE, false)
        if (seconds <= 0) {
          stopTimer(emitStoppedEvent = false)
          return START_NOT_STICKY
        }

        if (isRunning() && !forceReplace) {
          ForegroundTimerModule.emitTimerEvent(
            mapOf(
              "status" to "already_running",
              "remainingSeconds" to getCurrentState()["remainingSeconds"],
              "label" to getCurrentState()["label"],
            )
          )
          return START_NOT_STICKY
        }

        if (isRunning() && forceReplace) {
          stopTicker()
        }

        synchronized(stateLock) {
          timerLabel = label
          durationSeconds = seconds
          endAtEpochMs = System.currentTimeMillis() + seconds * 1000L
          running = true
        }

        startForeground(NOTIFICATION_ID, buildNotification())
        startTicker()
        emitRunningState()
        return START_NOT_STICKY
      }

      else -> {
        stopTimer(emitStoppedEvent = false)
        return START_NOT_STICKY
      }
    }
  }

  private fun ensureForegroundStarted() {
    try {
      startForeground(NOTIFICATION_ID, buildNotification())
    } catch (_: Exception) {
      val fallback = NotificationCompat.Builder(this, CHANNEL_ID)
        .setSmallIcon(R.mipmap.ic_launcher)
        .setContentTitle("Timer")
        .setContentText("Avvio timer...")
        .setOngoing(true)
        .setOnlyAlertOnce(true)
        .build()
      startForeground(NOTIFICATION_ID, fallback)
    }
  }

  override fun onDestroy() {
    stopTicker()
    synchronized(stateLock) {
      running = false
      startRequested = false
      endAtEpochMs = 0L
      durationSeconds = 0
      timerLabel = "Timer"
    }
    super.onDestroy()
  }

  override fun onBind(intent: Intent?): IBinder? = null

  private fun startTicker() {
    stopTicker()
    ticker = object : Runnable {
      override fun run() {
        if (!isRunning()) {
          return
        }

        val secondsLeft = getSecondsLeft()
        if (secondsLeft <= 0) {
          playAlarm()
          showCompletionNotification()
          ForegroundTimerModule.emitTimerEvent(
            mapOf(
              "status" to "finished",
              "remainingSeconds" to 0,
              "label" to getCurrentState()["label"],
            )
          )
          stopTimer(emitStoppedEvent = false)
          return
        }

        NotificationManagerCompat.from(this@ForegroundTimerService)
          .notify(NOTIFICATION_ID, buildNotification())
        emitRunningState()
        handler.postDelayed(this, 1000)
      }
    }

    handler.post(ticker as Runnable)
  }

  private fun stopTicker() {
    ticker?.let { handler.removeCallbacks(it) }
    ticker = null
  }

  private fun stopTimer(emitStoppedEvent: Boolean) {
    stopTicker()
    synchronized(stateLock) {
      running = false
      startRequested = false
      endAtEpochMs = 0L
      durationSeconds = 0
      timerLabel = "Timer"
    }

    if (emitStoppedEvent) {
      ForegroundTimerModule.emitTimerEvent(
        mapOf(
          "status" to "stopped",
          "remainingSeconds" to 0,
          "label" to "Timer",
        )
      )
    }

    stopForeground(STOP_FOREGROUND_REMOVE)
    stopSelf()
  }

  private fun emitRunningState() {
    val state = getCurrentState()
    ForegroundTimerModule.emitTimerEvent(
      mapOf(
        "status" to "running",
        "remainingSeconds" to state["remainingSeconds"],
        "label" to state["label"],
      )
    )
  }

  private fun buildNotification(): Notification {
    val stopIntent = Intent(this, ForegroundTimerService::class.java).apply {
      action = ACTION_STOP
    }

    val stopPendingIntent = PendingIntent.getService(
      this,
      REQUEST_CODE_STOP,
      stopIntent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )

    val launchIntent = packageManager.getLaunchIntentForPackage(packageName)
    val contentPendingIntent = PendingIntent.getActivity(
      this,
      REQUEST_CODE_OPEN_APP,
      launchIntent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )

    val state = getCurrentState()
    val remaining = state["remainingSeconds"] as Int
    val label = state["label"] as String

    return NotificationCompat.Builder(this, CHANNEL_ID)
      .setSmallIcon(R.drawable.ic_stat_name)
      .setContentTitle(label)
      .setContentText("Tempo rimanente: ${remaining}s")
      .setOnlyAlertOnce(true)
      .setOngoing(true)
      .setSilent(true)
      .setContentIntent(contentPendingIntent)
      .addAction(0, "Interrompi", stopPendingIntent)
      .build()
  }

  private fun showCompletionNotification() {
    val launchIntent = packageManager.getLaunchIntentForPackage(packageName)
    val contentPendingIntent = PendingIntent.getActivity(
      this,
      REQUEST_CODE_OPEN_APP,
      launchIntent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )

    val label = getCurrentState()["label"] as String
    val notification = NotificationCompat.Builder(this, FINISH_CHANNEL_ID)
      .setSmallIcon(R.drawable.ic_stat_name)
      .setContentTitle(label)
      .setContentText("Timer completato")
      .setPriority(NotificationCompat.PRIORITY_HIGH)
      .setAutoCancel(true)
      .setContentIntent(contentPendingIntent)
      .setDefaults(Notification.DEFAULT_SOUND or Notification.DEFAULT_VIBRATE)
      .build()

    NotificationManagerCompat.from(this)
      .notify(FINISH_NOTIFICATION_ID, notification)
  }

  private fun createNotificationChannel() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return

    val notificationManager = getSystemService(NotificationManager::class.java)
    val channel = NotificationChannel(
      CHANNEL_ID,
      "Timer Allenamento",
      NotificationManager.IMPORTANCE_LOW,
    ).apply {
      description = "Mostra lo stato del timer in esecuzione"
    }
    notificationManager.createNotificationChannel(channel)

    val finishChannel = NotificationChannel(
      FINISH_CHANNEL_ID,
      "Timer Allenamento - Fine",
      NotificationManager.IMPORTANCE_HIGH,
    ).apply {
      description = "Notifica sonora alla fine del timer"
      enableVibration(true)
      val soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
        ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
      val audioAttributes = android.media.AudioAttributes.Builder()
        .setUsage(android.media.AudioAttributes.USAGE_ALARM)
        .setContentType(android.media.AudioAttributes.CONTENT_TYPE_SONIFICATION)
        .build()
      setSound(soundUri, audioAttributes)
    }
    notificationManager.createNotificationChannel(finishChannel)
  }

  private fun playAlarm() {
    val alarmUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
      ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)

    try {
      val ringtone = RingtoneManager.getRingtone(applicationContext, alarmUri)
      ringtone?.play()
    } catch (_: Exception) {
    }

    try {
      if (alarmUri != null) {
        val player = MediaPlayer().apply {
          setAudioStreamType(AudioManager.STREAM_ALARM)
          setDataSource(applicationContext, alarmUri)
          isLooping = false
          setOnPreparedListener { it.start() }
          setOnCompletionListener { it.release() }
          prepareAsync()
        }

        handler.postDelayed({
          try {
            player.release()
          } catch (_: Exception) {
          }
        }, 4000)
      }
    } catch (_: Exception) {
    }

    try {
      val toneGenerator = ToneGenerator(AudioManager.STREAM_ALARM, 100)
      toneGenerator.startTone(ToneGenerator.TONE_CDMA_ALERT_CALL_GUARD, 500)
      handler.postDelayed({
        toneGenerator.startTone(ToneGenerator.TONE_CDMA_ALERT_CALL_GUARD, 500)
      }, 650)
      handler.postDelayed({
        toneGenerator.release()
      }, 1400)
    } catch (_: Exception) {
    }
  }

  companion object {
    private const val CHANNEL_ID = "workout_timer_channel"
    private const val FINISH_CHANNEL_ID = "workout_timer_finish_channel_v2"
    private const val NOTIFICATION_ID = 7301
    private const val FINISH_NOTIFICATION_ID = 7302
    private const val REQUEST_CODE_STOP = 9101
    private const val REQUEST_CODE_OPEN_APP = 9102

    const val ACTION_START = "com.gym.timer.START"
    const val ACTION_STOP = "com.gym.timer.STOP"
    const val EXTRA_LABEL = "label"
    const val EXTRA_SECONDS = "seconds"
    const val EXTRA_FORCE_REPLACE = "forceReplace"

    private val stateLock = Any()
    private var running = false
    private var startRequested = false
    private var timerLabel = "Timer"
    private var durationSeconds = 0
    private var endAtEpochMs = 0L

    fun isRunning(): Boolean = synchronized(stateLock) { running }

    fun getSecondsLeft(): Int = synchronized(stateLock) {
      if (!running) return 0
      val remainingMs = endAtEpochMs - System.currentTimeMillis()
      val seconds = kotlin.math.ceil(remainingMs / 1000.0).toInt()
      if (seconds > 0) seconds else 0
    }

    fun getCurrentState(): Map<String, Any> {
      val currentRunning = isRunning()
      return mapOf(
        "running" to currentRunning,
        "remainingSeconds" to if (currentRunning) getSecondsLeft() else 0,
        "label" to synchronized(stateLock) { timerLabel },
      )
    }

    fun startTimer(context: Context, label: String, seconds: Int, forceReplace: Boolean): Boolean {
      var shouldUseForegroundStart = false

      synchronized(stateLock) {
        if (seconds <= 0) return false
        if ((running || startRequested) && !forceReplace) return false
        shouldUseForegroundStart = !running && !startRequested
        if (shouldUseForegroundStart) {
          startRequested = true
        }
      }

      val intent = Intent(context, ForegroundTimerService::class.java).apply {
        action = ACTION_START
        putExtra(EXTRA_LABEL, label)
        putExtra(EXTRA_SECONDS, seconds)
        putExtra(EXTRA_FORCE_REPLACE, forceReplace)
      }

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && shouldUseForegroundStart) {
        context.startForegroundService(intent)
      } else {
        context.startService(intent)
      }

      return true
    }

    fun stopTimer(context: Context) {
      val intent = Intent(context, ForegroundTimerService::class.java).apply {
        action = ACTION_STOP
      }
      context.startService(intent)
    }
  }
}
