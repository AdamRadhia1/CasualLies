// Receives submissions from the Casually Lying web page and saves them to Google Drive.
// Deploy as a web app (see README.md). Files are created in YOUR Drive, as you.

// Optional: ID of an existing Drive folder to hold all submissions.
// Leave empty to create a "Casually Lying Submissions" folder in My Drive.
const PARENT_FOLDER_ID = "";

const MAX_AUDIO_BASE64 = 30 * 1024 * 1024; // per recording, as base64 text
const EXTENSIONS = { webm: "webm", ogg: "ogg", mp4: "m4a", mpeg: "mp3", wav: "wav" };

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (!/^[A-Za-z0-9-]{8,64}$/.test(data.sessionId || "")) throw new Error("Bad session id");

    if (data.type === "submission") saveSubmission(data);
    else if (data.type === "identity") saveIdentity(data);
    else throw new Error("Unknown type");

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err.message || err) });
  }
}

function saveSubmission(data) {
  const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH-mm");
  const folder = parentFolder().createFolder(stamp + " " + data.sessionId);

  (data.answers || []).forEach(function (a, i) {
    const n = i + 1;
    if (a.audio && a.audio.base64) {
      if (a.audio.base64.length > MAX_AUDIO_BASE64) throw new Error("Recording too large");
      const mime = String(a.audio.mime || "audio/webm").split(";")[0];
      const ext = EXTENSIONS[mime.split("/")[1]] || "webm";
      const bytes = Utilities.base64Decode(a.audio.base64);
      folder.createFile(Utilities.newBlob(bytes, mime, "Q" + n + " answer." + ext));
    }
    if (a.text) {
      folder.createFile("Q" + n + " written answer.txt", a.question + "\n\n" + a.text, MimeType.PLAIN_TEXT);
    }
  });
}

function saveIdentity(data) {
  const folder = findSessionFolder(data.sessionId);
  if (!folder) throw new Error("Submission not found");
  const body = data.anonymous
    ? "Anonymous"
    : "Name: " + (data.name || "") + "\nContact: " + (data.contact || "");
  folder.createFile("Who.txt", body, MimeType.PLAIN_TEXT);
}

function parentFolder() {
  if (PARENT_FOLDER_ID) return DriveApp.getFolderById(PARENT_FOLDER_ID);
  const existing = DriveApp.getFoldersByName("Casually Lying Submissions");
  return existing.hasNext() ? existing.next() : DriveApp.createFolder("Casually Lying Submissions");
}

function findSessionFolder(sessionId) {
  const it = parentFolder().searchFolders("title contains '" + sessionId + "'");
  return it.hasNext() ? it.next() : null;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
