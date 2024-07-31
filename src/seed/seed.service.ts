import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from '../pokemon/pokemon.service';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {


  constructor(
    @InjectModel( Pokemon.name )
    private pokemonModel: Model<Pokemon>,
    private pokemonService: PokemonService,
    private readonly http: AxiosAdapter
  ){}


  async excuteSeed() {
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon/?limit=650')

    await this.pokemonModel.deleteMany({}) // LIMPIA LA BASE DE DATOS
    
    const pokemons: CreatePokemonDto[] = data.results.map(({name, url}) => {
      return {
        no: this.extractNumberFromUrl(url),
        name
      }
    });
    await this.pokemonService.create(pokemons)

    return 'SEED EXECUTED'

  };

  private extractNumberFromUrl(url: string) {
    const regex = /\/(\d+)\/$/;
    const match = url.match(regex);
    if (match) {
        return parseInt(match[1], 10);
    } else {
        throw new Error("El formato de la URL no es válido, revisar la API externa.");
    }
  };

  

  
}
