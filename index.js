const fs = require("fs");
const express = require("express");
const { Router } = express;


const app = express();
const PORT = process.env.PORT || 8080;
const router = Router();


//CLASE CONTENEDOR
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
//NTANCIA CONTENEDOE
const test = new Contenedor("productos");

//OBJETOS A GUARDAR
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


//USANDO EXPRESS
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

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(`/public`, express.static(__dirname + `/public`))
app.use("/api/products", router)

app.get("/", (req, res) => {
    res.json([{ dato: "desafio para coderhouse" }]);
});
app.get("/productos", (req, res) => {
    res.send(respuesta)
});
app.get("/productoRandom", (req, res) => {

    res.send(elementoRandom);
});


//PRODUCTOS ARRAY
let productsLibreria = [
    { id: 1, title: 'LAPIZ', price: 101, thumbnail: 'http://localhost:8080/public/libreria.jpg' },
    { id: 2, title: 'ADHESIVO', price: 102, thumbnail: 'http://localhost:8080/public/libreria.jpg' },
    { id: 3, title: 'MARCADOR', price: 102, thumbnail: 'http://localhost:8080/public/libreria.jpg' },
];

//USANDO ROUTER
router.delete('/:id', (req, res) => {
    let { id } = req.params;
    const products = new Contenedor(productsLibreria);

    id = parseInt(id);

    const deletedProduct = products.deleteOne(id);
    console.log(products.getAll());
    if (deletedProduct != undefined) {
        res.json({ success: 'ok', id });
    } else {
        res.json({ error: 'producto no encontrado' });
    }
});

router.put('/:id', (req, res) => {
    let { id } = req.params;
    const { body } = req;
    id = parseInt(id);

    const products = new Contenedor(productsLibreria);

    const changedProduct = products.updateOne(id, body);

    if (changedProduct) {
        res.json({ success: 'ok', new: changedProduct });
    } else {
        res.json({ error: 'producto no encontrado' });
    }
});

router.post('/', (req, res) => {
    const { body } = req;
    body.price = parseFloat(body.price);

    const products = new Contenedor(productsLibreria);
    const productoGenerado = products.addOne(body);
    res.json({ success: 'ok', new: productoGenerado });
});

router.get('/:id', (req, res) => {
    let { id } = req.params;

    const products = new Contenedor(productsLibreria);
    id = parseInt(id);

    const found = products.findOne(id);
    if (found) {
        res.json(found);
    } else {
        res.json({ error: 'producto no encontrado' });
    }
});

router.get('/', (req, res) => {
    //const { query } = req;
    const products = new Contenedor(productsLibreria);
    res.json(products.getAll());
});