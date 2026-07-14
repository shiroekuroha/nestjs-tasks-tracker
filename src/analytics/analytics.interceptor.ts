import { Observable, tap } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class AnalyticsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const now = Date.now();

    console.log(`API: ${req.method} ${req.originalUrl}`);

    return next.handle().pipe(
      tap((data) => {
        data.analytics = {
          ...(data.analytics ?? {}),
          processingTimeMs: Date.now() - now,
        };
      }),
    );
  }
}
