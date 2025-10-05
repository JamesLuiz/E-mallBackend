import { ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
export declare class AuthRateLimitGuard extends ThrottlerGuard {
    protected handleRequest(context: ExecutionContext, limit: number, ttl: number): Promise<boolean>;
}
