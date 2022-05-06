const express = require("express");
const multer = require("multer");
const userController = require("../controllers/user.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 5 * 1024 * 1024, // keep images size < 5 MB
  },
});

router.get("/all", userController.getAllUsers);
router.get("/one/:userId", userController.getUserById);
router.get("/current", protect, userController.getCurrentUser);

router.post("/register", uploader.single("image"), userController.registerUser);
router.post("/login", userController.loginUser);

router.patch(
  "/update",
  uploader.single("image"),
  protect,
  userController.updateUser
);

router.delete("/delete", protect, userController.deleteUser);

module.exports = router;
