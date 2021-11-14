import { Request, Response } from "express";
import { Post, Tool, Story, StorySlide } from "../types";
import { db } from "../utils";

export default {
    async getPosts(req: Request, res: Response) {
        let posts = await db.select("id", "title", "tag", "insertion_date").from<Post>("post").orderBy("insertion_date");
        res.json(posts);
    },
    async getPost(req: Request, res: Response) {
        let post = await db.select().from<Post>("post").where({ title: <string>req.query.title }).first();
        res.json(post);
    },
    async getTools(req: Request, res: Response) {
        let tools = await db.select().from<Tool>("tool");
        res.json(tools);
    },
    async getStories(req: Request, res: Response) {
        let stories = await db.select("id", "title").from<Tool>("story");
        res.json(stories);
    },
    async getStory(req: Request, res: Response) {
        let story =  await db.select("id", "title", "title_cover").from<Story>("story").where({ title: <string>req.query.title }).first();
        if (story) {
            let story_slides = await db.select("text", "media_link").from<StorySlide>("story_slides").where({ story: story.id });
            if (story_slides) {
                res.json({
                    title: story,
                    slides: story_slides
                });
            } else {
                res.json({
                    title: story,
                    slides: []
                });
            }
        } else {
            res.status(204).end();
        }
    }
}