<template>
	<div class="guideToUse">
		<div class="image">
			<img src="../../assets/image/pic_manual1.png"/>
			<img src="../../assets/image/pic_manual2.png"/>
			<img src="../../assets/image/pic_manual3.png"/>
			<img src="../../assets/image/pic_manual4.png"/>
			<!--<img src="../../assets/image/pic_manual5.png"/>-->
		</div>
		<div class="guide_btn">
			<span @click="toHomePage">返回首页</span>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				
			}
		},
		methods: {
			toHomePage(){
				this.$router.push({
					name: 'HomePage'
				})
			}
		}
	}
</script>

<style>
	.guideToUse img{
		width: 100%;
	}
	.guideToUse .guide_btn{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		height: 60px;
		line-height: 60px;
		background: #ffffff;
		text-align: center;
	}
	.guideToUse .guide_btn span{
		display: inline-block;
		width: 50%;
		height: 36px;
		line-height: 36px;
		background: #FB6522;
		color: #FFFFFF;
		border-radius: 6px;
		font-size: 14px;
		
	}
</style>