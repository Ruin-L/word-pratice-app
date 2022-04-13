<template>
	<view class="answer-root">
		<view class="container" >
<view v-for="(item,index) in wordData" :key="wordData._id" >

		<view v-if="index == currentIndex">
			<!-- 题目选项卡模块开始 -->
			<view class="answer-box"  >
					<view class="title" >
						<text class="left-title">背单词 (词汇难度：{{item.difficulty}})</text>
						<text class="right-condition">
							<text>{{index+1}}</text>
							<text>/{{pageNum}}</text>
						</text>
					</view>
					<view class="content">
						<view>{{item.wordName}}</view>
						<view class="read">
							<text>音标：{{item.phonetic}}</text>
							<text @tap="getAudioResource">读音：{{item.pronunciation}}
							 <image src="../../static/icon/listen.png" mode="widthFix"></image>
							<audio  :src="current.src"   controls></audio>
							 </text>
						</view>
					</view>
					<view class="select-item">
						<text> {{item.means}}</text>
					</view>
				
				
			</view>
			<!-- 题目选项卡模块结束 -->
			<!-- 翻页按钮模块开始 -->
			<view class="page-btn">
				<view class="btn">
					<button type="default" @tap="previous(index,item.wordName)" v-if="currentIndex >= 1">
						上一个单词
					</button>
					<button type="default" @tap="next(index,item.wordName)" v-if="currentIndex < pageNum" >
						下一个单词
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
				<uni-popup-dialog :type="msgType" cancelText="返回首页" confirmText="继续下一难度" title="通知"
					:content="resultDialog" @confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				selectIndex: -1,
				pageSize: 21,
				pageNum: '',
				currentIndex:0,
				level: '',
				wordData:[],
				type: 'center',
				msgType: 'success',
				messageText: '这是一条成功提示',
				value: '',
				resultDialog: '您的成绩合格！',
				audio:'',
				current: {								
								src: '',
							audioAction: {
								method: 'pause'
							},
							}
			};
		},
		methods: {

			// 获取上一题
			previous(index,wordName) {
				this.getAudioResource()
				this.currentIndex--;
				this.audio = this.wordData[index-1].wordName;
				console.log('回到上一题',index,this.wordData[index-1].wordName)
			},

			// 获取下一题
			next(index,wordName) {
					this.currentIndex++;
					if(this.currentIndex % 20 == 1){
						this.getApiQuestionData();
					}
					this.audio = this.wordData[index+1].wordName;
					this.getAudioResource()
				console.log('跳转到下一题',index,this.wordData[index+1].wordName)
			},
			
			// 提交成功获取的信息
			messageToggle(type) {
				this.msgType = type
				this.$refs.alertDialog.open()
			},
			
			//确认提交
			dialogConfirm() {
				console.log('点击确认')
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
						name:'reciteWords',
						data:{pageSize:this.pageSize}
					})
					result.res.data.forEach(e=>{
						this.wordData.push(e);
					})
					this.pageNum = result.res.total
					if(this.wordData.length<22){
						this.audio = this.wordData[0].wordName;
						this.getAudioResource()
					}
					
					

						console.log('题目数据获取',this.wordData)
					
				}catch(e){
					console.error(e)
					//TODO handle the exception
				}
			
				
			},

			// 获取音频链接
			getAudioResource(){
				this.current.src = 'http://dict.youdao.com/dictvoice?type=0&audio=' + this.audio
				console.log(this.current.src)
			}
		},
		onLoad(option) {
		
				this.getApiQuestionData()
				// setTimeout(()=>{
				// 					this.audio = this.wordData[0].wordName;
				// 					this.getAudioResource()
				// 				},2000)
				
				
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f2f5f8;

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
					position: relative;
					
					
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
					padding: 20rpx;
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
	/deep/ .uni-audio-default{
		min-width:0rpx !important;
		position: absolute;
		padding: 0 !important;
		margin: 0 !important;
		height: 40rpx;
		width: 40rpx;
		
		top: 30rpx;
		right: 190rpx;
		opacity: 0;
	}
	/deep/ .uni-audio-right{
		display: none !important;
		
	}
	/deep/ .uni-audio-button{
		margin: 0 !important;
		height: 40rpx;
		width: 40rpx;
	}
	/deep/ .uni-audio-left{
		// height: 40rpx;
		// display: none !important;
		
	}

</style>
