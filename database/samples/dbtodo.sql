DROP DATABASE IF EXISTS dbtodo;
CREATE DATABASE dbtodo;
USE dbtodo;

CREATE TABLE users (
    username VARCHAR(30) NOT NULL,
    passwrd VARCHAR(30) NOT NULL,
    PRIMARY KEY(username)
) ENGINE=INNODB;

CREATE TABLE tasks (
    id INTEGER(4) AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    done BOOLEAN NOT NULL DEFAULT false,
    username VARCHAR(30) NOT NULL DEFAULT 'user',
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY(id)
) ENGINE=INNODB;

INSERT INTO users (username, passwrd) VALUES ('user', 'user');
INSERT INTO tasks (title) VALUES ('First sample task');
INSERT INTO tasks (title, done) VALUES ('Second sample task', true);