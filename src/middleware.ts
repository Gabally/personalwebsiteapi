import { Request, Response } from "express";

export const isAuthorized = (req: Request, res: Response, next: Function) => {
    req.session!.authorized ? next() : res.sendStatus(401);
}

export const CORSHeader = (req: Request, res: Response, next: Function) => {
    let allowedOrigins = process.env.CORS_ORIGINS?.split(",") || <string[]>[];
    if (allowedOrigins.includes(req.header("origin")!)) {
        res.setHeader("Access-Control-Allow-Origin", req.header("origin")!);
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Origin, Accept, token")
    }
    if (req.method == "OPTIONS") {
        res.sendStatus(204);
    } else {
        next();
    }
}
