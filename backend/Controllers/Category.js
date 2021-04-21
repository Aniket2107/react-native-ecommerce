const Category = require("../Models/Category");
const mongoose = require('mongoose')

exports.getAllCategories = async (req, res) => {
  const catList = await Category.find();

  if (!catList)
    return res.status(500).json({ success: false, msg: "No category found" });

  return res.status(200).json({ success: true, data: catList });
};

//Get category by Id
exports.getCategory = async () => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, msg: "Enter valid Id" });
  }

  const category = Cateogry.find({ _id: req.params.id });

  if (!category)
    return res.status(500).json({ success: false, msg: "No category found" });

  return res.status(200).json({ success: true, data: category });
};

//POST category
exports.addCategory = async (req, res) => {
  const { name, color, icon } = req.body;

  if (!name)
    return res.status(500).json({ success: false, msg: "Enter all fields" });

  let category = new Category({
    name,
    icon,
    color,
  });

  category = await category.save();

  if (!category)
    return res
      .status(404)
      .json({ success: false, msg: "Something went wrong, Try again" });

  return res
    .status(200)
    .json({ success: true, msg: "Category created", data: category });
};

//Delate category
exports.removeCategory = (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, msg: "Enter valid Id" });
  }
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (!category)
        return res
          .status(404)
          .json({ success: false, msg: "No category found" });

      return res
        .status(200)
        .json({ success: true, msg: "Category deleted sucessfully" });
    })
    .catch((err) => res.status(500).json({ success: false, msg: err }));
};

//Update category
exports.updateCategory = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, msg: "Enter valid Id" });
  }

  const { name, color, icon } = req.body;

  if (!name)
    return res.status(500).json({ success: false, msg: "Enter all fields" });

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name,
      color,
      icon,
    },
    { new: true }
  );

  if (!category)
    return res
      .status(404)
      .json({ success: false, msg: "Something went wrong, Try again" });

  return res
    .status(200)
    .json({ success: true, msg: "Category updated", data: category });
};
