import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CandidatesModule } from './candidates/candidates.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    CandidatesModule,
  ],
})
export class AppModule {}