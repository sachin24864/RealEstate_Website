import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    image: { type: String, required: true }, // stored as /uploads/gallery/filename.ext
    category: {
      type: String,
      required: true,
      enum: ['Office Environment', 'Client Dealing'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Gallery', gallerySchema);