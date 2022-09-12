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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const http_errors_1 = require("http-errors");
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const client_1 = require("@prisma/client");
const prisma_1 = require("../prisma");
const enums_1 = require("../utils/enums");
class AuthService {
    static register(_a) {
        var { password } = _a, input = __rest(_a, ["password"]);
        return __awaiter(this, void 0, void 0, function* () {
            const userFound = yield prisma_1.prisma.user.findUnique({
                select: { uuid: true },
                where: { email: input.email },
                rejectOnNotFound: false,
            });
            if (userFound) {
                throw new http_errors_1.UnprocessableEntity("email already registered");
            }
            const user = yield prisma_1.prisma.user.create({
                data: Object.assign({ password: (0, bcryptjs_1.hashSync)(password) }, input),
            });
            const sub = (yield this.createToken(user.uuid)).sub;
            const token = this.generateToken(sub);
            //emit email
            return token;
        });
    }
    static createToken(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenRow = prisma_1.prisma.token.create({
                    data: {
                        user_id: user_id,
                    },
                });
                return tokenRow;
            }
            catch (error) {
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                    error.code === enums_1.PrismaErrors.FOREIGN_KEY_CONSTRAINT) {
                    throw new http_errors_1.NotFound("user not found");
                }
                throw error;
            }
        });
    }
    static generateToken(sub) {
        const now = new Date().getTime();
        const iat = Math.floor(now / 1000);
        const exp = iat + parseInt(process.env.JWT_EXPIRATION_TIME_MINUTES) * 60;
        const token = (0, jsonwebtoken_1.sign)({ sub, iat, exp }, process.env.JWT_SECRET);
        return { token, expiration: exp };
    }
}
exports.AuthService = AuthService;
