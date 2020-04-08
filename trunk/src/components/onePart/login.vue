<template>
	<div class="login_wrap">
		<div class="box" v-if="loginShow">
			<img :src="pic_logo" alt />
			<div class="tips">正在加载....</div>
		</div>
		<div class="start_service" v-if="serviceShow">
			<img src="../../assets/image/pic_servicedetail.png" />
			<div class="service_btn">
				<span @click="isOk=true">开启服务</span>
				<p class="footerTips">本服务由<u><a href="http://www.ntmchc.cn/ucenter/home/main.do">国家远程医疗与互联网医学中心</a></u>与浙江好络维医疗技术有限公司共同提供</p>
			</div>
		</div>
		<!-- 确认提示 -->
		<div class="device_teaching bind_mobile" v-show="isOk">
			<div class="binding_box">
				<div class="content">
					ECG心电测量服务由国家远程医疗与互联网医学
					中心、浙江好络维医疗技术有限公司共同提
					供。<br>
					本服务属于健康管理服务，不作为临床诊断依
					据，不于医疗目的，不能代替传统的医疗诊
					断方式。
				</div>
				<div class="bind_btn">
					<span class="cancle_btn" @click="isOk=false">取消</span>
					<span @click="areYouSure">确定</span>
				</div>
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
			// 确认
			areYouSure(){
				localStorage.setItem('hw_startService','a')
				 this.infoHW();
//				this.test();
				// this.$router.push({
				// 	name: "Agreement"
				// });
			},
			test() {
				let Url = window.location.href;
				this.Url = Url;
				let argue = {
					isHwProtocol: 0,
					userNo: 998, //981   985
					managerNo: 923, //906   910
					regMonth: 18,
					hwOpenId: "MDFAMTAxMTI2ODkzQDI5NWRmNmE5MmNmZGM0MDdlN2Y1NDM1ODRlZDA4NzFkQDkzZTY2MzA2YWRlOTc1ZDlkMmMzNmY4NmMwMTcyYTMxYjlkMGU0YWUwY2U3NzIyYTBhYjc4ZTc0"
//					hwOpenId: 22
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
				// this.$router.push({
				// 	name: "HomePage"
				// });
				this.$router.push({
					name: "Agreement"
				});
			},

			startService() {
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
								localStorage.setItem('hw_hwInfo', res1)
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

			&>img {
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

	.login_wrap .start_service img {
		width: 100%;
	}

	.login_wrap .service_btn {
		position: fixed;
		bottom: 12px;
		margin:0 auto; 
		left:0; 
		right:0; 
		text-align: center;
	}

	.login_wrap .service_btn span {
		display: inline-block;
		width: 180px;
		height: 36px;
		line-height: 36px;
		background: #FB6522;
		color: #ffffff;
		font-size: 14px;
		border-radius: 25px;
		margin-bottom: 12px;
	}

	.footerTips {
		font-size: 12px;
		color: #888;
		line-height: 22px;
		width: 239px;
		margin: 0 auto;
	}
	.footerTips a{
		color: #888;
	}
	.device_teaching {
		position: fixed;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.4);
		z-index: 99;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		font-size: 14px;
		color: #ffffff;

		.binding_box {
			position: fixed;
			bottom: 0.64rem;
			width: 90%;
			color: #333333;
			background-color: #fff;
			padding: 24px 0;
			box-sizing: border-box;
			border-radius: 0.21rem;

			.bd_title {
				text-align: center;
				font-size: 22px;
			}

			.bd_input {
				font-size: 24px;
				position: relative;
				margin: 0 0.43rem;
				margin-top: 0.6rem;
				height: 45px;
				border-bottom: 1px solid #ccc;
				box-sizing: border-box;

				input {
					border: 0;
					padding-left: 16px;
					// padding-bottom: 13px;
					width: 100%;
					height: 100%;
					box-sizing: border-box;

					&::-webkit-input-placeholder {
						/* Chrome/Opera/Safari */
						color: #888;
						font-size: 14px;
					}
				}

				.placeholder {
					display: inline-block;
					padding-top: 5px;
					color: #e95f5f;
					font-size: 12px;
				}
			}

			.hqyzm {
				position: absolute;
				right: 8px;
				top: 18px;
				font-size: 14px;
				color: #fb6522;
				border: 0;
				background-color: transparent;
			}

			.huoquctive {
				color: #ccc;
			}

			.bd_tips {
				margin: 0 0.43rem;
				font-size: 14px;
				line-height: 20px;
				margin-top: 0.5rem;
			}

			.bd_btn {
				color: #fff;
				margin: 0 32px;
				font-size: 16px;
				height: 48px;
				line-height: 48px;
				margin-top: 26px;
				// width: 100%;
				box-sizing: border-box;
				background-color: #fb6522;
				text-align: center;

				&>button {
					border: 0;
					background-color: transparent;
				}
			}

			.bd_btn_active {
				background-color: #ccc;
			}
		}

		.sketch {
			width: 200px;
			height: 200px;
			text-align: center;
			line-height: 200px;
			color: #333333;
			background-color: #fff;
			margin-bottom: 20px;
			z-index: 1000;
		}

		.tips {
			margin-bottom: 20px;
			color: #ffffff;
		}

		.gogo_pay {
			height: 36px;
			background-color: #fb6522;
			font-size: 16px;
			color: #fff;
			width: 58%;
			border-radius: 6px;
			text-align: center;
			line-height: 36px;
			margin-bottom: 24px;
			z-index: 1000;
		}

		.already_pay {
			font-size: 16px;
			color: #fff;
			text-decoration: underline;
			z-index: 1000;
		}

		.bd_close {
			position: absolute;
			right: 16px;
			top: 10px;
		}

		.bind_btn {
			color: #FB6522;
			font-size: 16px;
			text-align: center;
			margin-top: 1.3rem;
		}

		.bind_btn span {
			display: inline-block;
			width: 50%;
			font-weight: bold;
		}
		.cancle_btn{
			box-sizing: border-box;
			border-right: 1px solid #e8e8e8;
		}
		.content{
			padding: 24px;
			color: #333;
			font-size: 14px;
			line-height: 22px;
			padding-bottom: 8px;
			padding-top: 12px;
		}
	}
	.login_wrap .device_teaching .bind_btn {
		margin-top:15px;
	}
</style>
