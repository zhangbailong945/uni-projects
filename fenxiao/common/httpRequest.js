/**
 * 常用方法封装 请求，文件上传等
 * @author echo. 
 **/

const tui = {
	bloc_id:4,
	store_id:43,
	uploadUrl:'https://demo.hopesfire.com/api/upload/images',
	//接口地址
	interfaceUrl: function() {
		return 'https://demo.hopesfire.com/api'
	},
	toast: function(text, duration, success) {
		uni.showToast({
			title: text || "出错啦~",
			icon: success ? 'success' : 'none',
			duration: duration || 2000
		})
	},
	modal: function(title, content, showCancel, callback, confirmColor, confirmText) {
		uni.showModal({
			title: '提示',
			content: content,
			showCancel: showCancel,
			cancelColor: "#555",
			confirmColor: confirmColor || "#5677fc",
			confirmText: confirmText || "确定",
			success(res) {
				if (res.confirm) {
					callback && callback(true)
				} else {
					callback && callback(false)
				}
			}
		})
	},
	isAndroid: function() {
		const res = uni.getSystemInfoSync();
		return res.platform.toLocaleLowerCase() == "android"
	},
	isPhoneX: function() {
		const res = uni.getSystemInfoSync();
		let iphonex = false;
		let models=['iphonex','iphonexr','iphonexsmax','iphone11','iphone11pro','iphone11promax']
		const model=res.model.replace(/\s/g,"").toLowerCase()
		if (models.includes(model)) {
			iphonex = true;
		}
		return iphonex;
	},
	constNum: function() {
		let time = 0;
		// #ifdef APP-PLUS
		time = this.isAndroid() ? 300 : 0;
		// #endif
		return time
	},
	delayed: null,
	/**
	 * 请求数据处理
	 * @param string url 请求地址
	 * @param string method 请求方式
	 *  GET or POST
	 * @param {*} postData 请求参数
	 * @param bool isDelay 是否延迟显示loading
	 * @param bool isForm 数据格式
	 *  true: 'application/x-www-form-urlencoded'
	 *  false:'application/json'
	 * @param bool hideLoading 是否隐藏loading
	 *  true: 隐藏
	 *  false:显示
	 */
	request: function(url, method, postData, isDelay=1, isForm, hideLoading) {
		//接口请求
		let loadding = false;
		tui.delayed && uni.hideLoading();
		clearTimeout(tui.delayed);
		tui.delayed = null;
		if (!hideLoading) {
			console.log('不稍后了001')
			tui.delayed = setTimeout(() => {
				uni.showLoading({
					mask: true,
					title: '请稍候...',
					success(res) {
						console.log('不稍后了',res)
						loadding = true
					}
				})
			}, isDelay ? 1500 : 0)
		}
		console.log(tui.interfaceUrl() + url,tui.bloc_id,tui.store_id,'isForm'+isForm,isForm ? 'application/x-www-form-urlencoded' : 'application/json')
		if(tui.bloc_id){
			url = url+'?bloc_id='+tui.bloc_id
		}
		
		if(tui.store_id){
			url = url+'&store_id='+tui.store_id
		}

		if(tui.getToken()){
			url = url+'&access-token='+tui.getToken()
		}	
		
		return new Promise((resolve, reject) => {
			uni.request({
				url: tui.interfaceUrl() + url,
				data: postData,
				header: {
					'content-type': isForm  ? 'application/json':'application/x-www-form-urlencoded',
					'access-token': tui.getToken(),
				},
				method: method, //'GET','POST'
				dataType: 'json',
				success: (res) => {
					clearTimeout(tui.delayed)
					console.log('隐藏加载',loadding,hideLoading)
					tui.delayed = null;
					if (loadding && !hideLoading) {
						console.log('隐藏加载')
						uni.hideLoading()
					}
					console.log('登录信息已失效',res.data.name)
					if(res.data.name=="Unauthorized" && res.data.code==0){
						res.data.message = '登录失效，请重新登录'
						uni.clearStorageSync()
						console.log('登录信息已失效01',res.data.name)
						tui.modal("登录提示", '登录信息已失效，请重新登录', false,() => {
							console.log('登录信息已失效02',res.data.name)
							//store.commit("logout") 登录页面执行
							uni.navigateTo({
								url: '/pages/common/login/wechatlogin',
								complete(res) {
									console.log('去登陆',res)
								}
							})
						},'','去登录')
						return;
					}
					
					resolve(res.data)
				},
				fail: (res) => {
					console.log('登录跳转失败',res)
					clearTimeout(tui.delayed)
					tui.delayed = null;
					tui.toast("网络不给力，请稍后再试~")
					reject(res)
				}
			})
		})
	},
	/**
	 * 上传文件
	 * @param string url 请求地址
	 * @param string src 文件路径
	 */
	uploadFile: function(src) {
		let that = this
		uni.showLoading({
			title: '请稍候...'
		})
		return new Promise((resolve, reject) => {
			const uploadTask = uni.uploadFile({
				url: tui.uploadUrl+'?access-token='+ tui.getToken(),
				filePath: src,
				name: 'file',
				// header: {
				// 	'Authorization': tui.getToken()
				// },
				formData: {
					'user': 'test'
				},
				success: function(res) {
					console.log(res)
					let img = JSON.parse(res.data)
					
					uni.hideLoading()
					console.log('图片上传',img,res)
					// if (res.code == 200) {
					// 	//返回图片地址
					// 	let fileObj = img.attachment;
					// 	resolve(fileObj)
					// } else {
					// 	that.toast(res.msg);
					// }
					resolve(img)
				},
				fail: function(res) {
					console.log('错误',res)
					reject(res)
					that.toast(res.msg);
				}
			})
		})
	},
	tuiJsonp: function(url, callback, callbackname) {
		// #ifdef H5
		window[callbackname] = callback;
		let tuiScript = document.createElement("script");
		tuiScript.src = url;
		tuiScript.type = "text/javascript";
		document.head.appendChild(tuiScript);
		document.head.removeChild(tuiScript);
		// #endif
	},
	store: function(){
		let _this = this
		uni.showLoading();
		return new Promise((resolve, reject) => {
			tui.request("/store/info","GET",{store_id:tui.store_id}).then((res)=>{
				console.log(res)
				if (res.code == 200) {
					getApp().globalData.storeInfo = res.data
				}
				uni.hideLoading();
				resolve(res.data)
			}).catch((res)=>{})
		})
		
	},
	/**
	 * 授权登录
	 */
	getUserInfo : function(callback) {
		  let _this = this
		  uni.showLoading({
			title: "正在登录",
			mask: true
		  });
		  // 执行微信登录
		  // 微信登录
		  uni.login({
			// provider: 'weixin',
			success: function (loginRes) {
				  console.log(loginRes,loginRes.authResult);
				  // 获取用户信息
				  uni.getUserInfo({
					provider: 'weixin',
					success: function (infoRes) {
						uni.showLoading();
						console.log('用户昵称为：' + infoRes.userInfo.nickName,infoRes.userInfo);
						_this.wechatsignup(infoRes,loginRes.code,callback)
						
					},
					fail(e) {
						console.log(e)
					}
				  });
			},
			fail(e) {
				console.log(e)
			}
		  });
	
	},
	// 微信登录
	wechatsignup:function(infoRes,code,callback){
				console.log(infoRes)
				// 获取用户token
				this.request("/wechat/basics/signup","POST",{
						code:code,
						avatarUrl:infoRes.userInfo.avatarUrl,
						nickname:infoRes.userInfo.nickName,
						gender:infoRes.userInfo.gender,
						country:infoRes.userInfo.country,
						city:infoRes.userInfo.city,
						province:infoRes.userInfo.province,
						openid:infoRes.userInfo.openId?infoRes.userInfo.openId:'',
						unionid:infoRes.userInfo.unionId?infoRes.userInfo.unionId:'',
					}).then((res)=>{
					console.log(res.data)
					if (res.code == 200) {
						uni.hideLoading();
						console.log('okok1',res.code,res)
						if(res.code==200){
							uni.setStorageSync('access_token', res.data.access_token);
							uni.setStorageSync('expiration_time', res.data.expiration_time);
							uni.setStorageSync('fans', res.data.fans);
							uni.setStorageSync('member', res.data.member);
							console.log(res);
							callback && callback();
						}
						
					} else {
						this.toast(res.message);
					}
				}).catch((res)=>{})
				
				
	},
	// 校验有效期
	checkCacheTime: function(keys){
		console.log(keys,'校验start')
		var timestamp = Date.parse(new Date());
		if(uni.getStorageSync(keys)==''){
			return true;
		}
		let cacheVal = uni.getStorageSync(keys).split('_');	
		let cacheValTime = cacheVal[cacheVal.length-1];
		let expiration_time= uni.getStorageSync('expiration_time');
		if(parseInt(cacheValTime)+parseInt(expiration_time)<=timestamp/1000){
			if(keys=='access_token'){
				// 缓存过期了
				uni.setStorageSync('access_token', '');
				uni.setStorageSync('fans', {});
				uni.setStorageSync('expiration_time',0);
				uni.setStorageSync('member',{});
			}else{
				uni.setStorageSync('keys', '');
			}
			console.log('过期了',cacheValTime,expiration_time,timestamp)
			return  true;
		}else{
			console.log('没过期',cacheValTime,expiration_time,timestamp)
			return  false;
		}
	},
	getCitylist:function(){
		return new Promise((resolve, reject) => {
			this.request("/map/citylist","GET",{}).then((res)=>{
				console.log(res.data)
				if (res.code == 200) {
						uni.setStorageSync('Citylist', res.data);
						console.log(res);
				} else {
					this.toast(res.message);
				}
				resolve(res.data)
			}).catch((res)=>{
				reject(res)
			})
		})
	},
	//设置用户信息
	setUserInfo: function(mobile, token) {
		uni.setStorageSync("access_token", token)
		uni.setStorageSync("thorui_mobile", mobile)
	},
	//获取token
	getToken() {
		return uni.getStorageSync("access_token")
	},
	//判断是否登录
	isLogin: function() {
		return uni.getStorageSync('access_token') != '' && uni.getStorageSync('fans') != '' && !this.checkCacheTime('access_token');
		return uni.getStorageSync("thorui_mobile") ? true : false
	},
	//跳转页面，校验登录状态
	href(url, isVerify) {
		if (isVerify && !tui.isLogin()) {
			uni.navigateTo({
				url: '/pages/common/login/login'
			})
		} else {
			uni.navigateTo({
				url: url
			});
		}
	}
}

export default tui
