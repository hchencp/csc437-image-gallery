import { useState, useEffect } from "react";
import { ImageGrid } from "./ImageGrid.jsx";

export function AllImages() {
  // 1. Setup state for data, loading, and errors
  const [imageData, setImageData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // 2. Use useEffect to trigger the fetch when the component mounts
  useEffect(() => {
    async function doFetch() {
      try {
        // This relative URL works because of your Vite proxy!
        const response = await fetch("/api/images");

        if (!response.ok) {
          throw new Error(
            `Error: HTTP ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();
        setImageData(data);
      } catch (err) {
        // Catch network errors or non-JSON responses
        setError(err.message);
      } finally {
        // Always stop loading, regardless of success or failure
        setIsLoading(false);
      }
    }

    doFetch();
  }, []);

  // 3. Conditional rendering for the different states
  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2 style={{ color: "red" }}>{error}</h2>;
  }

  return (
    <>
      <h2>All Images</h2>
      <ImageGrid images={imageData} />
    </>
  );
}
