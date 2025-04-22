import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { MovieRepository } from './movie.repository';
import { IntervalResponse, IntervalResult } from './interface/interval-response.interface';
import { Movie } from './movie.entity';

@Injectable()
export class MovieService {
  private logger: Logger = new Logger(MovieService.name);
  
  constructor(private readonly movieRepository: MovieRepository) {}

  async getProducersInterval(): Promise<IntervalResponse> {
    this.logger.log("Iniciando recuperação de intervalo de vencedores...");
    const winners = await this.loadData();
    const producersMap = this.mapProducers(winners);
    const intervals = this.mapIntervals(producersMap);

    const minInterval = intervals.reduce((min, item) => item.interval < min ? item.interval : min, 500);
    const maxInterval = intervals.reduce((max, item) => item.interval > max ? item.interval : max, 0);

    const result = {
      min: intervals.filter((i) => i.interval === minInterval),
      max: intervals.filter((i) => i.interval === maxInterval),
    };

    this.logger.log("Processo concluído.");
    return result;
  }

  private async loadData(): Promise<Movie[]>{
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

  private mapProducers(winners: Movie[]): Map<string, number[]>{
    const producersMap = new Map<string, number[]>();
    for (const movie of winners) {
      const producers = movie.producers.split(/,| and /).map((p) => p.trim());
      for (const producer of producers) {
        const list = producersMap.get(producer) ?? [];
        list.push(movie.year);
        producersMap.set(producer, list);
      }
    }
    return producersMap;
  }

  private mapIntervals(producersMap: Map<string, number[]>): IntervalResult[] {
    const intervals: IntervalResult[] = [];
  
    for (const [producer, years] of Array.from(producersMap)) {
      if (years.length < 2) continue;
  
      const orderedYears = [...years].sort((a, b) => a - b);
  
      for (let i = orderedYears.length - 1; i > 0; i--) {
        const current = orderedYears[i];
        const previous = orderedYears[i - 1];
        intervals.push({
          producer,
          interval: current - previous,
          previousWin: previous,
          followingWin: current,
        });
      }
    }
  
    return intervals;
  }
}