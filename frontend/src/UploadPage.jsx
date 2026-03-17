import { useState, useId } from "react";
import { useNavigate } from "react-router";

export function UploadPage({ authToken }) {
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Requirement: Fix accessibility with a unique ID
  const fileInputId = useId();
  const navigate = useNavigate();

  // Requirement: Add image preview
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Helper function provided in Lab 24 instructions
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setPreviewUrl(reader.result);
      reader.onerror = (err) => setError("Could not read file for preview");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setError("");

    // Requirement: Use FormData object for multipart/form-data
    const formData = new FormData(e.target);

    try {
      const response = await fetch("/api/images", {
        method: "POST",
        headers: {
          // Browser handles Content-Type automatically for FormData
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        // Requirement: Redirect to the new image details page
        navigate(`/images/${data.id}`);
      } else {
        const errData = await response.json();
        setError(errData.message || "Upload failed");
        setPreviewUrl(""); // Requirement: Clear preview on failure
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Upload New Image</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          {/* Requirement: Accessible label associated via htmlFor */}
          <label htmlFor={fileInputId}>Choose image to upload: </label>
          <input
            id={fileInputId}
            name="image" // Matches middlewareFactory.single("image")
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={handleFileChange}
            required
            disabled={isUploading}
          />
        </div>

        <div style={{ margin: "1rem 0" }}>
          <label>
            <span>Image title: </span>
            <input
              name="name"
              required
              disabled={isUploading}
              placeholder="Give your image a name"
            />
          </label>
        </div>

        {/* Requirement: Preview img element using data URL */}
        {previewUrl && (
          <div style={{ margin: "1rem 0" }}>
            <img
              style={{ width: "20em", maxWidth: "100%", borderRadius: "8px" }}
              src={previewUrl}
              alt="Preview"
            />
          </div>
        )}

        <input
          type="submit"
          value={isUploading ? "Uploading..." : "Confirm upload"}
          disabled={isUploading}
        />
      </form>
    </div>
  );
}
