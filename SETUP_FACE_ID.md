# Cloud Sync + Face ID / Touch ID setup

1. Upload this entire folder to GitHub Pages.
2. In Supabase Dashboard open **SQL Editor**, paste `SUPABASE_SETUP.sql`, and Run it once.
3. In **Authentication > URL Configuration**, set **Site URL** to your final GitHub Pages URL (for example `https://USERNAME.github.io/REPO/`). Add the same URL to Redirect URLs.
4. In **Authentication > Passkeys**, enable Passkey authentication.
5. Set **Relying Party ID** to the hostname only: normally `USERNAME.github.io` for GitHub Pages. Do not include `https://` or `/REPO/`.
6. Set **Relying Party Origins** to the origin only: normally `https://USERNAME.github.io` (no repo path).
7. Open the app. On first use choose **First-time email sign-in**. Open the email link and return to the app.
8. When signed in choose **Add Face ID / Touch ID** and approve the Apple passkey prompt.
9. On your other Apple device, open the same GitHub Pages app and choose **Unlock with Face ID / Passkey**. If iCloud Keychain sync is enabled, the passkey can be available across your Apple devices.

Important: Passkeys are currently experimental in Supabase. Your publishable key is intentionally included in browser code; never put a secret/service-role key in this repository. Row Level Security restricts each signed-in user to their own sync row.
