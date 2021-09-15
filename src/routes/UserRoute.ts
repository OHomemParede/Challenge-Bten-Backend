import { Router } from "express";
import UserController from "@controllers/UserController";
import UserMiddleware from "@middlewares/UserMiddleware";


const router: Router = Router();

router
    .route("/users")
    .post(UserMiddleware.validBody, UserController.addUser)
    .get(UserController.getUsers);

router
    .route("/users/:userId")
    .get(UserMiddleware.validUserId, UserController.getUser)
    .put(UserMiddleware.validUserId, UserController.updateUser)
    .delete(UserController.deleteUser);

export const UserRoutes: Router = router;
