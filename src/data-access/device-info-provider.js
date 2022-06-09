import {API} from '@variable/api';
import clientUtils from "@utils/client-utils";
import baseProvider from "./base-provider";

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  ...baseProvider(API.deviceInfo),
  getIp: () => {
    return new Promise((resolve, reject) => {
      fetch(`https://geolocation-db.com/json/`, { method: "get" })
        .then((x) => {
          resolve(x.json());
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  checkLogout: (deviceInfoId) => {
    return new Promise((resolve, reject) => {
      clientUtils
        .requestApi(
          "get",
          `${API.deviceInfo}/check-logout/${deviceInfoId}`,
          {},
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
};
