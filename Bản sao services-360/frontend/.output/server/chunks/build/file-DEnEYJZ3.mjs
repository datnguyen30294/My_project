const ATTACHMENT_MAX_FILES = 10;
const ATTACHMENT_MAX_FILE_SIZE = 10 * 1024 * 1024;
const ATTACHMENT_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
];
function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function isImageMime(mime) {
  return mime.startsWith("image/");
}

export { ATTACHMENT_MAX_FILES as A, ATTACHMENT_ALLOWED_TYPES as a, ATTACHMENT_MAX_FILE_SIZE as b, formatFileSize as f, isImageMime as i };
//# sourceMappingURL=file-DEnEYJZ3.mjs.map
