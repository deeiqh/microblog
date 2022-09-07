"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentation = void 0;
const fs_1 = __importDefault(require("fs"));
const js_yaml_1 = require("js-yaml");
exports.documentation = (0, js_yaml_1.load)(fs_1.default.readFileSync("./docs/docs.yaml", "utf-8"));
