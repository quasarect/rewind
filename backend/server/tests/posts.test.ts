import { beforeAll, describe, expect, test } from "@jest/globals";
import axios from "axios";
import { generateToken } from "../middlewares/auth";
/**
 * Default database : Already some dummy posts (2-3)
 */

describe("For posts", () => {
	let authToken: string, postId: string;
	let Headers: object;

	beforeAll(async () => {
		authToken = generateToken("", "");
		Headers = {
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		};
	});

	test("should create post", async () => {
		const post = await axios.post(
			"http://localhost:3000/posts/create",
			{
				text: "This is a test post",
			},
			Headers,
		);
		postId = post.data.postId;
		expect(post.data).toHaveProperty(["message", "postId"]);
		expect(post.status).toBe(201);
		expect(post.data.message).toEqual("Post created successfully");
	});

	test("should reply to a post", async () => {
		const post = await axios.post(
			"http://localhost:3000/posts/create",
			{
				replyTo: postId,
				text: "This a reply from the testing department",
			},
			Headers,
		);
		expect(post.data).toHaveProperty(["message", "postId"]);
		expect(post.status).toBe(201);
		expect(post.data.message).toEqual("Post created successfully");
	});
	test("should fetch comments", async () => {
		const post = await axios.get(
			`http://localhost:3000/${postId}/comments`,
			Headers,
		);
		expect(post.status).toBe(200);
		expect(post.data).toHaveProperty("posts");
	});
	test("should get a post from postId", async () => {
		const post = await axios.get(
			`http://localhost:3000/posts/${postId}`,
			Headers,
		);
		expect(post.status).toBe(200);
		expect(post.data).toHaveProperty(["post"]);
		expect(post.data.post).toHaveProperty([
			"user",
			"likeCount",
			"commentCount",
			"reshareCount",
		]);
	});
	test("should like a post", async () => {
		const post = await axios.get("http://localhost:3000/posts/like", {
			data: { id: postId },
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		});
		expect(post.status).toBe(200);
		expect(post.data).toHaveProperty("message");
		expect(post.data.message).toEqual("Like count incremented");
	});
	test("should throw error on liking already liked post", async () => {
		const post = await axios.get("http://localhost:3000/posts/like", {
			data: { id: postId },
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		});
		expect(post.status).toBe(400);
		expect(post.data).toHaveProperty("message");
		expect(post.data.message).toEqual("Already liked");
	});
	test("should fetch posts made by user", async () => {
		const post = await axios.get("https://localhost:3000/user/cshewale23");
	});
	test("should get a post liked by user by postId", async () => {
		const post = await axios.get(
			`http://localhost:3000/posts/${postId}`,
			Headers,
		);
		expect(post.status).toBe(200);
		expect(post.data).toHaveProperty(["post"]);
		expect(post.data.post).toHaveProperty([
			"user",
			"likeCount",
			"commentCount",
			"reshareCount",
			"likedBy",
		]);
	});
	test("should unlike a post", async () => {
		const post = await axios.get("http://localhost:3000/posts/unlike", {
			data: { id: postId },
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		});
		expect(post.status).toBe(200);
		expect(post.data).toHaveProperty("message");
		expect(post.data.message).toEqual("Unliked the post");
	});
	test("should throw error on unliking already unliked post", async () => {
		const post = await axios.get("http://localhost:3000/posts/unlike", {
			data: { id: postId },
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		});
		expect(post.status).toBe(400);
		expect(post.data).toHaveProperty("message");
		expect(post.data.message).toEqual("Already unliked");
	});
	test("should reshare a post", async () => {
		//Feature not implemented properly to test
	});
	test("should throw an error for resharing the post again", () => {
		//Later
	});
	test("should delete a post", async () => {
		const post = await axios.delete(
			`http://localhost:3000/${postId}`,
			Headers,
		);
		expect(post.status).toBe(200);
		expect(post.data).toHaveProperty("message");
		expect(post.data.message).toEqual("Post deleted successfully");
	});
	test("should throw error on creating invalid post", async () => {
		const post = await axios.post(
			"http://localhost:3000/posts/create",
			{},
			Headers,
		);
		expect(post.status).toBe(400);
		expect(post.data).toHaveProperty("message");
	});
	test("should fetch all posts", async () => {
		const post = await axios.get(
			"http://localhost:3000/posts/all",
			Headers,
		);
		expect(post.status).toBe(200);
		expect(post.data).toHaveProperty("posts");
	});
});
