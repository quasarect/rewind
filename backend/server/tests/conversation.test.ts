import { beforeAll, describe, expect, test } from "@jest/globals";
import { generateToken } from "../middlewares/auth";
import axios from "axios";
/**
 * After all : delete the conversation
 */
describe("For conversations", () => {
	let authToken: string;
	let Headers: object;
	let conversationId: string;
	const user2Id: string = "6438cf8bad843d1a0b782c55";
	const baseUrl: string = "http://localhost:3000/conversation";
	beforeAll(async () => {
		authToken = generateToken("643d37740bebbc75840aaa1a", "chinma_yyy");
		Headers = {
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		};
	});
	test("should create a conversation", async () => {
		const conversation = await axios.get(
			`${baseUrl}/create?userId=${user2Id}`,
			Headers,
		);
		conversationId = conversation.data.conversationId;
		expect(conversation.status).toBe(200);
		expect(conversation.data).toHaveProperty("conversationId");
	});
	test("should get a conversation", async () => {
		const conversation = await axios.get(
			`${baseUrl}?id=${conversationId}`,
			Headers,
		);
		expect(conversation.status).toBe(200);
		expect(conversation.data).toHaveProperty("conversation");
	});
	test("should get user conversations", async () => {
		const conversation = await axios.get(`${baseUrl}/user`, Headers);
		expect(conversation.status).toBe(200);
		expect(conversation.data).toHaveProperty("conversations");
	});
	test("should send a test message in the conversation", async () => {
		const message = await axios.post(
			`${baseUrl}/send?id=${conversationId}`,
			{
				userId: user2Id,
				message: "From myself",
			},
			Headers,
		);
		expect(message.status).toBe(200);
		expect(message.data).toHaveProperty("message");
		expect(message.data.message).toEqual("Message Sent");
	});
	test("should throw error on creating self conversation", () => {
		axios
			.get(`${baseUrl}/create?userId=643d37740bebbc75840aaa1a`, Headers)
			.catch((conversation) => {
				expect(conversation.response.status).toBe(403);
				expect(conversation.response.data.message).toEqual(
					"self conversation",
				);
				expect(conversation.response.data).toHaveProperty("message");
			});
	});
});
