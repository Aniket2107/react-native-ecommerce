const router = require("express").Router();

const categoryController = require("../Controllers/Category");

router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategory);

router.post("/", categoryController.addCategory);

router.delete("/:id", categoryController.removeCategory);

router.put("/:id", categoryController.updateCategory);

module.exports = router;
