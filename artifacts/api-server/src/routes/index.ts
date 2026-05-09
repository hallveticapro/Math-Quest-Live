import { Router, type IRouter } from "express";
import healthRouter from "./health";
import gameRouter from "./game/gameRoutes";
import imageRouter from "./images/imageRoutes";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/game", gameRouter);
router.use("/images", imageRouter);

export default router;
