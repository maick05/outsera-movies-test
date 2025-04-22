import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/producers/intervals (GET)', async () => {
    const expected = {
      min: [
        {
          producer: 'Joel Silver',
          interval: 1,
          previousWin: 1990,
          followingWin: 1991,
        },
      ],
      max: [
        {
          producer: 'Matthew Vaughn',
          interval: 13,
          previousWin: 2002,
          followingWin: 2015,
        },
      ],
    };

    const response = await request(app.getHttpServer())
      .get('/movies/intervals')
      .expect(200);

    expect(response.body).toEqual(expected);
  });

  afterAll(async () => {
    await app.close();
  });
});