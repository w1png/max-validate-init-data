import type { InitData, Result, ResultError } from "./types";

export function parseInitData(initData: string): Result<InitData, ResultError> {
  const decodedData = decodeURIComponent(initData);
  const searchParams = new URLSearchParams(decodedData);
  const params = Object.fromEntries(searchParams);

  if (!params.auth_date) {
    return {
      data: undefined,
      error: {
        message: "Missing auth_date parameter",
        type: "InitDataParseError",
      },
    };
  }

  if (!params.query_id) {
    return {
      data: undefined,
      error: {
        message: "Missing query_id parameter",
        type: "InitDataParseError",
      },
    };
  }

  if (!params.hash) {
    return {
      data: undefined,
      error: { message: "Missing hash parameter", type: "InitDataParseError" },
    };
  }

  if (!params.user) {
    return {
      data: undefined,
      error: { message: "Missing user parameter", type: "InitDataParseError" },
    };
  }

  let parsedUser;
  try {
    parsedUser = JSON.parse(params.user);
  } catch {
    return {
      data: undefined,
      error: {
        message: "Invalid user parameter format",
        type: "InitDataParseError",
      },
    };
  }

  if (!parsedUser.id) {
    return {
      data: undefined,
      error: {
        message: "Missing user.id parameter",
        type: "InitDataParseError",
      },
    };
  }
  if (!parsedUser.first_name) {
    return {
      data: undefined,
      error: {
        message: "Missing user.first_name parameter",
        type: "InitDataParseError",
      },
    };
  }

  let parsedChat;
  if (params.chat) {
    try {
      parsedChat = JSON.parse(params.chat);
    } catch {
      return {
        data: undefined,
        error: {
          message: "Invalid chat parameter format",
          type: "InitDataParseError",
        },
      };
    }

    if (!parsedChat.id) {
      return {
        data: undefined,
        error: {
          message: "Missing chat.id parameter",
          type: "InitDataParseError",
        },
      };
    }
    if (!parsedChat.type) {
      return {
        data: undefined,
        error: {
          message: "Missing chat.type parameter",
          type: "InitDataParseError",
        },
      };
    }
  }

  const parsedInitData: InitData = {
    auth_date: parseInt(params.auth_date),
    query_id: params.query_id,
    hash: params.hash,
    start_param: params.start_param,
    user: {
      id: parseInt(parsedUser.id),
      language_code: parsedUser.language_code,
      first_name: parsedUser.first_name,
      last_name: parsedUser.last_name,
      photo_url: parsedUser.photo_url,
      username: parsedUser.username,
    },
    chat: parsedChat
      ? {
          id: parseInt(parsedChat.id),
          type: parsedChat.type,
        }
      : undefined,
  };

  return { data: parsedInitData, error: undefined };
}
