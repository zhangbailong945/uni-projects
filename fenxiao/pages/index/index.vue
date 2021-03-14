<template>
	<view>
		<tui-skeleton v-if="skeletonShow" backgroundColor="#fafafa" borderRadius="10rpx"></tui-skeleton>
		<view class="container">
			<!--header-->
			<view class="tui-header">
				<view class="tui-category tui-skeleton-rect" hover-class="opcity" :hover-stay-time="150" @tap="classify">
					<tui-icon name="manage-fill" color="#fff" :size="44" unit="rpx"></tui-icon>
					<view class="tui-category-scale">分类</view>
				</view>
				<view class="tui-rolling-search tui-skeleton-rect">
					<tui-icon name="search-2" :size="32" unit="rpx"></tui-icon>
					<!-- <icon type="search" :size="13" color="#999"></icon> -->
					<swiper vertical autoplay circular interval="8000" class="tui-swiper">
						<swiper-item v-for="(item, index) in hotSearch" :key="index"  class="tui-swiper-item" :data-key="item"  @tap="search($event)">
							<view class="tui-hot-item" >{{ item }}</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
			<!--header-->
			<view class="tui-header-banner">
				<view class="tui-hot-search tui-skeleton-rect">
					<view>热搜</view>
					<block v-for="(item,index) in hotSearch"  :key="index" >
						<view class="tui-hot-tag" :data-key="item" @tap="search($event)">{{item}}</view>
					</block>
				</view>
				<view class="tui-banner-bg tui-skeleton-rect">
					<view class="tui-primary-bg tui-route-left"></view>
					<view class="tui-primary-bg tui-route-right"></view>
					<!--banner-->
					<view class="tui-banner-box">
						<swiper
							:indicator-dots="true"
							:autoplay="true"
							:interval="5000"
							:duration="150"
							class="tui-banner-swiper"
							:circular="true"
							indicator-color="rgba(255, 255, 255, 0.8)"
							indicator-active-color="#fff"
						>
							<swiper-item v-for="(item, index) in banner" :key="index" @tap.stop="detail">
								<image :src="item.thumb" class="tui-slide-image" mode="scaleToFill" />
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>

			<view class="tui-product-category tui-skeleton-rect">
				<view class="tui-category-item" v-for="(item, index) in category" :key="index" 
				:data-category_id="item.category_id" :data-key="item.name" @tap="moreList">
					<image :src="item.image_id" class="tui-category-img tui-skeleton-rect" mode="scaleToFill"></image>
					<view class="tui-category-name">{{ item.name }}</view>
				</view>
			</view>

			<view class="tui-product-box tui-pb-20 tui-bg-white">
				<view class="tui-group-names tui-skeleton-rect" @tap="more">
					<tui-divider dividerColor="#dddddd" color="#000000" size="30" width="40%">{{storeData.newTitle}}</tui-divider>
				</view>
				<view class="tui-activity-box">
					<view class="tui-product-container tui-skeleton-rect" v-for="(item, index) in goodgiftList" :key="index">
						<!-- <template is="productItem" data="{{item,index:index,isList:isList}}" /> -->
						<!--商品列表-->
						<view class="tui-pro-item-gift tui-flex-list" hover-class="hover" 
							:hover-start-time="150" 
							 :data-goods_id="item.goods_id" @tap="detail($event)"
							>
							<image :src="item.thumb" class="tui-pro-img tui-proimg-list tui-skeleton-rect" mode="widthFix" />
							<view class="tui-pro-content">
								<view class="tui-pro-tit tui-skeleton-rect">{{ item.goods.goods_name }}</view>
								<view>
									<view class="tui-pro-price tui-skeleton-rect">
										<text class="tui-sale-price">￥{{ item.gift_price }}</text>
									</view>
								</view>
							</view>
						</view>
						<!--商品列表-->
					</view>
					
					<!-- <block v-for="(item, index) in goodgiftList" :key="index">	
						<image :src="item.thumb" class="tui-activity-img" mode="widthFix" :data-goods_id="item.goods_id" @tap="giftDetail($event)"></image>
					</block> -->
				</view>
			</view>


			<view class="tui-product-box tui-pb-20 tui-bg-white">
				<view class="tui-group-names tui-skeleton-rect" @tap="more">
					<tui-divider dividerColor="#dddddd" color="#000000" size="30" width="40%">新人专享</tui-divider>
				</view>
				<view class="tui-activity-box tui-skeleton-rect">
					<block v-for="(item, index) in exclusiveProduct" :key="index">	
						<image :src="item.goods.thumb" class="tui-activity-img" mode="widthFix" :data-goods_id="item.goods_id" @tap="detail($event)"></image>
					</block>
				</view>
			</view>

			<view class="tui-product-box tui-pb-20 tui-bg-white">
				<view class="tui-group-names tui-skeleton-rect" @tap="more">
					<tui-divider dividerColor="#dddddd" color="#000000" size="30" width="40%">新品推荐</tui-divider>
				</view>
				<view class="tui-new-box">
					<view class="tui-new-item tui-flex" :class="[index != 0 && index != 1 ? 'tui-new-mtop' : '']" v-for="(item, index) in newProduct" :key="index" 
					:data-goods_id="item.goods_id" @tap="detail($event)">
						<!-- <image :src="item.goods.thumb" class="tui-new-label"></image> -->
						<view class="tui-title-box tui-col-7">
							<view class="tui-new-title tui-skeleton-rect">{{ item.goods.goods_name }}</view>
							<view class="tui-new-price tui-skeleton-rect">
								<text class="tui-new-present">￥{{item.goods.goods_price  }}</text>
							</view>
							<view class="tui-new-price tui-skeleton-rect">
								<text class="tui-new-original">￥{{ item.goods.line_price}}</text>
							</view>
						</view>
						
						<image :src="item.goods.thumb" class="tui-new-img" mode="widthFix"></image>
					</view>
				</view>
			</view>

			<view class="tui-product-box">
				<view class="tui-group-names tui-skeleton-rect" @tap="more">
					<tui-divider dividerColor="#dddddd" color="#000000" size="30" width="40%">热门推荐</tui-divider>
				</view>
				<view class="tui-product-list">
					<view class="tui-product-container">
						<block v-for="(item, index) in hotProduct" :key="index" v-if="(index + 1) % 2 != 0">
							<!--商品列表-->
							<view class="tui-pro-item" hover-class="hover" :hover-start-time="150" :data-goods_id="item.goods_id" @tap="detail($event)">
								<image :src="item.goods.thumb" class="tui-pro-img tui-skeleton-rect" mode="widthFix" />
								<view class="tui-pro-content">
									<view class="tui-pro-tit tui-skeleton-rect">{{ item.goods.goods_name }}</view>
									<view>
										<view class="tui-pro-price">
											<text class="tui-sale-price tui-skeleton-rect">￥{{ item.goods.goods_price }}</text>
											<text class="tui-factory-price tui-skeleton-rect">￥{{ item.goods.line_price }}</text>
										</view>
										<view class="tui-pro-pay tui-skeleton-rect">{{ item.goods.sales_initial}}人付款</view>
									</view>
								</view>
							</view>
							<!--商品列表-->
							<!-- <template is="productItem" data="{{item,index:index}}" /> -->
						</block>
					</view>
					<view class="tui-product-container">
						<block v-for="(item, index) in hotProduct" :key="index" v-if="(index + 1) % 2 == 0">
							<!--商品列表-->
							<view class="tui-pro-item" hover-class="hover" :hover-start-time="150" :data-goods_id="item.goods_id" @tap="detail($event)">
								<image :src="item.goods.thumb" class="tui-pro-img tui-skeleton-rect" mode="widthFix" />
								<view class="tui-pro-content">
									<view class="tui-pro-tit tui-skeleton-rect">{{ item.goods.goods_name }}</view>
									<view>
										<view class="tui-pro-price">
											<text class="tui-sale-price tui-skeleton-rect">￥{{ item.goods.goods_price }}</text>
											<text class="tui-factory-price tui-skeleton-rect">￥{{ item.goods.line_price }}</text>
										</view>
										<view class="tui-pro-pay tui-skeleton-rect">{{ item.goods.sales_initial}}人付款</view>
									</view>
								</view>
							</view>
							<!--商品列表-->
							<!-- <template is="productItem" data="{{item,index:index}}" /> -->
						</block>
					</view>
				</view>
			</view>

			<!--加载loadding-->
			<tui-loadmore v-if="loadding" :index="3" type="red"></tui-loadmore>
			<!-- <tui-nomore v-if="!pullUpOn"></tui-nomore> -->
			<!--加载loadding-->
			<view class="tui-safearea-bottom"></view>
			
			<tab-bar :currentindex="currentTabIndex"></tab-bar>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			currentTabIndex:0,
			storeData:{},
			current: 0,
			hotProduct:[],
			newProduct:[],
			hotSearch: [],
			exclusiveProduct:[],
			banner: [],
			goodgiftList:[],
			category: [
				
			],
			newProduct: [
			],
			productList: [
				
			],
			member_id:0,
			pageIndex: 1,
			loadding: false,
			pullUpOn: true,
			skeletonShow:true
		};
	},
	onLoad(options) {
		
		console.log('携带参数',options.scene)
		let that = this
		that.initPage()
		
		
		if(options.scene){
			that.member_id = options.scene
			// that.link(options.scene)
		}
		setTimeout(() => {
			this.skeletonShow = false
		}, 1800);
	},
	onShow() {
		let that = this
		if(that.member_id){
			that.link(that.member_id)
		}
	},
	methods: {
		link(member_id){
			let that = this
			that.tui.request("/diandi_distribution/level/link","POST",{
				member_id:member_id
			}).then((res)=>{
				console.log(res)
				if (res.code == 200) {
					console.log(res)
				} else {
					this.tui.toast(res.message);
				}
			}).catch((res)=>{})
		},
		initPage(){
			let that = this
			that.getSlide();
			that.getCate();
			that.getGoodsNewAdv();
			that.getGoodsHotAdv();
			that.getExclusive();
			that.goodgift();
			that.tui.store().then((res)=>{
				console.log('AAAAAAAAAA',res)
				uni.setNavigationBarTitle({
				    title:res.name
				});
				that.storeData = res
				that.hotSearch = res.hotSearch.split(',')
				console.log('关键词热搜',res.hotSearch,res.hotSearch.split(','))
			}).catch((res)=>{
				console.log('shibai',res)
			});
			
			
			
		},
		detail: function(event) {
			let that = this
			let goods_id = event.currentTarget.dataset.goods_id
			console.log('商品idsss',goods_id)
			uni.navigateTo({
				url: '../productDetail/productDetail?goods_id='+goods_id
			});
		},
		giftDetail: function(event) {
			let that = this
			let goods_id = event.currentTarget.dataset.goods_id
			console.log('商品idsss',goods_id)
			uni.navigateTo({
				url: '../giftDetail/giftDetail?goods_id='+goods_id
			});
		},
		coupon() {
			uni.navigateTo({
				url: '../coupon/coupon'
			});
		},
		more: function(e) {
			let key = e.currentTarget.dataset.key || '';
			uni.navigateTo({
				url: '../productList/productList?searchKey=' + key
			});
		},
		moreList:function(e){
		    let category_id = e.currentTarget.dataset.category_id || ''; 
			console.log(category_id)
			
			uni.navigateTo({
				url: '../productList/productList?category_id=' + category_id
			});
			
		},
		search: function(e) {
			let key = e.currentTarget.dataset.key || '';
			console.log('搜索',key,e)
			uni.navigateTo({
				url: '../search/search?key=' + key
			});
		},
		getExclusive:function(){
			let that = this
			that.tui.request("/diandi_distribution/index/goodsadv","GET",{
				mark:'index_exclusive',
				page:1,
				pageSize:2
			}).then((res)=>{
				console.log(res)
				if (res.code == 200) {
					this.exclusiveProduct = res.data.index_exclusive
				} else {
					this.tui.toast(res.message);
				}
			}).catch((res)=>{})
		},
		classify:function(){
			uni.navigateTo({
				url:"../classify/classify"
			})
		},
		getGoodsNewAdv:function(){
			let that = this
			that.tui.request("/diandi_distribution/index/goodsadv","GET",{
				mark:'index_new',
				page:1,
				pageSize:4
			}).then((res)=>{
				console.log(res)
				if (res.code == 200) {
					this.newProduct = res.data.index_new
				} else {
					this.tui.toast(res.message);
				}
			}).catch((res)=>{})
		},
		getGoodsHotAdv:function(){
			let that = this
			that.tui.request("/diandi_distribution/index/goodsadv","GET",{
				mark:'index_hot',
				page:1,
				pageSize:4
			}).then((res)=>{
				console.log(res)
				if (res.code == 200) {
					that.hotProduct = res.data.index_hot
					console.log('hotProduct',that.hotProduct)
				} else {
					that.tui.toast(that.message);
				}
			}).catch((res)=>{})
		},
		goodgift:function(){
			let that = this
			that.tui.request("/diandi_distribution/goods/goodgift","GET",{
				page:1,
				pageSize:4
			}).then((res)=>{
				console.log(res)
				if (res.code == 200) {
					this.goodgiftList = res.data
				} else {
					this.tui.toast(res.message);
				}
			}).catch((res)=>{})
		},
		getCate:function(){
			let that = this
			that.tui.request("/diandi_shop/category/list","GET",{}).then((res)=>{
				console.log(res)
				if (res.code == 200) {
					this.category = res.data
				} else {
					this.tui.toast(res.message);
				}
			}).catch((res)=>{})
				
		},
		getSlide:function(){
			
			this.tui.request("/diandi_distribution/index/slides","GET",{}).then((res)=>{
				console.log(res)
				if (res.code == 200) {
					this.banner = res.data
				} else {
					this.tui.toast(res.message);
				}
			}).catch((res)=>{})
		}
	},
	onPullDownRefresh: function() {
		let loadData = JSON.parse(JSON.stringify(this.productList));
		loadData = loadData.splice(0, 10);
		this.productList = loadData;
		this.pageIndex = 1;
		this.pullUpOn = true;
		this.loadding = false;
		uni.stopPullDownRefresh();
	},
	onReachBottom: function() {
		if (!this.pullUpOn) return;
		this.loadding = true;
		if (this.pageIndex == 4) {
			this.loadding = false;
			this.pullUpOn = false;
		} else {
			let loadData = JSON.parse(JSON.stringify(this.productList));
			loadData = loadData.splice(0, 10);
			if (this.pageIndex == 1) {
				loadData = loadData.reverse();
			}
			this.productList = this.productList.concat(loadData);
			this.pageIndex = this.pageIndex + 1;
			this.loadding = false;
		}
	}
};
</script>

