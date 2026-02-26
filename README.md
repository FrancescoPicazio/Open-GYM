# GYM App

A React Native fitness app to manage daily workout plans, track exercise progress, and run guided circuit/rest timers.

![alt text](https://github.com/FrancescoPicazio/Open-GYM/blob/main/images/showcase.png?raw=true)

## What this app does

The app helps users follow a structured training schedule divided by days. It supports:

- Email/password and Google sign-in
- Loading workout schedules from Firebase/Firestore
- Viewing daily exercises and exercise details
- Tracking sets, reps, load, notes, and completion status
- Running circuit sessions with work/rest phases
- Running per-set recovery timers in exercise detail
- Foreground timer notifications on Android with live countdown and a **Stop** action
- Timer completion alerts with sound/vibration (including while app is backgrounded or device is locked)

## Main user flow

1. User signs in.
2. App loads the latest workout schedule.
3. User selects a day and opens an exercise.
4. User updates set data and marks progress.
5. User can run:
   - Circuit timer from the day screen
   - Recovery timer from exercise sets
6. App prevents starting multiple timers at the same time and offers to replace an active one.

## Key features

### Authentication

- Firebase Authentication
- Google Sign-In integration
- Optional credential persistence (remember me)

### Workout management

- Day-based workout structure
- Exercise list and detailed exercise editor
- Set-level completion and day reset
- Circuit completion tracking

### Timer system (Android)

- Foreground service timer for reliable countdown
- Persistent notification with remaining time
- Notification action to stop timer
- Works when app is closed/backgrounded
- Audio/vibration alert at timer completion

## Tech stack

- React Native 0.84
- TypeScript
- Firebase (`@react-native-firebase/app`, `auth`, `firestore`)
- Google Sign-In (`@react-native-google-signin/google-signin`)
- AsyncStorage
- Native Android foreground service (Kotlin)

## Project structure

- `src/components/` UI screens and workout flows
- `src/api/` Firebase access and timer bridge modules
- `src/types/` workout domain types
- `android/` native Android service and notification implementation
- `ios/` iOS project files

## Getting started

### Prerequisites

- Node.js (see `package.json` engines)
- React Native environment configured
- Android Studio + SDK
- Java/JDK compatible with your RN setup
- Firebase project configured for Android/iOS

### Install dependencies

```sh
npm install
```

### Start Metro

```sh
npm start
```

### Run on Android

```sh
npm run android
```

### Run on iOS

```sh
bundle install
bundle exec pod install
npm run ios
```

## Configurations

### 1) Firebase keys and app config

Set up Firebase for both platforms before running authentication and Firestore features.

- Android:
  - Place your Firebase Android config file at `android/app/google-services.json`
  - Ensure your Android app package matches `com.gym` (or update `applicationId` in `android/app/build.gradle`)
- iOS:
  - Place your Firebase iOS config file at `ios/GYM/GoogleService-Info.plist`
  - Make sure it is included in the Xcode target
- Google Sign-In:
  - Configure SHA certificates in Firebase console (Android)
  - Configure OAuth client IDs in Google/Firebase
  - Set the correct Web Client ID in `src/components/login_page.tsx`

### 2) Firestore database structure (template)

Use a structure compatible with the app domain.
Below is a template you can fill with your final model.
The application read the documents day_1, day_2 and day_3
```text
schede (collection)
   {scheduleId} (document)
         day_1:
            giorno: number
            esercizi: array
               - nome: string
                  immagine: string | null
                  note: string
                  done: boolean
                  serie: array
                     - ripetizioni: number | string | null
                        carico: number | null
                        recupero: number | string | null
                        done: boolean
                  ...
            circuito:
               round: number
               durata_esercizio: string | null
               recupero: string | null
               done: boolean
               esercizi: array
                  - nome: string
                     immagine: string | null
                     note: string
               ...
```

Notes:

- Keep field names aligned with app types in `src/types/workout.ts`
- Ensure `days` keys match expected values (`day_1`, `day_2`, ...)
- Update `src/api/workout_repository.ts` if you change field names or nesting

## Android permissions used

- `INTERNET`
- `VIBRATE`
- `FOREGROUND_SERVICE`
- `FOREGROUND_SERVICE_DATA_SYNC`
- `POST_NOTIFICATIONS` (Android 13+)

## Notes

- Timer reliability and persistent timer notifications are implemented on Android via native foreground service.
- Notification small icon uses Android status-bar icon resources (`drawable-* / ic_stat_name`).
- If you change notification channels or icon behavior, reinstalling the app may be required on some devices.

## Scripts

- `npm run android` – build and run Android app
- `npm run android:release` – build release APK (Hermes disabled for Windows build compatibility)
- `npm run android:aab` – build release AAB (Hermes disabled for Windows build compatibility)
- `npm run ios` – build and run iOS app
- `npm start` – start Metro
- `npm run lint` – lint code
- `npm test` – run tests
