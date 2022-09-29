const path = require("path");
const File = require("../models/file");
const fs = require("fs");
module.exports = {
  getFiles: async (req, res) => {
    const fileList = await File.find(
      {
        userId: req.user._id,
      },
      { _id: 0, userId: 0 }
    );
    console.log(fileList);
    const formattedFileList = fileList.map((file) => {
      return {
        fileUrl:
          req.protocol +
          "://" +
          req.get("host") +
          "/staticfiles/" +
          file.fileDetails.filename,
        code: file.code,
        createdAt: file.createdAt,
        fileDetails: file.fileDetails,
      };
    });
    res.status(200).json(formattedFileList);
  },
  uploadFile: async (req, res) => {
    try {
      const newFile = new File({
        userId: req.user._id,
        code: Math.floor(100000 + Math.random() * 900000),
        fileDetails: req.file,
      });
      newFile.save((err, success) => {
        if (err) {
          console.log(err);
          return res.status(400).json({
            message: "File upload failed, Try again!",
          });
        }
        var fullUrl =
          req.protocol +
          "://" +
          req.get("host") +
          "/download/" +
          success.filename;
        res.status(200).json({
          code: success.code,
          downloadLink: fullUrl,
        });
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  },
  downloadFile: async (req, res) => {
    File.find(
      {
        code: req.query.code,
        userId: req.user._id,
        "fileDetails.filename": req.params.id,
      },
      (err, data) => {
        if (err) {
          return res.status(400).json({
            message: err.message,
          });
        } else {
          if (data.length > 0) {
            data.map((item) => {
              var filepath = path.join(
                __dirname,
                "..",
                "uploads",
                item.fileDetails.filename
              );
              res.download(filepath);
            });
          } else {
            return res.status(404).json({
              message: "No file found",
            });
          }
        }
      }
    );
  },
  deleteFile: async (req, res) => {
    File.find({
      code: req.query.code,
      userId: req.user._id,
      "fileDetails.filename": req.params.id,
    }).remove((err, data) => {
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      } else {
        if (data.deletedCount > 0) {
          let filePath = path.join(__dirname, "..", "uploads", req.params.id);
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(err);
              res.status(400).json({
                message: err.message,
              });
            }
            res.status(200).json({
              message: "File deleted successfully",
            });
          });
        } else {
          res.status(404).json({
            message: "No file found",
          });
        }
      }
    });
  },
};
