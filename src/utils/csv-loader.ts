import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';
import { Movie } from 'src/movie/movie.entity';

export async function loadMoviesFromCsv(): Promise<Movie[]> {
  const items: Movie[] = [];
  const filePath = path.resolve(__dirname, '../../data/movielist.csv');

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser({ separator: ';' }))
      .on('data', (row) => {
        if (!row.year || !row.title || !row.producers) return;

        items.push({
          year: parseInt(row.year, 10),
          title: row.title,
          studios: row.studios,
          producers: row.producers,
          winner: row.winner?.trim().toLowerCase() === 'yes',
        } as Movie);
      })
      .on('end', () => resolve(items))
      .on('error', (error) => reject(error));
  });
}