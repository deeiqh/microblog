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
exports.register = void 0;
const class_transformer_1 = require("class-transformer");
const register_dto_1 = require("../dtos/auth/request/register.dto");
const auth_service_1 = require("../services/auth.service");
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const dto = (0, class_transformer_1.plainToInstance)(register_dto_1.RegisterDto, req.body);
        yield dto.isValid();
        const tokenResponse = yield auth_service_1.AuthService.register(dto);
        res.status(200).json(tokenResponse);
    });
}
exports.register = register;
