import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';

import { Character } from './entities/character.entity';

import { transformProperty } from '../../utils/transform'

@Injectable()
export class CharactersService {
  
  constructor(
    @InjectModel( Character.name)
    private characterModel : Model<Character>
  ){}
  
  async createCharacter(createCharacterDto: CreateCharacterDto) {

    createCharacterDto.name = createCharacterDto.name.toLocaleLowerCase();
    createCharacterDto.lastName = createCharacterDto.lastName.toLocaleLowerCase();
    createCharacterDto.createdAt = new Date().getTime();

    try {
      const newCharacter = await this.characterModel.create(createCharacterDto)
      return newCharacter

    } catch (error) {
      if(error.code === 11000) {
        throw new BadRequestException(`Character exists in db ${ JSON.stringify( error.keyValue ) }`)
      }
      console.log(error)
      throw new InternalServerErrorException(`Can't create entry - Check server logs`)      
    }

  };

  async findAll() {
    const allChatacters = await this.characterModel.find();
    return allChatacters;
  };

  async findOne(term: string) {

    let character: Character;

    if(isValidObjectId( term )) {
      character = await this.characterModel.findById( term ) 
    }

    if( !character) {
      character = await this.characterModel.findOne({name: term.toLocaleLowerCase().trim()})
    }

    if( !character ) {
      throw new NotFoundException(`There is no character with ${term}`)
    }

    return character;
  };

  async update(term: string, updateCharacterDto: UpdateCharacterDto) {

    const character = await this.findOne( term )
    updateCharacterDto.updatedAt = new Date().getTime();

    if(updateCharacterDto.name) {
      updateCharacterDto.name = transformProperty(updateCharacterDto.name)
    }

    if(updateCharacterDto.lastName) {
      updateCharacterDto.lastName = transformProperty(updateCharacterDto.lastName)
    }

    await character.updateOne( updateCharacterDto )

    return {...character.toJSON(), ...updateCharacterDto}
  };

  async remove(term: string) {

      const character = await this.findOne( term )

      await this.characterModel.deleteOne( { _id: character.id } )

    return {msg: 'character removed'}
  };
}
