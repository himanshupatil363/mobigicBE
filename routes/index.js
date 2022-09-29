const { Router } = require("express");
const router = Router();
const userRoutes = require("./userRoutes");
const fileRoutes = require("./fileRoutes");
router.get("/",(req,res)=>{res.send("welcome to mobigic test api")})
router.use("/users", userRoutes);
router.use("/files", fileRoutes);
module.exports = router;
