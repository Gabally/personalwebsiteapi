import { db } from "../utils";

export const ToolModel = async () => {
    if (!await db.schema.hasTable("tool")) {
        await db.schema
        .createTable("tool", table => {
          table.increments("id");
          table.string("name").notNullable().unique();
          table.string("description").notNullable();
          table.string("image");
          table.string("link");
          table.string("repository_link");
        });
    }
}
