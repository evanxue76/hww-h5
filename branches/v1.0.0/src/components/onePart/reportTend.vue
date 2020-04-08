<template>
	<div class="reportTend">
		<div class="tendHeader">
			<div class="left" @click="getPreMonth(year,month)" :class="{'leftActive':leftIcon}">
				<van-icon name="arrow-left" />
			</div>
			<div>
				{{mydate}}
			</div>
			<div class="right" @click="getNextMonth(year,month)" :class="{'rightActive':rightIcon}">
				<van-icon name="arrow" />
			</div>
		</div>
			<div class="tendMessage" v-show="abnormalShow">
				<div class="userMessage">
					<div class="photo">
						<img :src="trendReportData.hwHealthTrend.icon"/>
					</div>
					<div class="name">
						{{trendReportData.hwHealthTrend.name}}
					</div>
					<div class="sex">
						{{trendReportData.hwHealthTrend.sex | sexFilter}}/{{trendReportData.hwHealthTrend.age}}岁
					</div>
				</div>
				<div class="measureDate">
					<div>测量时间段：{{trendReportData.hwHealthTrend.measuringStartDate | formatMonthDayFilter}} - {{trendReportData.hwHealthTrend.measuringEndDate | formatMonthDayFilter}}</div>
					<div>总测量时长：{{trendReportData.hwHealthTrend.measurementDuration | secondToHourFilter}}</div>
					<div>最常见心电异常：{{trendReportData.hwHealthTrend.commonAbnormal}}</div>
					<div>最常发生异常时间段：{{trendReportData.hwHealthTrend.commonAbnormalTime}}</div>
				</div>
			</div>
			<div class="measureDuration" v-show="abnormalShow">
				<div class="measureTitle">
					本月测量时长
				</div>
				<div id="myCharts" style="width: 100%; height: 260px;"></div>
				<div class="suggest">
					{{trendReportData.hwHealthTrend.tendencyChartReport}}
				</div>
			</div>
			<div class="recommend" v-show="abnormalShow">
				<div class="recoTitle">
					月度分析报告
				</div>
				<div class="suggestList">
					{{trendReportData.hwHealthTrend.monthlyAnalysisReport}}
				</div>
			</div>
			<div class="measureDuration" v-show="!abnormalShow">
				<div class="measureTitle">
					本月测量时长
				</div>
				<div id="myChart" style="width: 100%; height: 240px;"></div>
				<div class="suggest">
					{{sameMonthData.suggest}}
				</div>
			</div>
			<div class="recommend" v-show="!abnormalShow">
				<div class="recoTitle">
					专家推荐
				</div>
				<div class="suggestList" v-for="item in sameMonthData.suggestList">
					{{item}}
				</div>
			</div>
		</div>
</template>

<script>
//	import Vue from "vue";
	import util from '../../lib/util'
	import {formatMonthDay} from '../../lib/time'
