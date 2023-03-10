import express from "express";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

import Post from "./post";

dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.Cloudinary_CLOUD_NAME,
  api_key: process.env.Cloudinary_API_KEY,
  api_secret: process.env.Cloudinary_API_SECRET,
});

// GET ALL
router.route("/").get(async (req, res) => {
  try {
    const posts = await Post.find({});

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, data: error });
  }
});

// CREATE POST
router.route("/").post(async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;

    const photoUrl = await cloudinary.uploader.upload(photo);

    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl.url,
    });

    res.statusCode(201).json({ success: true, data: newPost });
  } catch (error) {
    res.statusCode(500).json({ success: false, data: error });
  }
});

export default router;
