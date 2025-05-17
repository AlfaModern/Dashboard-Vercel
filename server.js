const express = require('express');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
app.use(cors({
  origin: 'https://YOUR_HOSTINGER_DOMAIN.com' // ⚠️ غيّر هذا لاحقًا
}));
app.use(express.json());

// Routes
app.get('/list-images', async (req, res) => {
  try {
    const result = await cloudinary.search
      .expression('folder:dashboard AND resource_type:image')
      .sort_by('created_at', 'desc')
      .max_results(30)
      .execute();
    res.json(result.resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/delete-image', async (req, res) => {
  try {
    const result = await cloudinary.uploader.destroy(req.body.publicId);
    res.json({ success: result.result === 'ok' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));