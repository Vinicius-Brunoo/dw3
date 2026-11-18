CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS usuarios (
    usuarioid BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    removido BOOLEAN NOT NULL DEFAULT false
);

INSERT INTO usuarios (username, password)
VALUES ('admin', crypt('admin', gen_salt('bf')))
ON CONFLICT (username) DO NOTHING;

CREATE TABLE IF NOT EXISTS pasto (
    pastoid BIGSERIAL PRIMARY KEY,
    descricao VARCHAR(120) NOT NULL CHECK (length(trim(descricao)) > 0),
    areatotal NUMERIC(12,4) NOT NULL CHECK (areatotal > 0),
    removido BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS piquete (
    piqueteid BIGSERIAL PRIMARY KEY,
    descricao VARCHAR(120) NOT NULL CHECK (length(trim(descricao)) > 0),
    latitude NUMERIC(10,7) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
    longitude NUMERIC(10,7) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    pastoidfk BIGINT NOT NULL REFERENCES pasto(pastoid),
    removido BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS animal (
    animalid BIGSERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL CHECK (length(trim(nome)) > 0),
    datanasc DATE NOT NULL,
    removido BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS alocado (
    alocadoid BIGSERIAL PRIMARY KEY,
    animalidifk BIGINT NOT NULL REFERENCES animal(animalid),
    piqueteidfk BIGINT NOT NULL REFERENCES piquete(piqueteid),
    datainicio DATE NOT NULL,
    datafinal DATE,
    removido BOOLEAN NOT NULL DEFAULT false,
    CHECK (datafinal IS NULL OR datafinal >= datainicio)
);
