const express = require('express')
const productRoutes = require('./routes/productRoutes')

const app = express()
app.use(express.json());

app.use('/products', productRoutes);

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});