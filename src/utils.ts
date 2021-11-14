import { knex } from "knex"
import { URL } from "url";

export const randomString = (len: number): string => {
    let result           = [];
    let characters       = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < len; i++ ) {
        result.push(characters.charAt(Math.floor(Math.random() * 
    charactersLength)));
    }
    return result.join("");
};

export const db = knex({
    client: "sqlite3",
    connection: {
      filename: `./${process.env.DB_FILENAME}`,
    },
    useNullAsDefault: true
});

export const isValidURL = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}