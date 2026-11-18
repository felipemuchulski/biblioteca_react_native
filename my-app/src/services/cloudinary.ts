type CloudinaryUploadResponse = {
  secure_url?: string;
  error?: { message?: string };
};

const getCloudinaryConfig = () => {
  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim();

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Configure EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME e EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET para enviar as imagens.",
    );
  }

  return { cloudName, uploadPreset };
};

async function uploadImage(uri: string): Promise<string> {
  const { cloudName, uploadPreset } = getCloudinaryConfig();
  const form = new FormData();
  const extension = uri.split("?")[0].split(".").pop()?.toLowerCase();
  const mimeType =
    extension === "png"
      ? "image/png"
      : extension === "webp"
        ? "image/webp"
        : "image/jpeg";

  const filename = `book-${Date.now()}.${extension || "jpg"}`;
  form.append("file", {
    uri,
    name: filename,
    type: mimeType,
  } as unknown as Blob);
  form.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
    { method: "POST", body: form },
  );

  let result: CloudinaryUploadResponse;
  try {
    result = (await response.json()) as CloudinaryUploadResponse;
  } catch {
    throw new Error("O Cloudinary retornou uma resposta inválida.");
  }

  if (!response.ok || !result.secure_url) {
    throw new Error(
      result.error?.message ||
        "Não foi possível enviar uma imagem ao Cloudinary.",
    );
  }

  return result.secure_url;
}

export function uploadBookImages(uris: string[]): Promise<string[]> {
  if (uris.length === 0) return Promise.resolve([]);
  return Promise.all(uris.map(uploadImage));
}
