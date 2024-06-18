const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const authMiddleware = require("../middleware/auth");

router.post("/add", adminController.addAdmin);
router.post("/login", adminController.adminLogin);
router.get("/get",authMiddleware,adminController.getAllAdmins);
router.get("/get/:id", authMiddleware,adminController.getAdminById);
router.put("/update/:id", authMiddleware, adminController.updateAdminProfile); // Protected route
router.delete("/delete/:id", authMiddleware,adminController.deleteAdminProfileById);


module.exports = router;
