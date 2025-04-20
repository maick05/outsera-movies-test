import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SeedService } from './seed/seed.service';
import { Movie } from './movie/movie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieRepository } from './movie/movie.repository';
import { MovieService } from './movie/movie.service';

@Module({
  imports: [    
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [Movie],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Movie])
  ],
  controllers: [AppController],
  providers: [SeedService, MovieService, MovieRepository],
})
export class AppModule {}
