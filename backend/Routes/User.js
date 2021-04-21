const router = require("express").Router();
const userController = require("../Controllers/User");
const { check, validationResult } = require("express-validator");

router.get("/", userController.getAllUser);
router.get("/get/count", userController.getUsersCount);
router.get("/:id", userController.getAUser);

router.post(
  "/register",
  [
    check("name", "Name must have atleast 3chars").isLength({ min: 3 }),
    check("email", "Invalid email address").isEmail(),
    check("password", "Password must contain atleast 6chars").isLength({
      min: 6,
    }),
  ],
  userController.register
);

router.post(
  "/login",
  [
    check("email", "Invalid email address").isEmail(),
    check("password", "Password must contain atleast 6chars").isLength({
      min: 6,
    }),
  ],
  userController.login
);

module.exports = router;
