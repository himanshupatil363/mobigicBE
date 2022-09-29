const { Router } = require("express");
const router = Router();
const {
  getFiles,
  uploadFile,
  downloadFile,
  deleteFile
} = require("../controllers/fileController");
const auth = require("../middleware/auth");
const upload = require("../middleware/multer");

router.get("/", auth, getFiles);
router.post("/upload", auth, upload.single('file'), uploadFile);
router.get("/download/:id",auth, downloadFile);
router.delete("/delete/:id",auth,deleteFile)
module.exports = router;
