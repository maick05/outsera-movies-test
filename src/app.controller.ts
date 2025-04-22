import { Controller, Get } from '@nestjs/common';
import { MovieService } from './movie/movie.service';
import { IntervalResponse } from './movie/interface/interval-response.interface';

@Controller("producers")
export class AppController {
  constructor(private readonly movieService: MovieService) {}

  @Get("/intervals")
  getProducersInterval(): Promise<IntervalResponse> {
    return this.movieService.getProducersInterval();
  }
}
