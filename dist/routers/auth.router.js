"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const auth_controller_1 = require("../controllers/auth.controller");
exports.authRouter = express_1.default.Router();
exports.authRouter.route("/register").post((0, express_async_handler_1.default)(auth_controller_1.register));
