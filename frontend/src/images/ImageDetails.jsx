import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { ImageNameEditor } from "./ImageNameEditor"; // Adjust path if necessary

export function ImageDetails() {
  const { id } = useParams();

  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function doFetch() {
      try {
        // API 1: Fetch ONLY the specific image by its ID
        const response = await fetch(`/api/images/${id}`);

        if (!response.ok) {
          // If the ID is invalid or missing, this will catch the 404
          throw new Error(`Error: HTTP ${response.status}`);
        }

        const foundImage = await response.json();
        setImage(foundImage);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    doFetch();
  }, [id]);

  // Callback to update the heading immediately after a successful rename
  const handleNameUpdate = (newName) => {
    // Requirement: Do not mutate state directly. Create a shallow copy.
    setImage({ ...image, name: newName });
  };

  if (isLoading) return <h2>Loading...</h2>;
  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

  if (!image) {
    return <h2>Image not found</h2>;
  }

  return (
    <>
      {/* This heading will update automatically thanks to handleNameUpdate */}
      <h2>{image.name}</h2>

      <p>
        Uploaded by: {image.author.username} ({image.author.email})
      </p>

      {/* Lab 22b: Add the editor component here */}
      <ImageNameEditor
        imageId={image._id}
        initialValue={image.name}
        onNameUpdated={handleNameUpdate}
      />

      <p>Database ID: {image._id}</p>

      <img
        className="ImageDetails-img"
        src={image.src}
        alt={image.name}
        style={{ maxWidth: "100%" }}
      />
    </>
  );
}
