import app from "../app"; // assuming your Express app is defined in app.ts or app.js
import chaiHttp from "chai-http";
import chai from "chai";

chai.use(chaiHttp);
const expect = chai.expect;

// UserbyFields
describe("GET /user", () => {
	it("should return a user object on username ", async () => {
		const response = await chai
			.request(app)
			.get("/user?username=chinmayyy");
		expect(response.status).to.equal(200);
		expect(response.body).to.be.an("object");
		expect(response.body).to.have.property("user");
		expect(response.body).to.have.property("isMe");
		expect(response.body).to.have.property("topTrack");
	});
	it("should return a user object on userId", async () => {
		const response = await chai
			.request(app)
			.get("/user?userId=644073df452f5d6da6da52b9");
		expect(response.status).to.equal(200);
		expect(response.body).to.be.an("object");
		expect(response.body).to.have.property("user");
		expect(response.body).to.have.property("isMe");
		expect(response.body).to.have.property("topTrack");
	});
	it("should return a user object on email", async () => {
		const response = await chai
			.request(app)
			.get("/user?email=shewalechinmay23@gmail.com");
		expect(response.status).to.equal(200);
		expect(response.body).to.be.an("object");
		expect(response.body).to.have.property("user");
		expect(response.body).to.have.property("isMe");
		expect(response.body).to.have.property("topTrack");
	});
});

describe("POST /user/update", () => {
	it("should update a user", async () => {
		const response = await (
			await chai.request(app).post("/user/update")
		).body({
			name: "Chinmay updated",
			bio: "Updated bio",
			username: "updateusername",
		});
		expect(response.status).to.equal(200);
		expect(response.body).to.be.an("object");
		expect(response.body).to.have.property("message");
		await (
			await chai.request(app).post("/user/update")
		).body({
			name: "Chinmay Shewale",
			bio: "Bio",
			username: "chinmayyy",
		});
	});
	it("should give an eror if name or username is empty", async () => {
		const response = await (
			await chai.request(app).post("/user/update")
		).body({
			name: "dchdbc",
			bio: "",
			username: "",
		});
		expect(response.status).to.equal(400);
		expect(response.body).to.be.an("object");
		expect(response.body).to.have.property("message");
	});
	it("should give an eror if name or username is empty", async () => {
		const response = await (
			await chai.request(app).post("/user/update")
		).body({
			name: "",
			bio: "",
			username: "fdhbcdhcb",
		});
		expect(response.status).to.equal(400);
		expect(response.body).to.be.an("object");
		expect(response.body).to.have.property("message");
	});
});

describe("POST /user/follow", () => {
	it("should follow a user", async () => {
		// Add foloowing id
		const response = await chai.request(app).post("/user/follow?id=");
		expect(response.status).to.equal(200);
		expect(response.body).to.be.an("object");
		expect(response.body).to.have.property("message");
	});
	it("should give an error if it follows self", async () => {
		const response = await chai
			.request(app)
			.post("/user/follow?id=644073df452f5d6da6da52b9");
		expect(response.status).to.equal(400);
		expect(response.body).to.be.an("object");
		expect(response.body).to.have.property("message");
	});
});

describe("POST /user/unfollow", () => {
	it("should unfollow a user", async () => {
		// Add foloowing id
		const response = await chai.request(app).post("/user/unfollow?id=");
		expect(response.status).to.equal(200);
		expect(response.body).to.be.an("object");
		expect(response.body).to.have.property("message");
	});
	it("should give an error if it unfollows self", async () => {
		const response = await chai
			.request(app)
			.post("/user/unfollow?id=644073df452f5d6da6da52b9");
		expect(response.status).to.equal(400);
		expect(response.body).to.be.an("object");
		expect(response.body).to.have.property("message");
	});
});

describe("GET /user/me", () => {
	it("should return a user object", async () => {
		const response = await chai.request(app).get("/user/me");
		expect(response.status).to.equal(200);
		expect(response.body).to.be.an("object");
		expect(response.body).to.have.property("user");
    });
    
    
});
