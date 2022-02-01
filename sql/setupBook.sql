DROP TABLE IF EXISTS book;

CREATE TABLE book (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  publisher BIGINT,
  released INT NOT NULL,
  FOREIGN KEY(publisher) REFERENCES publisher(id)
);

INSERT INTO book (title, publisher, released) VALUES ('Harry Potter', 1, 1998);
INSERT INTO book (title, publisher, released) VALUES ('Harry Potter 2', 1, 1999);