//	import echarts from 'echarts/lib/echarts'
//	import 'echarts/lib/chart/line'
//	import 'echarts/lib/chart/bar'
//	import 'echarts/lib/component/legend'
//	import 'echarts/lib/component/title'
//	import('echarts/lib/component/tooltip')
//	Vue.prototype.$echarts = echarts
	const colorList = ['#fb6522','#fbbb22','#fff043','#8dcc77','#88d5d6','#56a8ce','#88a7d6','#dcacea','#adb6bc','#889095',
					    '#fb6522','#fbbb22','#fff043','#8dcc77','#88d5d6','#56a8ce','#88a7d6','#dcacea','#adb6bc','#889095',
					    '#fb6522','#fbbb22','#fff043','#8dcc77','#88d5d6','#56a8ce','#88a7d6','#dcacea','#adb6bc','#889095',
						'#fb6522','#fbbb22','#fff043','#8dcc77','#88d5d6','#56a8ce','#88a7d6','#dcacea','#adb6bc','#889095']
	export default {
		data (){
			return {
				type: 1,
				rightIcon: true,
				leftIcon: false,
				mydate: '',
				year: '',
				month: '',
				lineLength: 0,
				sameMonthData: {},
				trendReportData: {
					hwHealthTrend: {}
				},
				currentYear: '',
				currentMonth: '',
				abnormalShow: false,
				photo:require('../../assets/image/pic_user.png'),
				hw_user_message: {},
				minMonth: '',
				minYear: ''
			}
		},
		created(){
			let userData = localStorage.getItem('hw_user_message')
	  		this.hw_user_message = JSON.parse(userData)
			if (this.$route.params.type == undefined) {
				this.type = 1
			}else{
				this.type = this.$route.params.type
			}
			this.obtinDate()
			
		},
		methods: {
			obtinDate(){
				let date = new Date
				let year = date.getFullYear()
				let month = date.getMonth() + 1
				this.year = year
				this.currentYear = year
				this.month = month
				this.currentMonth = month
				if (this.type == 1) {
					this.obtionHealthData()
					if (month < 10) {
						this.mydate =  year + '年' + '0' +  month + '月'
					}else{
						this.mydate =  year + '年' + month + '月'
					}
				}else{
					this.getPreMonth(this.year,this.month)
				}
				
				
			},
			getPreMonth(year,month){
				let minYear = this.minYear
				let minMonth = this.minMonth
				if (year == this.currentYear && month > this.currentMonth) {
					this.rightIcon = true
				}else{
					this.rightIcon = false
				}
				month = month - 1
				if(month == 0){
					year = year - 1
					month = 12
				}
				if (month < 10) {
					this.mydate =  year + '年' + '0' +  month + '月'
				}else{
					this.mydate =  year + '年' + month + '月'
				}
				this.year = year
				this.month = month
				this.obtionHealthData()
			},
			getNextMonth(year,month){
				if (year == this.currentYear && month >= this.currentMonth - 1) {
					this.rightIcon = true
				}else{
					this.rightIcon = false
				}
				month = month + 1
				if (month == 13) {
					year = year +1
					month = 1
				}
				if (month < 10) {
					this.mydate =  year + '年' + '0' +  month + '月'
				}else{
					this.mydate =  year + '年' + month + '月'
				}
				this.year = year
				this.month = month
				this.obtionHealthData()
			},
			obtionHealthData(){
				let self = this
				let minYear = this.minYear
				let minMonth = this.minMonth
				let Url = ''
				let month = this.month
				if (month < 10) {
					month = '0' + month
				}else{
					month = month
				}
				let monthStr = this.year + '-' + month
				let params = {
					"reqHead": {
						'functionId': 'HWW002005001'
					},
					"body": {
						'monthStr': monthStr,
						'userNo': this.hw_user_message.userNo    //  2
					}
				}
				util.ajax.post(Url,params).then(function(res){
					self.minMonth = res.data.body.data.month
					self.minYear = res.data.body.data.year
					if (self.minMonth == self.month && self.minYear == self.year) {
						self.leftIcon = true
					}else{
						self.leftIcon = false
					}
					if (res.data.body.data.type == 3) {
						self.abnormalShow = true
						self.trendReportData = res.data.body.data
						setTimeout(function(){
							self.trendChart()
						},100)
					}else{
						self.abnormalShow = false
						self.sameMonthData = res.data.body.data
						setTimeout(function(){
							self.setEchart()
						},100)
						
					}
					
				})
			},
			setEchart(){
				let data = this.sameMonthData.duration
				let seriesDataList = [{
					barCategoryGap:'1',
				        data: data,
				        name: '时长(min)',
				        type: 'bar',
				        itemStyle:{
                                    normal:{
                                        color:'#CCEAFF'
                                    }
                                },
				}]
				let lineData = {
				        data: '',
				        name: '',
				        type: 'line',
				}
				for (let i = 0; i < this.lineLength.length; i++) {
					lineData = {
				        data: [],
				        name: '',
				        type: 'line',
                        yAxisIndex: 1,
					}
					seriesDataList.push(lineData)
				}
				
				let myChart = this.$echarts.init(document.getElementById('myChart'))
				let option = {
					legend: {
						x:'center',
						y:205,
				        data: ['时长(min)'],
				    },
				    tooltip: {},
					xAxis: {
				        type: 'category',
				        data: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
				    },
				    yAxis: [{
				        type: 'value',
				        name : '时长',
				        axisLabel : {
                            formatter: '{value}',
                            textStyle: {
                                color: '#888888'
                            }
                        }
				    },
				    {
				        type: 'value',
				        name : '',
				        axisLine:{
	                        lineStyle:{
	                            color:'#FFFFFF',
	                        }
	                    } 
				    }],
				    series: seriesDataList
				}
				myChart.setOption(option);
			},
			trendChart(){
				let xLineData = this.trendReportData.dateList
				let lineDataList = this.trendReportData.detailsList
				this.lineLength = lineDataList.length
				let barData = this.trendReportData.duration.split(',')
				let myCharts = this.$echarts.init(document.getElementById('myCharts'))
				let legendName = ['时长(min)']
				let seriesDataList = [{
					barCategoryGap:'1',
				        data: barData,
				        name: '时长(min)',
				        type: 'bar',
				        itemStyle:{
                                    normal:{
                                        color:'#CCEAFF'
                                    }
                                },
				}]
				let lineData = {
				        data: '',
				        name: '',
				        type: 'line',
				        itemStyle:{
                                    normal:{
                                        color:''
                                    }
                                },
				}
				for (let i = 0; i < lineDataList.length; i++) {
					let dataArr = lineDataList[i].dataStr.split(',')
					let name = lineDataList[i].abnormalName
					let color = colorList[i]
					lineData = {
						barCategoryGap:'0',
				        data: dataArr,
				        name: name,
				        type: 'line',
				        itemStyle:{
                                    normal:{
                                        color:color
                                    }
                                },
                        yAxisIndex: 1,
					}
					seriesDataList.push(lineData)
					legendName.push(name)
				}
				
				let options = {
					legend: {
						x:'center',
						y:200,
				        data: legendName,
				    },
				    tooltip: {},
				    grid: {
				    	bottom: 80
//				    	y2:80
				    },
					xAxis: {
						type: 'category',
						data: xLineData
					},
					yAxis: [{
						type: 'value',
				        name : '时长',
				        axisLabel : {
                            formatter: '{value}',
                            textStyle: {
                                color: '#888888'
                            }
                       },
                       splitLine: {
                       	show: false
                       }
					},
					{
						type:'value',
						scale: true,
						name: '频次',
						axisLabel : {
                            formatter: '{value}',
                            textStyle: {
                                color: '#888888'
                            }
                        },
                        splitLine: {
                       		show: false
                        },
                        min: 0,
						boundaryGap: [0.2, 0.2]
					}],
					series: seriesDataList,
				}
				myCharts.setOption(options);
			},
		},
		filters: {
			formatMonthDayFilter(val){
				return formatMonthDay(val)
			},
			sexFilter(val){
				if (val == 0) {
					return '男'
				}else{
					return '女'
				}
			},
			secondToHourFilter(val){
				let min = Math.floor(val/60)
				let minute = min % 60
				let hour = Math.floor(min/60)
				return hour + '小时' + minute + '分'
			}
		}
	}
