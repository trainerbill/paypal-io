import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import * as glob from "glob";
import * as express from "express";
import * as path from "path";

async function bootstrap() {
	const app = await NestFactory.create(ApplicationModule);
	const dir = __dirname + "/modules/**/views";
	glob(dir , (err, directories) => {
		// app.use(express.static(path.join(__dirname, 'public')));
		app.set('views', directories);
		app.set('view engine', 'pug');
		// app.set('basedir', __dirname);
	})

	

	await app.listen(3000);
}
bootstrap();
