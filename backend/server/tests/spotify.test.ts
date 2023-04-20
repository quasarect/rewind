import { Response } from "express";
import app from "../app"; // assuming your Express app is defined in app.ts or app.js
import userModel from "../models/userSchema";
import chaiHttp from "chai-http";
import chai from "chai";
import { generateToken } from "../middlewares/auth";

chai.use(chaiHttp);
const expect = chai.expect;

describe("POST /spotify/refresh", () => {
	it("should return a new access token", async () => {
		// Create a user with a SpotifyData object containing a refresh token
		const user = await userModel.findById("");

		// Make a request to the refresh endpoint with the user's ID
		const response = await chai
			.request(app)
			.post("/spotify/refresh")
			//@ts-ignore
			.set("Authorization", `Bearer ${generateToken(user._id, "user")}`)
			.send({});

		// Expect a 200 status code and a response body containing a new access token
		//@ts-ignore
		expect((response as Response).status).to.equal(200);
		expect(response.body).to.be.an("object");
		expect(response.body).to.have.property("accessToken");
	});

	it("should return a 401 error if the user is not authenticated", async () => {
		const response = await chai
			.request(app)
			.post("/spotify/refresh")
			.send({});
		//@ts-ignore
		expect((response as Response).status).to.equal(401);
		expect(response.body).to.be.an("object");
		expect(response.body).to.have.property("message").equal("Unauthorized");
	});
});
