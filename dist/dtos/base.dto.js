"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.BaseDto = void 0;
const class_validator_1 = require("class-validator");
const http_errors_1 = __importStar(require("http-errors"));
class BaseDto {
    isValid() {
        return __awaiter(this, void 0, void 0, function* () {
            const validationErrors = yield (0, class_validator_1.validate)(this);
            if (validationErrors.length) {
                const badRequest = new http_errors_1.BadRequest();
                throw (0, http_errors_1.default)(badRequest.status, badRequest.message, {
                    validationErrors: this.format(validationErrors),
                });
            }
            return true;
        });
    }
    format(errors) {
        return errors
            .map((error) => {
            var _a, _b;
            if (!((_a = error.children) === null || _a === void 0 ? void 0 : _a.length)) {
                return {
                    property: error.property,
                    constraint: Object.values((_b = error.constraints) !== null && _b !== void 0 ? _b : {}),
                };
            }
            return this.format(error.children);
        })
            .flat();
    }
}
exports.BaseDto = BaseDto;
