- Express SetUp
- Connect to database
- Controllers and Routes Setup
- Postman Setup
- express-async-errors

```js
// server
require('express-async-errors')

// controller/productController
const getAllProducts = async(req, res)=>{ // no need for try catch
    throw new Error('testing async errors')
}
```
- Schema models

```js
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "product name must be provided"],
    },
    price: {
        type: Number,
        required: [true, "product price must be provided"],
    },
    featured: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        default: 4.5,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    company: {
        type: String,
        enum: {
            values: ["ikea", "liddy", "caressa", "marcos"],
            message: "{VALUE} is not supported",
        },
        // enum: ['ikea', 'liddy', 'caressa', 'marcos'],
    },
});

module.exports = mongoose.model("Product", ProductSchema);
```
- Automating adding to database
```js
// product.json which will have data

// populate.js to add data from product.json to database
require("dotenv").config();

const connectDB = require("./db/connect");
const Product = require("./models/productModel");

const jsonProducts = require("./products.json");

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        await Product.deleteMany();
        await Product.create(jsonProducts);
        console.log("Success!!!!");
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

start();

```
### Mongoose Filter Methods

- Product.deleteMany()
- Product.find({})
- Product.create(jsonProducts) //Array of product objects

// Hard Coded filter values
- Product.find({ featured: true, price:{ $gt:30} }).sort('-name price').select('name price featured').limit(4).skip(1);
res.status(200).json({ products, nbHits: products.length });

- Product.find({ name: 'vase table' });

// Filtering values based on request

#### query params

```js

//{{URL}}/products?name=john&featured=true

const products = await Product.find(req.query);
res.status(200).json({ products, nbHits: products.length });

```
- if we pass something which property doesn't exist in schema

```js
// pulling out only the values that you require
const {featured, company, name} = req.query
const queryObject = {}
if(featured){
    queryObject.featured = featured === 'true'? true: false
}
if(company){
    queryObject.company = company
}
if(name){
    queryObject.name = { $regex: name, $options:'i'} // regex setup
}
const products = await Product.find(queryObject);

```
### Mongoose sort filter

```js
//{{URL}}/products?sort=-name,price
const {featured, company, name, sort} = req.query

let query = Product.find(queryObject); // we cant await as we want to chain sort with the query
if(sort){
    const sortList = sort.split(',').join(' ');
    query = query.sort(sortList);
}else{
     query = query.sort('createAt');
}

const products = await query
```

### Mongoose select filter

```js
//{{URL}}/products?sort=-name,price
const {featured, company, name, sort, select} = req.query

let query = Product.find(queryObject); // we cant await as we want to chain sort with the query
// sort
if(sort){
    const sortList = sort.split(',').join(' ');
    query = query.sort(sortList);
}else{
     query = query.sort('createAt');
}

//select
if(select){
    const selectList = sort.split(',').join(' ');
    query = query.select(selectList);
}
const products = await query

```
### Mongoose skip and limit filter

```js
const {featured, company, name, sort, select} = req.query

const page = Number(req.params.page) || 1
const limit = Number(req.params.limit) || 10

const skip = (page -1) * limit;

query = query.skip(skip).limit(limit)

```

### Mongoose numeric filter
```js
//{{URL}}/products?numericFilters=price>40,ratings>=4
const {featured, company, name, sort, select, numerFilters} = req.query

if(numerFilters){
    const operatorMap = {
        '>':'$gt',
        '>=':'$gte',
        '=':'$eq',
        '<':'$lt',
        '<=':'$lte',
    }
    const regEX = /\b(<|>|>=|=|<|<=)\b/g
    let filters = numerFilters.replace(regEx, (match)=>`-${operatorMap[match]}-`);
    const options = ['price', 'rating'];
    filters = filters.split(',').forEach((item=>{
        const [field, operator, value] = items.split('-')
        if(options.include(field)){
            queryObject[field] = {[operator]:Number(value)}
        }
    }))

}

```

@TODO: check the routes and check if all the filters are working.