# Security Policy

## Supported versions

Security fixes are applied to the latest `main` branch and the latest tagged release. This project is an early-stage mobile application; do not use it for safety-critical measurement decisions without independent verification.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability. Contact the repository maintainers through a private GitHub security advisory with a description, reproduction steps, affected version, impact, and any safe mitigation. Do not include camera images, personal information, access tokens, signing keys, or other secrets in the report.

## Secret rules

`EXPO_TOKEN` belongs only in GitHub Actions repository secrets. Never commit `.env` files, EAS credentials, Android keystores, signing passwords, API tokens, camera images, or generated user data. Rotate any credential that appears in logs or commits.

## Privacy boundary

The application requests camera access for the measurement flow. The intended local-first architecture does not upload camera frames or require user accounts. Any future cloud processing, analytics, or image storage requires an explicit privacy review, consent flow, data retention decision, and updated documentation.
