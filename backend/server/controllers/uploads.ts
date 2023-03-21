import { RequestHandler } from "express";
import { IError } from "../types/basic/IError";
import multer from "multer";
import { statusCode } from "../enums/statusCodes";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		if (file.fieldname === "audio") {
			cb(null, "./uploads/audio");
		} else if (file.fieldname === "image") {
			cb(null, "./uploads/image");
		} else if (file.filename === "video") {
			cb(null, "./uploads/video");
		} else {
			// cb(new Error("Invalid field name"), null);
		}
	},
	filename: function (req, file, cb) {
		//This ext is the extension of the file
		//   const ext = path.extname(file.originalname);
		const filename = `${Date.now()}-${file.originalname}`;
		req.body.filename = filename;
		cb(null, filename);
	},
});
const upload = multer({ storage: storage });

export const videoUpload: RequestHandler = (req, res, next) => {
	upload.single("file")(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			// A Multer error occurred when uploading.
			throw new IError("Multer Audio Upload file error", statusCode.INTERNAL_SERVER_ERROR);
		} else if (err) {
			// An unknown error occurred when uploading.
			throw new IError("Unknow audio upload error", statusCode.INTERNAL_SERVER_ERROR);
		} else {
			// Everything went fine.
			next();
		}
	});
};

export const audioUpload: RequestHandler = (req, res, next) => {
	upload.single("file")(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			// A Multer error occurred when uploading.
			throw new IError("Multer Upload file error", 500);
		} else if (err) {
			// An unknown error occurred when uploading.
			throw new IError("Unknow audio upload error", 500);
		} else {
			// Everything went fine.
			next();
		}
	});
};

export const imageUpload: RequestHandler = (req, res, next) => {
    console.log("Image uplaod");
	upload.single("file")(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			// A Multer error occurred when uploading.
			throw new IError("Multer Image Upload file error", 500);
		} else if (err) {
			// An unknown error occurred when uploading.
			throw new IError("Unknow image upload error", 500);
		} else {
			// Everything went fine.
			// next();
            console.log("all good");
		}
	});
};