<style>
page {
	background-color: #f7f7f7;
}

.container {
	padding-bottom: 100rpx;
	color: #333;
}


.tui-header {
	width: 100%;
	height: 100rpx;
	padding: 0 30rpx 0 20rpx;
	box-sizing: border-box;
	background-color: #e41f19;
	display: flex;
	align-items: center;
	justify-content: space-between;
	position: fixed;
	left: 0;
	top: 0;
	/* #ifdef H5 */
	top: 44px;
	/* #endif */
	z-index: 999;
}

.tui-rolling-search {
	width: 100%;
	height: 60rpx;
	border-radius: 35rpx;
	padding: 0 40rpx 0 30rpx;
	box-sizing: border-box;
	background-color: #fff;
	display: flex;
	align-items: center;
	flex-wrap: nowrap;
	color: #999;
}

.tui-category {
	font-size: 24rpx;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	margin: 0;
	margin-right: 22rpx;
	flex-shrink: 0;
}

.tui-category-scale {
	transform: scale(0.7);
	line-height: 24rpx;
}

.tui-icon-category {
	line-height: 20px !important;
	margin-bottom: 0 !important;
}

.tui-swiper {
	font-size: 26rpx;
	height: 60rpx;
	flex: 1;
	padding-left: 12rpx;
}

