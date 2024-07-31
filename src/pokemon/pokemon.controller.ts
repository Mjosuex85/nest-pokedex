import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

import { ParseMongoIdPipe } from '../common/pipes/mongoId.pipe'
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPokemonDto: CreatePokemonDto[]) {
    return this.pokemonService.create( createPokemonDto );
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto){  
    
    //TODO: está usando un DTO con reglas, y se usa un globalPipe para transformar la data que se espera.
    // TODO: YO haría que recibiera string y transformarlos en el servicio
    
    return this.pokemonService.findAll( paginationDto );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pokemonService.findOne( id );
  }

  @Patch(':term')
  update(
    @Param('term') term: string, 
    @Body() updatePokemonDto: UpdatePokemonDto) 
  {
    return this.pokemonService.update(term, updatePokemonDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe ) id: string) {
    return this.pokemonService.remove( id );
  }
}
