const db = require("../../../database/databaseconfig");

async function GetCredencial(username) {
    const result = await db.query(
        "SELECT username, password FROM usuarios WHERE username = $1 AND removido = false",
        [username]
    );
    return result.rows;
}

module.exports = { GetCredencial };
