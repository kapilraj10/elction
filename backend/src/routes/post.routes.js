const express = require("express");
const multer = require("multer");
const router = express.Router();
const postController = require("../controllers/post.controller.js");

// Use memory storage; controller will upload buffers to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/create", upload.array("images", 10), postController.createPost);
router.get("/all", postController.getPosts);
router.get("/:id", postController.getSinglePost);
router.put("/update/:id", upload.array("images", 10), postController.updatePost);
router.delete("/delete/:id", postController.deletePost);

module.exports = router;
