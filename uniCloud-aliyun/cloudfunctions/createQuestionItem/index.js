'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	// 创建数据库
	const collection = db.collection('questionList');
	// 添加示例数据
	const res = await collection.add({
	"wordData": {
		"level": 1,
		"wordName": "apple",
		"phonetic": "abdc",
		"pronunciation": "url:xx",
		"options": [
			{
				"itemId": "A",
				"itemContent": "苹果",
				"right": true
			},
			{
				"itemId": "B",
				"itemContent": "香蕉"
			},
			{
				"itemId": "C",
				"itemContent": "橙子"
			},
			{
				"itemId": "D",
				"itemContent": "柠檬"
			}
		]
	}
})
	//event为客户端上传的参数
	 event = '测试数据'
	console.log('后端接口测试数据 : ', event)
	
	//返回数据给客户端
	return event
};
