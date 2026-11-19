type CloudinaryUploadResponse = {
  secure_url?: string;
  error?: { message?: string };
};

const getCloudinaryConfig = () => {
  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim();

  if (!cloudName || !uploadPreset) {
    console.error(
      "Configure EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME e EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET para enviar as imagens.",
    );
    throw new Error(
      "Erro ao enviar imagens. Pendente cloudName e uploadPreset.",
    );
  }

  return { cloudName, uploadPreset };
};

const uploadImage = async (uri: string): Promise<string> => {
  const { cloudName, uploadPreset } = getCloudinaryConfig();
  const form = new FormData();
  if (!uri.startsWith("data:image/")) {
    throw new Error("Não foi possível obter os dados da imagem selecionada.");
  }
  form.append("file", uri);
  form.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
    { method: "POST", body: form },
  );

  let cloudinaryResponse: CloudinaryUploadResponse;
  try {
    cloudinaryResponse = (await response.json()) as CloudinaryUploadResponse;
  } catch (error) {
    throw new Error("O Cloudinary retornou uma resposta inválida.");
  }

  if (!response.ok || !cloudinaryResponse.secure_url) {
    throw new Error(
      cloudinaryResponse.error?.message ||
        "Não foi possível enviar uma imagem ao Cloudinary.",
    );
  }

  return cloudinaryResponse.secure_url;
};

export const uploadBookImages = (uris: string[]): Promise<string[]> => {
  if (uris.length === 0) return Promise.resolve([]);

  return Promise.all(uris.map(uploadImage));
};
