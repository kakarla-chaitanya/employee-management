import express,{ Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import "./config/db";
import "./config/redis"
import employeeRoute from "./routes/employee_route";
import authRoute from "./routes/auth_route";
import GlobalError from "./Errors/global_error";
import rateLimiterMiddleware from "./middleware/rate_limiter_middleware";
import checkDeviceId from "./middleware/check_device_id";
import validateToken from "./middleware/validate_token";

dotenv.config();
const app=express();
const port=process.env.PORT;

app.set('trust proxy', 1);

if(!port){
    throw new Error("Invalid port number");
}

app.use(cors({
  origin: "https://employee-management.netlify.app",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

//global middlewares
app.use(checkDeviceId);
app.use(rateLimiterMiddleware);

//routes
app.use("/auth",authRoute);
app.use("/employee",employeeRoute);

app.use("/api/me",validateToken,(req,res)=>{
    const user = req.user; 
    return res.status(200).json({ name:user?.name,email:user?.email });
});


app.use((err: GlobalError, _req: Request, res: Response, _next: NextFunction)=>{
    console.log(err);
    const errorResponse:{
        name: string;
        message: string;
        details?: any;
    }={
        name:err.name,
        message:err.message,
    };
    if (err.details){
        errorResponse.details=err.details
    }
    return res.status(err.statusCode||404).json(errorResponse);
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction)=>{
    // console.log("Error in Global");
    console.log(err);
    return res.status(404).send(err.message);
});

app.listen(port,()=>{
    console.log(`App running on port ${port}`);
})