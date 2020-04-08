<template>
  <div class="set_up">
    <section>
      <van-cell-group>
        <!--<van-cell
          size="large"
          class="record"
          title="手机号码"
          is-link
          :value="mobil"
          @click="go_to_tel"
        />-->
        <van-cell
          size="large"
          class="order"
          title="清空个人健康数据"
          is-link
          @click="clear_data"
        />
      </van-cell-group>
    </section>
    <section class="btn">
      <button @click="cancellationClick">注销账户</button>
    </section>
    <section class="cancellation_wrap" v-if="cancellationShow">
      <div class="cancellation_box">
        <!--<p class="pic">
          <img src="../../assets/image/pic_tip.png" />
        </p>-->
        <div class="art">
          <p>注销账户将会清除您保存的以下数据：</p>
          <p>1.所有健康档案数据</p>
          <p>2.所有心电数据</p>
          <p>3.所有用户信息和账号信息</p>
          <p>4.您的所有数据将会丢失</p>
          <p class="last">您如需再次重新使用本服务需重新注册账号</p>
        </div>
        <div class="cancellation_btn">
          <span class="cancle" @click="cancleCancellation">取消</span>
          <span @click="confirmCancellation">确定</span>
        </div>
      </div>
    </section>

    <section class="cancellation_wrap" v-if="clearShow">
      <div class="cancellation_box">
        <!--<p class="pic">
          <img src="../../assets/image/pic_tip.png" />
        </p>-->
        <div class="art">
          <p>清空个人健康数据将会清除您保存的以下数据：</p>
          <p>1.所有健康档案数据</p>
          <p>2.所有心电数据</p>
        </div>
        <div class="cancellation_btn">
          <span class="cancle" @click="cancleClear">取消</span>
          <span @click="confirmClear">确定</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
	import util from "../../lib/util";
	import globals from '../../lib/global'
	
	export default {
		data() {
			return {
				mobil: '',
				cancellationShow: false,
				clearShow: false,
				hwInfo: {},
      	userInfo: {},
      	hw_user_message: {},
      	baseUrl: ''
			}
		},
		created(){
			let host = globals.developmentUrl.host1
			let obj = {
				'http://192.168.9.136:2010/hww/': 'http://api-test.995120.cn/hww/',
				'http://api-test.995120.cn/hww/': 'http://api-test.995120.cn/hww/',
				'http://api.995120.cn/hww/': 'http://api.995120.cn/hww/'
			}
			this.baseUrl = obj[host]
			
			let userData = localStorage.getItem("hw_user_message");
    	this.hw_user_message = JSON.parse(userData);
			this.get_mobil();
		},
		methods: {
			// 跳转绑定页面
			go_to_tel() {
		      this.$router.push({
		        name: "Binding_tel",
		        params: {
		          type: this.mobil === "未绑定" ? 2 : 1,
		          mobil: this.mobil === "未绑定" ? "" : this.mobil
		        }
		      });
		    },
		    // 查询用户绑定手机号
		    async get_mobil() {
		      let Url = "",
		        params = {
		          reqHead: {
		            functionId: "HWW002014003"
		          },
		          body: {
		            userNo: this.hw_user_message.userNo
		          }
		        };
		      try {
		        let res = await util.ajax.post(Url, params);
		        console.log(res);
		        if (res.data.respHead.respCode === "000") {
		          this.mobil = res.data.body.data ? res.data.body.data : "未绑定";
		        } else {
		          this.$toast(`${res.data.respHead.respMsg}`);
		        }
		      } catch (e) {
		        console.log(e);
		        if (e.message.includes("Network")) {
		          this.$toast("网络连接错误，请检查网络连接，再重新尝试!");
		        } else {
		          this.$toast(`error： ${e.message}`);
		        }
		      }
		    },
			clear_data(){
				this.clearShow = true
			},
			cancleClear(){
				this.clearShow = false
			},
			confirmClear(){
				let self = this
				let Url = ''
				let params = {
					"reqHead": {
						'functionId': 'HWW002014004'
					},
					"body": {
						'hwOpenId': this.hw_user_message.hwOpenId
					}
				}
				util.ajax.post(Url,params).then(function(res){
					console.log(res)
					//alert(JSON.stringify(res))
					if(res.data.respHead.respCode == '000'){
						
						self.clearShow = false
						
						self.getInfo()
//						self.$router.push({
//							path: '/'
//						})
					}
					
				}).catch(function(err){
					console.log(err)
				})
			},
			
			
			getInfo() {
	      let self = this;
	      let hwInfo = JSON.parse(localStorage.getItem('hw_hwInfo'))
	      
	      let Url = this.baseUrl;
//	      let Url = "http://api.995120.cn/hww/";
	      let params = {
	        body: {
	          hwOpenId: hwInfo.openId,
	          nickName: hwInfo.displayName,
	          photo: hwInfo.photoUrl
	        },
	        reqHead: {
	          appId: "com.helowin.hm505h5",
	          version: "1.0.0",
	          functionId: "HWW001001004"
	        }
	      };
	      this.$http.post(Url, params).then(function(res) {
	          //alert('175:   ' + JSON.stringify(res))
	          self.userInfo = res.data.body.data;
	          self.userInfo.hwOpenId = hwInfo.openId;
	          self.userInfo.nickName = hwInfo.displayName;
	          self.userInfo.photo = hwInfo.photoUrl;
	          let userData = JSON.stringify(self.userInfo);
	          //alert('182:  ' + userData)
	          localStorage.setItem("hw_user_message", userData);
	          localStorage.removeItem('hw_isPopup')
	          self.$toast('数据清空成功')
	          self.obtainDataAgain()
	        })
	        .catch(function(err) {
	          if (err.message.includes("Network")) {
	            location.reload();
	          }
	        });
	    },
	    obtainDataAgain(){
	    	let userData = localStorage.getItem("hw_user_message");
			  this.hw_user_message = JSON.parse(userData);
			  this.get_mobil();
	    },
			
			
			cancellationClick(){
				this.cancellationShow = true
			},
			cancleCancellation(){
				this.cancellationShow = false
			},
			confirmCancellation(){
				let self = this
				let Url = ''
				let params = {
					"reqHead": {
						'functionId': 'HWW002014005'
					},
					"body": {
						'hwOpenId': this.hw_user_message.hwOpenId
					}
				}
				util.ajax.post(Url,params).then(function(res){
					console.log(res)
					self.$toast('账号注销成功')
					self.cancellationShow = false
				}).catch(function(err){
					console.log(err)
				})
			}
		}
	}
