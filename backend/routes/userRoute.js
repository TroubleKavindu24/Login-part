const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authMiddleware = require("../middleware/auth");

// Routes for managing customers
router.post("/add", userController.addUser);
router.get("/get", authMiddleware, userController.getAllUsers); // Protected route
router.get("/get/:id", authMiddleware, userController.getUserById); // Protected route
router.put("/update/:id", authMiddleware, userController.updateUser); // Protected route
router.delete("/delete/:id", authMiddleware, userController.deleteUser); // Protected route

// Route for User login
router.post("/login", userController.loginUser);

module.exports = router;
