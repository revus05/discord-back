import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import * as cookieParser from 'cookie-parser'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)
	app.enableCors({
		credentials: true,
		origin: 'http://localhost:5173',
	})
	const staticDirectory = `${process.cwd()}/public/avatars`
	app.useStaticAssets(staticDirectory)
	app.use(cookieParser())
	await app.listen(5555, () => {
		console.log('============ Server is running on port: 5555 ============')
	})
}
bootstrap().then()
