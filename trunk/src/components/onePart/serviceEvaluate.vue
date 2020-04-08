<template>
	<div class="service-evaluate">
		<div class="">
			<p class="evaluate-title">心电报告人工解读</p>
			<div class="doctor-introduce">
				<div v-if="messageData.doctorPhoto==''" class="doctor-photo">
					<img src="../../assets/image/pic_doctor.png"/>
				</div>
				<div v-else class="doctor-photo">
					<img :src="messageData.doctorPhoto"/>
				</div>
				<div class="doctor-message">
					<div class="doctor-box">
						<span class="name">{{messageData.doctorName}}</span>&nbsp;&nbsp;
						<span class="major">{{messageData.doctorAcademicTitle}}</span>
					</div>
					<p class="hospital">{{messageData.doctorHospital}}</p>
				</div>
			</div>
		</div>
		<div class="shdow"></div>
		<div class="score">
			<p class="evaluate-title">服务满意度</p>
			<van-rate :readonly='readonly' class='evaluate-icon' size='24' gutter='12' v-model="rank"/>
			<span class="evaluate-result">{{rank | evaluateFilter}}</span>
		</div>	
		<div class="evaluate-box">
			<textarea :disabled="readonly" placeholder="有什么话想对医生说？" @blur="txblur" @focus="txfocus" v-model="comment" class="evaluate-content" rows="6"></textarea>
		</div>
		<div class="evaluate-btn" v-if="show">
			<span class="confirm" @click="confirm">提交评价</span>
		</div>
	</div>
</template>

<script>
	import util from '../../lib/util'
	export default {
		data(){
			return {
				rank: 0,
				comment: '',
				readonly: false,
				show: true,
				objId: '',
				messageData: {}
			}
		},
		created(){
			this.messageData = this.$route.params.messageData
			this.searchEvaluate()
		},
		methods: {
			// 查询是否已评价
			searchEvaluate(){
				let self = this
				let Url = ''
				let params = {
					"reqHead": {
						'functionId': 'HWW002016002'
					},
					"body": {
						'id': this.messageData.id
					}
				}
				util.ajax.post(Url,params).then(function(res){
					if(res.data.respHead.respCode == '000'){
						self.objId = res.data.body.data.serviceId
						if(res.data.body.data.isAppraise == 0){
							self.readonly = false
							self.show = true
						}else{
							self.readonly = true
							self.show = false
							self.comment = res.data.body.data.appraiseRecord.comment
							self.rank = res.data.body.data.appraiseRecord.rank
						}
					}
					
				}).catch(function(err){
					console.log(err)
				})
			},
			txblur(){
				this.show = true
			},
			txfocus(){
				let self = this
				setTimeout(function(){
					self.show = false
				},800)
			},
			// 提交评论
			confirm(){
				if (this.rank == 0) {
					this.$toast('请选择服务满意度评分')
					return
				}else{
					let userData = localStorage.getItem("hw_user_message");
	    			let hw_user_message = JSON.parse(userData);
	    			let userId = hw_user_message.userNo
					let self = this
					let Url = ''
					let params = {
						"reqHead": {
							'functionId': 'HWW002016001'
						},
						"body": {
							'comment': this.comment,
							'rank': this.rank,
							'docId': this.messageData.doctorId,
							'objId': this.objId,
							'type': 3,
							'userId': userId
						}
					}
					util.ajax.post(Url,params).then(function(res){
						console.log(res)
						if(res.data.respHead.respCode == '000'){
							self.$toast('评价成功')
							self.searchEvaluate()
						}
					}).catch(function(err){
						console.log(err)
					})
					console.log(params)
				}
			}
		},
		filters: {
			evaluateFilter(val){
				switch (val){
					case 0:
						return '';
					case 1:
						return '非常不满意';
					case 2:
						return '不满意';
					case 3:
						return '一般';
					case 4:
						return '满意';
					case 5:
						return '非常满意';
					default:
						break;
				}
			}
		}
	}
</script>

<style>
	.service-evaluate .evaluate-title{
		font-size: 16px;
		padding-top: 16px;
		margin-left: 16px;
	}
	.service-evaluate .doctor-introduce{
		margin-top: 16px;
		display: flex;
	}
	.service-evaluate .doctor-photo{
		margin-left: 16px;
		padding-bottom: 16px;
	}
	.service-evaluate .doctor-photo img{
		width: 60px;
	}
	.service-evaluate .doctor-message{
		margin-left: 16px;
	}
	.service-evaluate .doctor-box{
		margin-top: 8px;
	}
	.service-evaluate .name{
		font-size: 16px;
		color: #333333;
	}
	.service-evaluate .major{
		font-size: 14px;
		color: #333333;
	}
	.service-evaluate .hospital{
		font-size: 14px;
		color: #888888;
		margin-top: 12px;
	}
	.service-evaluate .shdow{
		width: 100%;
		height: 8px;
		background: #f2f2f2;
	}
	.service-evaluate .score{
		padding-bottom: 48px;
		border-bottom: 1px solid #f2f2f2;
	}
	.service-evaluate .evaluate-icon{
		margin-left: 16px;
		margin-top: 10px;
	}
	.service-evaluate .evaluate-result{
		display: inline-block;
		margin-left: 20px;
		font-size: 14px;
		color: #333333;
		height: 30px;
		vertical-align: middle;
	}
	.service-evaluate .evaluate-box{
		margin-left: 16px;
		margin-top: 14px;
	}
	.service-evaluate .evaluate-content{
		width: 95%;
		font-size: 16px;
		color: #333333;
		border: none;
	}
	.service-evaluate .evaluate-btn{
		text-align: center;
		
	}
	.service-evaluate .confirm{
		position: absolute;
		bottom: 20px;
		left: 0;
		right: 0;
		margin: auto;
		display: inline-block;
		width: 180px;
		height: 36px;
		line-height: 36px;
		font-size: 16px;
		color: #FFFFFF;
		background: #fb6522;
		border-radius: 30px;
	}
	.service-evaluate textarea:disabled{
		background: #ffffff;
	}
</style>