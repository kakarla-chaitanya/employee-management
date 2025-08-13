import express from "express";
import asynchandler from "../utils/async_handler";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { login, logout, registerUser } from "../controllers/auth_controller";
import checkEmptyBody from "../middleware/check_empty_body";
import GlobalError from "../Errors/global_error";
import generateToken from "../utils/generate_token";
import validateToken from "../middleware/validate_token";
import redisClient from "../config/redis";

const router=express.Router();

router.get("/logout",validateToken,asynchandler(async (req,res)=>{
      await logout(req.user?._id?req.user._id:"",typeof req.headers["x-device-id"]==="string"?req.headers["x-device-id"]:"");
      res.clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).send("Logged out successfully");
}));

router.use(checkEmptyBody)

router.post("/register",
      [
      body("name").notEmpty().withMessage("Empty Name"),
      body("email").isEmail().withMessage("Invalid Email"),
      body("password").notEmpty().withMessage("Empty Password")
            .bail()
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long")
            .bail()
            .custom((value) => /[a-zA-Z]/.test(value) && /\d/.test(value))
            .withMessage("Password must contain both letters and numbers"),
  ],asynchandler(async (req,res)=>{
      const errors=validationResult(req);
      if (!errors.isEmpty()){
            throw new GlobalError("Invalid Body","Validation Error",errors);
      }
      let {name,email,password}=req.body;
      let hashPassword=await bcrypt.hash(password,10);
      let user=await registerUser(name,email,hashPassword);
      console.log(user);
      return res.status(200).json({
            name:user.name,
            email:user.email,
      });
}));

router.post(
      "/login",
      [
            body("email").isEmail().withMessage("Invalid Email"),
            body("password").notEmpty().withMessage("Empty Password"),
      ],asynchandler(async(req,res)=>{
            const errors=validationResult(req);
            if (!errors.isEmpty()){
                  throw new GlobalError("Invalid Body","Validation Error",errors);
            }
            let {email,password}=req.body;
            let user=await login(email,password);
            if (typeof req.headers["x-device-id"]!=="string"){
                  throw new GlobalError("Missing device Id","Invalid Header");
            }
            let token=await generateToken(user._id,req.headers["x-device-id"]);
            await redisClient.incr("successfulLoginRequest");
            res.cookie("token", token, {
              httpOnly: true,
              secure: true,
              path:"/",
              sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
              maxAge: 60 * 60 * 1000, // 1 hour
            });
            return res.status(200).json({
                  name:user.name,
                  email:user.email,
            });
      })
);

export default router;