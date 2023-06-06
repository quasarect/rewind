import { beforeAll, describe, test } from "@jest/globals";
/*
Default database :
    - Insert two user datas before only.

After tests :
    - Change back the data updated

*/
describe("For users", () => {
    // let naav: string;
    beforeAll(async () => {
        // naav = "chinu";
    });
    test("should update user details", () => {
    });
    test("should follow user", () => { });
    test("should throw error on self follow", () => { });
    test("should throw error on already follow", () => { });
    test("should unfollow user", () => { });
    test("should throw error on self unfollow", () => { });
    test("should get the me user details", () => { });
    test("should check if username is unique", () => { });
    test("should throw error on a not unique username", () => { });
});