.tui-swiper-item {
	display: flex;
	align-items: center;
}

.tui-hot-item {
	line-height: 26rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.tui-header-banner {
	padding-top: 100rpx;
	box-sizing: border-box;
	background: #e41f19;
}

.tui-hot-search {
	color: #fff;
	font-size: 24rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 20rpx;
	box-sizing: border-box;
	position: relative;
	z-index: 2;
}

.tui-hot-tag {
	background-color: rgba(255, 255, 255, 0.15);
	padding: 10rpx 24rpx;
	border-radius: 30rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	line-height: 24rpx;
}

.tui-banner-bg {
	display: flex;
	height: 180rpx;
	background-color: #e41f19;
	position: relative;
}

.tui-primary-bg {
	width: 50%;
	display: inline-block;
	height: 224rpx;
	border: 1px solid transparent;
	position: relative;
	z-index: 1;
	background-color: #e41f19;
}

.tui-route-left {
	transform: skewY(8deg);
}

.tui-route-right {
	transform: skewY(-8deg);
}

.tui-banner-box {
	width: 100%;
	padding: 0 20rpx;
	box-sizing: border-box;
	position: absolute;
	/* overflow: hidden; */
	z-index: 99;
	bottom: -80rpx;
	left: 0;
}

.tui-banner-swiper {
	width: 100%;
	height: 240rpx;
	border-radius: 12rpx;
	overflow: hidden;
	transform: translateY(0);
}

.tui-slide-image {
	width: 100%;
	height: 240rpx;
	display: block;
}

/* #ifdef MP-WEIXIN */
.tui-banner-swiper .wx-swiper-dot {
	width: 8rpx;
	height: 8rpx;
	display: inline-flex;
	background: none;
	justify-content: space-between;
}

.tui-banner-swiper .wx-swiper-dot::before {
	content: '';
	flex-grow: 1;
	background-color: rgba(255, 255, 255, 0.8);
	border-radius: 16rpx;
	overflow: hidden;
}

.tui-banner-swiper .wx-swiper-dot-active::before {
	background-color: #fff;
}

.tui-banner-swiper .wx-swiper-dot.wx-swiper-dot-active {
	width: 16rpx;
}

/* #endif */

/* #ifndef MP-WEIXIN */
>>> .tui-banner-swiper .uni-swiper-dot {
	width: 8rpx;
	height: 8rpx;
	display: inline-flex;
	background-color: none;
	justify-content: space-between;
}

>>> .tui-banner-swiper .uni-swiper-dot::before {
	content: '';
	flex-grow: 1;
	background-color: rgba(255, 255, 255, 0.8);
	border-radius: 16rpx;
	overflow: hidden;
}

>>> .tui-banner-swiper .uni-swiper-dot-active::before {
	background-color: #fff;
}

>>> .tui-banner-swiper .uni-swiper-dot.uni-swiper-dot-active {
	width: 16rpx;
}

/* #endif */

.tui-product-category {
	background-color: #fff;
	padding: 80rpx 20rpx 30rpx 20rpx;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	/* justify-content: space-between; */
	flex-wrap: wrap;
	font-size: 24rpx;
	color: #555;
	margin-bottom: 20rpx;
}

.tui-category-item {
	width: 20%;
	height: 118rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: column;
	padding-top: 30rpx;
}

.tui-category-img {
	height: 80rpx;
	width: 80rpx;
	display: block;
}

.tui-category-name {
	line-height: 24rpx;
}

.tui-product-box {
	margin-top: 20rpx;
	padding: 0 20rpx;
	box-sizing: border-box;
}

.tui-pb-20 {
	padding-bottom: 20rpx;
}

.tui-bg-white {
	background-color: #fff;
}

.tui-group-name {
	width: 100%;
	font-size: 32rpx;
	font-weight: bold;
	text-align: center;
	padding: 24rpx 0;
	display: flex;
	align-items: center;
	justify-content: center;
}

.tui-activity-box {
	display: flex;
	border-radius: 12rpx;
	overflow: hidden;
}

.tui-activity-img {
	width: 50%;
	display: block;
}

.tui-new-box {
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
}

.tui-new-item {
	width: 49%;
	height: 200rpx;
	padding: 0 20rpx;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	background: #f5f2f9;
	position: relative;
	border-radius: 12rpx;
}

.tui-new-mtop {
	margin-top: 2%;
}

.tui-title-box {
	font-size: 24rpx;
}

.tui-new-title {
	line-height: 32rpx;
	word-break: break-all;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}

.tui-new-price {
	padding-top: 18rpx;
}

.tui-new-present {
	color: #ff201f;
	font-weight: bold;
}

.tui-new-original {
	display: inline-block;
	color: #a0a0a0;
	text-decoration: line-through;
	padding-left: 12rpx;
	transform: scale(0.8);
	transform-origin: center center;
}

.tui-new-img {
	width: 160rpx;
	height: 160rpx;
	display: block;
	flex-shrink: 0;
}

.tui-new-label {
	width: 56rpx;
	height: 56rpx;
	border-top-left-radius: 12rpx;
	position: absolute;
	left: 0;
	top: 0;
}

.tui-product-list {
	display: flex;
	justify-content: space-between;
	flex-direction: row;
	flex-wrap: wrap;
	box-sizing: border-box;
	/* padding-top: 20rpx; */
}

.tui-product-container {
	flex: 1;
	margin-right: 2%;
}

.tui-product-container:last-child {
	margin-right: 0;
}

.tui-pro-item {
	width: 100%;
	margin-bottom: 4%;
	background: #fff;
	box-sizing: border-box;
	border-radius: 12rpx;
	overflow: hidden;
}

.tui-pro-img {
	width: 100%;
	display: block;
}

.tui-pro-content {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	box-sizing: border-box;
	padding: 20rpx;
}

.tui-pro-tit {
	color: #2e2e2e;
	font-size: 26rpx;
	word-break: break-all;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}

.tui-pro-price {
	padding-top: 18rpx;
}

.tui-sale-price {
	font-size: 34rpx;
	font-weight: 500;
	color: #e41f19;
}

.tui-factory-price {
	font-size: 24rpx;
	color: #a0a0a0;
	text-decoration: line-through;
	padding-left: 12rpx;
}

.tui-pro-pay {
	padding-top: 10rpx;
	font-size: 24rpx;
	color: #656565;
}
</style>
