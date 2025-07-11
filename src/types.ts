export type Result<T, E> =
  | { data: T; error: undefined }
  | { data: undefined; error: E };

export type ResultError = {
  message: string;
  type: "InitDataParseError" | "InvalidInitDataError";
};

export type InitData = {
  auth_date: number;
  query_id: string;
  hash: string;
  start_param: string | undefined;
  user: User;
  chat: Chat | undefined;
};

export type Chat = {
  id: number;
  type: string;
};

export type User = {
  id: number;
  language_code: string | undefined;
  first_name: string;
  last_name: string | null;
  photo_url: string | null;
  username: string | null;
};
