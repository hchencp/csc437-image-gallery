import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { ImageNameEditor } from "./ImageNameEditor";

// 1. Accept authToken as a prop
export function ImageDetails({ authToken }) {
  const { id } = useParams();

  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function doFetch() {
      try {
        // 2. Add Authorization header to the GET request
        const response = await fetch(`/api/images/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
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

    if (authToken) {
      doFetch();
    }
  }, [id, authToken]); // Re-run if ID or Token changes

  const handleNameUpdate = (newName) => {
    setImage({ ...image, name: newName });
  };

  if (isLoading) return <h2>Loading...</h2>;
  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

  if (!image) return <h2>Image not found</h2>;

  return (
    <>
      <h2>{image.name}</h2>
      <p>
        Uploaded by: {image.author.username} ({image.author.email})
      </p>

      {/* 3. Pass the authToken down to the editor so it can authorize the RENAME (PATCH) */}
      <ImageNameEditor
        imageId={image._id}
        initialValue={image.name}
        onNameUpdated={handleNameUpdate}
        authToken={authToken}
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
