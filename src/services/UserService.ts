import { getRepository, Repository, getConnection } from "typeorm";
import { User } from "@models/User";
import { validate, ValidationError } from "class-validator";
import Token from "@utils/Token";

class UserService {
    //============================ validateData ============================
    /**
     * Utilização do `class-validator.validate()` para validar os dados
     * antes de salvar no database.
     * Essas validaçoes estao definidas em '@models/User'.
     */
    async validateData(userData): Promise<ValidationError[]> {
        const { name, email, password, age, height, homeTeam } = userData;
        const userRepository: Repository<User> = getRepository(User);
        const user: User = userRepository.create({
            name,
            email,
            password,
            age,
            height,
            homeTeam,
        });

        return await validate(user, { validationError: { target: false } });
    }

    //============================ getUsers ============================
    async getUsers(): Promise<User[]> {
        const userRepository: Repository<User> = getRepository(User);
        const usersList: User[] = await userRepository.find({
            order: { idUser: "ASC" },
        });

        return usersList.map((user) => {
            delete user.password;
            return user;
        });
    }

    //============================ getUser ============================
    async getUser(userId: string, showPassword: boolean = false): Promise<User> {
        const userRepository: Repository<User> = getRepository(User);
        const user: User = await userRepository.findOne(userId);

        // para prevenir o erro: "Cannot convert undefined or null to object"
        if (user && !showPassword) delete user.password;

        return user;
    }

    //============================ addUser ============================
    async addUser(userData: {
        name: string;
        email: string;
        password: string;
        age: number;
        height: number;
        homeTeam: string | null;
    }) {
        const userRepository: Repository<User> = getRepository(User);
        const user: User = userRepository.create(userData);

        // `email` must be unique
        const userExists: User = await userRepository.findOne({
            where: { email: user.email },
        });
        if (userExists) return null;

        const userSaved: User = await userRepository.save(user);

        delete userSaved.password;

        return userSaved;
    }

    //============================ updateUser ============================
    async updateUser(
        userId: string,
        userData: {
            name: string;
            email: string;
            password: string;
            age: number;
            height: number;
            homeTeam: string | null;
        }
    ) {
        const { name, email, password, age, height, homeTeam } = userData;
        const userRepository: Repository<User> = getRepository(User);
        const user: User = userRepository.create({
            name,
            email,
            age,
            height,
            homeTeam,
        });

        // `email` must be unique
        const userExists: User = await userRepository.findOne({
            where: { email: user.email },
        });
        if (userExists) if (userId !== userExists.idUser.toString()) return null;

        const userInDatabase: User = await userRepository.findOne({
            where: { idUser: userId },
        });
        const samePassword: boolean = await userInDatabase.passwordValidate(password);
        if (!samePassword) user.password = password;

        await userRepository.update(userId, user);

        return await this.getUser(userId);
    }

    //============================ deleteUser ============================
    async deleteUser(userId: string) {
        const userRepository: Repository<User> = getRepository(User);
        return await userRepository.delete(userId);
    }

    //============================ loginUser ============================
    async loginUser(email, password) {
        const userRepository: Repository<User> = getRepository(User);
        const user: User = await userRepository.findOne({ where: { email } });
        if (!user) 
            return null;

        const ValidPassword = await user.passwordValidate(password);
        if (!ValidPassword) 
            return null;

        return await Token.generateToken({
            idUser: user.idUser,
            email: user.email,
        });

    }

    //============================ authUser ============================
    async authUser(token: string) {
        const tokenData = await Token.validateToken(token);
        if(!tokenData)
            return null;
            
        const userRepository: Repository<User> = getRepository(User);
        const user: User = await userRepository.findOne({ where: { email: (<any>tokenData).email } });

        return await this.getUser( (<any>user.idUser) );


    }
}   
export default new UserService();
