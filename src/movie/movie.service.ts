import { Injectable } from '@nestjs/common';
import { MovieRepository } from './movie.repository';
import { IntervalResponse } from './interface/interval-response.interface';
import { IntervalResult } from './interface/interval-result.interface';

@Injectable()
export class MovieService {
  constructor(private readonly movieRepository: MovieRepository) {}

  async getProducersInterval(): Promise<IntervalResponse> {
    const winners = await this.movieRepository.findAllWinners();

    const producerWinsMap = new Map<string, number[]>();

    for (const movie of winners) {
      const producers = movie.producers.split(/,| and /).map((p) => p.trim());
      for (const producer of producers) {
        if (!producerWinsMap.has(producer))
          producerWinsMap.set(producer, []);
        const pwm = producerWinsMap.get(producer);
        if(pwm) pwm.push(movie.year);
      }
    }

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

    const minInterval = Math.min(...intervals.map((i) => i.interval));
    const maxInterval = Math.max(...intervals.map((i) => i.interval));

    return {
      min: intervals.filter((i) => i.interval === minInterval),
      max: intervals.filter((i) => i.interval === maxInterval),
    };
  }

  async getAllMovies() {
    return this.movieRepository.findAll();
  }
}