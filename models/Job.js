import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    salaryRange: { type: String, required: true },
    category: { type: String, required: true },
    experience: { type: String, required: true },
    company: { type: String, required: true }, 
    contact: { type: String, required: true },
    requirements: { type: String },
    jobType: { type: String, required: true },
    status: { type: String, enum: ['pending', 'open', 'closed'], default: 'pending' },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Job', jobSchema);
