<template>
  <div class="login_wrap">
    <div class="box" v-if="loginShow">
      <img :src="pic_logo" alt />
      <div class="tips">正在加载....</div>
    </div>
    <div class="start_service" v-if="serviceShow">
    	<img src="../../assets/image/pic_startservices.png"/>
    	<div class="service_btn">
    		<p>注：本服务需要cassini手表及对应的ECG表带配合使用。</p>
    		<span @click="startService">开启服务</span>
    	</div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import util from "../../lib/util";
import axios from "axios";
Vue.prototype.$http = axios;
import globals from "../../lib/global";

export default {
  data() {
    return {
      pic_logo: require("./../../assets/image/pic_logo.png"),
      hwInfo: {},
      userInfo: {},
      Url: "",
      reportId: "",
      loginShow: true,
      serviceShow: false,
      baseUrl: ''
    };
  },
  created() {
  	let host = globals.developmentUrl.host1
	let obj = {
		'http://192.168.9.136:2010/hww/': 'http://api-test.995120.cn/hww/',
		'http://api-test.995120.cn/hww/': 'http://api-test.995120.cn/hww/',
		'http://api.995120.cn/hww/': 'http://api.995120.cn/hww/'
	}
	this.baseUrl = obj[host]
  	
  	let self = this
    let Url = window.location.href;
    let num = Url.indexOf("reportId=");
    if (num == -1) {
      this.reportId = "";
    } else {
      num = num + 9;
      this.reportId = Url.substring(num);
    }
    
		let startService = localStorage.getItem('hw_startService')
    if (startService == null) {
    	setTimeout(function(){
    		self.loginShow = false
    		self.serviceShow = true
    		localStorage.setItem('hw_startService','a')
    	},1000)
    }else{
    	this.infoHW();
//  	this.test();
    }
    
    

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
        userNo: 1142, //981   985
        managerNo: 911, //906   910
        regMonth: 18,
        hwOpenId:
          "MDFAMTAxMTI2ODkzQDRkYTcxZWIyNTMyMTNiaYTBjOTk1ZGYxOTcxNDkzZmVlQDM1NTJhYTVmZDZkNWY2ZTZkNTM1OTE3ZTczNzU1OWY5MTJjMGYzNGQ4YWFmYmI1NjM1MWY5MTdk"
      };
      argue.nickName = "哈哈";
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
		
		startService(){
			this.infoHW()
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
                //            	alert('name: ' + e.name)
                //            	alert('message: ' + e.message)
              }
              self.hwInfo = res;
              localStorage.setItem('hw_hwInfo',res1)
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
      let Url = this.baseUrl;
//    let Url = "http://api.995120.cn/hww/";
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
//                	alert('128:   ' + JSON.stringify(res))
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
            name: "HomePage"
          });
        }
      }
    }
  }
};

//  http://122.225.207.105:2130/hwh/
//  http://api-test.995120.cn/hwh/
//  http://api-test.995120.cn/hwh/?reportId=36185
</script>

<style lang="scss">
.login_wrap {
  display: flex;
  justify-content: center;
  // align-items: center;
  /*padding-top: 120px;*/
  height: 100%;
  background-color: #fff;
  box-sizing: border-box;
  overflow: hidden;
  .box {
    width: 90px;
    height: 90px;
    margin-top: 120px;
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
.login_wrap .start_service img{
	width: 100%;
}
.login_wrap .service_btn{
	position: fixed;
	bottom: 20px;
	width: 96%;
	margin-left: 3%;
	text-align: center;
}
.login_wrap .service_btn p{
	font-size: 0.36rem;
	text-align: left;
	margin-bottom: 12px;
}
.login_wrap .service_btn span{
	display: inline-block;
	width: 50%;
	height: 36px;
	line-height: 36px;
	background: #FB6522;
	color: #ffffff;
	font-size: 14px;
	border-radius: 6px;
}
</style>
