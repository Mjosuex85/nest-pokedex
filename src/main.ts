import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  // AQUI SE CREA LA APLICACIÓN CON UN NEST FACTORY, EN ESTE CASO USANDO EXPRESS
  const app = await NestFactory.create(AppModule);

  // HABILITA EL CORS PARA USARLO EN EL FRONT EN DESARROLLO
  app.enableCors({
    origin: '*', // Cambia esto al origen de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // ESO SEATEA UN GLOBAL PIPES, PARA QUE NO ENVIE BODY EN BLANCO Y OTROS VALIDADORES GLOBALES
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      //TODO: TRANFORMA LA DATA DE LOS DTO EN LA PARTE DEL LIMIT Y OFFSET DEL CONTROLADOR DEL POKEMON (VER BIEN) 
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );

  // ESTO SETEA UN PREFIJO A TODAS LAS RUTAS GLOBALES
  app.setGlobalPrefix('api/v2');

  // EL PUERTO DONDE DEBE ESCUCHAR // DESARROLLO
  await app.listen(process.env.PORT);
}
bootstrap();
