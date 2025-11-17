import Cookies from "js-cookie";

export const tokenService = {
  getAccessToken: (): string | null => Cookies.get("accessToken") || null,

  setAccessToken: (token: string) => {
    Cookies.set("accessToken", token, { expires: 7 }); // lưu 7 ngày
  },

  clearAccessToken: () => {
    Cookies.remove("accessToken");
  },
};
