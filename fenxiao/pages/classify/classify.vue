<template>
	<view class="container">
		<view class="tui-searchbox">
			<view class="tui-search-input" @tap="search">
				<icon type="search" :size="13" color="#999"></icon>
				<text class="tui-search-text">搜索商品</text>
			</view>
		</view>

		<scroll-view scroll-y scroll-with-animation class="tab-view" :scroll-into-view="scrollViewId" :style="{ height: height + 'px', top: top + 'px' }">
			<view :id="`id_${index}`" v-for="(item, index) in categoryList" :key="index" class="tab-bar-item" :class="[currentTab == index ? 'active' : '']" 
			:data-current="index" @tap.stop="swichNav">
				<text>{{ item.name }}</text>
			</view>
		</scroll-view>
		<block v-for="(item, index) in categoryList" :key="index">
			<scroll-view scroll-y class="right-box" :style="{ height: height + 'px', top: top + 'px' }" v-if="currentTab == index">
				<!--内容部分 start 自定义可删除-->
				<view class="page-view">
					<swiper indicator-dots autoplay circular :interval="5000" :duration="150" class="swiper">
						<swiper-item @tap.stop="detail" :data-goods_id="item.goods_id">
							<image :src="item.image_id" class="slide-image" />
						</swiper-item>
					</swiper>
					<view class="class-box">
						<view class="class-item" >
							<view class="class-name">{{ item.name }}</view>
							<view class="g-container">
								<view class="g-box" @tap.stop="productList" :data-key="child.category_id"  v-for="(child, childIndex) in item.child" :key="childIndex">
									<image :src="child.image_id" class="g-image" />
									<view class="g-title">{{ child.name }}</view>
								</view>
							</view>
						</view>

					
					</view>
				</view>
				<!--内容部分 end 自定义可删除-->
			</scroll-view>
		</block>
		<tab-bar :currentindex="currentTabIndex"></tab-bar>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentTabIndex:1,
			categoryList:[],
			height: 0, //scroll-view高度
			top: 0,
			currentTab: 0, //预设当前项的值
			scrollViewId:"id_0"
		};
	},
	onLoad: function(options) {
		setTimeout(() => {
			uni.getSystemInfo({
				success: res => {
					let header = 92;
					let top = 0;
					//#ifdef H5
					top = 44;
					//#endif
					this.height = res.windowHeight - uni.upx2px(header);
					this.top = top + uni.upx2px(header);
				}
			});
		}, 50);
		
		let that = this
		that.initPage();
		
	},
	methods: {
		initPage(){
			let that = this 
			that.getcate();
		},
		
		getcate(e){
			let that = this
			let currentId = that.currentId
			that.tui.request("/diandi_shop/category/list","GET",{}).then((res)=>{
				console.log(res)
				if (res.code == 200) {
					let cateData = res.data;
					that.categoryList = cateData
					let childCate = []
					cateData.forEach((item,index)=>{
						item.child.forEach(child=>{
							childCate.push(child)
						})
					})
					
					that.childCate = childCate
					console.log('所有子类',cateData,childCate)
				} else {
					that.tui.toast(res.message);
				}
			}).catch((res)=>{
				console.log("错误le ma ",res);
			})
			
		},
		// 点击标题切换当前页时改变样式
		swichNav: function(e) {
			let cur = e.currentTarget.dataset.current;
			if (this.currentTab == cur) {
				return false;
			} else {
				this.currentTab = cur;
				this.checkCor();
			}
		},
		//判断当前滚动超过一屏时，设置tab标题滚动条。
		checkCor: function() {
			if (this.currentTab > 6) {
				this.scrollViewId = `id_${this.currentTab - 2}`;
			} else {
				this.scrollViewId = `id_0`;
			}
		},
		detail: function(event) {
			let that = this
			let goods_id = event.currentTarget.dataset.goods_id
			console.log('商品idsss',goods_id)
			if(goods_id){
				uni.navigateTo({
					url: '../productDetail/productDetail?goods_id='+goods_id
				});
			}else{
				that.tui.toast('未设置商品');
			}
			
		},
		productList(e) {
			let key = e.currentTarget.dataset.key;
			uni.navigateTo({
				url: '../productList/productList?category_id=' + key
			});
		},
		search: function() {
			console.log('搜索')
			uni.navigateTo({
				url: '../search/search'
			});
		},
	}
};
</script>

