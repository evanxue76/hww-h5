<template>
	<div class="report_interpret">
		<div class="hospital_pic">
			<img src="../../assets/image/pic_analyse_hospital.jpg"/>
		</div>
		<div class="hospital_introduction">
			由入驻到国家远程医疗与互联网医学中心的中日友好医院、中国人民解放军总医院（301医院）、北京医院等三甲医院及各省、市级医院心电专业医生和心内科专家提供报告解读服务。
		</div>
		<div class="list_title">
			<span @click="searchHospital">查看服务医院列表</span>
		</div>
		<!--<div class="rapid_wrap" @click="toDoctor(rapidData)">
			<span class="recommend">推荐</span>
			<div class="rapid_box">
				<div class="art_box">
					<p class="rapid_title">极速解读</p>
					<p class="rapid_price">{{rapidData}}元<span class="rapid_once">/次</span></p>
				</div>
				<img src="../../assets/image/pic_analyse_tip.png"/>
			</div>
			<div class="Instructions_icon">
				<img src="../../assets/image/icon_arrow_gray.png"/>
			</div>
		</div>-->
		<div class="major_wrap">
			<!--<div class="major">专业</div>-->
			<div class="major_art">专家解读</div>
			<div class="">
				<van-cell value="内容" is-link @click='expertDoctor(middleData,1)'>
				  <template slot="title">
				    <span class="middle">中级</span>
				    <span class="level">主治医生</span>
				  </template>
				  <template slot="default">
					    <span class="custom-text">{{middleData}}元</span>
					    <span class="once">/次</span>
					</template>
				</van-cell>
				<van-cell title="单元格" is-link @click='expertDoctor(seniorData,2)'>
					<template slot="title">
					    <span class="senior">高级</span>
					    <span class="level">副主任/主任</span>
					</template>
					<template slot="default">
					    <span class="custom-text">{{seniorData}}元</span>
					    <span class="once">/次</span>
					</template>
				</van-cell>
				<van-cell value="内容" is-link @click='expertDoctor(famousData,3)'>
				  <template slot="title">
				    <span class="famous">著名</span>
				    <span class="level">资深专家</span>
				  </template>
				  <template slot="default">
					    <span class="custom-text">{{famousData}}元</span>
					    <span class="once">/次</span>
					</template>
				</van-cell>
			</div>
		</div>
		
		<div class="service_phone">
			<span>客服热线：</span>
			<span>
				<a class="phone_num" href="tel:18937086381">400-0785-120</a>
			</span>
		</div>
		
		<!--<div class="">
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
		</div>-->
	</div>
</template>

