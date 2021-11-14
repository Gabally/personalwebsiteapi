import { db } from "../utils";

export const StoryModel = async () => {
  if (!await db.schema.hasTable("story")) {
    await db.schema
    .createTable("story", table => {
      table.increments("id");
      table.string("title").notNullable().unique();
      table.string("title_cover").notNullable();
    });
  }
  if (!await db.schema.hasTable("story_slides")) {
    await db.schema
    .createTable("story_slides", table => {
      table.increments("id");
      table.string("text").notNullable();
      table.string("media_link").notNullable();
      table.integer("story")
      .unsigned()
      .references("story.id").notNullable();
    });
  }
}
