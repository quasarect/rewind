import axios from "axios";
import { expect, test, describe } from "@jest/globals";

test('Testing the endpoint', async () => {
    console.log("here");
    const response = await axios.get('http://localhost:3000/test');
    expect(response.status).toBe(200);
})

describe('Lets see this', () => {
    console.log("there");
    axios.get('http://localhost:3000/test').then((res) => {
        expect(res.status).toBe(200);
    });
})