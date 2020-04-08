<template>
	<div class="categoryContent">
		<div class="" v-html="data.content"></div>
	</div>
</template>

<script>
	import utils from '../../lib/utils'
	export default {
		data(){
			return {
				data: {},
				articleBid: ''
			}
		},
		created(){
			this.articleBid = this.$route.params.articleBid
			this.obtionArticle()
		},
		methods: {
			obtionArticle(){
				let self = this
				let Url = 'hwh/api/tm/infoManageApi/queryArticleDetail.action'
				let params  = {
						articleBid: this.articleBid
				}
				utils.ajax.get(Url,{params}).then(function(res){
					self.data = res.data
					console.log(res)
				})
			},
		}
		
	}
</script>

<style>
	img{
		width: 100%;
	}
</style>