const express = require('express');
const router = express.Router();
const {Products} = require("../models");
const validator = require("fastest-validator");
const v = new validator();
const verify = require("../middleware/verify");

// router.get("/",function(req,res,next){
//     res.send("Belajar node JS API");
// });

router.get("/", verify ,async function(req,res,next){
    let products = await Products.findAll();

    return res.json({
        status : 201,
        message : "Success get product",
        data : products
    })
});

router.get("/:id",verify,async function(req,res,next){
    const id = req.params.id;
    let products = await Products.findByPk(id);

    if(!products)
    {
        return res.status(404).json({
            status : 404,
            message : "Product not found",
            data : products
        })
    }
    else
    {
        return res.json({
            status : 201,
            message : "Success get product",
            data : products
        })
    }    
});

router.post("/create", verify, async function(req,res,next){
    const schema = {
        name: "string",
        price: "number",
        image: "string|optional"
    }

    const validate = v.validate(req.body, schema);
    if(validate.length){
        return res.status(422).json(validate);
    }

    const product = await Products.create(req.body);
    return res.json({
        status:201,
        message: "Sucess Create Products",
        data: product
    })
});

router.put("/edit/:id",verify, async function(req,res,next){
    const id = req.params.id;
    let products = await Products.findByPk(id);

    if(!products)
    {
        return res.status(404).json({
            status : 404,
            message : "Product not found",
            data : products
        })
    }

    const schema = {
        name: "string",
        price: "number",
        image: "string|optional"
    }

    const validate = v.validate(req.body, schema);
    if(validate.length){
        return res.status(422).json(validate);
    }
    
    products = await products.update(req.body);

    return res.json({
        status : 201,
        message : "Success update product",
        data : products
    })
    
});

router.delete("/:id",verify,async function(req,res,next){
    const id = req.params.id;
    let products = await Products.findByPk(id);

    if(!products)
    {
        return res.status(404).json({
            status : 404,
            message : "Product not found",
            data : products
        })
    }

    
    await products.destroy();

    return res.json({
        status : 201,
        message : "Success delete product"        
    })
    
});

module.exports = router;