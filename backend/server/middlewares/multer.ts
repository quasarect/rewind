import { RequestHandler } from "express";
import multer from "multer";
import { IError } from "../types/basic/IError";
// import path from "path";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		if (file.fieldname === "audio") {
			cb(null, "./uploads/audio");
		} else if (file.fieldname === "image") {
			cb(null, "./uploads/image");
		} else {
			// cb(new Error("Invalid field name"), null);
		}
	},
	filename: function (req, file, cb) {
		//This ext is the extension of the file
		//   const ext = path.extname(file.originalname);
		const filename = `${Date.now()}-${req.user?.id}`;
		req.body.filename = filename;
		cb(null, filename);
	},
});
const upload = multer({ storage: storage });

export const uploadMiddleware: RequestHandler = (req, res, next) => {
	// Use multer to handle file uploads
	upload.single("file")(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			// A Multer error occurred when uploading.
			next(new IError("Multer Upload file error", 500));
		} else if (err) {
			// An unknown error occurred when uploading.
			next(new IError("Unknow upload error", 500));
		} else {
			// Everything went fine.
			next();
		}
	});
};
