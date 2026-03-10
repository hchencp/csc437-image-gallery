import { Link } from "react-router";
import "./Images.css";

export function ImageGrid(props) {
  const imageElements = props.images.map((image) => (
    <div key={image.id} className="ImageGrid-photo-container">
      {/* Replaced <a> with <Link> and href with to */}
      <Link to={"/images/" + image.id}>
        <img src={image.src} alt={image.name} />
      </Link>
    </div>
  ));
  return <div className="ImageGrid">{imageElements}</div>;
}
