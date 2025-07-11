import { createHmac } from "crypto";
import type { InitData, Result, ResultError } from "./types";
import { parseInitData } from "./parse";

export function validateInitData({
  initData,
  botToken,
}: {
  initData: string;
  botToken: string;
}): Result<InitData, ResultError> {
  const decodedData = decodeURIComponent(initData);
  const searchParams = new URLSearchParams(decodedData);
  const params = Object.fromEntries(searchParams);

  const receivedHash = params.hash;
  if (!receivedHash) {
    return {
      data: undefined,
      error: {
        message: "Missing hash parameter",
        type: "InvalidInitDataError",
      },
    };
  }

  const dataCheckString = Object.keys(params)
    .filter((key) => key !== "hash")
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("\n");

  const secretKey = createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest("hex");

  const computedHash = createHmac("sha256", Buffer.from(secretKey, "hex"))
    .update(dataCheckString)
    .digest("hex");

  if (computedHash !== receivedHash) {
    return {
      data: undefined,
      error: { message: "Invalid hash", type: "InvalidInitDataError" },
    };
  }

  const parseResult = parseInitData(initData);
  if (parseResult.error) {
    return { data: undefined, error: parseResult.error };
  }

  return { data: parseResult.data, error: undefined };
}
