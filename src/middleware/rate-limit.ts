import type { Request } from "express";
import { rateLimit as limit } from "express-rate-limit";

const rateLimit = limit({
	legacyHeaders: true,
	limit: 20,
	message: "Too many requests, please try again later.",
	standardHeaders: true,
	windowMs: 1000,
	keyGenerator: (req: Request) => req.ip as string,
});

export { rateLimit };