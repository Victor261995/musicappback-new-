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
exports.search = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Received search request with searchTerm:', req.query.searchTerm);
    const searchTerm = req.query.searchTerm;
    try {
        const searchResult = yield prisma.album.findMany({
            where: {
                OR: [
                    { artista: { contains: searchTerm, mode: 'insensitive' } },
                    { titulo: { contains: searchTerm, mode: 'insensitive' } },
                    { genero: { contains: searchTerm, mode: 'insensitive' } },
                    {
                        songs: {
                            some: {
                                title: { contains: searchTerm, mode: 'insensitive' },
                            },
                        },
                    },
                ],
            },
            select: {
                titulo: true,
                artista: true,
                anio: true,
                caratula: true,
                songs: {
                    select: {
                        title: true,
                    },
                },
            },
        });
        console.log('Search results:', searchResult);
        res.json(searchResult);
    }
    catch (error) {
        console.error('Error en la búsqueda', error);
        res.status(500).json({ error: 'Error en la búsqueda' });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.search = search;
