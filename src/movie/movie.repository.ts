import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';

@Injectable()
export class MovieRepository {
  constructor(
    @InjectRepository(Movie)
    private readonly repository: Repository<Movie>,
  ) {}

  async findAllWinners(): Promise<Movie[]> {
    return this.repository.find({ where: { winner: true } });
  }

  async findAll(): Promise<Movie[]> {
    return this.repository.find({});
  }
}