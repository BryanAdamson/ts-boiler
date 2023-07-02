import multer from "multer";

const upload: multer.Multer  = multer({
    storage: multer.diskStorage({}),
    limits: { fileSize: 500000000 }
});

export default upload;