"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRouter = void 0;
const express_1 = __importDefault(require("express"));
exports.healthRouter = express_1.default.Router();
exports.healthRouter.route("").get((req, res) => {
    res.status(200).json({
        status: "ok",
        uptime: `${(process.uptime() / 60).toFixed(2)} min`,
    });
});
