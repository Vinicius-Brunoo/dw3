const getNumeros = (request) => {
    const { num1, num2 } = request.body;

    return {
        num1: Number(num1),
        num2: Number(num2),
    };
};

const somar = (request, res) => (async () => {
    const { num1, num2 } = getNumeros(request);
    res.json({ status: "ok", resultado: num1 + num2 });
})();

const subtrair = (request, res) => (async () => {
    const { num1, num2 } = getNumeros(request);
    res.json({ status: "ok", resultado: num1 - num2 });
})();

const multiplicar = (request, res) => (async () => {
    const { num1, num2 } = getNumeros(request);
    res.json({ status: "ok", resultado: num1 * num2 });
})();

const dividir = (request, res) => (async () => {
    const { num1, num2 } = getNumeros(request);

    if (num2 === 0) {
        return res.status(400).json({
            status: "erro",
            mensagem: "Não é possível dividir por zero.",
        });
    }

    return res.json({ status: "ok", resultado: num1 / num2 });
})();

module.exports = {
    somar,
    subtrair,
    multiplicar,
    dividir,
};
