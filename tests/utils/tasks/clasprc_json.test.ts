describe("clasprcJson.read", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("return value", () => {
    const test = {
      token: {
        access_token: "string",
        scope: "string",
        token_type: "string",
        id_token: "string",
        expiry_date: 1,
        refresh_token: "string",
      },
      oauth2ClientSettings: {
        clientId: "string",
        clientSecret: "string",
        redirectUri: "string",
      },
      isLocalCreds: false,
    };

    jest.mock("fs", () => ({
      readFileSync: jest.fn(() => Buffer.from(JSON.stringify(test))),
    }));

    import("@src/utils/tasks/clasprc_json").then((clasprcJson) => {
      const json = clasprcJson.read();
      expect(json).toStrictEqual(test);
    });
  });

  test("not found clasprc.json", () => {
    jest.mock("fs", () => ({
      readFileSync: jest.fn(() => {
        throw new Error("not found clasprc.json");
      }),
    }));

    import("@src/utils/tasks/clasprc_json").then((clasprcJson) => {
      expect(() => {
        clasprcJson.read();
      }).toThrow();
    });
  });
});
