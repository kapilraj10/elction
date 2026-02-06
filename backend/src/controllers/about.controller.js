const About = require("../models/About.Models.js");
const cloudinary = require("../utils/cloudinary");

// Create new About entry
exports.createAbout = async (req, res) => {
    try {
        const { vision, priorities, coverTitle, coverDescription } = req.body;

        const data = {
            vision,
            priorities: priorities ? JSON.parse(priorities) : [],
            coverTitle,
            coverDescription,
        };

        // Upload cover image to Cloudinary if provided
        if (req.file) {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "about" },
                (error, result) => {
                    if (error) {
                        return res.status(500).json({
                            success: false,
                            message: "Image upload failed"
                        });
                    }

                    data.coverImage = result.secure_url;

                    About.create(data)
                        .then(about => {
                            res.status(201).json({
                                success: true,
                                message: "About entry created successfully",
                                data: about,
                            });
                        })
                        .catch(err => {
                            res.status(500).json({
                                success: false,
                                message: err.message
                            });
                        });
                }
            );
            uploadStream.end(req.file.buffer);
        } else {
            const about = await About.create(data);
            res.status(201).json({
                success: true,
                message: "About entry created successfully",
                data: about,
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all About entries
exports.getAllAbout = async (req, res) => {
    try {
        const abouts = await About.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: abouts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single About entry by ID
exports.getAbout = async (req, res) => {
    try {
        const about = await About.findById(req.params.id);
        if (!about) {
            return res.status(404).json({
                success: false,
                message: "About entry not found"
            });
        }
        res.status(200).json({ success: true, data: about });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update About entry
exports.updateAbout = async (req, res) => {
    try {
        const { vision, priorities, coverTitle, coverDescription } = req.body;

        const about = await About.findById(req.params.id);
        if (!about) {
            return res.status(404).json({
                success: false,
                message: "About entry not found"
            });
        }

        const data = {
            vision,
            priorities: priorities ? JSON.parse(priorities) : about.priorities,
            coverTitle,
            coverDescription,
        };

        // Upload new cover image if provided
        if (req.file) {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "about" },
                (error, result) => {
                    if (error) {
                        return res.status(500).json({
                            success: false,
                            message: "Image upload failed"
                        });
                    }

                    data.coverImage = result.secure_url;

                    About.findByIdAndUpdate(req.params.id, data, { new: true })
                        .then(updatedAbout => {
                            res.status(200).json({
                                success: true,
                                message: "About entry updated successfully",
                                data: updatedAbout,
                            });
                        })
                        .catch(err => {
                            res.status(500).json({
                                success: false,
                                message: err.message
                            });
                        });
                }
            );
            uploadStream.end(req.file.buffer);
        } else {
            const updatedAbout = await About.findByIdAndUpdate(
                req.params.id,
                data,
                { new: true }
            );
            res.status(200).json({
                success: true,
                message: "About entry updated successfully",
                data: updatedAbout,
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete About entry
exports.deleteAbout = async (req, res) => {
    try {
        const about = await About.findByIdAndDelete(req.params.id);
        if (!about) {
            return res.status(404).json({
                success: false,
                message: "About entry not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "About entry deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
