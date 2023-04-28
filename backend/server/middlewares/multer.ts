import { RequestHandler } from "express";
import { IError } from "../types/basic/IError";
import multer from "multer";
import path from "path";

const baseDir = path.resolve();

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		if (file.mimetype.includes("audio")) {
			req.body.fileType = "audios";
			cb(null, baseDir + "/media/audios");
		} else if (file.mimetype.includes("image")) {
			req.body.fileType = "images";
			cb(null, baseDir + "/media/images");
		} else if (file.mimetype.includes("video")) {
			req.body.fileType = "videos";
			cb(null, baseDir + "/media/videos");
		}
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname);
		const filename = `${Date.now()}-${req.user?.id}${ext}`;
		req.body.filename = filename;
		cb(null, filename);
	},
});

const upload = multer({ storage: storage });

export const fileUpload: RequestHandler = (req, res, next) => {
	upload.single("file")(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			next(new IError("Multer file Upload file error", 500));
		} else if (err) {
			next(new IError("Unknow file upload error", 500));
		} else {
			next();
		}
	});
};
