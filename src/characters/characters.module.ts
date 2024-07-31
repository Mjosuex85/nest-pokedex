import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CharactersService } from './characters.service';
import { CharactersController } from './characters.controller';
import { Character, CharacterSchema } from './entities/character.entity';

@Module({
  controllers: [CharactersController],
  providers: [CharactersService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Character.name,
        schema: CharacterSchema
      }
    ])
  ]
})
export class CharactersModule {}
