const router = require("express").Router();
const orderController = require("../Controllers/Order");

router.get("/", orderController.getAllOrders);
router.get("/get/totalSales", orderController.getTotalSales);
router.get("/get/count", orderController.getTotalOrders);
router.get("/:id", orderController.getAOrder);

router.post("/", orderController.addOrder);

router.delete("/:id", orderController.removeOrder);

router.put("/:id", orderController.updateOrder);

module.exports = router;
