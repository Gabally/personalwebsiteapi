import { Request, Response } from "express";
import { Post, Tool, Story, StorySlide } from "../types";
import { db } from "../utils";
import validators from "../validators";

export default {
    async createPost(req: Request, res: Response) {
        if (validators.isNotNull(req.body.title) 
        && validators.isNotNull(req.body.content)
        && validators.isNotNull(req.body.tag)) {
            await db<Post>("post").insert({
                title: req.body.title,
                content: req.body.content,
                tag: req.body.tag
            });
            res.status(201).json({
                success: true
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid data"
            });
        }
    },
    async createTool(req: Request, res: Response) {
        if (validators.isNotNull(req.body.name) 
        && validators.isNotNull(req.body.description)) {
            await db<Tool>("tool").insert({
                name: req.body.name,
                description: req.body.description,
                image: req.body.image,
                link: req.body.link,
                repository_link: req.body.repository_link
            });
            res.status(201).json({
                success: true
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid data"
            });
        }
    },
    async createStory(req: Request, res: Response) {
        if (validators.isNotNull(req.body.title) 
        && validators.isNotNull(req.body.title_cover)
        && validators.verifyArrayStructure(req.body.story_slides, (e: any) => {
            return validators.isNotNull(e.text)
            && validators.isNotNull(e.media_link)
        })) {
            let insertedStory = await db<Story>("story").insert({
                title: req.body.title,
                title_cover: req.body.title_cover
            });
            let rowsToInsert = req.body.story_slides.map((el: StorySlide) => {
                el.story = insertedStory[0];
                return el;
            });
            await db<StorySlide>("story_slides").insert(rowsToInsert);
            res.status(201).json({
                success: true
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid data"
            });
        }
    }
}