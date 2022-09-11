"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const health_router_1 = require("./routers/health.router");
const auth_router_1 = require("./routers/auth.router");
exports.router = express_1.default.Router();
exports.router.use("/health", health_router_1.healthRouter);
exports.router.use("/auth", auth_router_1.authRouter);
