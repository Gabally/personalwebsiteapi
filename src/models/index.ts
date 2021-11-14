import { PostModel } from "./Post";
import { StoryModel } from "./Story";
import { ToolModel } from "./Tool";
import { UserModel } from "./User";

const initDB = async (): Promise<void> => {
  await PostModel();
  await ToolModel();
  await UserModel();
  await StoryModel();
};
export default initDB;