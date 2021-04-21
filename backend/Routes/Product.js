const router = require("express").Router();
const multer = require("multer");
const productController = require("../Controllers/Product");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValidFile = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid image type");

    if (isValidFile) uploadError = null;

    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const upload = multer({ storage: storage });

// router.get("/", productController.getProductByCategory);
router.get("/", productController.getAllProducts);
router.post("/", upload.single("image"), productController.addProdudt);
router.get("/get/count", productController.getProductCount);
router.get("/get/featured/:count", productController.getFeaturedProducts);
router.get("/:id", productController.getAProduct);

router.delete("/:id", productController.removeProduct);

router.put("/:id", productController.updateProduct);
router.put(
  "/gallery-images/:id",
  upload.array("images", 4),
  productController.updateProductImageGallery
);

module.exports = router;
