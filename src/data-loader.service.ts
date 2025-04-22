import { Injectable, InternalServerErrorException, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './movie/movie.entity';
import { loadMoviesFromCsv } from './utils/csv-loader';
import { Repository } from 'typeorm';

@Injectable()
export class DataLoaderService implements OnApplicationBootstrap {
  private logger: Logger = new Logger(DataLoaderService.name);
  
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log("Iniciando carregamento de dados em memória...")
    const movies: Movie[] = await this.loadDataFromCSV();
    await this.saveMoviesInDatabase(movies);
    this.logger.log("Dados salvos em memória com sucesso.")
  }

  private async loadDataFromCSV(): Promise<Movie[]> {
    try{
      this.logger.log("Carregando dados do arquivo csv...")
      return await loadMoviesFromCsv();
    }catch(err){
      this.logger.error(err);
      throw new InternalServerErrorException(`Erro ao carregar dados do csv: ${JSON.stringify(err)}`);
    }
  }

  private async saveMoviesInDatabase(movies: Movie[]): Promise<void>{
    try{
      this.logger.log("Salvando dados no banco de dados...")
      await this.movieRepository.clear();
      await this.movieRepository.save(movies);
    }catch(err){
      this.logger.error(err);
      throw new InternalServerErrorException(`Erro ao salvar dados no banco de dados: ${JSON.stringify(err)}`);
    }
  }
}