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
exports.getAlbums = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAlbums = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (id !== undefined) {
            const album = yield prisma.album.findUnique({
                where: {
                    id: id,
                },
                include: {
                    songs: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                },
            });
            return album ? [album] : [];
        }
        else {
            const albums = yield prisma.album.findMany({
                include: {
                    songs: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                },
            });
            const albumsSong = albums.map((album) => (Object.assign(Object.assign({}, album), { songIds: album.songs.map((song) => song.id) })));
            return albumsSong;
        }
    }
    catch (error) {
        console.error('Error fetching albums:', error);
        throw new Error('Internal server error');
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.getAlbums = getAlbums;
