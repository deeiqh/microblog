"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDoc = void 0;
const fs_1 = __importDefault(require("fs"));
const js_yaml_1 = require("js-yaml");
exports.swaggerDoc = (0, js_yaml_1.load)(fs_1.default.readFileSync("./docs/swagger.yaml", "utf-8"));
