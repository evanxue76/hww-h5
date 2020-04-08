<template>
	<div class="about">
		<section class="header">
			<img class="logo_pic" src="../../assets/image/pic_appicon.png"/>
			<p class="title">心知了</p>
			<p class="edition">发布版本 v1.0.0</p>
			<p class="edition2">完整版本 v1.0.0.2</p>
		</section>
		<section class="content">
			<van-cell-group>
		        <van-cell
		          size="large"
		          class="order"
		          title="用户协议"
		          is-link
		          @click="userAgreement"
		        />
		        <van-cell
		          size="large"
		          class="order"
		          title="隐私协议"
		          is-link
		          @click='pravityAgreement'
		        />
		      </van-cell-group>
		</section>
		<section class="footer">
			<p>Copyright Ⓒ 2006-2019</p>
			<p>浙江好络维医疗技术有限公司版权所有</p>
		</section>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				
			}
		},
		created(){
			
		},
		methods: {
			userAgreement(){
				this.$router.push({
					name: 'Hw_services'
				})
			},
			pravityAgreement(){
				this.$router.push({
					name: 'Hw_privacy'
				})
			}
		}
	}
</script>

<style>
	.about{
		height: 100%;
	}
	.about .header{
		text-align: center;
		font-size: 16px;
		padding-top: 40px;
	}
	.about .logo_pic{
		border-radius: 8px;
		width: 80px;
	}
	.about .title{
		margin-top: 16px;
	}
	.about .edition{
		margin-top: 12px;
		color: #888888;
		font-size: 14px;
	}
	.about .edition2{
		margin-top: 6px;
		color: #888888;
		font-size: 14px;
	}
	.about .content{
		margin-top: 30px;
	}
	.about .footer{
		position: absolute;
		bottom: 20px;
		left: 0;
		right: 0;
		margin: auto;
		text-align: center;
		font-size: 14px;
		color: #ABABAB;
		line-height: 22px;
	}
	.about .van-icon-arrow:before{
		color: #b2b2b2;
		font-size: 18px;
	}
</style>