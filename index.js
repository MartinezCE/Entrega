const fs = require("fs");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080

class Contenedor {
    constructor(name) {
        this.name = name;
    }
    async save(objeto) {
        try {
            try {
                let contenidoArchivo = await fs.promises.readFile(
                    `${this.name}.json`,
                    "utf8"
                );
                console.log(contenidoArchivo);
            } catch (err) {
                console.log("fallando con elegancia");
                await fs.promises.writeFile(
                    `${this.name}.json`,
                    "[]"
                );
            }
            let contenidoArchivo = await fs.promises.readFile(
                `${this.name}.json`,
                "utf8"
            );
            if (contenidoArchivo == '[]') {
                let contenidoEnJson = await JSON.parse(contenidoArchivo);
                const i = contenidoEnJson.map((x) => x.id).sort();
                objeto.id = i.length + 1;
                contenidoEnJson.push(objeto);
                await fs.promises.writeFile(
                    `${this.name}.json`,
                    JSON.stringify(contenidoEnJson)
                );

            } else {
                let contenidoEnJson = await JSON.parse(contenidoArchivo);
                const i = contenidoEnJson.map((x) => x.id).sort();
                objeto.id = i.length + 1;
                contenidoEnJson.push(objeto);
                await fs.promises.writeFile(
                    `${this.name}.json`,
                    JSON.stringify(contenidoEnJson)
                );
            }
        } catch (erro) {
            console.log("Error al invocar el metodo save(objeto) \n", erro);
        }
    }


    async getAll() {
        try {
            const data = await fs.promises.readFile(`${this.name}.json`, "utf8");
            console.log(JSON.parse(data));
            return JSON.parse(data);
        } catch (err) {
            console.log(err);
            throw new Error("Error al invocar el metodo --> getAll()\n,",
                err);
        }
    }


    async getById(id) {
        try {
            const data = await fs.promises.readFile(`${this.name}.json`, "utf-8");
            const parsedData = await JSON.parse(data);
            parsedData.find((objeto) => {
                if (objeto.id === id) {
                    console.log(objeto);

                }
            })

        } catch (error) {
            console.error(err);
            throw new Error(
                `Erro al invocar el metodo getById${id} \n`, err
            );
        }
    }



    async deleteById(id) {
        try {
            let data = await fs.promises.readFile(`${this.name}.json`, 'utf-8');
            let parsedData = JSON.parse(data);
            const existe = parsedData.find((e) => e.id === id);
            if (existe) {
                const dataFiltrada = parsedData.filter(
                    (producto) => producto.id !== id
                );
                fs.writeFileSync(`${this.name}.json`, JSON.stringify(dataFiltrada));
            } else {
                console.log('el elemento no existe');
            }
        } catch (err) {
            throw new Error(`Error al invocar el metodo deleteById(${id})\n`, err);
        }
    }

    async deleteAll() {
        try {
            await fs.promises.unlink(`${this.name}.json`);
        } catch (err) {
            console.log(err);
            throw new Error("Erro al invocar al metodo deleteAll()\n", err);
        }
    }

    async getRandomProduct() {
        try {
            let data = await fs.promises.readFile(`${this.name}.json`, "utf-8")
            let parseData = await JSON.parse(data)
            let random = Math.floor(Math.random() * parseData.length)
            let product = parseData[random]
            return product
        } catch (error) {
            throw new Error("no es posible obtener un producto random --> getRandomProduct()\n", error)
        }
    }
}

const test = new Contenedor("productos");

const escuadra = {
    title: "Escuadra",
    price: 123.45,
    thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",

};
const calculadora = {
    title: "Calculadora",
    price: 234.56,
    thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png",

};
const globo = {
    title: "Globo Terráqueo",
    price: 345.67,
    thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png",

};
let respuesta
test.getAll().then(res => {
    respuesta = res
})
let elementoRandom
test.getRandomProduct().then(res => {
    elementoRandom = res
})

const server = app.listen(PORT, () => {
    console.log(`
Servidor http escuchando en el puerto $ { server.address().port }
`);
});
server.on("error", (error) => console.log(`
Error en servidor $ { error }
`));

app.get("/", (req, res) => {
    res.json([{ dato: "desafio para coderhouse" }]);
});
app.get("/productos", (req, res) => {
    res.send(respuesta)
});
app.get("/productoRandom", (req, res) => {

    res.send(elementoRandom);
});

/*
gtest.save(escuadra);
test.getById(2);
test.getAll();
test.save(globo);
test.save(escuadra);
test.save(globo);
test.deleteAll();
test.deleteById(2)*/