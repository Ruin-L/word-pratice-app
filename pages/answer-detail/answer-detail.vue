<template>

	<view class="answer-root">
<!-- 		<view class="back-home">
			<text>< 返回首页</text>
			
		</view> -->
		<view class="container" >
			
<view v-for="(item,index) in wordData" :key="wordData._id" >

		<view v-if="index == currentIndex">
			<!-- 题目选项卡模块开始 -->
			<view class="answer-box"  >
					<view class="title" >
						<text class="left-title">单选题（难度等级{{item.difficulty}}）</text>
						<text class="right-condition">
							<text>{{index+1}}</text>
							<text>/{{pageNum}}</text>
						</text>
					</view>
					<view class="content">
						<view>{{item.wordName}}</view>
					</view>
					<view class="select-item">
						<text v-for="(itemOptions,indexOptions) in item.options" :key="indexOptions"
						@click="getSelectedItem(itemOptions,index)"
							:class="{'isSelected':  mySelectArr[index] == itemOptions}"
							> {{itemOptions}}</text>
					</view>
				
				
			</view>
			<!-- 题目选项卡模块结束 -->
			
			<!-- 翻页按钮模块开始 -->
			<view class="page-btn">
				<view class="btn">
					<button type="default" @tap="previous(index,item)" v-if="currentIndex >= 1">
						上一题
					</button>
					<button type="default" @tap="next(index,item)" v-if="currentIndex < 9">
						下一题
					</button>
					<button type="default" @tap="messageToggle('error')" v-if="currentIndex == 9 && mySelectArr.length==10">
						提交！
					</button>
					<button type="default" v-if="currentIndex == 9 && mySelectArr.length<10">
						还有题目未完成！
					</button>
				</view>
			
			</view>
			<!-- 翻页按钮模块结束 -->
			</view>
				</view>

			
		</view>
		
		<view>
		
			<!-- 提示窗示例 -->
			<uni-popup ref="alertDialog" type="dialog">
				<uni-popup-dialog :type="msgType" cancelText="返回首页" :confirmText="confirmText" :title="testRes"
					:content="resultDialog" @confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				selectIndexArr: [],
				pageSize: 1,
				pageNum: 10,
				currentIndex:0,
				score:0,
				level: '',
				wordData:[],
				selectItem:'',
				type: 'center',
				msgType: 'success',
				messageText: '这是一条成功提示',
				value: '',
				// 我的答案
				mySelectArr:[],
				// 正确答案
				rightSelectArr:[],
				testRes:'',
				resultDialog: '您的成绩合格！',
				confirmText:'',
				difficultLevel:0,
			};
		},
		watch:{
			mySelectArr(){
				console.log('触发')
				// this.$set(this.mySelectArr,this.mySelectArr[index],item)
				
			}
		},
		methods: {
			// 获取当前选中的选项并存到数组中
			getSelectedItem(item, index) {
				// this.mySelectArr[index] = item
				this.mySelectArr.splice(index,1,item)
				// this.$set(this.mySelectArr,this.mySelectArr[index],item)
				

				console.log('当前的选项',this.mySelectArr)
			},

			// 获取上一题
			previous(index,source) {
				this.currentIndex--;
				console.log('回到上一题',source)
			},

			// 获取下一题
			next(index,source) {
				this.currentIndex++;
				console.log('跳转到下一题',source)
			},
			// 提交成功获取的信息
			messageToggle(type) {
				for(let i = 0;i<this.pageNum;i++){
					if(this.mySelectArr[i].slice(3) == this.rightSelectArr[i]){
						this.score++
					}
					
					
				}
				this.score = this.score*10
				this.resultDialog = `您最后的分数为：${this.score}`
				if(this.score>=60 && this.difficultLevel < 6){
					 this.difficultLevel++
					this.testRes = '恭喜及格！'
					this.confirmText = '继续下一难度'
				}else if(this.score>=60 && this.difficultLevel == 6){
					 this.difficultLevel++
					this.testRes = '恭喜及格！'
					this.confirmText = '去加强巩固'
					
				}else{
					this.testRes = '不及格哦！'
					this.confirmText = '去背单词'
				}
				this.msgType = type
				this.$refs.alertDialog.open()
			},
			//确认提交
			dialogConfirm() {
				if(this.score<60){
					uni.switchTab({
						url:"../recitation/index"
					})
				}else if(this.score >= 60){
					console.log(this.difficultLevel,'当前难度等级')
					if(this.difficultLevel <= 6){
						uni.navigateTo({
							url:"../answer-detail/answer-detail?wordId=" + this.difficultLevel,
						})
					}else if(this.difficultLevel){
						uni.navigateTo({
							url:"../answer-detail/answer-detail?wordId=1",
						})
					}
					
					
				}
				// console.log('点击确认')
				
				this.$refs.alertDialog.open()
			},
			// 关闭提交窗口
			dialogClose() {
				uni.switchTab({
					url: "../../pages/home/index"
				})
				console.log('点击关闭')
			},
			
			// 调用云函数获取数据
			async getApiQuestionData(){
				try{
					const {result} = await uniCloud.callFunction({
						name:'provideQuestion',
						data:{level:this.level,pageSize:this.pageSize}
					})
						this.wordData = result.resData
						this.wordData.forEach(item=>{
							this.rightSelectArr.push(item.means)
						})
					
						console.log('题目数据获取',result)
						console.log('正确答案',this.rightSelectArr)
					
				}catch(e){
					console.error(e)
					//TODO handle the exception
				}
			
				
			}

		},
		onLoad(option) {
			this.level = option.wordId;
			this.difficultLevel = option.wordId;
				this.getApiQuestionData()
			console.log('当前难度等级：', this.level)
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f2f5f8;
		// overflow: scroll;

	}

	.answer-root {
		position: relative;
		top: 60rpx;

		.answer-box {
			word-wrap: break-word;
			word-break: break-all;
			box-sizing: border-box;
			padding: 30rpx;
			border-radius: 20rpx;
			width: 100%;
			box-shadow: 5px 4px 20px rgba(0, 0, 0, 0.16);
			background-color: #FFFFFF;

			.title {
				display: flex;
				align-items: center;
				box-sizing: border-box;
				padding-bottom: 20rpx;
				justify-content: space-between;
				width: 100%;
				border-bottom: 2rpx solid #eeeeee;

				.left-title {
					font-weight: bolder;
					padding: 0 20rpx;
					border-left: 8rpx solid #007AFF;
				}

				.right-condition {
					text {
						&:nth-child(1) {
							font-size: 40rpx;
							font-weight: bold;
							margin: 0 6rpx;
						}

						&:nth-child(2) {
							color: gray;
						}
					}
				}
			}

			.content {
				.read{
					display: flex;
					align-items: center;
					
					image{
						// line-height: 36rpx;
						vertical-align:middle;
						width: 36rpx;
						height: 36rpx;
					}
				}
				view {
					min-height: 100rpx;
					display: flex;
					align-items: center;

					&:nth-child(1) {
						font-size: 40rpx;
						font-weight: bold;
					}

					&:nth-child(2) {
						display: flex;
						align-items: center;
						font-size: 28rpx;

						text {
							flex: 1;
						}
					}
				}
			}

			.select-item {
			
				text {
					min-height: 100rpx;
					margin: 20rpx 0;

					&:nth-child(4) {
						margin-bottom: 0;
					}

					border: 2rpx solid #dee1e6;
					border-radius: 8rpx;
					padding:15rpx;
					background-color: #f2f5f8;
					display: block;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}

				.isSelected {
					border: 2rpx solid #007AFF;
					background-color: rgba(52, 152, 219, 0.3)
				}

			}

		}
	}

	.page-btn {
		margin: 30px;

		.btn {
			display: flex;

			button {
				box-shadow: 0 2px 5px 0 rgba(50, 50, 105, 0.15), 0 1px 1px 0 rgba(0, 0, 0, 0.05);
			}

		}

	}
	.noData{
		font-size: 30rpx;
		text-align: center;
	}
	.back-home{
		width: 100%;
		box-sizing: border-box;
		line-height: 100rpx;
		// padding: 20rpx;
		margin-bottom: 50rpx;
		height: 100rpx;
		background-color: #FFFFFF;
		font-size: 28rpx;
		font-weight: bold;
		border-bottom: 2rpx solid #EEEEEE;
		text{
			padding: 30rpx;
		}
	}
</style>
