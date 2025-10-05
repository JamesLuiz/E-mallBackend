import { Injectable, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class AuthRateLimitGuard extends ThrottlerGuard {
  protected async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
  ): Promise<boolean> {
    const { req } = context.switchToHttp().getRequest();
    const key = this.generateKey(context, req.ip, 'auth'); // Added 'auth' as the third argument
    const totalHits = await this.storageService.increment(key, ttl);

    const hitCount = typeof totalHits === 'number' ? totalHits : 0; // Default to 0 if not a number

    if (hitCount > limit) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many authentication attempts. Please try again later.',
          error: 'Too Many Requests',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
