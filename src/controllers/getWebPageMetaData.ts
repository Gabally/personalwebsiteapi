import { Request, Response } from "express";
import validators from "../validators";
import https from "https";
import * as cheerio from 'cheerio';
import { URL } from "url";
import { isValidURL } from "../utils";

const getHTTPRequest = async (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        https.get(url, (resp) => {
            let data = "";
            resp.on("data", (chunk) => {
                data += chunk;
            });
            resp.on("end", () => {
                resolve(data);
            });
        }).on("error", (err) => {
            reject(err.message);
        });
    });
}

const getOpenGraphTags = async (url: string) => {
    const $ = cheerio.load( await getHTTPRequest(url));
    let parsedURL = new URL(url);
    let favicon = null;
    let faviconHref = $("link[rel='icon']").attr("href");
    if (faviconHref && isValidURL(faviconHref)) {
        favicon = new URL(faviconHref);
    } else if (faviconHref) {
        favicon =  new URL(faviconHref, parsedURL.origin);
    }
    return {
        title: $("meta[property='og:title']").attr("content") || $("title").text(),
        description:  $("meta[property='og:description']").attr("content") || $("meta[property='description']").attr("content") || "No description provided",
        image: $("meta[property='og:image']").attr("content") || favicon!.href || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
    }
}

const getMetaData = async (req: Request, res: Response) => {
    try {
        if (validators.isURL(<string>req.query.url)) {
            res.status(200).json({
                success: true,
                data: await getOpenGraphTags(<string>req.query.url)
            });
        } else {
            res.status(400).json({
                success: false
            });
        }
    } catch (e) {
        res.json({
            success: false
        });
    }
}

export default getMetaData;