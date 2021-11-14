import { Request, Response } from "express";
import { Post, Tool, Story, StorySlide } from "../types";
import { db } from "../utils";
import validators from "../validators";

export default {
    async deletePost(req: Request, res: Response) {
        if (validators.isNumber(req.body.id)) {
            await db<Post>("post").where({ id: req.body.id }).del();
            res.status(200).json({
                success: true
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid id"
            });
        }
    },
    async deleteTool(req: Request, res: Response) {
        if (validators.isNumber(req.body.id)) {
            await db<Tool>("tool").where({ id: req.body.id }).del();
            res.status(200).json({
                success: true
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid id"
            });
        }
    },
    async deleteStory(req: Request, res: Response) {
        if (validators.isNumber(req.body.id)) {
            await db<Story>("story").where({ id: req.body.id }).del();
            await db<StorySlide>("story_slides").where("story", req.body.id).del();
            res.status(200).json({
                success: true
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid id"
            });
        }
    }
}