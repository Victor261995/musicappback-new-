"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.followRouter = void 0;
const followController_1 = require("../Controllers/followController");
const express_1 = require("express");
const followController_2 = require("../Controllers/followController");
const authinter_1 = require("../AuthMiddleware/authinter");
exports.followRouter = (0, express_1.Router)();
exports.followRouter.post('/followArtist', authinter_1.AuthMiddleware, followController_1.followArtist);
exports.followRouter.delete('/unfollowArtist/:artistName', followController_2.unfollowArtist);