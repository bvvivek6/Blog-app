const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../uploads/profiles");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, req.user.id + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/me", auth, upload.single("profilePic"), async (req, res) => {
  try {
    const updates = { name: req.body.name, bio: req.body.bio };
    if (req.file) {
      updates.profilePic = "/uploads/profiles/" + req.file.filename;
    }
    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    })
      .select("-password")
      .orFail(() => new Error("User not found"));
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
