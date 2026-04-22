export const uploadImage = (req, res) => {
  if (req.file) {
    return res.status(200).json({
      message: "Image uploaded successfully",
      image: `/uploads/${req.file.filename}`,
    });
  }

  if (req.files && req.files.length > 0) {
    const images = req.files.map(file => `/uploads/${file.filename}`);
    return res.status(200).json({
      message: "Images uploaded successfully",
      images: images,
    });
  }

  return res.status(400).json({
    message: "No file(s) uploaded",
  });
};