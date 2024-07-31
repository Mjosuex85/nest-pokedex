import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import { isValidObjectId, Model } from 'mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  public readonly defaultLimit: number;

  constructor(
    @InjectModel( Pokemon.name )
    private pokemonModel: Model<Pokemon>,
    private readonly confiService: ConfigService
  ){

    this.defaultLimit = this.confiService.get<number>('defaultLimit')

  }

  async create(createPokemonDto: CreatePokemonDto[]) {

    createPokemonDto.forEach(pokemon => {
      pokemon.name = pokemon.name.toLocaleLowerCase();
    });

    try {
      if (createPokemonDto.length > 1) {
        await this.pokemonModel.insertMany(createPokemonDto);
        return createPokemonDto;
      } else {
        const newPokemon = await this.pokemonModel.create(createPokemonDto[0]);
        return newPokemon;
        }
      } catch (error) {
        this.handleException(error);
      }
  };

  async findAll(paginationDto: PaginationDto) {
      const { limit = this.defaultLimit, offset = 0 } = paginationDto

      
      //TODO: transformar a numero los strings y así el servicio hace la lógica
      return this.pokemonModel.find()
        .limit( limit ) // LA CANTIDAD DE DATOS QUE QUIERO PEDIR
        .skip( offset ) // APARTIR DE QUE NUMERO QUIERO VER LOS DATOS
        .sort({ // ORDENAR COMO SE PIDEN
          no: 1 // PROPIEDAD QUE QUIERO ORDENAR
        })
        .select('-__v',) // EL GUIÓN - QUITA LA COLUMNA QUE NO QUIERO VER
      
  };

  async findOne(term: string) {
    let pokemon: Pokemon;

    if(!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({no: term})
    }
    if(!pokemon && isValidObjectId( term )) {
      pokemon = await this.pokemonModel.findById( term )
    }
    if(!pokemon) {
      pokemon = await this.pokemonModel.findOne({name: term.toLocaleLowerCase().trim()})
    }
    if(!pokemon) throw new NotFoundException(`Pokemon with id, name or no "${ term }" not found`)

    return pokemon
  };

  async update( term: string, updatePokemonDto: UpdatePokemonDto ) {
    const pokemon = await this.findOne( term )

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    }

    try {
      await pokemon.updateOne( updatePokemonDto ) 
      return { ...pokemon.toJSON(), ...updatePokemonDto }
    } 
    catch (error) {
      this.handleException(error)
    }
  };

  async remove(term: string) {

      const pokemon = await this.pokemonModel.findByIdAndDelete( term )

      if(pokemon === null) {
        throw new BadRequestException(`Theres is not pokemon to remove with de id ${term}`)
      }

      return { eliminated: pokemon }
  };

  private handleException( error: any) {
    if(error.code === 11000) {
      
      const value = error.value || error.message
      
      throw new BadRequestException(`Cannot use the ${ JSON.stringify(value) }, is alredy exists`)
    }
    console.log(error) 
      throw new InternalServerErrorException('Internal Server Error - check Logs')
  };

}
