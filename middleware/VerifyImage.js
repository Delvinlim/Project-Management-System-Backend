import multer from "multer";

// CB => Callback
const filterImage = (req, file, cb) => {
  file.mimetype.startsWith("image")
    ? cb(null, true)
    : cb("Please upload only images", false);
};

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-pms-${file.originalname}`);
  },
});

export const verifyImage = multer({storage: imageStorage, fileFilter: filterImage}).single("image");