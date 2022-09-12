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
const swagger_ui_express_1 = require("swagger-ui-express");
const morgan_1 = __importDefault(require("morgan"));
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("./swagger");
const router_1 = require("./router");
const http_error_dto_1 = require("./dtos/http-error.dto");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.NODE_ENV || "development";
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use("/api-docs", swagger_ui_express_1.serve, (0, swagger_ui_express_1.setup)(swagger_1.swaggerDoc));
app.use("/api", router_1.router);
app.use((err, req, res, next) => {
    var _a;
    res.status((_a = err.status) !== null && _a !== void 0 ? _a : 500).json((0, class_transformer_1.plainToClass)(http_error_dto_1.HttpErrorDto, err));
});
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server listening on port ${PORT}, env: ${ENVIRONMENT}`);
}));
