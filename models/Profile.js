import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bio: { type: String },
  skills: [String],
  education: [{
    school: String,
    degree: String,
    fieldOfStudy: String,
    startDate: Date,
    endDate: Date
  }],
  experience: [{
    company: String,
    jobTitle: String,
    startDate: Date,
    endDate: Date,
    description: String
  }],
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String
  }
});

export default mongoose.model('Profile', profileSchema);
