<template>
	<div class="payResult">
		<div class="blank" v-if="success == 1">
			
		</div>
		<div class="" v-else-if="success == 2">
			<img class="icon" :src="ok"/>
			<p class="success">{{successContent}}</p>
			<!--<p class="back">{{count}}s后返回</p>-->
			<div class="direction" v-if="flag">
				<p v-if="docMessage">
					<span>{{doctorData.doctorName}}   ({{doctorData.academicTitleId | academicFilter}})</span>
					将为您提供心电解读服务
				</p>
				<p v-if="unscrambleType == 0">心电解读报告将在10分钟内发给您</p>
				<p v-else>心电解读报告将在2小时内发给您</p>
				<p>
					请在首页
					<span @click="toAllMessage" class="message">消息中心</span>
					进行查看
				</p>
			</div>
			
			<div class="direction" v-else>
				<p>
					<span>{{doctorData.doctorName}}   ({{doctorData.academicTitleId | academicFilter}})</span>
					将为您提供图文咨询服务
				</p>
			</div>
			<div id="" v-if="docMessage">
				<div class="doctor_intro" @click="toDoctorDetails" v-if="serviceTypeId == 3">
					<div class="">
						<img v-if="doctorData.photo == ''" :src="doctorPhoto"/>
						<img v-else :src="doctorData.photo"/>
					</div>
					<div class="doctor_introduction">
						<div class="doctor_name">{{doctorData.doctorName}}     <span>({{doctorData.academicTitleId | academicFilter}})</span></div>
						<div>{{doctorData.hospitalName}}</div>
					</div>
					<div class="arrow">
						<img src="../../assets/image/icon_arrow_gray.png"/>
					</div>
					
				</div>
				
				<div class="doctor_intro" @click="consult" v-else>
					<div class="" @click="toDoctorDetails">
						<img src="../../assets/image/pic_doctor.png"/>
					</div>
					<div class="doctor_introduction" @click="toDoctorDetails">
						<div class="doctor_name">{{doctorData.doctorName}}     <span>({{doctorData.academicTitleId | academicFilter}})</span></div>
						<div>{{doctorData.hospitalName}}</div>
					</div>
					<div class="btn">
						立即咨询
					</div>
				</div>
			</div>
		</div>
		<div class="" v-else-if="success == 3">
			<img class="icon" :src="fail"/>
			<p class="success">{{failContent}}</p>
			<p class="fail_reason">网络不稳定，请检查网络重新支付</p>
			<!--<p class="back">{{count}}s后返回</p>-->
		</div>
		
		<div class="" v-else-if="success == 4">
			<img class="icon" :src="wait"/>
			<p class="success">{{waitingContent}}</p>
		</div>
		<div class="wait_btn" v-if="success == 4 || success == 3">
			<p><span @click="toHome">返回首页</span></p>
			<p><span @click="toOrderList">查看订单</span></p>
		</div>
		<div class="to_homePage" @click="toHome" v-else>
			<span>返回首页</span>
		</div>
	</div>
</template>

