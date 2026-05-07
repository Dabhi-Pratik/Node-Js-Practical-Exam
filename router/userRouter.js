import express from "express";
import userController from "../controller/userController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/addUser", userController.addUser);
router.get("/login", userController.login);
router.get("/allUsers", userController.allUser);

router.get("/authLogin",auth,userController.authLogin)

export default router;
