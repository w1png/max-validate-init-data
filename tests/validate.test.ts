import { describe, expect, test } from "bun:test";
import { validateInitData } from "../src";

const TEST_BOT_TOKEN = "2Uk3Z_8zAlwhprgOcK3r1B1fDk8uhi2MDv47EvXkcu8";
const TEST_INIT_DATA =
  "auth_date%3D1733485316394%26query_id%3D158b120b-7aa3-4a0f-a198-52ace06d0658%26user%3D%257B%2522language_code%2522%253A%2522ru%2522%252C%2522first_name%2522%253A%2522%25D0%2592%25D0%25B0%25D1%2581%25D1%258F%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522photo_url%2522%253Anull%252C%2522username%2522%253Anull%252C%2522id%2522%253A400%257D%26hash%3Df982406d90b118d8e90e26b33c5cec0cadd3fc30354f2955c75ff8e3d14d130d";

describe("validate", () => {
  test("should return init data", () => {
    const v = validateInitData({
      initData: TEST_INIT_DATA,
      botToken: TEST_BOT_TOKEN,
    });

    expect(v.data).toBeTruthy();
    expect(v.data?.user.first_name).toBe("Вася");
    expect(v.error).toBeFalsy();
  });

  test("should return error missing hash parameter", () => {
    const v = validateInitData({
      initData:
        "auth_date=1733485316394&query_id=158b120b-7aa3-4a0f-a198-52ace06d0658&user=%7B%22language_code%22%3A%22ru%22%2C%22first_name%22%3A%22%D0%92%D0%B0%D1%81%D1%8F%22%2C%22last_name%22%3A%22%22%2C%22photo_url%22%3Anull%2C%22username%22%3Anull%2C%22id%22%3A400%7D",
      botToken: TEST_BOT_TOKEN,
    });

    expect(v.data).toBeFalsy();
    expect(v.error?.message).toBe("Missing hash parameter");
    expect(v.error?.type).toBe("InvalidInitDataError");
  });

  test("should return error invalid hash", () => {
    const v = validateInitData({
      initData: TEST_INIT_DATA.replace("4a0f", "4af0"),
      botToken: TEST_BOT_TOKEN,
    });

    expect(v.data).toBeFalsy();
    expect(v.error?.message).toBe("Invalid hash");
    expect(v.error?.type).toBe("InvalidInitDataError");
  });
});
