import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { MovieRepository } from './movie.repository';
import { IntervalResponse } from './interface/interval-response.interface';
import { IntervalResult } from './interface/interval-result.interface';
import { Movie } from './movie.entity';

@Injectable()
export class MovieService {
  private logger: Logger = new Logger(MovieService.name);
  
  constructor(private readonly movieRepository: MovieRepository) {}

  async getProducersInterval(): Promise<IntervalResponse> {
    this.logger.log("Iniciando recuperação de intervalo de vencedores...");
    const winners = await this.loadDataInDatabase();
    const producerWinsMap = this.mapWinnerProducers(winners);
    const intervals = this.mapIntervals(producerWinsMap);

    const minInterval = intervals.reduce((min, item) => item.interval < min ? item.interval : min, 500);
    const maxInterval = intervals.reduce((max, item) => item.interval > max ? item.interval : max, 0);

    const result = {
      min: intervals.filter((i) => i.interval === minInterval),
      max: intervals.filter((i) => i.interval === maxInterval),
    };

    this.logger.log(`Processo concluído, min: ${minInterval}, max: ${maxInterval}`);
    return result;
  }

  private async loadDataInDatabase(): Promise<Movie[]>{
    try{
      this.logger.log("Buscando filmes salvos em memória...");
      const movies = await this.movieRepository.findAllWinners();
      this.logger.log(`Filmes vencedores encontrados: ${movies.length}`);
      return movies;
    }catch(err){
      this.logger.error(err);
      throw new InternalServerErrorException(`Erro ao buscar dados em memória: ${JSON.stringify(err)}`);
    }
  }

  private mapWinnerProducers(winners: Movie[]): Map<string, number[]>{
    const producerWinsMap = new Map<string, number[]>();
    for (const movie of winners) {
      const producers = movie.producers.split(/,| and /).map((p) => p.trim());
      for (const producer of producers) {
        if (!producerWinsMap.has(producer))
          producerWinsMap.set(producer, []);
        const pwm = producerWinsMap.get(producer);
        if(pwm) 
          pwm.push(movie.year);
      }
    }
    return producerWinsMap;
  }

  private mapIntervals(producerWinsMap: Map<string, number[]>): IntervalResult[] {
    const intervals: IntervalResult[] = [];
    for (const [producer, years] of producerWinsMap.entries()) {
      if (years.length < 2) continue;

      const sortedYears = years.sort((a, b) => a - b);
      for (let i = 1; i < sortedYears.length; i++) {
        intervals.push({
          producer,
          interval: sortedYears[i] - sortedYears[i - 1],
          previousWin: sortedYears[i - 1],
          followingWin: sortedYears[i],
        });
      }
    }
    return intervals;
  }

  async getAllMovies() {
    return this.movieRepository.findAll();
  }
}