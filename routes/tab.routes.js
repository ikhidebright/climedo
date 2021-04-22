import { Router } from "express";
const router = new Router();
import TabsController from "../controllers/tabs";
const { createTabs, getAll, deleteTab, editTab, getTabStats } = TabsController;

router.post("/tabs", createTabs);
router.get("/tabs", getAll);
router.delete("/tabs/:tabId", deleteTab);
router.put("/tabs/:tabId", editTab);
router.get("/tabStats", getTabStats);

export default router;
