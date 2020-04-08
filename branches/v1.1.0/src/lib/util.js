import axios from "axios";
import Qs from "qs";
import config from "./global";
import { stringify } from "querystring";
import router from "../router";

let util = {};
//console.log(this)
const ajaxUrl = config.developmentUrl;
util.ajax = axios.create({
  baseURL: ajaxUrl.host1,
  headers: {
    //'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*"
  }

  //transformRequest: (data) => {
  //	console.log(data)
  //  return (Qs.a = stringify(data))
  //}

  //timeout: 10000
});

function getCookie(name) {
  var arr = document.cookie.split(";");
  var i = 0;
  for (i = 0; i < arr.length; i++) {
    var arr2 = arr[i].split("=");

    if (arr2[0] == name) {
      var getC = decodeURIComponent(arr2[1]);
      return getC;
    }
  }

  return "";
}

//let oToken =  getCookie('token');
//console.log(oToken)
// util.ajax.interceptors.request.use(
//   config => {
//   	console.log(config)
//     if (this.$cookie.get('token') !== oToken) {
//       oToken = this.$cookie.get('token')
//       config.headers.token = oToken
//     } else {
//				 console.log(this.$cookie)
//       config.headers.token = oToken
//     }
//     return config
//   },
//   err => {
//     return Promise.reject(err)
//   }
// )

util.ajax.interceptors.request.use(
  function(config) {
    let hw_user_message = JSON.parse(localStorage.getItem("hw_user_message"));
    let hwOpenId = hw_user_message.hwOpenId;
    let managerNo = hw_user_message.managerNo;
    config.headers.hwOpenId = hwOpenId == null ? "" : hwOpenId;
    config.headers.managerNo = managerNo == null ? "" : managerNo;
    return config;
  },
  function(error) {
    console.log(error);
  }
);

util.ajax.interceptors.response.use(
  response => {
    if (
      response.data.respHead != undefined &&
      response.data.respHead.respCode == "010"
    ) {
      router.replace({
        path: "/"
      });
    } else {
      return response;
    }
  },
  err => Promise.reject(err)
);

export default util;
