import { describe, expect, test } from "bun:test";
import { parseInitData } from "../src/parse";

const TEST_INIT_DATA =
  "auth_date%3D1733485316394%26query_id%3D158b120b-7aa3-4a0f-a198-52ace06d0658%26user%3D%257B%2522language_code%2522%253A%2522ru%2522%252C%2522first_name%2522%253A%2522%25D0%2592%25D0%25B0%25D1%2581%25D1%258F%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522photo_url%2522%253Anull%252C%2522username%2522%253Anull%252C%2522id%2522%253A400%257D%26hash%3Df982406d90b118d8e90e26b33c5cec0cadd3fc30354f2955c75ff8e3d14d130d";

describe("parseInitData", () => {
  test("should return init data", () => {
    const result = parseInitData(TEST_INIT_DATA);

    expect(result.data).toBeTruthy();
    expect(result.data?.user.first_name).toBe("Вася");
    expect(result.data?.user.id).toBe(400);
    expect(result.data?.auth_date).toBe(1733485316394);
    expect(result.data?.query_id).toBe("158b120b-7aa3-4a0f-a198-52ace06d0658");
    expect(result.data?.hash).toBe(
      "f982406d90b118d8e90e26b33c5cec0cadd3fc30354f2955c75ff8e3d14d130d",
    );
    expect(result.error).toBeUndefined();
  });

  test("should return error for missing auth_date", () => {
    const initData = TEST_INIT_DATA.replace("auth_date%3D1733485316394%26", "");
    const result = parseInitData(initData);

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      message: "Missing auth_date parameter",
      type: "InitDataParseError",
    });
  });

  test("should return error for missing query_id", () => {
    const initData = TEST_INIT_DATA.replace(
      "query_id%3D158b120b-7aa3-4a0f-a198-52ace06d0658%26",
      "",
    );
    const result = parseInitData(initData);

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      message: "Missing query_id parameter",
      type: "InitDataParseError",
    });
  });

  test("should return error for missing hash", () => {
    const initData = TEST_INIT_DATA.replace(
      "hash%3Df982406d90b118d8e90e26b33c5cec0cadd3fc30354f2955c75ff8e3d14d130d",
      "",
    );
    const result = parseInitData(initData);

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      message: "Missing hash parameter",
      type: "InitDataParseError",
    });
  });

  test("should return error for missing user", () => {
    const initData = TEST_INIT_DATA.replace(
      "user%3D%257B%2522language_code%2522%253A%2522ru%2522%252C%2522first_name%2522%253A%2522%25D0%2592%25D0%25B0%25D1%2581%25D1%258F%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522photo_url%2522%253Anull%252C%2522username%2522%253Anull%252C%2522id%2522%253A400%257D%26",
      "",
    );
    const result = parseInitData(initData);

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      message: "Missing user parameter",
      type: "InitDataParseError",
    });
  });

  test("should return error for invalid user JSON", () => {
    const initData = TEST_INIT_DATA.replace(
      "user%3D%257B%2522language_code%2522%253A%2522ru%2522%252C%2522first_name%2522%253A%2522%25D0%2592%25D0%25B0%25D1%2581%25D1%258F%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522photo_url%2522%253Anull%252C%2522username%2522%253Anull%252C%2522id%2522%253A400%257D",
      "user%3Dinvalid_json",
    );
    const result = parseInitData(initData);

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      message: "Invalid user parameter format",
      type: "InitDataParseError",
    });
  });

  test("should return error for missing user.id", () => {
    const initData = TEST_INIT_DATA.replace(
      "%2522id%2522%253A400",
      "%2522id%2522%253A%2522%2522",
    );
    const result = parseInitData(initData);

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      message: "Missing user.id parameter",
      type: "InitDataParseError",
    });
  });

  test("should return error for missing user.first_name", () => {
    const initData = TEST_INIT_DATA.replace(
      "%2522first_name%2522%253A%2522%25D0%2592%25D0%25B0%25D1%2581%25D1%258F%2522%252C",
      "",
    );
    const result = parseInitData(initData);

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      message: "Missing user.first_name parameter",
      type: "InitDataParseError",
    });
  });

  test("should handle optional chat parameter", () => {
    const initDataWithChat =
      TEST_INIT_DATA + "&chat=%7B%22id%22%3A100%2C%22type%22%3A%22group%22%7D";
    const result = parseInitData(initDataWithChat);

    expect(result.data).toBeTruthy();
    expect(result.data?.chat).toEqual({ id: 100, type: "group" });
    expect(result.error).toBeUndefined();
  });

  test("should return error for invalid chat JSON", () => {
    const initData = TEST_INIT_DATA + "&chat=invalid_json";
    const result = parseInitData(initData);

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      message: "Invalid chat parameter format",
      type: "InitDataParseError",
    });
  });

  test("should return error for missing chat.id", () => {
    const initData = TEST_INIT_DATA + "&chat=%7B%22type%22%3A%22group%22%7D";
    const result = parseInitData(initData);

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      message: "Missing chat.id parameter",
      type: "InitDataParseError",
    });
  });

  test("should return error for missing chat.type", () => {
    const initData = TEST_INIT_DATA + "&chat=%7B%22id%22%3A100%7D";
    const result = parseInitData(initData);

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      message: "Missing chat.type parameter",
      type: "InitDataParseError",
    });
  });
});
