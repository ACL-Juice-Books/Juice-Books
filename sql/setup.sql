-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS authors CASCADE;
DROP TABLE IF EXISTS book CASCADE;
DROP TABLE IF EXISTS publishers CASCADE;
DROP TABLE IF EXISTS books_authors CASCADE;
DROP TABLE IF EXISTS reviewers CASCADE;

CREATE TABLE authors (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL, 
  date_of_birth DATE NOT NULL, 
  place_of_birth TEXT NOT NULL
);

INSERT INTO authors (name, date_of_birth, place_of_birth) VALUES ('Nicholas Eames', '11/10/2020', 'USA');

CREATE TABLE  publishers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  country TEXT
);

INSERT INTO publishers (name) VALUES ('bob');

CREATE TABLE book (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  publisher BIGINT,
  released INT NOT NULL,
  FOREIGN KEY(publisher) REFERENCES publishers(id)
);

INSERT INTO book (title, publisher, released) VALUES ('Harry Potter', 1, 1998);
INSERT INTO book (title, publisher, released) VALUES ('Harry Potter 2', 1, 1999);

CREATE TABLE books_authors(
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  author_id BIGINT NOT NULL,  
  book_id BIGINT NOT NULL,
  FOREIGN KEY(author_id) REFERENCES authors(id), 
  FOREIGN KEY(book_id) REFERENCES book(id)
);

CREATE TABLE reviewers(
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL
);