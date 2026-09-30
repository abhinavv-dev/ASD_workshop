const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const app = express();

const PORT = 3000;

const pathToFile = path.join(__dirname, 'db.json');

async function readFile() {
    try {
    const data = await fs.readFile(pathToFile, 'utf-8');
    return JSON.parse(data);
    } catch (error) {
        console.error('Error reading file:', error);
    }
}

app.get('/products/:id', async (req, res) => {
    try {
        const products = await readFile();
        let {id} = req.params;
        id = Number(id);
        let product = products.find((item)=>{return item.id===id});
        res.json(product);

    } catch (error) {
        console.error('Error reading file:', error);
}});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});

