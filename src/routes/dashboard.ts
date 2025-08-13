import express from 'express';
import asynchandler from '../utils/async_handler';
import validateToken from '../middleware/validate_token';
import User from '../models/user/user_model';
import Employee from '../models/employee/employee';
import redisClient from '../config/redis';
import { extractIp } from '../middleware/rate_limiter_middleware';

const router = express.Router();

router.use(validateToken);

router.get("/", asynchandler(async (req, res) => {

    let totalUsers = (await User.find({})).length.toString();
    let totalEmployees = (await Employee.find({})).length.toString();

    let loginRequests = (await redisClient.get("loginRequest")) || "0";

    let successfulLoginRequests = (await redisClient.get("successfulLoginRequest")) || "0";

    let unsuccessfulLoginRequests = (Number(loginRequests) - Number(successfulLoginRequests)).toString();

    let apiRequests = (await redisClient.get("apiRequest")) || "0";
    let getRequests = (await redisClient.get("getRequests")) || "0";
    let postRequests = (await redisClient.get("postRequests")) || "0";
    let putRequests = (await redisClient.get("putRequests")) || "0";
    let patchRequests = (await redisClient.get("patchRequests")) || "0";
    let deleteRequests = (await redisClient.get("deleteRequests")) || "0";

    let ip = extractIp(req);
    let rateLimiting = await redisClient.zcard(`rate_limit:${ip}`);

    return res.status(200).json({
        Users: [
            {
                label: "Total Users",
                value: totalUsers,
                icon: "users"
            }
        ],
        Employees: [
            {
                label: "Total Employees",
                value: totalEmployees,
                icon: "employees"
            }
        ],
        "Rate Limiting": [
            {
                label: "Rate Limiting",
                value: `${rateLimiting}/${process.env.MAX_REQUESTS_PER_SECOND}`,
                icon:"rateLimiting",
            }
        ],
        Authentication: [
            {
                label: "Login Requests",
                value: loginRequests,
                icon: "login"
            },
            {
                label: "Successful Login Requests",
                value: successfulLoginRequests,
                icon: "success"
            },
            {
                label: "Unsuccessful Login Requests",
                value: unsuccessfulLoginRequests,
                icon: "error"
            }
        ],
        "API Requests": [
            {
                label: "Total API Requests",
                value: apiRequests,
                icon: "api"
            },
            {
                label: "GET Requests",
                value: getRequests,
                icon: "api"
            },
            {
                label: "POST Requests",
                value: postRequests,
                icon: "api"
            },
            {
                label: "PUT Requests",
                value: putRequests,
                icon: "api"
            },
            {
                label: "PATCH Requests",
                value: patchRequests,
                icon: "api"
            },
            {
                label: "DELETE Requests",
                value: deleteRequests,
                icon: "api"
            }
        ]
    });


}));

export default router;