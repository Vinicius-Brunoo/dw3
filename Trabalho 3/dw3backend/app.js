const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const router = require("./routes/router");

const app = express();
const port = process.env.PORT || 40003;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    return next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(router);

app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (["23502", "23503", "23514", "22003", "22007", "22008", "22001", "22P02"].includes(error.code)) {
        return res.status(400).json({ status: "Confira os campos, as datas e os registros relacionados." });
    }
    if (error.code === "23505") {
        return res.status(409).json({ status: "Registro já cadastrado." });
    }
    console.error(error.message);
    res.status(500).json({ status: "Não foi possível concluir a operação." });
});

app.listen(port, () => {
    console.log(`App listening at port ${port}`);
});
