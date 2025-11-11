// infraestructure/interface/upload-audio.ts
import { Platform } from "react-native";

const CLOUD_NAME    = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

if (!CLOUD_NAME || !UPLOAD_PRESET) {
  throw new Error("[Cloudinary] Faltan EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME o EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET");
}

export async function uploadAudioToCloudinary(uri: string, fileName?: string): Promise<string> {
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;
  const fd = new FormData();
  fd.append("upload_preset", UPLOAD_PRESET);
  fd.append("folder", "lexyvoz/audios");

  if (Platform.OS === "web") {
    const resp = await fetch(uri);
    if (!resp.ok) throw new Error(`No se pudo leer el blob (${resp.status})`);
    const blob = await resp.blob();
    const mime = blob.type || "audio/webm";
    const ext  = (mime.split("/")[1] || "webm").toLowerCase();
    const name = fileName ?? `voz_${Date.now()}.${ext}`;
    fd.append("file", blob, name);
  } else {
    const extFromUri = (uri.split(".").pop() || "m4a").toLowerCase();
    const name = fileName ?? `voz_${Date.now()}.${extFromUri}`;
    const type =
      extFromUri === "m4a" ? "audio/m4a" :
      extFromUri === "mp3" ? "audio/mpeg" :
      extFromUri === "wav" ? "audio/wav"  :
      extFromUri === "aac" ? "audio/aac"  :
      "audio/m4a"; // default útil

    fd.append("file", { uri, name, type } as any);
  }

  const r = await fetch(endpoint, { method: "POST", body: fd });
  const json = await r.json().catch(() => ({}));

  if (!r.ok) throw new Error(`Cloudinary upload failed (${r.status}): ${JSON.stringify(json)}`);
  if (!json.secure_url) throw new Error("Cloudinary response without secure_url");
  return json.secure_url as string;
}
