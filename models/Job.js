import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  salaryRange: { type: String, required: true },
  category: { type: String, required: true }, // Added category
  experience: { type: String, required: true }, // Added experience level
  company: { type: String, required: true }, // Added company name
  contact: { type: String, required: true }, // Added contact email
  requirements: String,
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isApproved: { type: Boolean, default: false },
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

export default mongoose.model('Job', jobSchema);