<style>
page {
	background: #fcfcfc;
}

/* 左侧导航布局 start*/

/* 隐藏scroll-view滚动条*/

::-webkit-scrollbar {
	width: 0;
	height: 0;
	color: transparent;
}

.tui-searchbox {
	width: 100%;
	height: 92rpx;
	padding: 0 30rpx;
	box-sizing: border-box;
	background: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	position: fixed;
	left: 0;
	top: 0;
	/* #ifdef H5 */
	top: 44px;
	/* #endif */
	z-index: 100;
}

.tui-searchbox::after {
	content: '';
	position: absolute;
	border-bottom: 1rpx solid #d2d2d2;
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	bottom: 0;
	right: 0;
	left: 0;
}

.tui-search-input {
	width: 100%;
	height: 60rpx;
	background: #f1f1f1;
	border-radius: 30rpx;
	font-size: 26rpx;
	color: #999;
	display: flex;
	align-items: center;
	justify-content: center;
}

.tui-search-text {
	padding-left: 16rpx;
}

.tab-view {
	/* height: 100%; */
	width: 200rpx;
	position: fixed;
	left: 0;
	z-index: 10;
}

.tab-bar-item {
	width: 200rpx;
	height: 110rpx;
	background: #f6f6f6;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26rpx;
	color: #444;
	font-weight: 400;
}

.active {
	position: relative;
	color: #000;
	font-size: 30rpx;
	font-weight: 600;
	background: #fcfcfc;
}

.active::before {
	content: '';
	position: absolute;
	border-left: 8rpx solid #e41f19;
	height: 30rpx;
	left: 0;
}

/* 左侧导航布局 end*/

.right-box {
	width: 100%;
	position: fixed;
	padding-left: 220rpx;
	box-sizing: border-box;
	left: 0;
}

.page-view {
	width: 100%;
	overflow: hidden;
	padding-top: 20rpx;
	padding-right: 20rpx;
	box-sizing: border-box;
	padding-bottom: env(safe-area-inset-bottom);
}

.swiper {
	width: 100%;
	height: 220rpx;
	border-radius: 12rpx;
	overflow: hidden;
	transform: translateZ(0);
}

/* #ifdef MP-WEIXIN */
.swiper .wx-swiper-dot {
	width: 8rpx;
	height: 8rpx;
	display: inline-flex;
	background: none;
	justify-content: space-between;
}

.swiper .wx-swiper-dot::before {
	content: '';
	flex-grow: 1;
	background: rgba(255, 255, 255, 0.8);
	border-radius: 16rpx;
	overflow: hidden;
}

.swiper .wx-swiper-dot-active::before {
	background: #fff;
}

.swiper .wx-swiper-dot.wx-swiper-dot-active {
	width: 16rpx;
}

/* #endif */

/* #ifndef MP-WEIXIN */
>>> .swiper .uni-swiper-dot {
	width: 8rpx;
	height: 8rpx;
	display: inline-flex;
	background: none;
	justify-content: space-between;
}

>>> .swiper .uni-swiper-dot::before {
	content: '';
	flex-grow: 1;
	background: rgba(255, 255, 255, 0.8);
	border-radius: 16rpx;
	overflow: hidden;
}

>>> .swiper .uni-swiper-dot-active::before {
	background: #fff;
}

>>> .swiper .uni-swiper-dot.uni-swiper-dot-active {
	width: 16rpx;
}

/* #endif */

.slide-image {
	width: 100%;
	height: 220rpx;
}

.class-box {
	padding-top: 30rpx;
}

.class-item {
	background: #fff;
	width: 100%;
	box-sizing: border-box;
	padding: 20rpx;
	margin-bottom: 20rpx;
	border-radius: 12rpx;
}

.class-name {
	font-size: 22rpx;
}

.g-container {
	/* padding-top: 20rpx; */
	display: flex;
	display: -webkit-flex;
	justify-content: flex-start;
	flex-direction: row;
	flex-wrap: wrap;
}

.g-box {
	width: 33.3333%;
	text-align: center;
	padding-top: 40rpx;
}

.g-image {
	width: 120rpx;
	height: 120rpx;
}

.g-title {
	font-size: 22rpx;
}
</style>
