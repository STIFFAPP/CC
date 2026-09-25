# Confidence Hub — Cloud Sync + Passkeys

Configured for:
- GitHub Pages: https://stiffapp.github.io/CC/
- Supabase project: https://cxrfobwwjfnzwjunzrvs.supabase.co
- WebAuthn RP ID: stiffapp.github.io
- WebAuthn origin: https://stiffapp.github.io

The Supabase database table `user_app_data` has already been created in your current project. You do not need to run `SUPABASE_SETUP.sql` again unless you create a new Supabase project.

## First sign-in
1. Upload the contents of this folder to the root of the GitHub repository that publishes `/CC/`.
2. Open https://stiffapp.github.io/CC/.
3. Press **First-time email sign-in** and enter your email address.
4. Open the secure link Supabase emails you and return to the Hub.
5. When the Hub shows **Synced**, press **Add Face ID / Touch ID** and approve the passkey prompt.

## Other Apple devices
Open the same Hub and choose **Unlock with Face ID / Passkey**. Availability across devices depends on where your passkey is stored/synced (for example iCloud Keychain).

Note: Supabase passkey support is experimental as of September 2026 and requires supabase-js v2.105.0+ plus the experimental passkey client option. This bundle is configured accordingly.
