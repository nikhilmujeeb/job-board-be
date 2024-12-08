import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  school: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  jobTitle: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String, required: true },
});

const socialLinksSchema = new mongoose.Schema({
  linkedin: { type: String },
  github: { type: String },
  twitter: { type: String },
});

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  countryCode: { type: String, required: true },
  phone: { type: String, required: true },
  bio: { type: String },
  skills: { type: [String] },
  education: { type: [educationSchema] },
  experience: { type: [experienceSchema] },
  socialLinks: { type: socialLinksSchema },
  resume: { type: String },
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema);
