const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");



// Routes for managing customers
router.post("/add", userController.addUser);
router.get("/get", userController.getAllUsers);
router.get("/get/:id", userController.getUserById);
router.put("/update/:id", userController.updateUser);
router.delete("/delete/:id", userController.deleteUser);

// Route for User login
router.post("/login", userController.loginUser);



module.exports = router;


