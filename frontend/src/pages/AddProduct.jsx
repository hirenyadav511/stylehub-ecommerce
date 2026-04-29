import React, { useState } from "react";
import { uploadImageAPI } from "../services/api";

const AddProduct = () => {
  const [imageUrl, setImageUrl] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    const data = await uploadImageAPI(file);
    setImageUrl(data.image);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return imagePath.startsWith("http")
      ? imagePath
      : `${process.env.REACT_APP_API_URL}${imagePath}`;
  };

  return (
    <div>
      <h2>Add Product</h2>

      <input type="file" onChange={handleImageUpload} />

      {imageUrl && (
        <img
          src={getImageUrl(imageUrl)}
          alt="preview"
          width="200"
        />
      )}
    </div>
  );
};

export default AddProduct;
