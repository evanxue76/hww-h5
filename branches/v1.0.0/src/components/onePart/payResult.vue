<template>
	<div class="payResult">
		<div class="blank" v-if="success == 1">
			
		</div>
		<div class="" v-else-if="success == 2">
			<img :src="ok"/>
			<p class="success">{{successContent}}</p>
			<p class="back">{{count}}s后返回</p>
		</div>
		<div class="" v-else-if="success == 3">
			<img :src="fail"/>
			<p class="success">{{failContent}}</p>
			<p class="back">{{count}}s后返回</p>
		</div>
	</div>
</template>

<script>
	import utils from '../../lib/utils'
	export default {
		data(){
			return {
				ok: require('../../assets/image/pic_ok.png'),
				fail: require('../../assets/image/pic_fail.png'),
				count: 5,
				orderId: '',
				success: 1,
				type: '',
				successContent: '',
				failContent: ''
			}
		},
		created(){
			let url = window.location.href
			let typeNum = url.indexOf('type=') + 5
			this.type = url.substring(typeNum,typeNum+1)
			let num = url.indexOf('orderId=') + 8
			this.orderId = url.substring(num)
			this.payStatus()
			if (this.type == 1 || this.type == 2) {
				this.successContent = '支付成功'
				this.failContent = '支付失败'
			}else if (this.type == 3) {
				this.successContent = '服务开通成功'
				this.failContent = '服务开通失败'
			}else if (this.type == 4) {
				this.successContent = '服务续费成功'
				this.failContent = '服务续费失败'
			}else if (this.type == 5) {
				this.successContent = '服务升级成功'
				this.failContent = '服务升级失败'
			}else if (this.type == 6) {
				this.successContent = '套餐续费成功'
				this.failContent = '套餐续费失败'
			}
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
				let Url = 'http://api-test.995120.cn/hww/hwpay/order/status?orderId=' + self.orderId
//				let Url = 'http://api.995120.cn/hww/hwpay/order/status?orderId=' + self.orderId
				setTimeout(function(){
					utils.ajax.get(Url).then(function(res){
						if (res.data.state == 'true') {
							self.$toast.clear()
							self.success = 2
						}else{
							self.$toast.clear()
							self.success = 3
						}
						self.countDown()
					})
				},5000)
			},
		}
	}
</script>

<style lang='scss'>
	.payResult {
		text-align: center;
		img{
			width: 80px;
			height: 80px;
			margin-top: 96px;
		}
		.success{
			font-size: 16px;
			color: #333333;
			margin-top: 40px;
		}
		.back{
			font-size: 14px;
			color: #888888;
			margin-top: 36px;
		}
	}
	.payResult .blank{
		
	}
</style>