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
Object.defineProperty(exports, "__esModule", { value: true });
exports.unfollowArtist = exports.followArtist = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const followArtist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        const { artistName } = req.params;
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            include: { followedArtists: true },
        });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const alreadyFollowed = user.followedArtists.some((artist) => artist.artist === artistName);
        if (alreadyFollowed) {
            return res.json({ message: `Ya sigues al artista: ${artistName}` });
        }
        yield prisma.followartist.create({
            data: {
                artist: artistName,
                user: { connect: { id: userId } },
            },
        });
        return res.json({ message: `Ahora sigues al artista: ${artistName}` });
    }
    catch (error) {
        console.error('Error al seguir al artista', error);
        res.status(500).json({ error: 'Error al seguir al artista' });
    }
});
exports.followArtist = followArtist;
const unfollowArtist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { artistName } = req.params;
        const userId = 1; // Aquí deberías obtener el ID del usuario autenticado, puede ser desde el token de autenticación o desde otra fuente
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            include: { followedArtists: true },
        });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const followedArtist = user.followedArtists.find((artist) => artist.artist === artistName);
        if (!followedArtist) {
            return res.json({ message: `No sigues al artista: ${artistName}` });
        }
        yield prisma.followartist.delete({
            where: { id: followedArtist.id },
        });
        return res.json({ message: `Dejaste de seguir al artista: ${artistName}` });
    }
    catch (error) {
        console.error('Error al dejar de seguir al artista', error);
        res.status(500).json({ error: 'Error al dejar de seguir al artista' });
    }
});
exports.unfollowArtist = unfollowArtist;