</script>

<style>
	.reportTend{
		height: 100%;
		background: #F2F2F2;
		font-size: 14px;
	}
	.reportTend .tendHeader{
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 40px;
		line-height: 40px;
		background: #FFFFFF;
		font-size: 16px;
		font-weight: bold;
	}
	.reportTend .left{
		margin-left: 3%;
		font-size: 18px;
	}
	.reportTend .right{
		font-size: 18px;
		margin-right: 3%;
	}
	.reportTend .rightActive{
		visibility: hidden;
	}
	.reportTend .measureDuration{
		width: 100%;
		background: #FFFFFF;
		margin-top: 8px;
	}
	.reportTend .measureTitle{
		font-size: 15px;
		font-weight: bold;
		margin-left: 3%;
		padding: 18px 0 0;
	}
	.reportTend .suggest{
		width: 90%;
		margin-left: 4%;
		line-height: 24px;
		margin-top: -5px;
		padding-bottom: 16px;
	}
	.reportTend .recommend{
		width: 100%;
		background: #FFFFFF;
		margin-top: 8px;
		padding-bottom: 14px;
	}
	.reportTend .recoTitle{
		font-size: 15px;
		font-weight: bold;
		margin-left: 4%;
		padding: 10px 0 8px;
	}
	.reportTend .suggestList{
		margin-left: 4%;
		line-height: 22px;
	}
	.reportTend .tendMessage{
		width: 100%;
		margin-top: 8px;
		background: #FFFFFF;
		display: flex;
		justify-content: space-around;
		padding: 16px 0;
	}
	.reportTend .photo{
		width: 48px;
		height: 48px;
		border-radius: 48px;
	}
	.reportTend .photo img{
		/*width: 100%;*/
		width: 48px;
		height: 48px;
		border-radius: 50%;
	}
	.reportTend .name{
		text-align: center;
		font-size: 15px;
		font-weight: bold;
		margin-top: 4px;
	}
	.reportTend .sex{
		text-align: center;
		font-size: 12px;
		color: #888888;
		margin-top: 4px;
	}
	.reportTend .measureDate{
		line-height: 22px;
	}
	#myCharts div{
		/*overflow: auto !important;*/
		/*height: 100% !important;*/
	}
	#myCharts div canvas{
		/*overflow: auto !important;*/
		/*height: 100% !important;*/
	}
	.reportTend .leftActive{
		visibility: hidden;
	}
</style>