const express = require("express");
const router = express.Router();
const {
    getAllProductsStatic,
    getAllProducts,
    // createProduct,
    // getProduct,
    // updateProdcut,
    // deleteProduct,
} = require("../controllers/productController");

router.route("/").get(getAllProducts);
// .post(createProduct);
router.route("/static").get(getAllProductsStatic);
// router.route("/:id").get(getProduct).patch(updateProdcut).delete(deleteProduct);

module.exports = router;
