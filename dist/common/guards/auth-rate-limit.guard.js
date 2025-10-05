"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRateLimitGuard = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
let AuthRateLimitGuard = class AuthRateLimitGuard extends throttler_1.ThrottlerGuard {
    async handleRequest(context, limit, ttl) {
        const { req } = context.switchToHttp().getRequest();
        const key = this.generateKey(context, req.ip, 'auth');
        const totalHits = await this.storageService.increment(key, ttl);
        const hitCount = typeof totalHits === 'number' ? totalHits : 0;
        if (hitCount > limit) {
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.TOO_MANY_REQUESTS,
                message: 'Too many authentication attempts. Please try again later.',
                error: 'Too Many Requests',
            }, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        return true;
    }
};
exports.AuthRateLimitGuard = AuthRateLimitGuard;
exports.AuthRateLimitGuard = AuthRateLimitGuard = __decorate([
    (0, common_1.Injectable)()
], AuthRateLimitGuard);
//# sourceMappingURL=auth-rate-limit.guard.js.map