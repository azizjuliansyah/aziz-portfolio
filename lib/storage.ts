import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function saveFile(file: File, folder: "profiles" | "skills" | "projects" | "social-links"): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const extension = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  const filePath = path.join(uploadDir, fileName);

  // Ensure directory exists
  await mkdir(uploadDir, { recursive: true });

  // Save the file
  await writeFile(filePath, buffer);

  return `/uploads/${folder}/${fileName}`;
}

export async function deleteFile(filePath: string): Promise<void> {
  if (!filePath) return;

  try {
    const absolutePath = path.join(process.cwd(), "public", filePath);
    await unlink(absolutePath);
  } catch (error) {
    console.error(`Failed to delete file at ${filePath}:`, error);
  }
}
