// Lightweight browser-only stubs for file upload/URL generation
// In production, replace with real backend integrations.

export async function UploadPrivateFile({ file }) {
  // In dev, we just return a blob URL as a stand-in "file_uri"
  const file_uri = URL.createObjectURL(file);
  return { file_uri };
}

export async function UploadFile(params) {
  return UploadPrivateFile(params);
}

export async function CreateFileSignedUrl({ file_uri }) {
  // In dev, the file_uri is already a blob URL we can download
  return { signed_url: file_uri };
}

