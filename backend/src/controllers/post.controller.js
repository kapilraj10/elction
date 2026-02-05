const Post = require("../models/Post");
const cloudinary = require("../utils/cloudinary");


// CREATE POST with primary image compulsory
exports.createPost = async (req, res) => {
    try {
        const { title, content, category, date } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Primary image required" });
        }

        // Upload all images to Cloudinary (first image = primary)
        const uploadPromises = req.files.map((file, index) =>
            new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: "image", folder: "posts" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve({ url: result.secure_url, publicId: result.public_id, isPrimary: index === 0 });
                    }
                );
                stream.end(file.buffer);
            })
        );

        const imagesResult = await Promise.all(uploadPromises);

        const post = new Post({
            title,
            content,
            category,
            date,
            images: imagesResult.map(({ url, isPrimary }) => ({ url, isPrimary })),
        });

        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json(err);
    }
};



// GET ALL
exports.getPosts = async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
};


// GET ONE
exports.getSinglePost = async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.json(post);
};


// UPDATE POST (change primary)
exports.updatePost = async (req, res) => {
    try {
        let updateData = req.body;

        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map((file, index) =>
                new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: "image", folder: "posts" },
                        (error, result) => {
                            if (error) return reject(error);
                            resolve({ url: result.secure_url, publicId: result.public_id, isPrimary: index === 0 });
                        }
                    );
                    stream.end(file.buffer);
                })
            );

            const imagesResult = await Promise.all(uploadPromises);
            updateData.images = imagesResult.map(({ url, isPrimary }) => ({ url, isPrimary }));
        }

        const updated = await Post.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json(updated);
    } catch (err) {
        res.status(500).json(err);
    }
};


// DELETE
exports.deletePost = async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
};
