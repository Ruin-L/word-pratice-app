<template>
	<view class="answer-root">
		<view class="container" v-if="wordData.wordName">
			<!-- 题目选项卡模块开始 -->
			<view class="answer-box" >
				<view class="title">
					<text class="left-title">单选题（难度等级{{wordData.level}}）</text>
					<text class="right-condition">
						<text>{{pageSize}}</text>
						<text>/{{pageNum}}</text>
					</text>
				</view>
				<view class="content">
					<view>{{wordData.wordName}}</view>
					<view>
						<text>音标：{{wordData.phonetic}}</text>
						<text>读音：{{wordData.pronunciation}} </text>
					</view>
				</view>
				<view class="select-item">
					<text v-for="(item,index) in wordData.options" :key="item.itemId"
						:class="{'isSelected':index == selectIndex}"
						@click="getSelectedItem(item,index)">{{item.itemId}} {{item.itemContent}}</text>

				</view>


			</view>
			<!-- 题目选项卡模块结束 -->

			<!-- 翻页按钮模块开始 -->
			<view class="page-btn">
				<view class="btn">
					<button type="default" @tap="previous" v-if="pageSize != 1">
						上一题
					</button>
					<button type="default" @tap="next" v-if="pageSize != 10">
						下一题
					</button>
					<button type="default" @tap="messageToggle('error')" v-if="pageSize == 10">
						提交！
					</button>
				</view>

			</view>
			<!-- 翻页按钮模块结束 -->
		</view>
		
		<view  class="noData" v-else-if="!wordData.worName">
			<text>暂无数据~</text>
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
				pageSize: 1,
				pageNum: 10,
				level: '',
				wordData:{},
				type: 'center',
				msgType: 'success',
				messageText: '这是一条成功提示',
				value: '',
				resultDialog: '您的成绩合格！'
			};
		},
		methods: {
			// 获取当前选中的选项
			getSelectedItem(item, itemIndex) {
				this.selectIndex = itemIndex
				if (item.right) {
					console.log('选择正确')
				}
				console.log(item, '选中的项')
			},

			// 获取上一题
			previous() {
				if (this.pageSize > 1) {
					this.pageSize--
				}

				console.log('回到上一题')
			},

			// 获取下一题
			next() {
				if (this.pageSize < 10) {
					this.pageSize++
				}
				this.getApiQuestionData()
				console.log('跳转到下一题')
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
						name:'provideQuestion',
						data:{level:this.level,pageSize:this.pageSize}
					})
					if(result.data[0] != undefined){
						this.wordData = result.data[0].wordData
						console.log('题目数据获取',result.data[0])
					}
					
				}catch(e){
					console.error(e)
					//TODO handle the exception
				}
			
				
			}

		},
		onLoad(option) {
			this.level = option.wordId;
				this.getApiQuestionData()
			console.log('获取到', this.level)
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
					padding: 0 20rpx;
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
</style>
