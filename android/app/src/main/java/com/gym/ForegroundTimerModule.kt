package com.gym

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class ForegroundTimerModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  init {
    instance = this
  }

  override fun getName(): String = "ForegroundTimer"

  @ReactMethod
  fun startTimer(options: ReadableMap, promise: Promise) {
    val label = if (options.hasKey("label")) options.getString("label").orEmpty() else "Timer"
    val seconds = if (options.hasKey("seconds")) options.getInt("seconds") else 0
    val forceReplace = if (options.hasKey("forceReplace")) options.getBoolean("forceReplace") else false

    if (seconds <= 0) {
      promise.reject("INVALID_DURATION", "Il timer deve essere maggiore di 0 secondi")
      return
    }

    val started = ForegroundTimerService.startTimer(
      reactApplicationContext,
      label,
      seconds,
      forceReplace,
    )
    if (!started) {
      promise.reject("TIMER_ALREADY_RUNNING", "Un timer è già in esecuzione")
      return
    }

    promise.resolve(createStateMap())
  }

  @ReactMethod
  fun stopTimer(promise: Promise) {
    ForegroundTimerService.stopTimer(reactApplicationContext)
    promise.resolve(createStateMap())
  }

  @ReactMethod
  fun getState(promise: Promise) {
    promise.resolve(createStateMap())
  }

  @ReactMethod
  fun addListener(eventName: String) {
  }

  @ReactMethod
  fun removeListeners(count: Double) {
  }

  private fun createStateMap() = Arguments.createMap().apply {
    val state = ForegroundTimerService.getCurrentState()
    putBoolean("running", state["running"] as Boolean)
    putInt("remainingSeconds", state["remainingSeconds"] as Int)
    putString("label", state["label"] as String)
  }

  companion object {
    private var instance: ForegroundTimerModule? = null

    fun emitTimerEvent(payload: Map<String, Any?>) {
      val module = instance ?: return
      val map = Arguments.createMap()

      payload.forEach { (key, value) ->
        when (value) {
          is Boolean -> map.putBoolean(key, value)
          is Int -> map.putInt(key, value)
          is Double -> map.putDouble(key, value)
          is String -> map.putString(key, value)
          null -> map.putNull(key)
        }
      }

      module.reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit("foregroundTimerEvent", map)
    }
  }
}
