import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClassicModule } from './modules/classic/classic.module';
import { ScratchModule } from './modules/scratch/scratch.module';
import { SpaModule } from './modules/spa/spa.module';

@Module({
  imports: [],
  controllers: [
    AppController
  ],
  components: [],
  modules: [
    ClassicModule,
    ScratchModule,
    SpaModule,
  ]
})
export class ApplicationModule {}
