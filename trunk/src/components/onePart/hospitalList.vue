<template>
	<div class="hospital_list">
		<div>
		  <van-search @blur='searchHospital' placeholder="请输入医院名称搜索" v-model="hospitalName" />
		</div>
        <div class="condition">
        	<div class="area_chioce" @click="areaChioce">
        		<span :class="{'active-area' : areaFlag}">{{addressName}}</span>
        		<img :class="{'active-area' : areaFlag}" src="../../assets/image/arrow_dropdown.png"/>
        	</div>
        	<div class="grade_chioce" @click="gradeChioce">
        		<span :class="{'active-grade' : gradeFlag}">{{grade}}</span>
        		<img :class="{'active-grade' : gradeFlag}" src="../../assets/image/arrow_dropdown.png"/>
        	</div>
        </div>
        <!--等级筛选-->
        <van-popup v-model="gradeFlag" position="bottom" >
        	<div class="grade-style" v-for="(item,index) in option" :key='index' @click="chioceGradeContent(index,item)">
        		<div class="grade-content">
        			{{item.label}}
        		</div>
        		<div class="symbol" :class="{'icon-right':index==flag}">
        			<img src="../../assets/image/dui.gif"/>
        		</div>
        	</div>
		</van-popup>
        <van-popup v-model="areaFlag" position="bottom" >
        	<van-area :area-list="areaList" @confirm='areaConfirm' @cancel='areaCancel' columns-num='3'/>
        </van-popup>
        <van-list class="hospital-wrap" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :offset='50'>
        	<div class="content-list" v-for="(item,index) in hospitalList" @click="goHospitalDetails(item)">
        		<div class="hospital-img">
        			<img :src="item.hospital_picture"/>
        		</div>
        		<div class="hospital-content">
        			<div class="hospital-name">
        				{{item.hospital_name}}
        			</div>
        			<div class="hospital-details">
        				<span class="hospital-area">{{item.city_name}}</span>&nbsp;&nbsp;
        				<span class="hospital-grade">{{item.hospital_grade}}</span>
        			</div>
        		</div>
        	</div>
        </van-list>
	</div>
</template>

<script>
	import util from '../../lib/util'
	import area from './area'
	export default{
		data() {
			return {
				photo: require('../../assets/image/pic_analyse_hospital.jpg'),
				hospitalName: '',
				areaName: '',
				cityName: '',
				provinceName: '',
				addressName: '全国',
				option: [
			        { label: '全部级别', value: ''},
			        { label: '三甲', value: 103 },
			        { label: '二甲', value: 102 },
			        { label: '一甲', value: 101 },
			        { label: '三乙', value: 203 },
			        { label: '二乙', value: 202 },
			        { label: '一乙', value: 201 },
			        { label: '三丙', value: 303 },
			        { label: '二丙', value: 302 },
			        { label: '一丙', value: 301 },
			    ],
			    areaList: area,
			    gradeFlag: false,
			    flag: 0,
			    grade: '全部级别',
			    hospitalGrade: '',
			    areaFlag: false,
			    hospitalList: [],
			    loading: false,
      			finished: false,
      			pageNum: 0
			}
		},
		created(){
//			this.obtainHospitalList(0)
		},
		methods: {
			// 获取医院列表
			obtainHospitalList(pageNum){
				let self = this
				let Url = ''
				let params = {
					"reqHead": {
						'functionId': 'HWW002015001'
					},
					"body": {
						'hospitalName': this.hospitalName,
						'provinceName': this.provinceName,
						'cityName': this.cityName,
						'areaName': this.areaName,
						'hospitalGradeCode': this.hospitalGrade,
						'pageNum': pageNum,
						'pageSize': 8
					}
				}
				util.ajax.post(Url,params).then(function(res){
					console.log(res)
					if(res.data.respHead.respCode == '000'){
						self.loading = false
						if(res.data.body.data.datas.length > 0){
							self.hospitalList = self.hospitalList.concat(res.data.body.data.datas)
						}else{
							self.finished = true
						}
					}
					
				}).catch(function(err){
					console.log(err)
				})
			},
			onLoad(){
				this.obtainHospitalList(this.pageNum)
				this.pageNum ++ 
			},
			// 查看医院详情
			goHospitalDetails(item){
				this.$router.push({
					name: 'HospitalDetails',
					params: {id: item.id}
				})
			},
			// 搜索医院
			searchHospital(){
				this.finished = false
				this.hospitalList = []
				this.pageNum = 1
				this.obtainHospitalList(0)
			},
			// 选择级别
			gradeChioce(){
				this.gradeFlag = true
			},
			chioceGradeContent(index,item){
				let self = this
				this.flag = index
				this.grade = item.label
				this.hospitalGrade = item.value
				setTimeout(function(){
					self.gradeFlag = false
					self.finished = false
					self.loading = false
					self.hospitalList = []
					self.pageNum = 1
					self.obtainHospitalList(0)
				},300)
			},
			// 选择地区
			areaChioce(){
				this.areaFlag = true
			},
			areaConfirm(val){
				console.log(val)
				if (val[0].name == '全国') {
					this.addressName = '全国'
					this.areaName = ''
					this.cityName = ''
					this.provinceName = ''
				}else if (val[1].name == '--市--') {
					this.addressName = val[0].name
					this.areaName = ''
					this.cityName = ''
					this.provinceName = val[0].name
				}else if (val[2].name == '--区--' || val[2].name == '--乡/镇--') {
					this.addressName = val[1].name
					this.areaName = ''
					this.cityName = val[1].name
					this.provinceName = val[0].name
				}else{
					this.addressName = val[2].name
					this.areaName = val[2].name
					this.cityName = val[1].name
					this.provinceName = val[0].name
				}
				
				this.areaFlag = false
				this.finished = false
				this.hospitalList = []
				this.pageNum = 1
				this.obtainHospitalList(0)
			},
			areaCancel(){
				this.areaFlag = false
			}
		},
		filters: {
			areaNameFilter(val){
				if (val == '') {
					return '全国'
				}else{
					return val
				}
			}
		}
	}
