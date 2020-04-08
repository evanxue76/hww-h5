<template>
	<div class="report_interpret">
		<div class="hospital_pic">
			<img src="../../assets/image/pic_analyse_hospital.jpg"/>
		</div>
		<div class="hospital_introduction">
			针对采集的心电图，由中日友好医院、中国人民解放军总医院（301医院）、阜外医院等医院的医生提供人工读图服务。
		</div>
		<div class="">
			<div class="major_doctor" @click="toDoctor">
				<div class="title">
					<div class="">
						专业医生解读
					</div>
					<div class="">
						{{majorData.vipPrice | priceFilter}}元/次
					</div>
				</div>
				<div class="explain">
					由系统智能分配主治及以下医生提供解读服务
				</div>
			</div>
			<div class="expert_doctor" @click="expertDoctor">
				<div class="title">
					<div class="">
						专家医生解读
					</div>
					<div class="">
						{{expertData.vipPrice | priceFilter}}元/次
					</div>
				</div>
				<div class="explain">
					由系统智能分配副主任及以上医生提供解读服务
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
				majorData: {},
				expertData: {}
			}
		},
		created(){
			this.obtionPrice()
			localStorage.setItem('hw_service_type','报告解读')
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
						'serviceType': 3
					}
				}
				util.ajax.post(Url,params).then(function(res){
					console.log(res)
					self.majorData = res.data.body.data[0]
					self.expertData = res.data.body.data[1]
				}).catch(function(err){
					console.log(err)
				})
			},
			toDoctor(){
				let price = '￥' + (this.majorData.vipPrice/100).toFixed(2)
				localStorage.setItem('hw_picArt_price',price)
				localStorage.setItem('hw_docId','')
				localStorage.setItem('hw_titleId',1)
				let hw_fromPath = sessionStorage.getItem('hw_fromPath')
				if (hw_fromPath == 1) {
					this.$router.push({
						name: 'Upload',
						params: {
							type: 1
						}
					})
				}else{
					this.$router.push({
						name: 'ChoiceEcg'
					})
				}
			},
			expertDoctor(){
				let price = '￥' + (this.expertData.vipPrice/100).toFixed(2)
				localStorage.setItem('hw_picArt_price',price)
				localStorage.setItem('hw_docId','')
				localStorage.setItem('hw_titleId',3)
				let hw_fromPath = sessionStorage.getItem('hw_fromPath')
				if (hw_fromPath == 1) {
					this.$router.push({
						name: 'Upload',
						params: {
							type: 1
						}
					})
				}else{
					this.$router.push({
						name: 'ChoiceEcg'
					})
				}
			}
		},
		filters: {
			priceFilter(val){
				return (val/100).toFixed(2)
			}
		}
	}
</script>

<style>
	.report_interpret{
		width: 100%;
		height: 100%;
	}
	.hospital_pic img{
		width: 100%;
	}
	.report_interpret .hospital_introduction{
		width: 94%;
		margin-left: 3%;
		line-height: 20px;
		margin-top: 16px;
		font-size: 14px;
		color: #333333;
		font-weight: bold;
	}
	.report_interpret .major_doctor{
		width: 94%;
		height: 90px;
		background: linear-gradient(66deg, #67b2df, #8fc8e8);
		margin-left: 3%;
		border-radius: 5px;
		margin-top: 60px;
	}
	
	.report_interpret .expert_doctor{
		width: 94%;
		height: 90px;
		background: linear-gradient(66deg, #ff6e28, #ff9737);
		margin-left: 3%;
		border-radius: 5px;
		margin-top: 18px;
	}
	.report_interpret .title{
		width: 94%;
		margin-left: 3%;
		display: flex;
		justify-content: space-between;
		font-size: 0.43rem;
		color: #ffffff;
		font-weight: bold;
		padding-top: 20px;
	}
	.report_interpret .explain{
		width: 94%;
		margin-left: 3%;
		margin-top: 16px;
		font-size: 0.37rem;
		color: #ffffff;
	}
</style>