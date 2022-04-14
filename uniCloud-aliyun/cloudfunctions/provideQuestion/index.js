'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数

	// 根据level字段随机返回数据库中不同的数据40组
	let res = await db.collection('allWordList').aggregate().match({
		difficulty: event.level
	}).sample({
		size: 40
	}).limit(40).end()
	let data = res.data
	let optionData = [];
	// 设置计数器
	let count = 0;
	// 前10组数据用于题目 后30组数据用于选项
	data.forEach((item, index) => {
		if (index < 10) {
			item.options = [item.means]
		} else if (index >= 10 && index < 40) {
			optionData.push(item.means)
		}

	})

	// 将后30组数据中的单词含义赋值到前10组数据中的数组中
	data.forEach((item, index) => {
		if (item.options) {
			for (let i = 1; i < 4; i++) {
				item.options.push(optionData[count])
				count++
			}

		}
	})

	// 打乱题目选项
	let resData = [];
	data.forEach((item, index) => {
		if (item.options) {
			item.options.sort(() => {
				return (0.5 - Math.random());
			});
			// 添加题标
			item.options[0] = `A. ${item.options[0]}`
			item.options[1] = `B. ${item.options[1]}`
			item.options[2] = `C. ${item.options[2]}`
			item.options[3] = `D. ${item.options[3]}`
		}
		if(index<10){
			resData.push(item)
			
		}
	})
	
	
	console.log('选项列表', optionData)
	console.log('入参：页码+难度', event, res)
	//返回数据给客户端
	return {
		code: 200,
		msg: 'success',
		resData,
	}
};
