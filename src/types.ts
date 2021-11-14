export interface User {
    id: number;
    username: string,
    password: string
}

export interface Post {
    id: number,
    title: string,
    content: string,
    tag: string
}

export interface Tool {
    id: number,
    name: string,
    description: string,
    image: string,
    link: string,
    repository_link: string
}

export interface Story {
    id: number,
    title: string,
    title_cover: string
}

export interface StorySlide {
    id: number,
    text: string,
    media_link: string,
    story: number
}