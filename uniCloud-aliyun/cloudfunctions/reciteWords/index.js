'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	let count = await db.collection('allWordList').count()
	// 根据level字段随机返回不同的数据
	
	let res = await db.collection('allWordList').aggregate().sample({
		size: event.pageSize
	}).limit(event.pageSize).end()
	res.total = count.total;
	let data = res.data
	console.log('入参：页码+难度', event, res,count)

	// let res 
	//返回数据给客户端
	return {
		code: 200,
		msg: 'success',
		res,
		
	}
};
