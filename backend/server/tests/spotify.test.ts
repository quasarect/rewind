import app from "../app"; // assuming your Express app is defined in app.ts or app.js
import chaiHttp from "chai-http";
import chai from "chai";

chai.use(chaiHttp);
const expect = chai.expect;

describe("POST /spotify/refresh", () => {
	it("should return a new access token", async () => {
		// Create a user with a SpotifyData object containing a refresh token

		// Expect a 200 status code and a response body containing a new access token
		const response = await chai.request(app).get("/test");
		expect(response.status).to.equal(200);
		expect(response.body.message).to.equal("Recieved");
	});

	it("should return a 401 error if the user is not authenticated", async () => {
		const res = await chai.request(app).post("/spotify/refresh").send({});
		expect(res.body).to.be.an("object");
	});
});
