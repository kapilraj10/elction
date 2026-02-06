const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
    createAbout,
    getAbout,
    getAllAbout,
    updateAbout,
    deleteAbout
} = require("../controllers/about.controller");

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// CRUD Routes
router.post("/create", upload.single("coverImage"), createAbout);
router.get("/all", getAllAbout);
router.get("/:id", getAbout);
router.put("/update/:id", upload.single("coverImage"), updateAbout);
router.delete("/delete/:id", deleteAbout);

module.exports = router;
