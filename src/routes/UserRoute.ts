import { Router } from "express";
import UserController from "@controllers/UserController";
import UserMiddleware from "@middlewares/UserMiddleware";

const router: Router = Router();

router
    .route("/users")
    .post(UserMiddleware.validAdd, UserController.addUser)
    .get(UserController.getUsers);

router
    .route("/users/:userId")
    .get(UserMiddleware.validUserId, UserController.getUser)
    .put(UserMiddleware.validUserId, UserController.updateUser)
    .delete(UserMiddleware.validUserId, UserController.deleteUser);

router
    .route("/users/login")
    .post(UserMiddleware.validLogin, UserController.loginUser);

router
    .route('/users/auth')
    .post(UserController.authUser);

export const UserRoutes: Router = router;
