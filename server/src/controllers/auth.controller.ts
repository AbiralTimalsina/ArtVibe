import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/User";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

// Validate JWT_SECRET and throw error if missing
if (!JWT_SECRET) {
  throw new Error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
}

const SECRET = JWT_SECRET;

if (process.env.NODE_ENV !== 'production') {
  console.log('JWT_SECRET: Loaded successfully');
  console.log('JWT_EXPIRES:', JWT_EXPIRES);
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required" 
      });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    if (user.role === 'vendor' && !user.vendorVerified) {
      return res.status(403).json({ 
        success: false,
        message: "Vendor account not verified yet. Please contact administrator." 
      });
    }

    const token = jwt.sign(
      { 
        id: user._id.toString(),
        role: user.role 
      }, 
      SECRET,
      { 
        expiresIn: JWT_EXPIRES 
      } as jwt.SignOptions
    );

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      vendorVerified: user.vendorVerified,
      verificationStatus: user.verificationStatus,
      phone: user.phone,
      address: user.address,
      ...(user.role === "vendor" && {
        businessName: user.businessName,
        businessLicense: user.businessLicense
      })
    };

    console.log('🔍 BACKEND - Full user response:', userResponse);

    res.status(200).json({
      success: true,
      token,
      user: userResponse,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false,
      message: "Internal server error during login" 
    });
  }
};