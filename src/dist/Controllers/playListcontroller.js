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
exports.addToPlaylist = exports.getPlaylists = exports.deleteTrack = exports.deletePlaylist = exports.createPlaylist = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createPlaylist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ error: 'No se inició sesión' });
        }
        const { nombre, albumId, songId } = req.body;
        console.log('Received songIds:', songId);
        const existingPlaylist = yield prisma.playlist.findFirst({
            where: {
                usuarioId: userId,
                nombre,
            },
        });
        if (existingPlaylist) {
            const updatedPlaylist = yield prisma.playlist.update({
                where: { id: existingPlaylist.id },
                data: {
                    songs: {
                        connect: songId.map((songId) => ({ id: songId })),
                    },
                },
            });
            return res.json(updatedPlaylist);
        }
        const playlist = yield prisma.playlist.create({
            data: {
                nombre,
                usuario: { connect: { id: userId } },
                songs: {
                    connect: songId.map((songId) => ({ id: songId })),
                },
                album: albumId ? { connect: { id: albumId } } : undefined,
            },
        });
        return res.json(playlist);
    }
    catch (error) {
        console.error('Error al crear playlist', error);
        res.status(500).json({ error: 'Error al crear la playlist' });
    }
});
exports.createPlaylist = createPlaylist;
const deletePlaylist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { playlistId } = req.params;
        const existingPlaylist = yield prisma.playlist.findUnique({
            where: { id: parseInt(playlistId) },
        });
        if (!existingPlaylist) {
            return res.status(404).json({ error: 'Playlist No encontrada'
            });
        }
        yield prisma.playlist.delete({
            where: { id: Number(playlistId) }
        });
        return res.json({ message: 'Playlist eliminada ' });
    }
    catch (error) {
        console.error('Error al eliminar la playlist', error);
        res.status(500).json({ error: 'error al eliminar la playlist' });
    }
});
exports.deletePlaylist = deletePlaylist;
const deleteTrack = (res, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { playlistId, songId } = req.params;
        yield prisma.playlist.update({
            where: { id: Number(playlistId) },
            data: {
                songs: {
                    disconnect: { id: Number(songId) },
                },
            },
        });
        return res.json({ message: 'tema eliminado de playlist ' });
    }
    catch (error) {
        console.error('Error al eliminar tema', error);
        res.status(500).json({ error: 'error al eliminar tema ' });
    }
});
exports.deleteTrack = deleteTrack;
const getPlaylists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (!userId) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        const playlists = yield prisma.playlist.findMany({
            where: {
                usuarioId: userId,
            },
            include: {
                songs: true,
                album: true
            },
        });
        return res.json(playlists);
    }
    catch (error) {
        console.error('Error al obtener las playlists del usuario', error);
        res.status(500).json({ error: 'Error al obtener las playlists del usuario' });
    }
});
exports.getPlaylists = getPlaylists;
const addToPlaylist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
        if (!userId) {
            return res.status(401).json({ error: 'No se inició sesión' });
        }
        const { playlistName, songId } = req.body;
        const existingPlaylist = yield prisma.playlist.findFirst({
            where: {
                usuarioId: userId,
                nombre: playlistName,
            },
        });
        if (!existingPlaylist) {
            return res.status(404).json({ error: 'Playlist no encontrada' });
        }
        const updatedPlaylist = yield prisma.playlist.update({
            where: { id: existingPlaylist.id },
            data: {
                songs: {
                    connect: songId.map((songId) => ({ id: songId })),
                },
            },
            include: {
                songs: {
                    include: {
                        album: true,
                    }
                }
            }
        });
        const songs = updatedPlaylist.songs.map((song) => {
            return Object.assign(Object.assign({}, song), { album: song.album });
        });
        const updated = Object.assign(Object.assign({}, updatedPlaylist), { songs: songs });
        return res.json(updated);
    }
    catch (error) {
        console.error('Error al añadir a la playlist', error);
        res.status(500).json({ error: 'Error al añadir a la playlist' });
    }
});
exports.addToPlaylist = addToPlaylist;
