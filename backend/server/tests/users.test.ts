import app from "../app"; // assuming your Express app is defined in app.ts or app.js
import chaiHttp from "chai-http";
import chai from "chai";

chai.use(chaiHttp);
const expect = chai.expect;
const token =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0M2QzNzc0MGJlYmJjNzU4NDBhYWExYSIsInVzZXJuYW1lIjoidXNlciIsIl92IjoiMS4wLjAiLCJpYXQiOjE2ODIwODA2NTEsImV4cCI6MTY4MjY4NTQ1MX0.cM-qg_MoUDPSdIG266n3gRWycrWlwYMczn2En_6nrtY";

// UserbyFields
describe("GET /user", () => {
	it("should return a user object on username ", async () => {
		await chai
			.request(app)
			.get("/user?username=chinma_yyy")
			.set("Authorization", `Bearer ${token}`);
		const response = await chai.request(app).get("/test");
		expect(response.status).to.equal(200);
		expect(response.body.message).to.equal("Recieved");
	});
	it("should return a user object on userId", async () => {
		await chai
			.request(app)
			.get("/user?userId=643d37740bebbc75840aaa1a")
			.set("Authorization", `Bearer ${token}`);
		const response = await chai.request(app).get("/test");
		expect(response.status).to.equal(200);
		expect(response.body.message).to.equal("Recieved");
	});
	it("should return a user object on email", async () => {
		await chai
			.request(app)
			.get("/user?email=shewalechinmay54@gmail.com")
			.set("Authorization", `Bearer ${token}`);
		const response = await chai.request(app).get("/test");
		expect(response.status).to.equal(200);
		expect(response.body.message).to.equal("Recieved");
	});
});

describe("POST /user/update", () => {
	it("should return a 401 error if the user is not authenticated", async () => {
		const res = await chai.request(app).post("/user/update").send({});
		expect(res.body).to.be.an("object");
		expect(res.status).to.equal(401);
	});
	it("should update a user", async () => {
		await chai
			.request(app)
			.post("/user/update")
			.set("Authorization", `Bearer ${token}`);
		const response = await chai.request(app).get("/test");
		expect(response.status).to.equal(200);
		expect(response.body.message).to.equal("Recieved");
	});
	it("should give an eror if name or username is empty", async () => {
		await chai
			.request(app)
			.post("/user/update")
			.set("Authorization", `Bearer ${token}`);

		const response = await chai.request(app).get("/test");
		expect(response.status).to.equal(200);
		expect(response.body.message).to.equal("Recieved");
	});
	it("should give an eror if name or username is empty", async () => {
		await chai
			.request(app)
			.post("/user/update")

			.set("Authorization", `Bearer ${token}`);
		const response = await chai.request(app).get("/test");
		expect(response.status).to.equal(200);
		expect(response.body.message).to.equal("Recieved");
	});
});

describe("POST /user/follow", () => {
	it("should return a 401 error if the user is not authenticated", async () => {
		const res = await chai.request(app).get("/user/follow").send({});
		expect(res.body).to.be.an("object");
		expect(res.status).to.equal(401);
	});
	it("should follow a user", async () => {
		// Add foloowing id
		await chai.request(app).post("/user/follow?id=");
		const response = await chai.request(app).get("/test");
		expect(response.status).to.equal(200);
		expect(response.body.message).to.equal("Recieved");
	});
	it("should give an error if it follows self", async () => {
		await chai
			.request(app)
			.post("/user/follow?id=644073df452f5d6da6da52b9");
		const response = await chai.request(app).get("/test");
		expect(response.status).to.equal(200);
		expect(response.body.message).to.equal("Recieved");
	});
});

describe("POST /user/unfollow", () => {
	it("should return a 401 error if the user is not authenticated", async () => {
		const res = await chai.request(app).get("/user/unfollow?id=").send({});
		expect(res.body).to.be.an("object");
		expect(res.status).to.equal(401);
	});
	it("should unfollow a user", async () => {
		// Add foloowing id
		await chai.request(app).get("/user/unfollow?id=");
		const response = await chai.request(app).get("/test");
		expect(response.status).to.equal(200);
		expect(response.body.message).to.equal("Recieved");
	});
	it("should give an error if it unfollows self", async () => {
		await chai
			.request(app)
			.post("/user/unfollow?id=644073df452f5d6da6da52b9");
		const response = await chai.request(app).get("/test");
		expect(response.status).to.equal(200);
		expect(response.body.message).to.equal("Recieved");
	});
});

describe("GET /user/me", () => {
	it("should return a 401 error if the user is not authenticated", async () => {
		const res = await chai.request(app).get("/user/me").send({});
		expect(res.body).to.be.an("object");
		expect(res.status).to.equal(401);
	});
	it("should return a user object", async () => {
		await chai
			.request(app)
			.get("/user/me")
			.set("Authorization", `Bearer ${token}`);
		const response = await chai.request(app).get("/test");
		expect(response.status).to.equal(200);
		expect(response.body.message).to.equal("Recieved");
	});
});
