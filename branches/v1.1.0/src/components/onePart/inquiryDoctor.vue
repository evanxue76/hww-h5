<template>
	<div class="inquiry_doctor">
		<div class="wrap" @click="toReport">
			<div class="" style="margin-top: 26px; margin-left: 10px;">
				<img src="../../assets/image/icon_ask_analyse.png"/>
			</div>
			<div class="" style="width: 100%; margin-top: 16px;">
				<div class="box_title">
					<div class="inquiry_type">
						报告解读
					</div>
					<div class="inquiry_price">
						{{data.chartPrice | priceFilter}}元/次  起
					</div>
				</div>
				<div class="detail_intro">
					针对采集的心电图，医生提供人工读图服务，由301医院、阜外医院、中日友好医院提供服务，按次收费。
				</div>
			</div>
		</div>
		
		<div class="wrap" @click="toDoctorList">
			<div class="" style="margin-top: 26px; margin-left: 10px;">
				<img src="../../assets/image/icon_ask_onlinetalk.png"/>
			</div>
			<div class="" style="width: 100%; margin-top: 16px;">
				<div class="box_title">
					<div class="inquiry_type">
						图文咨询
					</div>
					<div class="inquiry_price">
						{{data.ecgPrice | priceFilter}}元/次  起
					</div>
				</div>
				<div class="detail_intro">
					由心内科医生基于单导心电图提供24小时的图文咨询服务。
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import util from '../../lib/util'
	export default {
		data(){
			return {
				data: {}
			}
		},
		created(){
			this.obtionPrice()
		},
		methods: {
			obtionPrice(){
				let self = this
				let Url = ''
				let params = {
					"reqHead": {
						'functionId': 'HWW002009003'
					},
					"body": {
						'titleId': 1
					}
				}
				util.ajax.post(Url,params).then(function(res){
					console.log(res)
					self.data = res.data.body.data
				}).catch(function(err){
					console.log(err)
				})
			},
			toDoctorList(){
				this.$router.push({
					name: 'DoctorList'
				})
			},
			toReport(){
				this.$router.push({
					name: 'ReportInterpret'
				})
			},
		},
		filters: {
			priceFilter(val){
				return (val/100).toFixed(2)
			}
		}
	}
</script>

<style>
	.inquiry_doctor{
		height: 100%;
		width: 100%;
		background: #F2F2F2;
		padding-top: 16px;
	}
	.inquiry_doctor .wrap{
		display: flex;
		width: 94%;
		height: 118px;
		margin-left: 3%;
		background: #FFFFFF;
		border-radius: 6px;
		margin-bottom: 16px;
	}
	.inquiry_doctor img{
		width: 2.2rem;
		height: 2.2rem;
	}
	.inquiry_doctor .box_title{
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
	.inquiry_doctor .inquiry_type{
		font-size: 0.48rem;
		color: #333333;
		margin-left: 12px;
	}
	.inquiry_doctor .inquiry_price{
		font-size: 0.42rem;
		color: #Fb6522;
		margin-right: 12px;
	}
	.inquiry_doctor .detail_intro{
		font-size: 0.37rem;
		color: #888888;
		line-height: 0.52rem;
		margin-left: 12px;
		margin-right: 12px;
		margin-top: 18px;
		padding-bottom: 20px;
	}
</style>