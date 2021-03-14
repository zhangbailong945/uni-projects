<template>
	<view>
		<tui-tabbar :tabBar="tabBar2" :selectedColor="selectedColor" :hump="false"  :current="current" @click="tabbarSwitch"></tui-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,				
				selectedColor:"#F74D54",
				tabBar2: [{
						"pagePath": "/pages/index/index",
						"text": "首页",
						"iconPath": "/static/images/tabbar/index.png",
						"selectedIconPath": "/static/images/tabbar/index_active.png"
					},
					{
						"pagePath": "/pages/classify/classify",
						"text": "分类",
						"iconPath": "/static/images/tabbar/cate.png",
						// "hump": true,
						"selectedIconPath": "/static/images/tabbar/cate_active.png"
					},
					{
						"pagePath": "/pages/shopcart/shopcart",
						"text": "购物车",
						"iconPath": "/static/images/tabbar/cart.png",
						"selectedIconPath": "/static/images/tabbar/cart_active.png",
						"num": 2,
						"isDot": true,
						"verify": true
					},
					{
						"pagePath": "/pages/my/my",
						"text": "我的",
						"iconPath": "/static/images/tabbar/thor_gray.png",
						"selectedIconPath": "/static/images/tabbar/thor_active.png",
						"num": 2,
						"isDot": true,
						"verify": true
					}
				],
			}
		},
		props:{
			currentindex:{
				type: Number,
				default: 0
			}
		},
		created() {
			this.current = this.currentindex
		},
		methods: {
			tabbarSwitch(e) {
				//获取登录状态，此处默认未登录
				let isLogin=false
				console.log(e.pagePath)
				
				uni.redirectTo({
					url:e.pagePath,
					complete(res) {
						console.log(res)
					}
				})
				this.current = e.index
				
				// if(e.verify && !isLogin){
				// 	this.tui.toast("您还未登录，请先登录")
				// }else{
				// 	this.current = e.index
				// }
			},
		}
	}
</script>

<style>

</style>
