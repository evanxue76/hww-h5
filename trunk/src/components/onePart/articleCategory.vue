<template>
	<div class="article_category">
		<!--<div class="headerTotal">
	      <van-nav-bar class="headerNav" title="资讯列表" left-text="返回" left-arrow @click-left="onClickLeft">
		  </van-nav-bar>
		</div>-->
		<div class="category">
			<img :src="'http://ycxt.995120.cn:9090/tm/infoManageApi/'+category.cover+'.action'" />
			<div class="categoryTitle">{{category.categoryName}}</div>
		</div>
		<div class="article">
			<div class="articleList" v-for="item in list" @click="viewArticles(item)">
				<div class="portrait">
					<img :src="'http://ycxt.995120.cn:9090/tm/infoManageApi/'+item.cover+'.action'" @click="viewArticles(item)"/>
				</div>
				<div class="introduction">
					<div class="articleTitle">{{item.title}}</div>
					<div class="abstract">{{item.summary}}</div>
					<div class="abstract">{{item.publishTime | formatDateFilter}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import utils from '../../lib/utils'
	import {formatDate} from '../../lib/time'
	export default {
		data(){
			return {
				category: {},
				list: []
			}
		},
		created(){
			this.category = JSON.parse(localStorage.getItem('category')) 
			this.obtionArticle()
		},
		methods: {
			obtionArticle(){
				let self = this
				let Url = 'hwh/api/tm/infoManageApi/queryArticleByCategory.action'
				let params = {
					categoryBid: this.category.categoryBid,
					pageSize: 6,
					start: 1
				}
				utils.ajax.get(Url,{params}).then(function(res){
					console.log(res)
					self.list = res.data.recordList
				}).catch(function(err){
					console.log(err)
				})
			},
			onClickLeft() {
		      console.log('返回')
		      history.go(-1)
		    },
		    viewArticles(item){
		    	this.$router.push({
		    		name: 'CategoryContent',
		    		params: {articleBid: item.articleBid}
		    	})
		    },
		},
		filters: {
			formatDateFilter(val){
				return formatDate(val)
			}
		}
	}
</script>

<style>
	.article_category .category{
		position: relative;
		width: 94%;
		margin-left: 3%;
		margin-top: 6px;
	}
	.article_category .category img{
		width: 100%;
		display: block;
		border-radius: 5px;
	}
	.article_category .categoryTitle{
		position: absolute;
		font-size: 18px;
		top: 50px;
		left: 40px;
		color: #FFFFFF;
		font-weight: bold;
	}
	.article_category .article{
		width: 94%;
		margin-left: 3%;
		position: relative;
	}
	.article_category .article img{
		width: 100%;
		margin-top: 0.3rem;
	}
	.article_category .articleList{
		display: flex;
		justify-content: space-between;
		min-width: 0;
	}
	.article_category .introduction{
		font-size: 14px;
		width: 97%;
		padding-left: 3%;
		min-width: 0;
		border-bottom: 1px solid #F2F2F2;
		padding-bottom: 0.2rem;
	}
	.article_category .portrait{
		width: 2.2rem;
		height: 2.2rem;
		min-width: 0;
	}
	.article_category .portrait img{
		width: 100%;
	}
	.article_category .articleTitle{
		font-weight: bold;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		margin-top: 0.2rem;
	}
	.article_category .abstract{
		font-size: 12px;
		color: #888888;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		margin-top: 0.2rem;
	}
</style>