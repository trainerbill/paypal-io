import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClassicModule } from './modules/classic/classic.module';

@Module({
  imports: [],
  controllers: [
    AppController
  ],
  components: [],
  modules: [
    ClassicModule
  ]
})
export class ApplicationModule {}
