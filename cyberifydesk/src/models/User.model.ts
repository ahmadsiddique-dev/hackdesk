import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import mongoose, { Schema, Document } from "mongoose"

export interface IUser extends Document {
  fullName: string
  email: string
  password: string
  isVerified: boolean
  organization: string | null // FIX: Organization is required for client and agent so I removed null
  role: "user" | "agent"
  otp: string | null
  refreshToken: string | null // FIX: Not null could be string but see later
  isPasswordCorrect(password: string): Promise<boolean>
  generateAccessToken(): string
  generateRefreshToken(): string
}

const UserSchema: Schema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true    
    },
    email: {
      type: String,
      required: true,
      unique: true, // Single email can be use either as an Agnet or as a User otherwise it could create proplems
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    organization: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      default: "user",
    },
    otp: {
      type: String,
      default: null, 
    },
    refreshToken: {
      type: String, // Again should be changed but for now we are just dignosing change later
      default: null,
    }
  },
  {
    timestamps: true,
  }
)
  
UserSchema.pre<IUser>("save", async function () {
    if(!this.isModified("password")) return; // I hope in new versions we don't do next();

    this.password = await bcrypt.hash(this.password, 10)
})

UserSchema.methods.isPasswordCorrect = async function(password: string){
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET || "access_token_agar_na_mila",
        {
            expiresIn: (process.env.ACCESS_TOKEN_EXPIRY || "1d") as any // We can hard code but i have chull
        }
    )
}
UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET || "refresh_token_agar_na_mila",
        {
            expiresIn: (process.env.REFRESH_TOKEN_EXPIRY || "7d") as any // Ya anotaion ky bina error dy raha ha
        }
    )
}

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
