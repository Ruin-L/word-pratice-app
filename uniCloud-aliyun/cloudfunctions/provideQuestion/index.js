'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// const count = await db.collection('questionList').count()
	// 根据level字段随机返回不同的数据
	
	let res = await db.collection('allWordList').aggregate().match({
		difficulty: event.level
	}).sample({
		size: 10
	}).limit(10).addFields({
    'options':["$means",'B. v.爬升，上升.n.爬升率，上升率；上升距离','C adv.不变地；经常地；坚持不懈地','D n.积云；组合，集结；累积；形成']
  }).end()

	// let resMeans = await db.collection('allWordList').where({})
	let data = res.data
	console.log('入参：页码+难度', event, res)

	// let res 
	//返回数据给客户端
	return {
		code: 200,
		msg: 'success',
		data
	}
};
