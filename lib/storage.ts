import { supabaseAdmin as supabase } from "@/config/db";
import { v4 as uuidv4 } from "uuid";

/**
 * Ensures a storage bucket exists and is public.
 */
async function ensureBucket(bucketName: string) {
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) throw listError;

    const exists = buckets?.some((b) => b.name === bucketName);

    if (!exists) {
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
      });
      if (createError) {
        console.error(`Error creating bucket ${bucketName}:`, createError);
      }
    }
  } catch (error) {
    console.error(`Error checking/creating bucket ${bucketName}:`, error);
  }
}

/**
 * Saves a file to Supabase Storage and returns the public URL.
 */
export async function saveFile(file: File, folder: "profiles" | "skills" | "projects" | "social-links" | "certificates" | "settings"): Promise<string> {
  const bucketName = folder;
  
  // Ensure bucket exists (programmatic creation as requested)
  await ensureBucket(bucketName);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const extension = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${extension}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw new Error(`Failed to upload file to Supabase: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  return publicUrl;
}

/**
 * Deletes a file from Supabase Storage given its public URL.
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  if (!fileUrl) return;

  // If it's an old local path, ignore or we could try to handle it.
  // But since we are migrating, we focus on Supabase URLs.
  if (fileUrl.startsWith("/uploads/")) {
    console.log(`Skipping deletion of local file path: ${fileUrl}`);
    return;
  }

  try {
    // Expected format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[fileName]
    const urlParts = fileUrl.split("/storage/v1/object/public/");
    if (urlParts.length < 2) {
      console.warn("Could not parse Supabase URL for deletion:", fileUrl);
      return;
    }

    const pathParts = urlParts[1].split("/");
    const bucketName = pathParts[0];
    const fileName = pathParts.slice(1).join("/");

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([fileName]);

    if (error) {
      console.error(`Failed to delete file from Supabase:`, error);
    }
  } catch (error) {
    console.error(`Failed to delete file at ${fileUrl}:`, error);
  }
}
