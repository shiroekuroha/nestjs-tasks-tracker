import { ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (configService: ConfigService) =>
      mongoose.connect(configService.getOrThrow<string>('MONGODB_URI')),
    inject: [ConfigService],
  },
];
