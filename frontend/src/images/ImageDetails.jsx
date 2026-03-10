import { useState } from "react";
import { useParams } from "react-router";
// 1. Removed the MainLayout import
import { fetchById } from "./ImageFetcher.js";

export function ImageDetails() {
  const { id } = useParams();
  const [image, _setImage] = useState(fetchById(id));

  if (!image) {
    // 2. Replaced MainLayout with a React Fragment here
    return (
      <>
        <h2>Image not found</h2>
      </>
    );
  }

  return (
    // 3. Replaced MainLayout with a React Fragment here too
    <>
      <h2>{image.name}</h2>
      <p>By {image.author.username}</p>
      <img className="ImageDetails-img" src={image.src} alt={image.name} />
    </>
  );
}
