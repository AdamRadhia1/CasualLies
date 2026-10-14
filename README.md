# Casually Lying

Static page: `index.html` + `assets/`. Answers are saved to Google Drive through a small Google Apps Script.

## Connect Google Drive (one-time)

1. Go to https://script.google.com and create a **New project**.
2. Replace the default code with the contents of `apps-script/Code.gs`.
3. Click **Deploy > New deployment > Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Approve the Drive permissions when asked, then copy the **Web app URL**.
5. Paste that URL into `SUBMISSION_URL` near the top of the script in `index.html`.

Each participant gets a folder in Drive named `<date time> <session id>` inside "Casually Lying Submissions", holding:

- `Q1 answer.webm` ... audio recordings (`.m4a` on Safari)
- `Q1 written answer.txt` ... for anyone who typed instead
- `Who.txt` ... "Anonymous", or their name and contact, if they chose on the last screen

If you change the script later, use **Deploy > Manage deployments > Edit > New version** so the URL stays the same.

## Preview without uploading

Open `index.html?preview` to click through every screen without sending anything.
Microphone recording needs `localhost` or https.
