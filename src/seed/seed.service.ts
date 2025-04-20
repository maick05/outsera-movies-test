import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from '../movie/movie.entity';
import { loadMoviesFromCsv } from '../utils/csv-loader';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const movies = await loadMoviesFromCsv();
    await this.movieRepository.clear();
    await this.movieRepository.save(movies);
  }
}