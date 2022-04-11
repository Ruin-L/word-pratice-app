'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// const count = await db.collection('questionList').count()
	// 根据level字段返回不同的数据
	let res = await db.collection('questionList').where({
		wordData:{
			level:event.level
		}
	}).limit(1).get()
	let data = res.data
	console.log('入参：页码+难度', event,res)
	
	// let res 
	//返回数据给客户端
	return {
		code: 200,
		msg: 'success',
		data
	}
};
