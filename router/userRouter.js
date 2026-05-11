import express from "express";
import userController from "../controller/userController.js";
import auth from "../middleware/auth.js";
import checkRole from "../middleware/checkRole.js";

const router = express.Router();

router.post("/addUser", userController.addUser);
router.get("/login", userController.login);
router.get("/allUsers", userController.allUser);

router.get("/authLogin", auth, userController.authLogin)

router.patch("/updateUser/:id", auth, userController.update);

router.delete("/deleteUser/:id", auth, userController.deleteUser)

router.post("/logout", auth, userController.logOut);

router.post("/logoutAll", auth, userController.logOutAll);

export default router;