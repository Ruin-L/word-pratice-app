<template>
	<view class="home-root">
		<view class="container">
			<view class="word-box" v-for="item in wordDivArray" :key="item.id" @tap="navgateToAnswer(item.id)" >
				{{item.text}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				wordDivArray:[{
					id:'1',
					text:'一级词汇难度'
				},{
					id:'2',
					text:'二级词汇难度'
				},{
					id:'3',
					text:'三级词汇难度'
				},{
					id:'4',
					text:'四级词汇难度'
				},{
					id:'5',
					text:'五级词汇难度'
				},{
					id:'6',
					text:'六级词汇难度'
				},{
					id:'7',
					text:'七级词汇难度'
				}]
			}
		},
		onLoad() {

		},
		methods: {
			navgateToAnswer(id){
				uni.navigateTo({
					url:"../answer-detail/answer-detail?wordId="+id,
				})
				// console.log('触发')
			}
		}
	}
</script>

<style lang="scss" scoped>

	.home-root{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.word-box{
			box-sizing: border-box;
			width: 100%;
			height: 120rpx;
			border-radius: 20rpx;
			margin:40rpx 0;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #FFFFFF;
			border: 2rpx solid #4CD964;
			&:nth-child(1){
				margin-top: 30rpx;
			}
			&:nth-child(odd){
				background: linear-gradient(135deg,#43cbff,#9708cc);
			}
			&:nth-child(even){
				background: linear-gradient(135deg,#f54ea2,#ff7676);
				
			}
					
			}
	}
	
</style>
