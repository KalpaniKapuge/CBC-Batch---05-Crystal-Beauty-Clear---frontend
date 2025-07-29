import { createClient } from "@supabase/supabase-js";

const url = "https://ofviqmvabgpkantxleui.supabase.co";
const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdmlxbXZhYmdwa2FudHhsZXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MTE1NDgsImV4cCI6MjA2OTM4NzU0OH0.P-I_Mxr6k9JgmFHioJQ827swKfRi-aNQFSnxgvpUjW4";

const supabase = createClient(url, key);

export default function mediaUpload(file) {
  return new Promise(async (resolve, reject) => {
    if (file == null) {
      reject("No file selected");
      return;
    }

    const timestamp = new Date().getTime();
    const newName = timestamp + "_" + file.name;

    try {
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(newName, file, {
          upsert: false,
          cacheControl: "3600",
        });

      if (uploadError) {
        reject("Error uploading file");
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(newName);

      resolve(publicUrl);
    } catch (err) {
      reject("Unexpected error: " + err.message);
    }
  });
}
