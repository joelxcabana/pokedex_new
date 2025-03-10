import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-responde.interfaces';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel:Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) {

  }


  async executeSeed() {

    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const listPokemon: { no: number; name: string }[] = [];

    data.results.forEach(({name, url}) => {
      const segment = url.split('/');
      const no:number = +segment[segment.length - 2];
      listPokemon.push({ no, name})
    });

    await this.pokemonModel.insertMany(listPokemon);

    return 'seed executed successfully';
  }

 
}
