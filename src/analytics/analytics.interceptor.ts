import { Observable, tap } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AnalyticsInterceptor implements NestInterceptor {
  constructor(private configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const now = Date.now();

    if ((this.configService.get<string>('NODE_ENV') ?? 'default') == 'dev') {
      console.log(`[${new Date()}] API: ${req.method} ${req.originalUrl}`);
    }

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
