import { useState, useEffect } from "react";
import { ImageGrid } from "./ImageGrid.jsx";

// 1. Accept authToken as a prop
export function AllImages({ authToken }) {
  const [imageData, setImageData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function doFetch() {
      try {
        // 2. Add the Authorization header to the fetch call
        const response = await fetch("/api/images", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(
            `Error: HTTP ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();
        setImageData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    // Only attempt fetch if we have a token (good practice for SPAs)
    if (authToken) {
      doFetch();
    }
  }, [authToken]); // 3. Re-run fetch if the token changes (e.g., logging in/out)

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
