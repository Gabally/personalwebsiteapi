import { Request, Response } from "express";
import { User } from "../types";
import { db } from "../utils";

export default {
    async setCredentials(req: Request, res: Response) {
        let user = await db<User>("users").first();
        if (!user && req.body.username && req.body.password) {
            await db("users").insert({ username: req.body.username, password: req.body.password });
            res.status(201).json({
                success: true,
                message: "Credentials set!"
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Credentials already set!"
            });
        }
    },
    async login(req: Request, res: Response) {
        let user = await db<User>("users").where({
            username: req.body.username,
            password: req.body.password
        }).first();
        if (user) {
            req.session!.authorized = true;
            res.status(200).json({
                success: true,
                message: ""
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Wrong username or password."
            });
        }
    },
    async canSetCredentials(req: Request, res: Response) {
        let user = await db<User>("users").first();
        res.status(200).json({
            response: user == null || user == undefined
        });
    }
}