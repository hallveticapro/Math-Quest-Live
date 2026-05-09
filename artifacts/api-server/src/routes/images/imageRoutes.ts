import { Router } from "express";
import { getStoredImage } from "../../images/imageStore";

const router = Router();

router.get("/:imageId", (req, res) => {
  const imageId = req.params.imageId;
  if (!imageId || !imageId.startsWith("img_")) {
    res.status(404).json({ error: "Image not found" });
    return;
  }

  const image = getStoredImage(imageId);
  if (!image) {
    res.status(404).json({ error: "Image not found" });
    return;
  }

  res.setHeader("Content-Type", image.contentType);
  res.setHeader("Cache-Control", "private, max-age=1800");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.send(image.buffer);
});

export default router;
