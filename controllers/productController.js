const productService=require('../services/productService')

const productController={
    async getProducts(req,res,next){
        try{
            const products=await productService.delayReadData()
            res.json(products)
        }catch(err){
            next(err)
        }
    },

    async getProductById(req,res,next){
        try{
            const id=req.params.id
            const products=await productService.delayReadData()
            const product=products.find(prod=>prod.id==id)

            if(!product){
                return res.status(404).json({error:"Product not found"})
            }

            res.json(product)
        }catch(err){
            next(err)
        }
    },

    async createProduct(req,res,next){
        try{
            const newProduct=await productService.addProduct(req.body)
            res.status(201).json(newProduct)
        }catch(err){
            next(err)
        }
    },

    async updateProduct(req,res,next){
        try{
            const id=req.params.id
            const updatedProduct=await productService.updateProduct(id,req.body)

            if(!updatedProduct){
                return res.status(404).json({error: "Product not found"})
            }

            res.json(updatedProduct)
        }catch(err){
            next(err)
        }
    },

    async deleteProduct(req,res,next){
        try{
            const id=req.params.id
            const deleted=await productService.deleteProduct(id)

            if(!deleted){
                return res.status(404).json({error: "Product not found"})
            }

            res.json({message: "Product deleted successfully"})
        }catch(err){
            next(err)
        }
    }
};

module.exports=productController;