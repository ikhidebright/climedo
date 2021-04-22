import { Router } from "express";
const router = new Router();
import TabsController from "../controllers/tabs";
const { createTabs, getAll, deleteTab, editTab } = TabsController;

router.post("/tabs", createTabs);
router.get("/tabs", getAll);
router.delete("/tabs/:tabId", deleteTab);
router.put("/tabs/:tabId", editTab);

export default router;
