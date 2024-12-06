import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  bio: { type: String },
  skills: [String],
  education: {
    type: [{
      school: String,
      degree: String,
      fieldOfStudy: String,
      startDate: Date,
      endDate: Date
    }],
    validate: [arr => arr.length > 0, 'Education must not be empty']
  },
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
  },
  resume: { type: String, default: null } // Default to null if no resume uploaded
});

export default mongoose.model('Profile', profileSchema);
