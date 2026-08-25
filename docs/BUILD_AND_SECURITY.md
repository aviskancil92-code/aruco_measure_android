# Build, Release, Security, and Operations

## Architecture reality check

This repository is an Expo SDK 54 mobile project. The GitHub workflow builds an Android **preview APK** through EAS Build, which is the supported path for an Expo project. It does not execute Buildozer and it does not yet embed Python/Kivy/OpenCV/ArUco native processing. The current UI and measurement-domain contracts are ready for a custom native module or a separate Python/Kivy implementation; real ArUco detection must be validated on physical Android devices before a production accuracy claim.

## GitHub setup

Create an Expo/EAS account and create an access token with the minimum scope required for builds. Add it to the repository as an Actions secret named `EXPO_TOKEN`. Never commit this value, an Android keystore, a service-account JSON file, or `.env` files. The workflow only runs the APK build for pushes to `main` and manual dispatch; pull requests run quality gates without publishing a build.

The workflow performs dependency installation from the lockfile, TypeScript validation, linting, unit tests, Expo diagnostics, and a production dependency audit. The audit report is uploaded as an artifact even when upstream advisories exist, so findings remain visible rather than being silently ignored. The build job is gated on the deterministic code/configuration checks and uploads the build request to EAS. The resulting APK is available from the EAS build page; a future enhancement may use the EAS API to download it automatically as a GitHub artifact.

## Local commands

| Command | Purpose |
|---|---|
| `pnpm install --frozen-lockfile` | Reproducible dependency installation |
| `pnpm check` | TypeScript validation |
| `pnpm lint` | Static lint checks |
| `pnpm test` | Unit tests for measurement math and validation |
| `npx expo-doctor` | Expo dependency/config diagnostics |
| `eas build --platform android --profile preview` | Internal APK build |
| `eas build --platform android --profile production` | Store-oriented AAB build |

## Release procedure

1. Merge only after the `quality` job is green.
2. Trigger the workflow manually or push to `main`.
3. Open the EAS build URL emitted by the job and download the generated APK for internal testing.
4. Test camera permission denial, camera unavailable, marker missing, marker too small, tilted marker, object missing, unstable results, app background/resume, and low-light conditions on at least two Android devices.
5. Release only after a human verifies measurements against physical references and confirms that no sensitive data is collected unexpectedly.

## Security controls

The app is local-first and does not require user authentication or cloud storage for measurement history. Camera access is requested only when the user starts the camera. Do not add analytics, image upload, or remote inference without an explicit product decision and a privacy review. Keep permissions minimal, pin dependency ranges where practical, review lockfile changes, and run `pnpm audit --prod --audit-level high` in CI.

GitHub repository settings should require pull requests, enable Dependabot security updates, restrict Actions to approved actions where organizational policy requires it, and protect `main`. Use immutable action versions or reviewed major versions in a hardened organization. Rotate `EXPO_TOKEN` immediately if it is exposed.

## Performance and reliability targets

Camera processing must remain off the UI thread when native CV is integrated. Process a bounded number of frames, downsample before detection, reject invalid frames early, and smooth output rather than recalculating expensive transforms on every render. The UI must always represent unknown values as `—`, surface actionable validation states, and recover from denied permission or missing camera without crashing.

No software can honestly guarantee zero bugs. This package includes automated checks and defensive states, but a professional release still requires device matrix testing, native-module validation, privacy review, and acceptance testing with known-size objects.