<script>
	import util from '../../lib/util'
	export default {
		data(){
			return {
				majorData: {},
				expertData: {},
				rapidData: '',
				middleData: '',
				seniorData: '',
				famousData: ''
			}
		},
		created(){
			this.obtionPrice()
			localStorage.setItem('hw_service_type','心电报告人工解读')
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
					res.data.body.data.map(item => {
						let val = item.titleId
						switch (val){
							case 0:
								self.rapidData = item.commonPrice/100
								break;
							case 1:
								self.middleData = item.commonPrice/100
								break;
							case 2:
								self.seniorData = item.commonPrice/100
								break;
							case 3:
								self.famousData = item.commonPrice/100
								break;
							default:
								break;
						}
					})
					self.majorData = res.data.body.data[0]
					self.expertData = res.data.body.data[1]
				}).catch(function(err){
					console.log(err)
				})
			},
			toDoctor(rapidData){
				console.log(rapidData)
				let price = '￥' + rapidData.toFixed(2)
				localStorage.setItem('hw_picArt_price',price)
				localStorage.setItem('hw_docId','')
				localStorage.setItem('hw_titleId',0)
				localStorage.setItem('hw_unscramble_type',0)
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
			expertDoctor(priceData,val){
				let price = '￥' + priceData.toFixed(2)
				localStorage.setItem('hw_picArt_price',price)
				localStorage.setItem('hw_docId','')
				localStorage.setItem('hw_titleId',val)
				localStorage.setItem('hw_unscramble_type',1)
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
			searchHospital(){
				this.$router.push({
					name: 'HospitalList'
				})
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
		background: #FAFAFA;
	}
	.hospital_pic img{
		width: 100%;
	}
	.report_interpret .hospital_introduction{
		width: 94%;
		margin-left: 3%;
		line-height: 20px;
		margin-top: 0.1rem;
		font-size: 14px;
		color: #333333;
		font-weight: bold;
	}
	.report_interpret .rapid_wrap{
		position: relative;
		width: 94%;
		height: 2.24rem;
		margin-left: 3%;
		background: #ffffff;
		border-radius: 0.14rem;
		margin-top: 0.48rem;
	}
	.report_interpret .recommend{
		position: absolute;
		top: 0;
		left: 0;
		display: inline-block;
		font-size: 0.32rem;
		color: #FFFFFF;
		background: #FB6522;
		padding: 0 0.2rem;
		height: 0.55rem;
		line-height: 0.585rem;
		border-top-left-radius: 0.14rem;
		border-bottom-right-radius: 0.14rem;
	}
	.report_interpret .rapid_box{
		display: inline-block;
		width: 80%;
		margin-left: 5%;
		padding-top: 0.68rem;
	}
	.report_interpret .art_box{
		display: flex;
		justify-content: space-between;
	}
	.report_interpret .rapid_box img{
		width: 100%;
		vertical-align: top;
		margin-top: 0.14rem;
	}
	.report_interpret .rapid_title{
		font-size: 0.48rem;
		color: #333333;
	}
	.report_interpret .rapid_price{
		font-size: 0.43rem;
		color: #FB6522;
	}
	.report_interpret .rapid_once{
		font-size: 0.32rem;
		color: #FB6522;
	}
	.report_interpret .Instructions_icon{
		display: inline-block;
		width: 10%;
		height: 2.24rem;
		line-height: 2.24rem;
	}
	.report_interpret .Instructions_icon img{
		width: 0.5rem;
		vertical-align: top;
		margin-top: 0.32rem;
		margin-left: 0.55rem;
	}
	.report_interpret .major_wrap{
		position: relative;
		margin-top: 0.43rem;
		width: 94%;
		height: 5.12rem;
		background: #FFFFFF;
		border-radius: 0.14rem;
		margin-left: 3%;
		border: 1px solid #F3F3F3;
	}
	.report_interpret .major{
		position: absolute;
		top: 0;
		left: 0;
		display: inline-block;
		font-size: 0.32rem;
		color: #FFFFFF;
		background: #5fb7ec;
		/*vertical-align: top;*/
		padding: 0 0.2rem;
		height: 0.55rem;
		line-height: 0.585rem;
		border-top-left-radius: 0.14rem;
		border-bottom-right-radius: 0.14rem;
		
	}
	.report_interpret .major_art{
		font-size: 0.48rem;
		color: #333333;
		padding-top: 0.68rem;
		margin-left: 5%;
	}
	.report_interpret .middle{
		display: inline-block;
		font-size: 0.32rem;
		height: 0.5rem;
		line-height: 0.5rem;
		padding: 0 0.16rem;
		background: #e0f0fa;
		color: #5FB7EC;
		border-radius: 0.11rem;
		vertical-align: middle;
	}
	.report_interpret .senior{
		display: inline-block;
		font-size: 0.32rem;
		height: 0.5rem;
		line-height: 0.5rem;
		padding: 0 0.16rem;
		background: #fde1d2;
		color: #fb6522;
		border-radius: 0.11rem;
		vertical-align: middle;
	}
	.report_interpret .famous{
		display: inline-block;
		font-size: 0.32rem;
		height: 0.5rem;
		line-height: 0.5rem;
		padding: 0 0.16rem;
		background: #fdedd2;
		color: #fa951d;
		border-radius: 0.11rem;
		vertical-align: middle;
	}
	.report_interpret .level{
		display: inline-block;
		font-size: 0.38rem;
		color: #333333;
		margin-left: 6px;
		vertical-align: middle;
	}
	.report_interpret .custom-text{
		font-size: 0.45rem;
		color: #333333;
	}
	.report_interpret .once{
		font-size: 0.32rem;
		color: #333333;
	}
	.report_interpret .van-icon-arrow:before{
		font-size: 18px;
		color: #b2b2b2;
	}
	.report_interpret .list_title{
		text-align: center;
		color: #FB6522;
		margin-top: 10px;
	}
	.report_interpret .list_title span{
		display: inline-block;
		padding: 6px 10px;
		background: #F0F0F0;
		border-radius: 20px;
		letter-spacing: 1px;
	}
	.report_interpret .service_phone{
		position: fixed;
		bottom: 20px;
		left: 0;
		right: 0;
		margin: auto;
		text-align: center;
		color: #888888;
		font-size: 15px;
	}
	.report_interpret .phone_num{
		color: #FB6522;
	}
	
	
	
	
	
	
	/*.report_interpret .major_doctor{
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
	}*/
</style>