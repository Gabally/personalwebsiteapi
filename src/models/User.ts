import { db } from "../utils";

export const UserModel = async () => {
    if (!await db.schema.hasTable("users")) {
        await db.schema
        .createTable("users", table => {
          table.increments("id");
          table.string("username").notNullable().unique();
          table.string("password").notNullable();
        });
    }
}
