<template>
  <div class="login_wrap">
    <div class="box">
      <img :src="pic_logo" alt />
      <div class="tips">正在登录...</div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import util from "../../lib/util";
import axios from "axios";
Vue.prototype.$http = axios;
import globalUrl from "../../lib/global";

export default {
  data() {
    return {
      pic_logo: require("./../../assets/image/pic_logo.png"),
      hwInfo: {},
      userInfo: {},
      Url: "",
      reportId: ""
    };
  },
  created() {
    let Url = window.location.href;
    let num = Url.indexOf("reportId=");
    if (num == -1) {
      this.reportId = "";
    } else {
      num = num + 9;
      this.reportId = Url.substring(num);
    }
    this.infoHW();
//  this.test();
    

//  this.hwInfo = {
//    openId:
//      "MDFAMTAxMTI2ODkzQGI0YmIxYzg4M2E3ZTNmMWU5MTVlYzdkZjUzZGU4MjM2QDY2YmZhOWViaYTdjM2FiaZmFiaNTJkNzc3Y2U5ZDFjMTg0NTUzOGRjYmQ1NDg5YThiaZWJlYzdkMWI2",
//    displayName: "哈哈",
//    photoUrl:
//      "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1554699871199&di=efa7d2dd9220f629ab982deeea1de3a9&imgtype=0&src=http%3A%2F%2Fimg.duoziwang.com%2F2018%2F04%2F2410313413407.jpg"
//  };
//  this.getInfo();
  },
  methods: {
    test() {
      let Url = window.location.href;
      this.Url = Url;
      let argue = {
        isHwProtocol: 1,
        userNo: 995, //981   985
        managerNo: 920, //906   910
        regMonth: 18,
        hwOpenId:
          "MDFAMTAxMTI2ODkzQDI5Mjc3NDExZjNhMzZkZjE0MTNiaN2JhNWE5ODk0YzQ5QGU4ODlmZTYxZmU4ZDUwNDNhZWI5M2IxM2M5ZmFjMjU2YmJiaMWMwYzRiaMjI3ZTc1YjhiaZGQzZWUz"
      };
      argue.nickName = "呵呵";
      argue.photo =
        "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1554699871199&di=efa7d2dd9220f629ab982deeea1de3a9&imgtype=0&src=http%3A%2F%2Fimg.duoziwang.com%2F2018%2F04%2F2410313413407.jpg";
      let userData = JSON.stringify(argue);
      localStorage.setItem("hw_user_message", userData);
      try {
        window.JsInteraction.ecgLoginAuthSign(hwOpenId);
      } catch (e) {
        console.log("name: " + e.name);
        console.log("message: " + e.message);
      }
      this.$router.push({
        name: "HomePage"
      });
    },

    infoHW() {
      let self = this;
      if (hbs.isSupport()) {
        hbs.config({
          appId: "101126893", //必填，华为开发者联盟上申请的Web轻应用的appId
          jsApiList: ["signIn"] //必填，申请使用的接口列表
        });
        hbs.ready(function() {
          var param = {
            scope: "https://www.huawei.com/auth/account/base.profile"
          };
          //或者var param = {"scope":"https://www.huawei.com/auth/account/base.profile","needAuthCode":false };
          hbs.signIn(
            param,
            function(res) {
              let res1 = JSON.stringify(res);
              try {
                window.JsInteraction.ecgLoginAuthSign(res.openId);
              } catch (e) {
                              	alert('name: ' + e.name)
                              	alert('message: ' + e.message)
              }
              self.hwInfo = res;
              if (res1) {
                self.getInfo();
              }
            },
            function(error) {
              if (error.message.includes("Network")) {
                location.reload();
              }
              var e = JSON.stringify(error);
            }
          );
        });
        hbs.error(function(res) {
        	alert(JSON.stringify(res))
        	alert(JSON.stringify(res.data))
          self.$toast("请在华为运动健康中打开页面 ！");
          return;
        });
      } else {
        self.$toast("请在华为运动健康中打开页面！");
        return;
      }
    },

    getInfo() {
      let self = this;
//      let Url = "http://api-test.995120.cn/hww/";
      let Url = "http://api.995120.cn/hww/";
      let params = {
        body: {
          hwOpenId: this.hwInfo.openId,
          nickName: this.hwInfo.displayName,
          photo: this.hwInfo.photoUrl
        },
        reqHead: {
          appId: "com.helowin.hm505h5",
          version: "1.0.0",
          functionId: "HWW001001004"
        }
      };
      this.$http
        .post(Url, params)
        .then(function(res) {
          //      	alert('128:   ' + JSON.stringify(res))
          self.userInfo = res.data.body.data;
          self.userInfo.hwOpenId = self.hwInfo.openId;
          self.userInfo.nickName = self.hwInfo.displayName;
          self.userInfo.photo = self.hwInfo.photoUrl;
          let userData = JSON.stringify(self.userInfo);
          localStorage.setItem("hw_user_message", userData);
          self.login();
        })
        .catch(function(err) {
          if (err.message.includes("Network")) {
            location.reload();
          }
        });
    },
    login() {
      if (this.reportId != "") {
        localStorage.setItem("hw_reportId", this.reportId);
        this.$router.push({
          name: "EcgReport"
        });
      } else {
        if (this.userInfo.isHwProtocol == 0) {
          this.$router.push({
            name: "Agreement"
          });
        }
        if (this.userInfo.isHwProtocol == 1) {
          this.$router.push({
            name: "HomePage",
          });
        }
      }
    }
  }
};

//  http://122.225.207.105:2130/hwh/
//  http://api-test.995120.cn/hwh/
//  http://api-test.995120.cn/hwh/?type=ecg&reportId=36185
</script>

<style lang="scss">
.login_wrap {
  display: flex;
  justify-content: center;
  // align-items: center;
  padding-top: 120px;
  height: 100%;
  background-color: #fff;
  box-sizing: border-box;
  overflow: hidden;
  .box {
    width: 90px;
    height: 90px;
    & > img {
      width: 100%;
      height: 100%;
      margin-bottom: 20px;
    }
    .tips {
      color: #333;
      font-size: 16px;
    }
  }
}
</style>
