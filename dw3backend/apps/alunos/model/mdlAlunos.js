const db = require("../../../database/databaseconfig");

const GetAllAlunos = async () => {
    return (
        await db.query(
            "SELECT alunos.*, " +
                "(SELECT descricao FROM cursos WHERE cursos.cursoid = alunos.cursoid) AS descricao " +
                "FROM alunos WHERE deleted = false ORDER BY nome ASC"
        )
    ).rows;
};

const GetAlunoByID = async (alunoIDPar) => {
    return (
        await db.query(
            "SELECT alunos.*, " +
                "(SELECT descricao FROM cursos WHERE cursos.cursoid = alunos.cursoid) AS descricao " +
                "FROM alunos WHERE alunoid = $1 AND deleted = false ORDER BY nome ASC",
            [alunoIDPar]
        )
    ).rows;
};

const GetCursosToAlunos = async () => {
    return (
        await db.query(
            "SELECT cursoid, descricao FROM cursos WHERE deleted = false ORDER BY descricao ASC"
        )
    ).rows;
};

const InsertAluno = async (alunoREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    let alunoid = null;

    try {
        const result = await db.query(
            "INSERT INTO alunos " +
                "(prontuario, nome, endereco, rendafamiliar, datanascimento, cursoid, deleted) " +
                "VALUES ($1, $2, $3, $4, $5, $6, $7) " +
                "RETURNING alunoid",
            [
                alunoREGPar.prontuario,
                alunoREGPar.nome,
                alunoREGPar.endereco,
                alunoREGPar.rendafamiliar,
                alunoREGPar.datanascimento,
                alunoREGPar.cursoid,
                alunoREGPar.deleted ?? false,
            ]
        );

        linhasAfetadas = result.rowCount;
        alunoid = result.rows[0]?.alunoid ?? null;
    } catch (error) {
        msg = "[mdlAlunos|InsertAluno] " + (error.detail || error.message);
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas, alunoid };
};

const UpdateAluno = async (alunoIDPar, alunoREGPar) => {
    let linhasAfetadas;
    let msg = "ok";

    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE alunos SET " +
                    "prontuario = $2, " +
                    "nome = $3, " +
                    "endereco = $4, " +
                    "rendafamiliar = $5, " +
                    "datanascimento = $6, " +
                    "cursoid = $7, " +
                    "deleted = $8 " +
                    "WHERE alunoid = $1",
                [
                    alunoIDPar,
                    alunoREGPar.prontuario,
                    alunoREGPar.nome,
                    alunoREGPar.endereco,
                    alunoREGPar.rendafamiliar,
                    alunoREGPar.datanascimento,
                    alunoREGPar.cursoid,
                    alunoREGPar.deleted ?? false,
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlAlunos|UpdateAluno] " + (error.detail || error.message);
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

const DeleteAluno = async (alunoIDPar) => {
    let linhasAfetadas;
    let msg = "ok";

    try {
        linhasAfetadas = (
            await db.query("UPDATE alunos SET deleted = true WHERE alunoid = $1", [
                alunoIDPar,
            ])
        ).rowCount;
    } catch (error) {
        msg = "[mdlAlunos|DeleteAluno] " + (error.detail || error.message);
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

module.exports = {
    GetAllAlunos,
    GetAlunoByID,
    GetCursosToAlunos,
    InsertAluno,
    UpdateAluno,
    DeleteAluno,
};
