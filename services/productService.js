const fs=require('fs')
const fsPromise=require('fs/promises')
const path=require('path')
const crypto=require('crypto')

const filePath=path.join(__dirname,"../database", "db.json")

const productService={

    async delayReadData(){
        await new Promise((res,rej)=>{
            setTimeout(res,5000)
        })
        return await this.readData()
    },

    async readData(){
        let data=await fsPromise.readFile(filePath,"utf-8")
        return JSON.parse(data)
    },

    async addProduct(newProduct){
        await new Promise((res,rej)=>{
            setTimeout(res,1000)
        });
        const products=await this.delayReadData()
        
        const data_new={
            id: crypto.randomUUID(),
            ...newProduct
        };
        
        products.push(data_new)
        await fsPromise.writeFile(filePath,JSON.stringify(products,null,2),'utf-8')
        return data_new
    },

    async updateProduct(id,updatedData){
        const products=await this.readData()
        const index=products.findIndex(prod=>prod.id==id)
        
        if(index===-1)return null

        products[index]={ ...products[index],...updatedData }
        await fsPromise.writeFile(filePath, JSON.stringify(products, null, 2),'utf-8')
        
        return products[index]
    },

    async deleteProduct(id){
        const products=await this.readData()
        const index=products.findIndex(prod=>prod.id==id)

        if(index===-1)return false

        products.splice(index,1)
        await fsPromise.writeFile(filePath,JSON.stringify(products,null,2),'utf-8')
        return true
    }
};

module.exports=productService;