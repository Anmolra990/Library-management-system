import api from "./axios";
import type {
  LoginInput,
  LoginResult,
  RegisterInput,
  User,
} from "../types/auth";

export const registerUser = async (
  data: RegisterInput
): Promise<void> => {
  await api.post("/users/register", data);
};

export const loginUser = async (
  data: LoginInput
): Promise<LoginResult> => {
  const response = await api.post<LoginResult>(
    "/users/login",
    data
  );

  return response.data;
};

export const getProfile = async (): Promise<User> => {
  const response = await api.get<{ user: User }>(
    "/users/profile"
  );

  return response.data.user;
};