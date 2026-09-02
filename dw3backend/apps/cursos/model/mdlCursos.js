const db = require("../../../database/databaseconfig");

const GetAllCursos = async () => {
    return (
        await db.query(
            "SELECT * FROM cursos WHERE deleted = false ORDER BY descricao ASC"
        )
    ).rows;
};

const GetCursoByID = async (cursoIDPar) => {
    return (
        await db.query(
            "SELECT * FROM cursos WHERE cursoid = $1 AND deleted = false ORDER BY descricao ASC",
            [cursoIDPar]
        )
    ).rows;
};

const InsertCurso = async (registroPar) => {
    let linhasAfetadas;
    let msg = "ok";
    let cursoid = null;

    try {
        const result = await db.query(
            "INSERT INTO cursos (codigo, descricao, ativo, deleted) " +
                "VALUES ($1, $2, $3, $4) RETURNING cursoid",
            [
                registroPar.codigo,
                registroPar.descricao,
                registroPar.ativo,
                registroPar.deleted ?? false,
            ]
        );

        linhasAfetadas = result.rowCount;
        cursoid = result.rows[0]?.cursoid ?? null;
    } catch (error) {
        msg = "[mdlCursos|InsertCurso] " + (error.detail || error.message);
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas, cursoid };
};

const UpdateCurso = async (cursoIDPar, registroPar) => {
    let linhasAfetadas;
    let msg = "ok";

    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE cursos SET " +
                    "codigo = $2, " +
                    "descricao = $3, " +
                    "ativo = $4, " +
                    "deleted = $5 " +
                    "WHERE cursoid = $1",
                [
                    cursoIDPar,
                    registroPar.codigo,
                    registroPar.descricao,
                    registroPar.ativo,
                    registroPar.deleted ?? false,
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlCursos|UpdateCurso] " + (error.detail || error.message);
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

const DeleteCurso = async (cursoIDPar) => {
    let linhasAfetadas;
    let msg = "ok";

    try {
        linhasAfetadas = (
            await db.query("UPDATE cursos SET deleted = true WHERE cursoid = $1", [
                cursoIDPar,
            ])
        ).rowCount;
    } catch (error) {
        msg = "[mdlCursos|DeleteCurso] " + (error.detail || error.message);
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

module.exports = {
    GetAllCursos,
    GetCursoByID,
    InsertCurso,
    UpdateCurso,
    DeleteCurso,
};
