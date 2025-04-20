import { Controller, Get } from '@nestjs/common';
import { MovieService } from './movie/movie.service';
import { IntervalResponse } from './movie/interface/interval-response.interface';

@Controller("movies")
export class AppController {
  constructor(private readonly appService: MovieService) {}

  @Get("/intervals")
  getProducersInterval(): Promise<IntervalResponse> {
    return this.appService.getProducersInterval();
  }

  @Get("/")
  getAllMovies(): Promise<any> {
    return this.appService.getAllMovies();
  }
}
