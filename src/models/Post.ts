import { db } from "../utils";

export const PostModel = async () => {
    if (!await db.schema.hasTable("post")) {
        await db.schema
        .createTable("post", table => {
          table.increments("id");
          table.string("title").notNullable().unique();
          table.string("content", 99999999999).notNullable();
          table.string("tag").notNullable();
          table.date("insertion_date").notNullable().defaultTo(db.fn.now());
          table.boolean("published").notNullable();
        });
    }
}