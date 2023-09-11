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
exports.logoutUser = exports.getUser = exports.deleteUser = exports.loginUser = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const auth_1 = require("./../AuthMiddleware/auth");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, email, contrasena, playlist } = req.body;
        const usuarioExistente = yield prisma.user.findFirst({
            where: { email },
        });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(contrasena, 10);
        const newUser = yield prisma.user.create({
            data: {
                nombre,
                email,
                contrasena: hashedPassword,
            },
        });
        return res.json(newUser);
    }
    catch (error) {
        console.error('Error al crear usuario', error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, contrasena } = req.body;
        const user = yield prisma.user.findFirst({
            where: { email: email },
            include: {
                playlists: true,
                followedArtists: true
            }
        });
        if (!user || !(yield (0, auth_1.comparePasswords)(contrasena, user.contrasena))) {
            return res.status(401).json({ error: 'Error en email o contrasena' });
        }
        const token = (0, auth_1.generateToken)(user);
        return res.json({ user, token });
    }
    catch (error) {
        console.error('error al iniciar sesion', error);
        res.status(500).json({ error: 'error al iniciar sesion' });
    }
});
exports.loginUser = loginUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.userId);
        const usuarioExistente = yield prisma.user.findUnique({
            where: { id: Number(userId) },
            include: {
                playlists: true,
                followedArtists: true,
            },
        });
        if (!usuarioExistente) {
            return res.status(404).json({ Error: 'Usuario no encontrado' });
        }
        ;
        yield prisma.playlist.deleteMany({ where: { usuarioId: userId } });
        yield prisma.followartist.deleteMany({ where: { userId } });
        yield prisma.user.delete({
            where: { id: Number(userId) },
            include: { playlists: true },
        });
        return res.json({ message: 'Usuario eliminado' });
    }
    catch (error) {
        console.error('Error al eliminar usuario', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});
exports.deleteUser = deleteUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield prisma.user.findUnique({
            where: { id: parseInt(userId) },
            include: {
                followedArtists: true,
                playlists: {
                    include: {
                        songs: true,
                        album: true,
                    }
                },
            }
        });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const response = {
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            followedArtists: user.followedArtists || [],
            playlists: user.playlists || [],
        };
        if (user.followedArtists && user.followedArtists.length > 0) {
            response.followedArtists = user.followedArtists;
        }
        else {
            response.followedArtists = [];
            response.messageFollowedArtists = 'El usuario no sigue a ningún artista.';
        }
        if (user.playlists && user.playlists.length > 0) {
            response.playlists = user.playlists;
        }
        else {
            response.playlists = [];
            response.messagePlaylists = 'El usuario no tiene playlists creadas.';
        }
        return res.json(response);
    }
    catch (error) {
        console.error('Error  usuario ', error);
        res.status(500).json({ error: 'Error usuario ' });
    }
});
exports.getUser = getUser;
const logoutUser = (req, res) => {
    try {
        res.cookie('token', '', { expires: new Date(0) });
        res.json({ message: 'Log out' });
    }
    catch (error) {
        console.error('Error log out:', error);
        res.status(500).json({ error: 'Error log out' });
    }
};
exports.logoutUser = logoutUser;
