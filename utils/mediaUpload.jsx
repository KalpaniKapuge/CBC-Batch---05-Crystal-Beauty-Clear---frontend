import { createClient } from "@supabase/supabase-js";

// Move the URL and KEY into environment variables for security.
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY; // public anon key; do not expose service role in frontend

const supabase = createClient(url, key);

export default async function mediaUpload(file) {
  if (!file) throw new Error("No file selected");
  const timestamp = new Date().getTime();
  const newName = `${timestamp}_${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(newName, file, { upsert: false, cacheControl: "3600" });
  if (uploadError) {
    throw new Error("Error uploading file: " + uploadError.message);
  }
  const { data } = supabase.storage.from("images").getPublicUrl(newName);
  return data.publicUrl;
}