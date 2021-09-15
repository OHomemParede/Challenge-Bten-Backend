import UserService from "@services/UserService";
import { Request, Response, NextFunction } from "express";

class UserMiddleware {
    //============================ validUserId ============================
    /**
     * Verifica se o parametro `userId` é válido.
     */
    validUserId(req: Request, res: Response, next: NextFunction) {
        const { userId = null } = req.params;
        if (!userId) return res.status(400).json({ error: "UserId is missing" });

        return next();
    }

    //============================ validAdd ============================
    /**
     *  Verifica os parametros passados pelo body para adicionar um usuário.
     */
    async validAdd(req: Request, res: Response, next: NextFunction) {
        const {
            name = "",
            email = "",
            password = "",
            age = null,
            height = null,
            homeTeam = "",
        } = req.body;
        const userData = { name, email, password, age, height, homeTeam };
        const validationErrors = await UserService.validateData(userData);

        if (validationErrors.length === 0) return next();
        else return res.status(400).json(validationErrors);
    }

    //============================ validlogin ============================
    /**
     *  Verifica os parametros passados pelo body para efetuar o login do usuário.
     */
    async validLogin(req: Request, res: Response, next: NextFunction) {
        const { email = '', password = '' } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "Missing credentials, [email] or [password]." });

        return next();
    }
}

export default new UserMiddleware();
