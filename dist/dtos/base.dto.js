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
exports.BaseDto = void 0;
const class_validator_1 = require("class-validator");
const http_errors_1 = __importDefault(require("http-errors"));
class BaseDto {
    isValid() {
        return __awaiter(this, void 0, void 0, function* () {
            const validationErrors = yield (0, class_validator_1.validate)(this);
            if (validationErrors.length) {
                const badRequest = new http_errors_1.default.BadRequest();
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
