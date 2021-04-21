const Category = require("../Models/Category");
const Product = require("../Models/Product");

const mongoose = require("mongoose");

exports.getAllProducts = async (req, res) => {
  const productsList = await Product.find().populate("category");

  if (!productsList)
    return res.status(500).json({ success: false, msg: "No products found" });

  return res.status(200).json({ success: true, data: productsList });
};

exports.getProductCount = async (req, res) => {
  const productCount = await Product.countDocuments((count) => count);

  if (!productCount)
    return res.status(500).json({ success: false, msg: "No products found" });

  return res.status(200).json({ success: true, data: productCount });
};

exports.getFeaturedProducts = async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isFeatured: true })
    .limit(+count)
    .populate("category");

  if (!products)
    return res.status(500).json({ success: false, msg: "No products found" });

  return res.status(200).json({ success: true, data: products });
};

exports.getProductByCategory = async (req, res) => {
  let filter = {};

  if (req.params.categories) {
    filter = { category: req.params.categories.split(",") };
  }

  const productsList = await Product.find(filter).populate("category");

  if (!productsList)
    return res.status(500).json({ success: false, msg: "No products found" });

  return res.status(200).json({ success: true, data: productsList });
};

exports.getAProduct = async () => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, msg: "Enter valid Id" });
  }

  const product = await Category.find(req.parasm.id).populate("category");

  if (!product)
    return res.status(500).json({ success: false, msg: "No product found" });

  return res.status(200).json({ success: true, data: product });
};

exports.addProdudt = async (req, res) => {
  const category = await Category.findOne({ _id: req.body.category });
  if (!category)
    return res
      .status(400)
      .json({ success: false, msg: "Enter valid category" });

  const file = req.file;
  if (!file)
    return res.status(404).json({ success: false, msg: "No image found" });

  console.log(file.filename);

  const baseUrl = `${req.protocol}://${req.get("host")}/public/uploads/`;
  const imageUrl = `${baseUrl}${file.filename}`;
  let product = new Product({
    ...req.body,
    image: imageUrl,
  });

  product = await product.save();

  if (!product)
    return res
      .status(404)
      .json({ success: false, msg: "Something went wrong, Try again" });

  return res
    .status(200)
    .json({ success: true, msg: "Product created", data: product });
};

exports.removeProduct = (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, msg: "Enter valid Id" });
  }

  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (!product)
        return res
          .status(404)
          .json({ success: false, msg: "No product found" });

      return res
        .status(200)
        .json({ success: true, msg: "Product deleted sucessfully" });
    })
    .catch((err) => res.status(500).json({ success: false, msg: err }));
};

//Update Product
exports.updateProduct = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, msg: "Enter valid Id" });
  }

  if (req.body.category) {
    const category = await Category.findOne({ _id: req.body.category });
    if (!category)
      return res
        .status(400)
        .json({ success: false, msg: "Enter valid category" });
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  );

  if (!product)
    return res
      .status(404)
      .json({ success: false, msg: "Something went wrong, Try again" });

  return res
    .status(200)
    .json({ success: true, msg: "Product updated", data: product });
};

exports.updateProductImageGallery = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, msg: "Enter valid Id" });
  }

  const files = req.files;
  const images = [];
  const baseUrl = `${req.protocol}://${req.get("host")}/public/uploads/`;
  if (!files)
    return res.status(404).json({ success: false, msg: "No image found" });

  files.map((file) => {
    images.push(`${baseUrl}${file.fileName}`);
  });

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { images },
    { new: true }
  );

  if (!product)
    return res
      .status(404)
      .json({ success: false, msg: "Something went wrong, Try again" });

  return res.status(200).json({
    success: true,
    msg: "Product Image gallery updated",
    data: product,
  });
};
