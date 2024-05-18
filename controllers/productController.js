const Product = require("../models/productModel");

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({ featured: true, price: { $gt: 30 } })
        .sort("name")
        .select("name price featured")
        .limit(10)
        .skip(2);
    res.status(200).json({ products, nbHits: products.length });
};
const getAllProducts = async (req, res) => {
    const { featured, company, name, sort, select, numberFilters } = req.query;
    const queryObject = {};
    if (featured) {
        queryObject.featured = featured === "true" ? true : false;
    }
    if (company) {
        queryObject.company = company;
    }
    if (name) {
        queryObject.name = { $regex: name, $options: "i" }; // regex setup
    }

    if (numberFilters) {
        const operatorMap = {
            ">": "$gt",
            ">=": "$gte",
            "=": "$eq",
            "<": "$lt",
            "<=": "$lte",
        };
        console.log(numberFilters); // price>20
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numberFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        );
        console.log(filters); // price-$gt-20
        const options = ["price", "rating"];
        filters = filters.split(",").forEach((item) => {
            const [field, operator, value] = item.split("-");
            if (options.includes(field)) {
                queryObject[field] = { [operator]: Number(value) };
            }
        });
        console.log(queryObject);
    }

    let query = Product.find(queryObject); // we cant await as we want to chain sort with the query

    //sort
    if (sort) {
        const sortList = sort.split(",").join(" ");
        query = query.sort(sortList);
    } else {
        query = query.sort("createAt");
    }

    //select
    if (select) {
        const selectList = select.split(",").join(" ");
        query = query.select(selectList);
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const products = await query;
    res.status(200).json({
        products,
        nbHits: products.length,
        limit: limit,
        skip: skip,
        page: page,
    });
};
// const createProduct = async () => {};
// const getProduct = async () => {};
// const updateProdcut = async () => {};
// const deleteProduct = async () => {};

module.exports = {
    getAllProductsStatic,
    getAllProducts,
    // createProduct,
    // getProduct,
    // updateProdcut,
    // deleteProduct,
};
