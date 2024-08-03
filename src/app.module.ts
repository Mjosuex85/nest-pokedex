import { join } from 'path';
import { CommonModule } from './common/common.module';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { PokemonModule } from './pokemon/pokemon.module';
import { CharactersModule } from './characters/characters.module';
import { SeedModule } from './seed/seed.module';
import { EnvConfiguration } from './config/app.config';
import { JoiValidatorSchema } from './config/joi.config';


@Module({
  imports: [
    // TODO: ESTO ES COMO EL DOTENV
    ConfigModule.forRoot({
      // TODO: ESTO CARGA LA CONFIGURACIÓN QUE CREO PARA LAS VARIABLES DE ENTORNO
      // LOAD: para todo el modulo de nest, y validationSchema un paso más arriba de la aplicación de nest
      load: [ EnvConfiguration ],
      validationSchema: JoiValidatorSchema
    }),
    // ESTO HACE QUE CUANDO LA PAGINA CARGUE CON ALGUN ERROR, RENDERICE UN HTML STATICO SSR
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    }),

    // ESTO ES EL "ORM" LA CONEXIÓN A LA BASE DE DATOS, SEA LOCAL O EN LA NUBE DEPENDIENDO DE EL URL que se le pase
    MongooseModule.forRoot(process.env.MONGODB),
    
    CharactersModule,
    PokemonModule,
    SeedModule,
    CommonModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

  constructor() {
    console.log(process.env)
  }


}
