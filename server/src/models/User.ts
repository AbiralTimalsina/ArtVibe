import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'user' | 'vendor' | 'admin';
export type VerificationStatus = 'pending' | 'approved' | 'suspended';
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  address?: string;
  businessName?: string;
  businessLicense?: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  vendorVerified?: boolean;
  verificationStatus?: VerificationStatus;
  verificationNotes?: string;
  verifiedAt?: Date;
  businessDescription?: string;
  taxId?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// -------------------- Schema --------------------
const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'] 
  },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['user','vendor','admin'], default: 'user' },
  phone: { type: String, match: [/^\+?[\d\s\-()]+$/, 'Please enter a valid phone number'] },
  address: { type: String, maxlength: 255 },
}, { timestamps: true });

// -------------------- Model --------------------
const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;