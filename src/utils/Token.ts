import { decode, JwtPayload, sign, verify } from "jsonwebtoken";


class Token {
    async generateToken(user) {
        return sign(user, process.env.JWT_SECRET, {expiresIn: 1800});
    }

    async validateToken(token: string): Promise<string | JwtPayload>{
        return verify(token, process.env.JWT_SECRET)
    }

    async getToken(req) {
        const { authorization } = req.headers;
        try {
            const [type, token] = authorization.split(" ");
            return decode(token);
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

export default new Token();