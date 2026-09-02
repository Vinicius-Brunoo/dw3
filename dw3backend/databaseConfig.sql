CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS cursos (
    cursoid bigserial CONSTRAINT pk_cursos PRIMARY KEY,
    codigo varchar(50) UNIQUE,
    descricao varchar(60),
    ativo boolean,
    deleted boolean DEFAULT false
);

INSERT INTO cursos (codigo, descricao, ativo) VALUES
    ('BSI', 'Bacharelado em Sistemas de Informação', true),
    ('DIREITO', 'Bacharelado em Direito', true),
    ('LETRAS', 'Licenciatura em Letras', true),
    ('ADM', 'Bacharelado em Administração', false)
ON CONFLICT (codigo) DO NOTHING;

CREATE TABLE IF NOT EXISTS alunos (
    alunoid bigserial CONSTRAINT pk_alunos PRIMARY KEY,
    prontuario varchar(10) UNIQUE,
    nome varchar(50),
    endereco varchar(60),
    rendafamiliar numeric(8,2),
    datanascimento date,
    cursoid bigint CONSTRAINT fk_aluno_curso REFERENCES cursos,
    deleted boolean DEFAULT false
);

INSERT INTO alunos (
    prontuario,
    nome,
    endereco,
    rendafamiliar,
    datanascimento,
    cursoid
) VALUES
    (
        'pront1',
        'José das Neves',
        'Rua A, Votuporanga',
        6891.60,
        '2000-01-31',
        (SELECT cursoid FROM cursos WHERE codigo = 'BSI')
    ),
    (
        'pront2',
        'Maria Silveira',
        'Rua B, São José do Rio Preto',
        7372.41,
        '2002-03-12',
        (SELECT cursoid FROM cursos WHERE codigo = 'DIREITO')
    )
ON CONFLICT (prontuario) DO NOTHING;

CREATE TABLE IF NOT EXISTS usuarios (
    usuarioid bigserial CONSTRAINT pk_usuarios PRIMARY KEY,
    username varchar(10) UNIQUE,
    password text,
    deleted boolean DEFAULT false
);

INSERT INTO usuarios (username, password) VALUES
    ('admin', crypt('admin', gen_salt('bf'))),
    ('qwe', crypt('qwe', gen_salt('bf')))
ON CONFLICT (username) DO NOTHING;

CREATE TABLE IF NOT EXISTS clientes (
    clienteid bigserial CONSTRAINT pk_clientes PRIMARY KEY,
    codigo varchar(50) UNIQUE,
    nome varchar(60),
    endereco varchar(50),
    ativo boolean,
    deleted boolean DEFAULT false
);

INSERT INTO clientes (codigo, nome, endereco, ativo) VALUES
    ('CLI01', 'João da Silva', 'Rua A1', true),
    ('CLI02', 'Marcia Almeida', 'Rua B2', true)
ON CONFLICT (codigo) DO NOTHING;

CREATE TABLE IF NOT EXISTS pedidos (
    pedidoid bigserial CONSTRAINT pk_pedidos PRIMARY KEY,
    numero bigint UNIQUE,
    data date,
    valortotal numeric(9,2),
    clienteid bigint CONSTRAINT fk_pedido_cliente REFERENCES clientes,
    deleted boolean DEFAULT false
);

INSERT INTO pedidos (numero, data, valortotal, clienteid) VALUES
    (234, '2020-01-31', 6891.60, (SELECT clienteid FROM clientes WHERE codigo = 'CLI01'))
ON CONFLICT (numero) DO NOTHING;
