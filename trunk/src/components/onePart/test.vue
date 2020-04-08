<template>
	<div class="">
		<div class="cheme" @click="jump">
			ecg跳转
		</div>
		
		<div class="cheme" @click="jumps">
			reportId跳转
		</div>
	</div>
	
</template>

<script>
	export default {
		data (){
			return {
				
			}
		},
		created (){
			
		},
		methods: {
			jump(){
				window.location.href = 'huaweischeme://healthapp/thirdapp?type=ecg'
			},
			jumps(){
				window.location.href = 'huaweischeme://healthapp/thirdapp?type=ecg&reportId=31941'
			}
		},
	}
	
</script>

<style>
	.cheme{
		margin-top: 30px;
		margin-left: 50px;
		font-size: 16px;
	}
	
</style>