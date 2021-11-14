import dotenv from "dotenv";
dotenv.config();
import express, { Response, Request } from "express";
import { default as session } from "express-session";
import { randomString } from "./utils";
import { default as MemoryStoreBuilder } from "memorystore";
import initDB from "./models";
import router from "./router";
import { CORSHeader } from "./middleware";

const MemoryStore = MemoryStoreBuilder(session);
const app = express();

app.use(express.json({limit: "1mb"}));

app.use(session({
    store: new MemoryStore({
        checkPeriod: 86400000
    }),
    secret: randomString(30),
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

app.use(router);

app.use((err: any, req: Request, res: Response, next: any) => {
    console.error(err.stack);
    res.status(500).json({
        success: false
    });
});

(async () => {
    await initDB();

    app.listen(parseInt(process.env.PORT || "5000"), process.env.BIND_ADDRESS || "127.0.0.1", () => {
        console.log(`App listening on ${process.env.BIND_ADDRESS || "127.0.0.1"}:${process.env.PORT || "5000"}!`);
    });
})();