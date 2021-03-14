

/* 常用正则 */
let regExps = {
	email: /^[0-9a-zA-Z_]+@[0-9a-zA-Z_]+[\.]{1}[0-9a-zA-Z]+[\.]?[0-9a-zA-Z]+$/, //邮箱
	mobile: /^(?:1\d{2})-?\d{5}(\d{3}|\*{3})$/, //手机号码
	qq: /^[1-9][0-9]{4,9}$/, //QQ
	befitName: /^[a-z0-9A-Z\u4e00-\u9fa5]+$/, //合适的用户名，中文,字母,数字
	befitPwd: /^[a-z0-9A-Z_]+$/, //合适的密码，字母,数字,下划线
	allNumber: /^[0-9]+.?[0-9]$/ //全部为数字
}


/* 获取元素自定义属性值-当前事件元素 */
let getData = (el, key) => {
	if (key) {
		return el.currentTarget.dataset[key];
	} else {
		return el.currentTarget.dataset;
	}
}

/* 获取元素大小及位置 */
let getRect = (selector) => {
	return new Promise((resolve, reject) => {
		let view = uni.createSelectorQuery().select(selector);
		view.fields({
			size: true,
			rect: true
		}, (res) => {
			resolve(res);
		}).exec();
	})
}

let pushdArray = function(arr, index, value) {	
	arr[index].push(value);
	return arr;
};


export default {
	regExps,
	getData,
	getRect,
	pushdArray,
}
