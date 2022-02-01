-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS authors CASCADE;
DROP TABLE IF EXISTS book CASCADE;
DROP TABLE IF EXISTS publishers CASCADE;

CREATE TABLE authors (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL, 
  date_of_birth DATE NOT NULL, 
  place_of_birth TEXT NOT NULL
);


CREATE TABLE  publishers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  country TEXT
);


CREATE TABLE book (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  publisher BIGINT,
  released INT NOT NULL,
  FOREIGN KEY(publisher) REFERENCES publishers(id)
);

INSERT INTO book (title, publisher, released) VALUES ('Harry Potter', 1, 1998);
INSERT INTO book (title, publisher, released) VALUES ('Harry Potter 2', 1, 1999);