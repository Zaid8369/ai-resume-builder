import express from "express";
import Resume from "../models/Resume.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const resume = await Resume.create(req.body.data);
    res.status(201).json({ data: resume.toJSON() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { userEmail } = req.query;
    const filter = userEmail ? { userEmail } : {};
    const resumes = await Resume.find(filter).sort({ createdAt: -1 });
    res.json({ data: resumes.map((r) => r.toJSON()) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ error: "Not found" });
    res.json({ data: resume.toJSON() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const resume = await Resume.findByIdAndUpdate(
      req.params.id,
      { $set: req.body.data },
      { new: true, runValidators: true }
    );
    if (!resume) return res.status(404).json({ error: "Not found" });
    res.json({ data: resume.toJSON() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) return res.status(404).json({ error: "Not found" });
    res.json({ data: resume.toJSON() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;