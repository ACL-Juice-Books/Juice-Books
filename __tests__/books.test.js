const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('book routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  const seedData = [
    {
      id: 1,
      title: 'Harry Potter',
      publisher: 1,
      released: 1998
    },
    {
      id: 2,
      title: 'Harry Potter 2',
      publisher: 1,
      released: 1999
    }
  ];

  it('should get all books', async () => {
    const { body } = await request(app).get('/api/v1/books');
    expect(body).toEqual(seedData);
  });

  it('should get a book', async () => {
    const { body } = await request(app).get('/api/v1/books/1');
    expect(body).toEqual(seedData[0]);
  });

  it('should post a book', async () => {
    const book = {
      title: 'Harry Potter',
      publisher: 1,
      released: 1998
    };

    const { body } = await request(app)
      .post('/api/v1/books/1')
      .send(book);

    book.id = 3;

    expect(body).toEqual(book);
  });
});
