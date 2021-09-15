import { Request, Response } from "express";
import { User } from "@models/User";
import UserService from "@services/UserService";

class UserController {
    //============================ getUsers ============================
    async getUsers(req: Request, res: Response) {
        try {
            const user: User[] = await UserService.getUsers();
            return res.status(200).json({ users: user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }

    //============================ getUser ============================
    async getUser(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const user: User = await UserService.getUser(userId);

            if (!user) return res.status(404).json({ error: "User not found" });

            return res.status(200).json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }

    //============================ addUser ============================
    async addUser(req: Request, res: Response) {
        try {
            const { name, email, password, age, height, homeTeam } = req.body;
            const user: User = await UserService.addUser({
                name,
                email,
                password,
                age,
                height,
                homeTeam,
            });

            if (user) return res.status(201).json(user);

            return res.status(409).json({ error: "conflict email" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }

    //============================ updateUser ============================
    async updateUser(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const user: User = await UserService.getUser(userId, true);
            if (!user) return res.status(404).json({ error: "User not found" });
            const {
                name = user.name,
                email = user.email,
                password = user.password,
                age = user.age,
                height = user.height,
                homeTeam = user.homeTeam,
            } = req.body;
            const validationErrors = await UserService.validateData({
                name,
                email,
                password,
                age,
                height,
                homeTeam,
            });
            if (validationErrors.length === 0) {
                const userUpdated: User = await UserService.updateUser(userId, {
                    name,
                    email,
                    password,
                    age,
                    height,
                    homeTeam,
                });
                if (userUpdated) return res.status(200).json(userUpdated);

                return res.status(409).json({ error: "conflict email" });
                
            } else return res.status(400).json(validationErrors);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }

    //============================ deleteUser ============================
    async deleteUser(req: Request, res: Response) {
        try {
            const { userId = null } = req.params;
            if (!userId) return res.status(400).json({ error: "UserId is missing" });

            const user: User = await UserService.getUser(userId, true);
            if (!user) return res.status(404).json({ error: "User not found" });

            await UserService.deleteUser(userId);

            return res.status(200).json({ mensage: "User deleted" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new UserController();
