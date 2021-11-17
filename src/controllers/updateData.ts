import { Request, Response } from "express";
import { Post, Tool, Story, StorySlide } from "../types";
import { db } from "../utils";
import validators from "../validators";

export default {
    async updatePost(req: Request, res: Response) {
        if (validators.isNumber(req.body.id)
        && validators.isNotNull(req.body.title) 
        && validators.isNotNull(req.body.content)
        && validators.isNotNull(req.body.tag)
        && validators.isBoolean(req.body.published)) {
            await db<Post>("post").update({
                title: req.body.title,
                content: req.body.content,
                tag: req.body.tag,
                published: req.body.published
            }).where({ id: req.body.id });
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
    async updateTool(req: Request, res: Response) {
        if (validators.isNumber(req.body.id)
        && validators.isNotNull(req.body.name) 
        && validators.isNotNull(req.body.description)
        && validators.isNotNull(req.body.link)) {
            await db<Tool>("tool").update({
                name: req.body.name,
                description: req.body.description,
                image: req.body.image,
                link: req.body.link
            }).where({ id: req.body.id });
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
    async updateStory(req: Request, res: Response) {
        if (validators.isNumber(req.body.id)
        && validators.isNotNull(req.body.title) 
        && validators.isNotNull(req.body.title_cover)
        && validators.verifyArrayStructure(req.body.story_slides, (e: any) => {
            return validators.isNotNull(e.text)
            && validators.isNotNull(e.media_link)
        })) {
            await db<Story>("story").update({
                title: req.body.title,
                title_cover: req.body.title_cover
            }).where({ id: req.body.id });
            let rowsToInsert = req.body.story_slides.map((el: StorySlide) => {
                el.story = req.body.id;
                return el;
            });
            await db<StorySlide>("story_slides").where("story", req.body.id).del();
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