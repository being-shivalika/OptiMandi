import multer from "multer";

// Store file in memory (not disk)
const storage = multer.memoryStorage();

// Optional: file validation (CSV only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "text/csv",
    "application/vnd.ms-excel",
  ];

  const isCSV =
    allowedTypes.includes(file.mimetype) ||
    file.originalname.toLowerCase().endsWith(".csv");

  if (isCSV) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit (enough for MVP)
  },
});

export default upload;