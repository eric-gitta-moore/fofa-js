import { Client } from "./index";
import * as process from "node:process";

describe("ClientTestCase", () => {
  let client: Client;

  beforeEach(() => {
    const key = process.env.FOFA_KEY;
    client = new Client(key, process.env.FOFA_BASE_URL);
  });

  it("should get user info", async () => {
    const userinfo = await client.getUserInfo();
    expect(userinfo).toHaveProperty("isvip");
    expect(userinfo).toHaveProperty("fcoin");
    expect(userinfo).toHaveProperty("email");
    expect(userinfo).toHaveProperty("avatar");

    expect(userinfo.isvip).toBeTruthy();
    expect(userinfo.fcoin).toBeGreaterThanOrEqual(0);
    expect(userinfo.email).toBeTruthy();
    expect(userinfo.avatar).toBeDefined();
  });

  it(
    "should get empty data",
    async () => {
      const query = "djaoiwjklejaoijdoawd";
      const data = await client.search(query);
      expect(data).toHaveProperty("results");
      expect(data).toHaveProperty("page");
      expect(data).toHaveProperty("size");
      expect(data).toHaveProperty("mode");
      expect(data).toHaveProperty("query");

      expect(data.results).toEqual([]);
      expect(data.mode).toBeTruthy();
      expect(data.query).toBeTruthy();
      expect(data.size).toBe(0);

      expect(data.query).toBe(`"${query}"`);
      expect(data.page).toBe(1);
      expect(data.mode).toBe("normal");
    },
    60 * 1000,
  );

  it(
    "should get normal data",
    async () => {
      const query = "fofa.info";
      const data = await client.search(query);
      expect(data).toHaveProperty("results");
      expect(data).toHaveProperty("page");
      expect(data).toHaveProperty("size");
      expect(data).toHaveProperty("mode");
      expect(data).toHaveProperty("query");

      expect(data.results).toBeTruthy();
      expect(data.mode).toBeTruthy();
      expect(data.query).toBeTruthy();
      expect(data.size).toBeTruthy();
      expect(data.error).toBeFalsy();
      expect(data.page).toBeTruthy();

      expect(data.query).toBe(`"${query}"`);
      expect(data.mode).toBe("normal");
    },
    60 * 1000,
  );

  it(
    "should get data with fields",
    async () => {
      const query = `host="fofa.info"`;
      const data = await client.search(query, {
        fields: "host,title,ip,domain,port,country,city",
      });

      expect(data).toHaveProperty("results");
      expect(data).toHaveProperty("page");
      expect(data).toHaveProperty("size");
      expect(data).toHaveProperty("mode");
      expect(data).toHaveProperty("query");

      expect(data.results).toBeTruthy();
      expect(data.page).toBeTruthy();
      expect(data.size).toBeTruthy();
      expect(data.mode).toBeTruthy();
      expect(data.query).toBeTruthy();

      expect(data.error).toBeFalsy();

      expect(data.query).toBe(query);
      expect(data.page).toBe(1);
      expect(data.mode).toBe("extended");

      expect(data.results[0]).toHaveLength(7);
    },
    60 * 1000,
  );

  it(
    "should get extended data",
    async () => {
      const query = 'host="fofa.info"';
      const data = await client.search(query);
      expect(data).toHaveProperty("results");
      expect(data).toHaveProperty("page");
      expect(data).toHaveProperty("size");
      expect(data).toHaveProperty("mode");
      expect(data).toHaveProperty("query");

      expect(data.results).toBeTruthy();
      expect(data.page).toBeTruthy();
      expect(data.size).toBeTruthy();
      expect(data.mode).toBeTruthy();
      expect(data.query).toBeTruthy();

      expect(data.error).toBeFalsy();

      expect(data.query).toBe(query);
      expect(data.page).toBe(1);
      expect(data.mode).toBe("extended");
    },
    60 * 1000,
  );

  it("should handle page error 1", async () => {
    const query = "djaoiwjklejaoijdoawd";
    try {
      const data = await client.search(query, { size: 100, page: "300" });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it(
    "should handle page error 2",
    async () => {
      const query = "fofa.info";
      try {
        const data = await client.search(query, { size: 100, page: "300" });
      } catch (error) {
        expect(error).toBeTruthy();
      }
    },
    60 * 1000,
  );
});
