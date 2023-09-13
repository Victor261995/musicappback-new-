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
const cors_1 = __importDefault(require("cors"));
const followRutes_1 = require("./Rutes/followRutes");
const userRutes_1 = require("./Rutes/userRutes");
const client_1 = require("@prisma/client");
const playlistRuter_1 = require("./Rutes/playlistRuter");
const searchRoutes_1 = require("./Rutes/searchRoutes");
const albumRoutes_1 = __importDefault(require("./Rutes/albumRoutes"));
require("./AuthMiddleware/authinter");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userController_1 = require("./Controllers/userController");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 2600;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
    origin: 'http://localhost:3001',
}));
app.use("/users", userRutes_1.userRouter);
app.use("/playList", playlistRuter_1.playlistRouter);
app.use("/ArtistFollow", followRutes_1.followRouter);
app.use("/Search", searchRoutes_1.searchRouter);
app.use('/api/albums', albumRoutes_1.default);
app.use('/logout', userController_1.logoutUser);
app.use((0, cookie_parser_1.default)());
const backInit = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.$connect();
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('Error al iniciar la aplicación:', error);
    }
});
backInit();
