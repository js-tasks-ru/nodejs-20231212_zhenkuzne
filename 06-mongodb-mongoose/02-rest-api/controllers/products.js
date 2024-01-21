const mongoose = require('mongoose');
const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

const {isValidObjectId} = mongoose;

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const products = await Product.find({subcategory});

  ctx.body = {products: products.map(mapProduct)};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();

  ctx.body = {products: products.map(mapProduct)};
};

module.exports.productById = async function productById(ctx, next) {
  const {id} = ctx.params;

  if (!isValidObjectId(id)) {
    ctx.status = 400;
    ctx.body = '';
    return;
  }

  const product = await Product.findById(id);

  if (!product) {
    ctx.status = 404;
    ctx.body = '';
    return;
  }

  ctx.body = {product: mapProduct(product)};
};