</script>

<style>
.set_up .btn {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  margin: auto;
  color: #ffffff;
  font-size: 16px;
  text-align: center;
}
.set_up .btn button {
  background: #e95f5f;
  width: 180px;
  height: 38px;
  line-height: 38px;
  border: none;
  border-radius: 6px;
}
.set_up .cancellation_wrap {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.2);
}
.set_up .cancellation_box {
  position: absolute;
  bottom: 30px;
  width: 90%;
  margin-left: 5%;
  background: #ffffff;
  border-radius: 8px;
}
.set_up .pic {
  text-align: center;
}
.set_up .cancellation_box img {
  width: 50px;
  padding-top: 16px;
}
.set_up .art {
  width: 90%;
  margin-left: 5%;
  font-size: 0.38rem;
  line-height: 0.6rem;
  padding-top: 24px;
}
.set_up .last {
  margin-top: 12px;
}
.set_up .cancellation_btn {
  font-size: 0.5rem;
  text-align: center;
  margin-top: 16px;
  padding-bottom: 10px;
}
.set_up .cancellation_btn span {
  display: inline-block;
  width: 50%;
  padding: 3px 0;
  color: #fb6522;
}
.set_up .cancellation_btn .cancle {
  box-sizing: border-box;
  border-right: 1px solid lightgray;
}
.set_up .van-icon-arrow:before{
	color: #b2b2b2;
	font-size: 18px;
}
.set_up .van-hairline--top-bottom::after, .set_up .van-hairline-unset--top-bottom::after{
	border-width: 0 0;
}
</style>
