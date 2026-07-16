import { error } from 'console';
import { catchError, map, Observable, tap } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class WrappersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const now = new Date();

    return next.handle().pipe(
      map((data) => {
        const res = context.switchToHttp().getResponse();
        const { meta, ...result } = data ?? {};

        if ([200, 201, 204].includes(res.statusCode)) {
          data = {
            method: req.method,
            route: req.originalUrl,
            status: Number(res.statusCode),
            success: true,
            data: data.data ?? data,
            meta: {
              ...(meta ?? {}),
            },
          };
        } else {
          data = {
            method: req.method,
            route: req.originalUrl,
            status: Number(res.statusCode),
            success: false,
            error: catchError((error) => error),
            meta: {},
          };
        }
        return data;
      }),
    );
  }
}
