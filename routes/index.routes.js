import { Router } from "express";
import tabRoutes from "./tab.routes";

const router = new Router();

router.use("/v1", tabRoutes);

export default router;
