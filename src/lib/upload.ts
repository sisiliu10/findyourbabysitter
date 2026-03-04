import { put, del } from "@vercel/blob";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function saveAvatar(
  file: File,
  userId: string,
): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Allowed: JPEG, PNG, WebP");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("File too large. Maximum 5MB.");
  }

  const ext = file.type.split("/")[1];
  const blob = await put(`avatars/${userId}.${ext}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
  });

  return blob.url;
}

export async function deleteAvatar(url: string): Promise<void> {
  if (url.includes(".blob.vercel-storage.com")) {
    await del(url);
  }
}
