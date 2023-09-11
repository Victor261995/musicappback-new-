"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const Password = 'passwordtoken';
const AuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorizationHeader = req.headers.authorization || '';
        if (!authorizationHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token no válido' });
        }
        const token = authorizationHeader.replace('Bearer ', '').trim();
        const decoded = jsonwebtoken_1.default.verify(token, Password);
        const userId = decoded.id;
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            include: {
                playlists: true,
                followedArtists: true,
            },
        });
        if (!user) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
});
exports.AuthMiddleware = AuthMiddleware;
