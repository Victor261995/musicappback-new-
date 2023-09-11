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
const express_1 = __importDefault(require("express"));
const albumController_1 = require("./../Controllers/albumController");
const albumsRouter = express_1.default.Router();
albumsRouter.get('/:id?', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const idAsNumber = id ? parseInt(id) : undefined;
    try {
        const albums = yield (0, albumController_1.getAlbums)(idAsNumber);
        if (!albums || albums.length === 0) {
            res.status(404).json({ message: 'No albums found' });
        }
        else {
            res.json(albums);
        }
    }
    catch (error) {
        console.error('Error fetching albums:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = albumsRouter;
