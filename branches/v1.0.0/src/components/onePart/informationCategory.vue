<template>
	<div class="Information_category">
		<!--<div class="headerTotal">
	      <van-nav-bar class="headerNav" title="资讯列表" left-text="返回" left-arrow @click-left="onClickLeft">
		  </van-nav-bar>
		</div>-->
		<div class="artical">
			<van-list
			v-model='loading'
			:finished='finished'
			@load='obtionData'
			:offset="offset"
			loading-text='正在加载'
			finished-text="没有更多数据了">
				<div class="artList" v-for="item in list">
					<img :src="'http://ycxt.995120.cn:9090/tm/infoManageApi/'+item.cover+'.action'" @click="choiceCategory(item)"/>
					<div class="categoryTitle">{{item.categoryName}}</div>
				</div>
			</van-list>
		</div>
	</div>
</template>

<script>
	import utils from '../../lib/utils'
	export default {
		data(){
			return {
				loading: false,
			    finished: false,
			    offset: 10,
			    start: 1,
				list:[]
			}
		},
		created(){
			
		},
		methods: {
			onClickLeft() {
		      history.go(-1)
		    },
		    obtionData(){
		    	let self = this
		    	let Url = 'hwh/api/tm/infoManageApi/queryArticleCategoryList.action'
		    	let params = {
		    		pageSize: 3,
		    		start: this.start
		    	}
		    	utils.ajax.get(Url,{params}).then(function(res){
		    		self.list = self.list.concat(res.data.recordList)
		    		self.loading = false
		    		self.start++
		    		if(self.list.length >= res.data.total){
		    			self.finished = true
		    		}
		    	}).catch(function(err){
		    		console.log(err)
		    	})
		    },
		    
		    choiceCategory(item){
		    	let category = JSON.stringify(item)
				localStorage.setItem('category',category)
		    	this.$router.push({
		    		name: 'ArticleCategory'
		    	})
		    },
		}
	}
</script>

<style>
	*{
		margin: 0;
		padding: 0;
	}
	.Information_category .artList{
		width: 90%;
		margin-left: 5%;
		margin-top: 6px;
		position: relative;
	}
	.Information_category .artical img{
		width: 100%;
		display: block;
	}	
	.Information_category .categoryTitle{
		position: absolute;
		font-size: 18px;
		font-weight: bold;
		top: 50px;
		left: 40px;
		color: #FFFFFF;
	}
	/*.Information_category .creater{
		text-align: left;
		position: absolute;
		font-size: 16px;
		top: 90px;
		left: 40px;
		color: #608A15;
	}*/
</style>