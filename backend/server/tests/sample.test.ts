import axios from "axios";
import { expect, test, describe } from "@jest/globals";

test("Testing and testing", async () => {
	const response = await axios.get("http://localhost:3000/test");
	expect(response.status).toBe(200);
});

describe("Describing and testing", () => {
	axios.get("http://localhost:3000/test").then((res) => {
		expect(res.status).toBe(200);
	});
});
