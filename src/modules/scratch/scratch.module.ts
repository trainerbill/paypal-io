import { Module } from '@nestjs/common';
import { ScratchController } from './scratch.controller';

@Module({
  controllers: [
    ScratchController
  ]
})
export class ScratchModule {}
