<template>
	<div class="doctor_details">
		<div class="doctor_intro">
			<div class="">
				<img :src="doctorData.photo"/>
				<!--<img src="../../assets/image/pic_doctor.png"/>-->
			</div>
			<div class="doctor_introduction">
				<div class="doctor_name">{{doctorData.doctorName}}</div>
				<div>{{doctorData.department}}  {{doctorData.academicTitle}}</div>
				<div>{{doctorData.hospitalName}}</div>
			</div>
		</div>
		<div class="adept">
			擅长：
			<span>{{doctorData.speciality}}</span>
		</div>
		<div class="service">
			<div class="">
				已开通服务
			</div>
			<div class="price_type">
				<div class="consultation">
					<div class="service_type">
						<img src="../../assets/image/icon_ecg.png" v-if="serviceArr[0].serviceName=='心电图解读'"/>
						<img src="../../assets/image/icon_onlinetalk.png" v-else/>
						<p class="service_name">{{serviceArr[0].serviceName}}</p>
					</div>
					<div class="service_price">
						￥{{serviceArr[0].commonPrice | priceFilter}}
					</div>
				</div>
				
				<div class="consultation pic_art" v-if="serviceArr.length==2">
					<div class="service_type">
						<img src="../../assets/image/icon_onlinetalk.png" v-if="serviceArr[1].serviceName=='图文咨询'" />
						<img src="../../assets/image/icon_ecg.png" v-else/>
						<p class="service_name">{{serviceArr[1].serviceName}}</p>
					</div>
					<div class="service_price">
						￥{{serviceArr[1].commonPrice | priceFilter}}
					</div>
				</div>
			</div>
		</div>
		<div class="submit" @click="submit">
			立即咨询
		</div>
	</div>
</template>

<script>
	import util from '../../lib/util'
	export default{
		data(){
			return {
				doctorData: {
					'doctorName': '卢喜烈',
					'department': '心内科',
					'academicTitle': '主任医师',
					'hospitalName': '中国人民解放军总医院',
					'speciality': '心律失常、房颤、房早、室早、心律失常、房颤',
					
				},
				serviceArr: []
			}
		},
		created(){
			if (this.$route.params.item) {
				this.doctorData = this.$route.params.item
				localStorage.setItem('hw_doctorData',JSON.stringify(this.$route.params.item))
			}else{
				this.doctorData = JSON.parse(localStorage.getItem('hw_doctorData'))
			}
			if (this.$route.params.item != undefined) {
				this.serviceArr = this.$route.params.item.services
				localStorage.setItem('hw_serviceArr',JSON.stringify(this.$route.params.item.services))
			}else{
				this.serviceArr = JSON.parse(localStorage.getItem('hw_serviceArr'))
			}
			
			
//			this.obtionData()
			localStorage.setItem('hw_service_type','图文咨询')
		},
		methods: {
			obtionData(){
				let self = this
				let Url = ''
				let params = {
					"reqHead": {
						'functionId': 'HWW002012001'
					},
					"body": {
						'areaId': 330106000000,
						'cityId': 330100000000,
						'doctorName': '',
						'isDoctor': 0,
						'pageNum': 0,
						'pageSize': 6
					}
				}
				util.ajax.post(Url,params).then(function(res){
					console.log(res)
				})
			},
			submit(){
				let id = this.doctorData.id
				let price = ''
				if (this.serviceArr.length == 1) {
					price = '￥' + (this.serviceArr[0].commonPrice/100).toFixed(2)
				}else{
					price = '￥' + (this.serviceArr[1].commonPrice/100).toFixed(2)
				}
				localStorage.setItem('hw_picArt_price',price)
				localStorage.setItem('hw_docId',id)
				localStorage.setItem('hw_titleId','')
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
	.doctor_details{
		width: 100%;
		height: 100%;
		background: #f2f2f2;
	}
	.doctor_details .doctor_intro{
		display: flex;
		background: #ffffff;
		margin-top: 16px;
		border-bottom: 1px solid lightgray;
	}
	.doctor_details .doctor_intro img{
		width: 1.6rem;
		height: 1.6rem;
		margin-left: 16px;
	}
	.doctor_details .doctor_introduction{
		font-size: 0.37rem;
		line-height: 0.58rem;
		margin-left: 16px;
		padding-bottom: 16px;
	}
	.doctor_details .doctor_introduction .doctor_name{
		font-size: 0.43rem;
	}
	.doctor_details .adept{
		background: #ffffff;
		font-size: 0.37rem;
		color: #888888;
		padding: 16px;
		line-height: 0.5rem;
	}
	.doctor_details .service{
		background: #ffffff;
		margin-top: 8px;
		padding: 16px 16px 20px;
		font-size: 0.43rem;
	}
	.doctor_details .service_type{
		width: 2.88rem;
		height: 2.77rem;
		border: 1px solid #cccccc;
		border-radius: 6px;
	}
	.doctor_details .consultation{
		margin-top: 16px;
		text-align: center;
	}
	.doctor_details .service_type img{
		width: 1.17rem;
		height: 1.17rem;
		margin-top: 0.43rem;
	}
	.doctor_details .service_name{
		font-size: 0.43rem;
		color: #333333;
		margin-top: 0.32rem;
	}
	.doctor_details .service_price{
		width: 2.88rem;
		color: #FB6522;
		font-size: 0.43rem;
		margin-top: 14px;
	}
	.doctor_details .submit{
		position: fixed;
		height: 46px;
		line-height: 46px;
		background: #FB6522;
		color: #FFFFFF;
		font-size: 16px;
		left: 0;
		right: 0;
		bottom: 0;
		text-align: center;
	}
	.doctor_details .price_type{
		display: flex;
	}
	.doctor_details .pic_art{
		margin-left: 3%;
	}
</style>