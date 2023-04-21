import app from "../app"; // assuming your Express app is defined in app.ts or app.js
import chaiHttp from "chai-http";
import chai from "chai";

chai.use(chaiHttp);
const expect = chai.expect;

describe("GET /test", () => {
	it('should return "Received"', async () => {
		const response = await chai.request(app).get("/test");
		expect(response.status).to.equal(200);
		expect(response.body.message).to.equal("Recieved");
		console.log("success");
	});
});
