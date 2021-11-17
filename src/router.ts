import { Router } from "express";
import authorization from "./controllers/authorization";
import deleteData from "./controllers/deleteData";
import getData from "./controllers/getData";
import insertData from "./controllers/insertData";
import updateData from "./controllers/updateData";
import { isAuthorized, CORSHeader } from "./middleware";
import getMetaData from "./controllers/getWebPageMetaData";

let router = Router();
router.use(CORSHeader);

let authorizedRouter = Router();
authorizedRouter.use(isAuthorized);

router.use("/auth", authorizedRouter);

//Retrieve
router.get("/posts", getData.getPosts);
router.get("/post", getData.getPost);
router.get("/tools", getData.getTools);
router.get("/stories", getData.getStories);
router.get("/story", getData.getStory);

//URL Info pre-fetch
router.get("/fetchmetadata", getMetaData);

//Login stuff
router.get("/cansetcredentials", authorization.canSetCredentials);
router.post("/setcredentials", authorization.setCredentials);
router.post("/login", authorization.login);
router.get("/isloggedin", authorization.isLoggedIn);

//Create
authorizedRouter.post("/newpost", insertData.createPost);
authorizedRouter.post("/newtool", insertData.createTool);
authorizedRouter.post("/newstory", insertData.createStory);

//Update
authorizedRouter.post("/updatepost", updateData.updatePost);
authorizedRouter.post("/updatetool", updateData.updateTool);
authorizedRouter.post("/updatestory", updateData.updateStory);

//Delete
authorizedRouter.post("/deletepost", deleteData.deletePost);
authorizedRouter.post("/deletetool", deleteData.deleteTool);
authorizedRouter.post("/deletestory", deleteData.deleteStory);

export default router;