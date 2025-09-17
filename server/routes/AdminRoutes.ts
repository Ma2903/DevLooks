import {Router} from "express";
import AdminController from "../controllers/AdminController";
import {verifyToken} from "../middlewares/authMiddleware";

const router = Router();

router.get("/admin/extract", AdminController.extractData);

export default router;