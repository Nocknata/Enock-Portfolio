
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function ProjectImageUpload({ project, onImageUploaded }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleFileChange(event) {
    setError("");
    setSuccess("");

    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError("Please select a PNG, JPEG, or WebP image.");
      setFile(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("Image must be smaller than 5 MB.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  }

  async function handleUpload() {
    if (!file || uploading) return;

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const extension = file.type.split("/")[1] === "jpeg"
        ? "jpg"
        : file.type.split("/")[1];

      const filePath =
        `${project.id}/${crypto.randomUUID()}.${extension}`;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public image URL
      const { data: urlData } = supabase.storage
        .from("project-images")
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;

      // Save image URL to project record
      const { data, error: updateError } = await supabase
        .from("projects")
        .update({
          image_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", project.id)
        .select("id")
        .single();

      if (updateError) throw updateError;

      if (!data) {
        throw new Error("Could not update the project image.");
      }

      setSuccess("Project image uploaded successfully!");
      setFile(null);

      if (onImageUploaded) {
        onImageUploaded();
      }
    } catch (err) {
      setError(err.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="project-image-upload">
      <h3>Upload Project Image</h3>

      <p>Project: {project.title}</p>

      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
      />

      {file && <p>Selected: {file.name}</p>}

      {error && <p role="alert">{error}</p>}

      {success && <p role="status">{success}</p>}

      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
}

export default ProjectImageUpload;