<script>
	import utils from '../../lib/utils'
	import util from '../../lib/util'
	import globals from '../../lib/global'
	export default {
		data(){
			return {
				ok: require('../../assets/image/pic_ok.png'),
				fail: require('../../assets/image/pic_fail.png'),
				wait: require('../../assets/image/waiting.png'),
				doctorPhoto: require('../../assets/image/pic_doctor.png'),
				count: 5,
				orderId: '',
				success: 1,
				type: 1,
				successContent: '',
				failContent: '',
				docId: '',
				flag: false,
				doctorData: {},
				serviceTypeId: '',
				docMessage: false,
				unscrambleType: 0,
				baseUrl: ''
			}
		},
		created(){
			let host = globals.developmentUrl.host1
			let obj = {
				'http://192.168.9.136:2010/hww/': 'http://api-test.995120.cn/hww/hwpay/order/status?orderId=',
				'http://api-test.995120.cn/hww/': 'http://api-test.995120.cn/hww/hwpay/order/status?orderId=',
				'http://api.995120.cn/hww/': 'https://api.995120.cn/hww/hwpay/order/status?orderId='
			}
			this.baseUrl = obj[host]
			let titleId = localStorage.getItem('hw_titleId')
			if (titleId == '') {
				this.flag = false
			}else{
				this.flag = true
			}
			let Url = window.location.href
			try{
				let arr = Url.split("?")[1].split("&");
				let obj = {};
				for (let i of arr) {
					obj[i.split("=")[0]] = i.split("=")[1];    
				}
				this.orderId = obj.orderId
				this.docId = obj.docId
				this.serviceTypeId = obj.serviceTypeId
			}catch(e){
				console.log(e)
			}
			this.unscrambleType = localStorage.getItem('hw_unscramble_type')
			if (this.docId == '') {
				this.docMessage = false
			}else{
				this.docMessage = true
				this.obtionDoctorData()
			}
			
			this.payStatus()
			this.successContent = '支付成功'
			this.failContent = '支付失败'
			this.waitingContent = '支付中...'
		},
		methods: {
			countDown(){
				let self = this
				let count = this.count
				let timer = setInterval(function(){
					self.count = --count
					if (count == 0) {
						clearInterval(timer)
						if (self.type == 1) {
							self.$router.push({
								name: 'EcgReport'
							})
						}else{
							self.$router.push({
								name: 'HomePage'
							})
						}
					}
				},1000)
			},
			payStatus(){
				this.$toast.loading({
					duration: 0,
					mask: true,
					message: '支付中...'
				})
				let self = this
				let Url = this.baseUrl + self.orderId
//				let Url = 'https://api.995120.cn/hww/hwpay/order/status?orderId=' + self.orderId
				setTimeout(function(){
					utils.ajax.get(Url).then(function(res){
						if (res.data.state == 1) {
							self.$toast.clear()
							self.success = 2
						}else if(res.data.state == 2 || res.data.state == 4 || res.data.state == 8){
							self.$toast.clear()
							self.success = 3
						}else if(res.data.state == 0){
							self.$toast.clear()
							self.success = 4
							self.payStatusAgain()
						}
						//self.countDown()
					})
				},5000)
			},
			payStatusAgain(){
				let self = this
				let Url = this.baseUrl + self.orderId
//				let Url = 'https://api.995120.cn/hww/hwpay/order/status?orderId=' + self.orderId
				setTimeout(function(){
					utils.ajax.get(Url).then(function(res){
						if (res.data.state == 1) {
							self.$toast.clear()
							self.success = 2
						}else if(res.data.state == 2 || res.data.state == 4 || res.data.state == 8){
							self.$toast.clear()
							self.success = 3
						}else if(res.data.state == 0){
							self.success = 4
							self.payStatusAgain()
						}
						//self.countDown()
					})
				},5000)
			},
			obtionDoctorData(){
				let self = this
				let Url = ''
				let params = {
					"reqHead": {
						'functionId': 'HWW002012002'
					},
					"body": {
						'id': this.docId    //this.docId    130
					}
				}
				util.ajax.post(Url,params).then(function(res){
					self.doctorData = res.data.body.data
					console.log(res)
				}).catch(function(err){
					console.log(err)
				})
			},
			toAllMessage() {
		      this.$router.push({
		        name: "Msg_list"
		      });
		    },
		    toDoctorDetails(){
		    	this.$router.push({
		    		name: 'DoctorDetails',
		    		params: {
		    			item: this.doctorData
		    		}
		    	})
		    },
		    consult(){
		    	this.$router.push({
			        name: "Im",
			        params: {
			        	type: 1,
			        	docId: this.docId
			        }
			      });
		    },
		    toHome(){
		    	this.$router.push({
		    		name: 'HomePage'
		    	})
		    },
		    toOrderList(){
		    	this.$router.push({
		    		name: 'order'
		    	})
		    }
		},
		filters: {
			academicFilter(val){
				switch (val){
					case 1:
						return '住院医师';
					case 2:
						return '主治医师';
					case 3:
						return '副主任医师';
					case 4:
						return '主任医师';
					case 5:
						return '著名';
					default:
						break;
				}
			}
		}
	}
</script>

<style lang='scss'>
	.payResult {
		text-align: center;
		.icon{
			width: 80px;
			height: 80px;
			margin-top: 60px;
		}
		.success{
			font-size: 16px;
			color: #333333;
			margin-top: 20px;
		}
		.back{
			font-size: 14px;
			color: #888888;
			margin-top: 36px;
		}
	}
	.payResult .to_homePage{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 60px;
		line-height: 60px;
		font-size: 16px;
		color: #FFFFFF;
		background: #FFFFFF;
	}
	.payResult .to_homePage span{
		display: inline-block;
		width: 50%;
		height: 36px;
		line-height: 36px;
		border-radius: 6px;
		background: #FB6522;
	}
	.payResult .direction{
		color: #888888;
		font-size: 14px;
		line-height: 22px;
		margin-top: 32px;
	}
	.payResult .message{
		color: #FB6522;
		border-bottom: 1px solid #FB6522;
	}
	.payResult .doctor_intro{
		display: flex;
		background: #ffffff;
		margin-top: 16px;
		border-top: 1px solid #F5F5F5;
		border-bottom: 1px solid #F5F5F5;
		text-align: left;
		padding-top: 14px;
	}
	.payResult .doctor_intro img{
		width: 1.6rem;
		height: 1.6rem;
		margin-left: 16px;
	}
	.payResult .doctor_introduction{
		font-size: 0.4rem;
		line-height: 0.8rem;
		color: #888888;
		margin-left: 16px;
		padding-bottom: 18px;
	}
	.payResult .doctor_introduction .doctor_name{
		font-size: 0.46rem;
		color: #333333;
	}
	.payResult .doctor_introduction .doctor_name span{
		font-size: 0.4rem;
	}
	.payResult .arrow{
		margin-left: 1.9rem;
	}
	.payResult .arrow img{
		width: 0.46rem;
		height: 0.46rem;
	}
	.payResult .btn{
		font-size: 0.4rem;
		color: #FFFFFF;
		background: #FB6522;
		height: 0.6rem;
		line-height: 0.6rem;
		padding: 0 3px;
		margin-top: 0.5rem;
		margin-left: 1.2rem;
	}
	.payResult .fail_reason{
		font-size: 0.4rem;
		margin-top: 20px;
		color: #888888;
	}
	.payResult .wait_btn{
		position: fixed;
		bottom: 30px;
		left: 0;
		right: 0;
		margin: auto;
		text-align: center;
	}
	.payResult .wait_btn p{
		display: inline-block;
		width: 50%;
	}
	.payResult .wait_btn span{
		display: inline-block;
		width: 60%;
		height: 36px;
		line-height: 36px;
		background: #FB6522;
		color: #ffffff;
		border-radius: 6px;
		font-size: 14px;
	}
</style>