</script>

<style lang="scss">
	.hospital_list{
		height: 100%;
		background: #f2f2f2;
	}
	.hospital_list .van-search{
		padding: 10px 16px;
	}
	.hospital_list .van-search__content{
		background-color: #F2F2F2;
		border-radius: 5px;
	}
	
	.hospital_list .condition{
		display: flex;
		justify-content: space-around;
		font-size: 16px;
		height: 48px;
		line-height: 48px;
		border-top: 1px solid #F2F2F2;
		border-bottom: 1px solid #f2f2f2;
		background: #ffffff;
	}
	.condition img{
		width: 10px;
		margin-left: 6px;
	}
	.area_chioce{
		width: 50%;
		text-align: center;
	}
	.hospital_list .active-area{
		color: #2196F3;
		transition: 0.5s;
		transform: rotate(-180deg);
	}
	.hospital_list .grade_chioce{
		border-left: 1px solid #f2f2f2;
		width: 50%;
		text-align: center;
	}
	.hospital_list .active-grade{
		color: #2196F3;
		transition: 0.5s;
		transform: rotate(-180deg);
	}
	.hospital_list .grade-style{
		display: flex;
		justify-content: space-between;
		height: 40px;
		line-height: 40px;
		border-bottom: 1px solid #f2f2f2;
	}
	.hospital_list .grade-content{
		margin-left: 40px;
	}
	.hospital_list .symbol img{
		width: 16px;
		margin-right: 40px;
	}
	.hospital_list .symbol{
		display: none;
	}
	.hospital_list .icon-right{
		display: block;
	}
	
	.hospital_list .content-list{
		display: flex;
		padding: 12px 0;
		border-bottom: 1px solid #f2f2f2;
		background: #ffffff;
	}
	.hospital_list .hospital-img{
		width: 100px;
	}
	.hospital-img img{
		width: 100px;
		vertical-align: middle;
		margin-left: 16px;
	}
	.hospital_list .hospital-content{
		margin-left: 16px;
	}
	.hospital_list .hospital-name{
		margin-top: 8px;
		font-size: 16px;
		color: #333333;
	}
	.hospital_list .hospital-details{
		margin-top: 4px;
	}
	.hospital_list .hospital-area{
		font-size: 14px;
		color: #333333;
	}
	.hospital_list .hospital-grade{
		display: inline-block;
		color: #fb6522;
		border: 1px solid #fb6522;
		padding: 0 4px;
		font-size: 12px;
		height: 16px;
		line-height: 16px;
	}
</style>