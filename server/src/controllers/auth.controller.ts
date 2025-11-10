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

// Since we validated above, we can safely assert it's not null
const SECRET = JWT_SECRET;

if (process.env.NODE_ENV !== 'production') {
  console.log('JWT_SECRET: Loaded successfully');
  console.log('JWT_EXPIRES:', JWT_EXPIRES);
}

export const register = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      role = "user",
      phone,
      address,
      businessName,
      businessLicense,
    } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (role === "admin") {
      return res.status(403).json({ message: "Admin registration is not allowed" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    if (role === "vendor") {
      if (!businessName || !businessLicense) {
        return res.status(400).json({ 
          message: "Business name and license are required for vendors" 
        });
      }
    }

    const user = await UserModel.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      phone: phone?.trim(),
      address: address?.trim(),
      ...(role === "vendor" && { 
        businessName: businessName.trim(),
        businessLicense: businessLicense.trim()
      }),
    });

    // Fixed jwt.sign call
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

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        vendorVerified: user.vendorVerified,
        phone: user.phone,
        address: user.address,
        ...(user.role === "vendor" && {
          businessName: user.businessName,
          businessLicense: user.businessLicense
        })
      },
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    
    if (err.name === 'ValidationError') {
      return res.stat