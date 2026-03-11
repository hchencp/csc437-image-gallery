import { Link } from "react-router";
import "./Images.css";

export function ImageGrid(props) {
  const imageElements = props.images.map((image) => (
    // 1. Change key to use underscore: _id
    <div key={image._id} className="ImageGrid-photo-container">
      {/* 2. Change the Link to use underscore: _id */}
      <Link to={"/images/" + image._id}>
        <img src={image.src} alt={image.name} />
      </Link>
    </div>
  ));
  return <div className="ImageGrid">{imageElements}</div>;
}
