import { API } from "@variable/api";
import clientUtils from "@utils/client-utils";
import { combineUrlParams } from "@utils/common";

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  login(body) {
    return new Promise((resolve, reject) => {
      clientUtils
        .requestApi(
          "post",
          combineUrlParams(
            `/account/login`
            // `/chat-server/api/v1/login`
            // {
            //   response_type: "code",
            //   client_id: "hoang",
            //   scope: "read",
            //   state: "2K4ZDYkjCYQf6u5NPJYGDtOtxmUkgI73WIcI-PJFe8k%3D",
            //   redirect_uri: "http://localhost:3000",
            // }
          ),
          body,
          true
        )
        .then((x) => {
          resolve(x);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  register(body) {
    return new Promise((resolve, reject) => {
      clientUtils
        .requestApi("post", `${API.account}/register`, body, true)
        .then((x) => {
          resolve(x);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  changeAvatar(file) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);

      clientUtils
        .upload("put", `${API.account}/avatar`, formData)
        .then((x) => {
          resolve(x);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  logout(pending) {
    localStorage.clear();
    if (pending) {
      setTimeout(() => {
        window.location.href = "/p/home";
      }, pending);
    } else {
      window.location.href = "/p/home";
    }
  },
};
