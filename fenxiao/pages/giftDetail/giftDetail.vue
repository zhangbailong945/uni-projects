<template>
	<view class="container">
		<!--header-->
		<view class="tui-header-box" :style="{ height: height + 'px', background: 'rgba(255,255,255,' + opcity + ')' }">
			<view class="tui-header" :style="{ paddingTop: top + 'px', opacity: opcity }">商品详情</view>
			<view class="tui-header-icon" :style="{ marginTop: top + 'px' }">
				<view class="tui-icon-box" :style="{ backgroundColor: 'rgba(0, 0, 0,' + iconOpcity + ')' }" @tap="back">
					<tui-icon name="arrowleft" :size="30" :color="opcity >= 1 ? '#000' : '#fff'"></tui-icon>
				</view>

				<view class="tui-icon-box tui-icon-ml" :style="{backgroundColor: 'rgba(0, 0, 0,' + iconOpcity + ')'}" @tap.stop="openMenu">
					<tui-icon name="more-fill" :size="20" :color="opcity >= 1 ? '#000' : '#fff'"></tui-icon>
					<tui-badge type="red" :scaleRatio="0.8" absolute top="0" right="-4rpx">5</tui-badge>
				</view>

			</view>
		</view>
		<!--header-->

		<!--banner-->
		<view class="tui-banner-swiper" v-if="goodsdetail.slides" >
			<swiper :autoplay="true" :interval="5000" :duration="150" :circular="true" :style="{ height: scrollH + 'px' }"
			 @change="bannerChange">
				<block v-for="(item, index) in goodsdetail.slides" :key="index">
					<swiper-item :data-index="index" @tap.stop="previewImage">
						<image :src="item.url" class="tui-slide-image" :style="{ height: scrollH + 'px' }"  v-if="item.type=='image'"/>
						<video :src="item.url"
						class="tui-slide-image"
						:ssautoplay="false" loop 
						:show-play-btn="true" 
						:controls="true"
						:poster="goodsdetail.thumb"
						objectFit="cover" 
						v-if="item.type=='video' && item.url"
						></video>
						
					</swiper-item>
				</block>
			</swiper>
			<view class="tui-banner-tag">
				<tui-tag padding="12rpx 18rpx" type="translucent" shape="circleLeft" :scaleMultiple="0.82" originRight>{{ bannerIndex + 1 }}/{{ banner.length }}</tui-tag>
			</view>
		</view>

		<!--banner-->

		<view class="tui-pro-detail" v-if="goodsdetail.goods_price">
			<view class="tui-product-title tui-border-radius">
				<view class="tui-pro-pricebox tui-padding">
					<view class="tui-pro-price">
						<view>
							<text>￥</text>
							<text class="tui-price">{{goodsdetail.goods_price}}</text>
						</view>
						<tui-tag padding="10rpx 20rpx" size="24rpx" plain type="high-green" shape="circle" :scaleMultiple="0.8">{{goodsdetail.label}}</tui-tag>
					</view>
					<view class="tui-collection tui-size" @tap="collecting">
						<tui-icon :name="collected ? 'like-fill' : 'like'" :color="collected ? '#ff201f' : '#333'" :size="20"></tui-icon>
						<view class="tui-scale-collection" :class="{'tui-icon-red':collected}">收藏</view>
					</view>
				</view>
				<view class="tui-original-price">
					价格
					<text class="tui-line-through">￥{{goodsdetail.line_price}}</text>
				</view>
				<view class="tui-pro-titbox">
					<view class="tui-pro-title">{{goodsdetail.goods_name}}</view>
					<button open-type="share" class="tui-share-btn tui-share-position" @tap="onShare">
						<tui-tag type="gray" shape="circleLeft" padding="12rpx 16rpx">
							<view class="tui-share-box">
								<tui-icon name="partake" color="#999" :size="15"></tui-icon>
								<text class="tui-share-texttui-size">分享</text>
							</view>
						</tui-tag>
					</button>
				</view>
				<view class="tui-padding">
					<view class="tui-sub-title tui-size">此商品将于2019-06-28,10点结束闪购特卖，时尚美饰联合专场</view>
					<view class="tui-sale-info tui-size">
						<view>销量:{{goodsdetail.sales_initial}}</view>
						<view>库存: {{goodsdetail.stock}}</view>
						<view>浏览量: {{goodsdetail.browse}}</view>
					</view>
				</view>
			</view>

			<!-- <view class="tui-discount-box tui-radius-all tui-mtop">
				<view class="tui-list-cell" @tap="coupon">
					<view class="tui-bold tui-cell-title">领券</view>
					<view class="tui-flex-center">
						<tui-tag type="red" shape="circle" padding="12rpx 24rpx" size="24rpx">满99减8</tui-tag>
						<tui-tag margin="0 0 0 20rpx" type="red" padding="12rpx 24rpx" size="24rpx" shape="circle">满59减5</tui-tag>
					</view>
					<view class="tui-ml-auto">
						<tui-icon name="more-fill" :size="20" color="#666"></tui-icon>
					</view>
				</view>

				<view class="tui-list-cell tui-last" @tap="showPopup">
					<view class="tui-bold tui-cell-title">促销</view>
					<view>
						<view class="tui-promotion-box">
							<tui-tag originLeft padding="12rpx 24rpx" :scaleMultiple="0.8" shape="circle" type="red" plain>多买优惠</tui-tag>
							<text>满1件，立减最低1件商品价格，包邮（限中国内地）</text>
						</view>
						<view class="tui-promotion-box">
							<tui-tag originLeft padding="12rpx 24rpx" :scaleMultiple="0.8" shape="circle" type="red" plain>满额返券</tui-tag>
							<text>满2件，立减最低2件商品价格，包邮（限中国内地）</text>
						</view>
						<view class="tui-promotion-box">
							<tui-tag originLeft padding="12rpx 24rpx" :scaleMultiple="0.8" shape="circle" type="red" plain>特别赠品</tui-tag>
							<text>满3件，立减最低3件商品价格，包邮（限中国内地）</text>
						</view>
					</view>
					<view class="tui-right">
						<tui-icon name="more-fill" :size="20" color="#666"></tui-icon>
					</view>
				</view>
			</view> -->
			
			
			
			
			<view class="tui-basic-info tui-mtop tui-radius-all">
				<view class="tui-list-cell" @tap="showPopup" v-if="goodsdetail.spec_type==1">
					<view class="tui-bold tui-cell-title">已选</view>
					<view class="tui-selected-box">
						<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
							{{sItem.name}}
						</text>
					</view>
					<view class="tui-ml-auto">
						<tui-icon name="more-fill" :size="20" color="#666"></tui-icon>
					</view>
				</view>
				<!-- <view class="tui-list-cell" @tap="showPopup">
					<view class="tui-bold tui-cell-title">送至</view>
					<view class="tui-addr-box">
						<view class="tui-addr-item">北京朝阳区三环到四环之间</view>
						<view class="tui-addr-item">今日23:59前完成下单，预计6月28日23:30前发货，7月1日24:00前送达</view>
					</view>
					<view class="tui-right">
						<tui-icon name="more-fill" :size="20" color="#666"></tui-icon>
					</view>
				</view>
				<view class="tui-list-cell tui-last">
					<view class="tui-bold tui-cell-title">运费</view>
					<view class="tui-selected-box">在线支付免运费</view>
				</view> -->
				<view class="tui-guarantee">
					<!-- <view class="tui-guarantee-item">
						<tui-icon name="circle-selected" :size="14" color="#999"></tui-icon>
						<text class="tui-pl">可配送海外</text>
					</view> -->
					<view class="tui-guarantee-item">
						<tui-icon name="circle-selected" :size="14" color="#999"></tui-icon>
						<text class="tui-pl">店铺发货&售后</text>
					</view>
					<view class="tui-guarantee-item">
						<tui-icon name="circle-selected" :size="14" color="#999"></tui-icon>
						<text class="tui-pl">7天无理由退货</text>
					</view>
					<view class="tui-guarantee-item">
						<tui-icon name="circle-selected" :size="14" color="#999"></tui-icon>
						<text class="tui-pl">闪电退款</text>
					</view>
					<view class="tui-guarantee-item">
						<tui-icon name="circle-selected" :size="14" color="#999"></tui-icon>
						<text class="tui-pl">极速审核</text>
					</view>
				</view>
			</view>

			<!-- <view class="tui-cmt-box tui-mtop tui-radius-all">
				<view class="tui-list-cell tui-last tui-between">
					<view class="tui-bold tui-cell-title">评价</view>
					<view class="tui-flex-center" @tap="common">
						<text class="tui-cmt-all">查看全部</text>
						<tui-icon name="more-fill" :size="20" color="#ff201f"></tui-icon>
					</view>
				</view>

				<view class="tui-cmt-content tui-padding">
					<view class="tui-cmt-user">
						<image src="/static/images/news/avatar_2.jpg" class="tui-acatar"></image>
						<view>z***9</view>
					</view>
					<view class="tui-cmt">物流很快，很适合我的风格❤</view>
					<view class="tui-attr">颜色：叠层钛钢流苏耳环（A74）</view>
				</view>

				<view class="tui-cmt-btn">
					<tui-button width="240rpx" height="64rpx" :size="24" type="black" plain shape="circle" @click="common">查看全部评价</tui-button>
				</view>
			</view> -->

			<view class="tui-nomore-box">
				<tui-nomore text="宝贝详情" backgroundColor="#f7f7f7"></tui-nomore>
			</view>
			<view class="padding-sm tui-radius-all">
				<rich-text :nodes="goodsdetail.content"></rich-text>
			</view>
			<!-- <view class="tui-product-img tui-radius-all">
				<image :src="'https://www.thorui.cn/img/detail/' + (index + 1) + '.jpg'" v-for="(img, index) in 20" :key="index"
				 mode="widthFix"></image>
			</view> -->
			<tui-nomore text="已经到最底了" backgroundColor="#f7f7f7"></tui-nomore>
			<view class="tui-safearea-bottom"></view>
		</view>

		<!--底部操作栏-->
		<view class="tui-operation">
			<view class="tui-operation-left tui-col-4">
				<view class="tui-operation-item" hover-class="tui-opcity" :hover-stay-time="150" 
					  @click="contact"
					 v-if="storeData.contact_type==1">
					<tui-icon name="kefu" :size="22" color="#333"></tui-icon>
					<view class="tui-operation-text tui-scale-small">客服</view>
				</view>
				<button class="tui-operation-item clearbutton" hover-class="tui-opcity" :hover-stay-time="150" open-type="contact" session-from="weapp" v-if="storeData.contact_type==2">
					<tui-icon name="kefu" :size="22" color="#333"></tui-icon>
					<view class="tui-operation-text tui-scale-small">客服</view>
				</button>
				
				
				<view class="tui-operation-item" 
				
					hover-class="tui-opcity" 
					:hover-stay-time="150"
					@click="toCart"
				>
					<tui-icon name="cart" :size="22" color="#333"></tui-icon>
					<view class="tui-operation-text tui-scale-small">购物车</view>
					<tui-badge type="red" absolute :scaleRatio="0.8" right="10rpx" top="-4rpx">{{totalNumber}}</tui-badge>
				</view>
			</view>
			<view class="tui-operation-right tui-right-flex tui-col-8 tui-btnbox-4">
				<view class="tui-flex-1">
					<tui-button height="68rpx" :size="26" type="warning" shape="circle" @click="showPopup">立即购买</tui-button>
				</view>
			</view>
		</view>

		<!--底部操作栏--->

		<!--顶部下拉菜单-->
		<tui-top-dropdown backgroundColor="rgba(76, 76, 76, 0.95)" :show="menuShow" :height="0" @close="closeMenu">
			<view class="tui-menu-box tui-padding tui-ptop">
				<view class="tui-menu-header" :style="{ paddingTop: top + 'px' }">功能直达</view>
				<view class="tui-menu-itembox">
					<block v-for="(item, index) in topMenu" :key="index">
						<view class="tui-menu-item" hover-class="tui-opcity" :hover-stay-time="150" @tap="btnTopMenu(index)">
							<view class="tui-badge-box">
								<tui-icon :name="item.icon" color="#fff" :size="item.size"></tui-icon>
								<tui-badge type="red" :scaleRatio="0.8" absolute right="-8rpx" v-if="item.badge">{{ item.badge }}</tui-badge>
							</view>
							<view class="tui-menu-text">{{ item.text }}</view>
						</view>
					</block>
				</view>
				<view class="tui-icon-up_box">
					<tui-icon name="up" color="#fff" :size="26" @click="closeMenu"></tui-icon>
				</view>
			</view>
		</tui-top-dropdown>
		<!---顶部下拉菜单-->

		<!--底部选择层-->
		<tui-bottom-popup :show="popupShow" @close="hidePopup">
			<view class="tui-popup-box">
				<view class="tui-product-box tui-padding" v-if="goodsdetail.spec_type==1">
					<image :src="thumb[specitem]" class="tui-popup-img"></image>
					<view class="tui-popup-price">
						<view class="tui-amount tui-bold">￥{{specsVal[specKey].goods_price}}/库存：{{specsVal[specKey].stock_num}}件</view>
						<view class="tui-number">
							<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
								{{sItem.name}}
							</text>
						</view>
					</view>
				</view>
				<view class="tui-product-box tui-padding" v-if="goodsdetail.spec_type==0">
					<image :src="goodsdetail.thumb" class="tui-popup-img"></image>
					<view class="tui-popup-price">
						<view class="tui-amount tui-bold">￥{{goodsdetail.goods_price}}/库存：{{goodsdetail.stock}}件</view>
					</view>
				</view>
				<scroll-view scroll-y class="tui-popup-scroll" :style="{ height: scrollheight + 'rpx'}">
					<view class="tui-scrollview-box">
						<block v-for="(item,index) in specs" :key="index" v-if="item">	
							<view class="tui-bold tui-attr-title">{{index}}</view>
							<view class="tui-attr-box">
								<view class="tui-attr-item" 
								v-for="(childItem, childIndex) in item"
								:key="childIndex"
								:class="{selected: childItem.selected}"
								@click="selectSpec(index,childIndex,childItem.id)"
								>{{childItem.name}}</view>
							</view>
						</block>
					</view>
				</scroll-view>
				<view class="tui-operation tui-operation-right tui-right-flex tui-popup-btn">
					<view class="tui-flex-1">
						<tui-button height="72rpx" :size="28" type="warning" shape="circle" @click="submit">立即购买</tui-button>
					</view>
				</view>
				<view class="tui-right">
					<tui-icon name="close-fill" color="#999" :size="20" @click="hidePopup"></tui-icon>
				</view>
			</view>
		</tui-bottom-popup>
		<!--底部选择层-->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goodsDis:{},
				scrollheight:600,
				goods_id:0,
				goodsdetail:{},
				specs:{},
				thumb:{},
				specitem:'',
				specKey:'',
				specsVal:{},
				specSelected:[],
				goodsNumber:1,
				totalNumber:0,
				storeData:{},
				height: 64, //header高度
				top: 26, //标题图标距离顶部距离
				scrollH: 0, //滚动总高度
				opcity: 0,
				iconOpcity: 0.5,
				banner: [],
				bannerIndex: 0,
				topMenu: [{
						icon: 'message',
						text: '消息',
						size: 26,
						badge: 3
					},
					{
						icon: 'home',
						text: '首页',
						size: 23,
						badge: 0
					},
					{
						icon: 'people',
						text: '我的',
						size: 26,
						badge: 0
					},
					{
						icon: 'cart',
						text: '购物车',
						size: 23,
						badge: 2
					},
					{
						icon: 'kefu',
						text: '客服小蜜',
						size: 26,
						badge: 0
					},
					{
						icon: 'feedback',
						text: '我要反馈',
						size: 23,
						badge: 0
					},
					{
						icon: 'share',
						text: '分享',
						size: 26,
						badge: 0
					}
				],
				menuShow: false,
				popupShow: false,
				value: 1,
				collected: false,
				specKeyId:''
				
			};
		},
		onLoad: function(options) {
			let obj = {}
			let that  =this;
			that.goods_id = options.goods_id
			that.getdetail();
			
			that.tui.store().then((res)=>{
				console.log('AAAAAAAAAA',res)
				that.storeData = res
				console.log('商家信息',res.hotSearch,res.hotSearch.split(','))
			}).catch((res)=>{
				console.log('shibai',res)
			});
			
			// #ifdef MP-WEIXIN
			obj = wx.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-BAIDU
			obj = swan.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-ALIPAY
			my.hideAddToDesktopMenu();
			// #endif

			setTimeout(() => {
				uni.getSystemInfo({
					success: res => {
						this.width = obj.left || res.windowWidth;
						this.height = obj.top ? obj.top + obj.height + 8 : res.statusBarHeight + 44;
						this.top = obj.top ? obj.top + (obj.height - 32) / 2 : res.statusBarHeight + 6;
						this.scrollH = res.windowWidth;
					}
				});
			}, 0);
		},
		onShow() {
			let that = this;
			that.initPage();
		},
		methods: {
			initPage(){
				let that = this
				that.getCartlist();
				
			},
			toCart(){
				uni.navigateTo({
					url:"../shopcart/shopcart",
					complete(res) {
						console.log(res)
					}
				})
			},
			bannerChange: function(e) {
				this.bannerIndex = e.detail.current;
			},
			previewImage: function(e) {
				let index = e.currentTarget.dataset.index;
				uni.previewImage({
					current: this.banner[index],
					urls: this.banner
				});
			},
			back: function() {
				uni.navigateBack();
			},
			openMenu: function() {
				this.menuShow = true;
			},
			closeMenu: function() {
				this.menuShow = false;
			},
			showPopup: function() {
				this.popupShow = true;
			},
			hidePopup: function() {
				this.popupShow = false;
			},
			change: function(e) {
				this.value = e.value;
				this.goodsNumber = e.value;
				
			},
			collecting: function() {
				this.collected = !this.collected;
			},
			common: function() {
				this.tui.toast('功能开发中~');
			},
			// 获取详情
			getdetail(){
				let that = this
				let goods_id = that.goods_id
				
				
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
				
				that.tui.request("/diandi_distribution/goods/detail","GET",{
					goods_id:goods_id,
					goods_type:1
				}).then((res)=>{
					console.log('商品详情获取成功',res.code==200,res.code,res.data)
					if(res.code==200){
						let goodsdetail  = res.data.goods
						that.goodsDis = res.data.dis
						that.goodsdetail = goodsdetail
						console.log('lailailai01')
						// 规格
						that.specs = goodsdetail.specs.list
						console.log('lailailai02')
						that.specsVal=goodsdetail.specs.specVal
						console.log('lailailai03')
						that.thumb = goodsdetail.specs.thumb
						console.log('lailailai04')
						that.specitem = goodsdetail.specs.specitem
						console.log('lailailai05',goodsdetail.specs.list)
						let specKey =[]
						let specSelected =[]
						let specKeyId=[]
						// 初始默认选项
						let specs = Object.values(goodsdetail.specs.list)
						console.log('lailailai05 specs',specs)
						
						if(goodsdetail.spec_type==0){
							that.scrollheight=100
							console.log('修改高度',that.scrollheight)
						}
						
						specs.forEach((item,index)=>{
							console.log(item,index)
							item.forEach((sp,k)=>{
								if(sp.selected){
									specSelected.push(sp)
									specKey.push(sp.name)
									specKeyId.push(sp.id)
								}
								console.log(sp,k,index)
							})
						})
						that.specSelected = specSelected
						that.specKeyId = specKeyId.join('_');
						that.specKey = specKey.join('_');
						console.log('cccc',specKey.join('_'))
					}
					console.log('商品详情222',goodsdetail);
				}).catch((res)=>{
					console.log('商品详情获取错误',res);
				})
				
			},	
			//选择规格
			selectSpec(group,index, id){
				let _this = this;
				let list = _this.specs;
				console.log(list,'222')
				_this.specSelected = [];
				let specKey=[]
				let specKeyId=[]
				for(var key in list) {
					for (let child in list[key]) {
						if(group==key){
							if(list[key][child].id==id){
								_this.specitem = list[key][child].name
								_this.$set(list[key][child], 'selected', true);
							}else{
								_this.$set(list[key][child], 'selected', false);
							}
						}
						if(list[key][child].selected){
							specKey.push(list[key][child].name)
							specKeyId.push(list[key][child].id)
							_this.specSelected.push(list[key][child])
						}					
					}
				}
				console.log('选中',_this.specSelected)
				console.log(_this.specitem)
				 _this.specKey = specKey.join('_');
				 _this.specKeyId = specKeyId.join('_');
				 _this.specs=list
				 _this.$forceUpdate();
			},
			//新增商品计算价格
			addGoodsChange() {
				console.log('5675')
				var that = this;
				let goodsNumber = Number(that.goodsNumber);
				let totalPrice = 0;
				let totalNumber = 0;
				let existedGoods = false;
				let goods_id = that.goods_id
				console.log('选中',that.specKeyId)
				that.tui.request("/diandi_shop/cart/add","POST",{
					goods_id:goods_id,
					num:goodsNumber,
					spec_id:that.specKeyId
				}).then((res)=>{
					uni.hideLoading();
					console.log('商品详情',res.code==200,res.code,res.data)
					if(res.code==200){
						that.shoppCart = res.data
						that.goodsTotalPrice = res.data.goodsTotalPrice
						//总价
						totalPrice   = res.data.total_price;
						that.totalNumber  = res.data.goodsTotalNumber;
						that.popupShow = false;
						that.tui.toast(res.message);
					}else{
						that.tui.toast(res.message);
					}
					console.log('商品详情222',res.data);
				}).catch((res)=>{
					console.log("错误",err);
				});
				//购物车商品数据缓存至本地
				// uni.setStorageSync(that.shoppingCartStorageName, that.shoppingCartAll);
			},
			getCartlist(){
				var that = this;
				let totalPrice = 0;
				let totalNumber =0;
				
				that.tui.request("/diandi_shop/cart/list","POST",{}).then((res)=>{
					uni.hideLoading();
					console.log('商品详情',res.code==200,res.code,res.data)
					if(res.code==200){
						that.shoppCart = res.data
						that.goodsTotalPrice = res.data.goodsTotalPrice
						//总价
						that.totalPrice   = res.data.total_price;
						that.totalNumber  = res.data.goodsTotalNumber;
					}else{
						that.tui.toast(res.message);
					}
					console.log('商品详情222',res.data);
				}).catch((res)=>{})
			},
			btnTopMenu(index) {
				this.closeMenu()
				if (index == 4) {
					uni.makePhoneCall({
						phoneNumber: "10086"
					})
				} else if (index == 6) {
                    // #ifdef MP
                    this.common()
                    // #endif
					
					// #ifndef MP
					this.onShare()
					// #endif
				} else {
					let url = {
						0: '../message/message',
						1: "../index/index",
						2: '../my/my',
						3: '../shopcart/shopcart',
						5: '/pages/my/feedback/feedback?page=mall'
					} [index];
					url && this.tui.href(url)
				}
			},
			submit() {
				let that = this
				let goodsNumber = Number(that.goodsNumber);
				let totalPrice = 0;
				let totalNumber = 0;
				let existedGoods = false;
				let goods_id = that.goods_id
				let specKeyId = that.specKeyId
				
				console.log('选中',that.specKeyId)
					
				this.popupShow = false;
				uni.navigateTo({
					url: '../submitOrder/submitOrder?goods_type=1&goods_id='+goods_id+'&goodsNumber='+goodsNumber+'&specKeyId='+specKeyId
				});
			},
			coupon() {
				uni.navigateTo({
					url: '../coupon/coupon'
				});
			},
			onShare() {
				//#ifdef APP-PLUS
				plus.share.sendWithSystem({
						content: 'ThorUI商城模板',
						href: 'https://www.thorui.cn/'
					},
					function() {
						console.log('分享成功');
					},
					function(e) {
						console.log('分享失败：' + JSON.stringify(e));
					}
				);
				//#endif
				// #ifdef H5
				location.href = "https://www.thorui.cn/"
				// #endif
			}
		},
		onPageScroll(e) {
			let scroll = e.scrollTop <= 0 ? 0 : e.scrollTop;
			let opcity = scroll / this.scrollH;
			if (this.opcity >= 1 && opcity >= 1) {
				return;
			}
			this.opcity = opcity;
			this.iconOpcity = 0.5 * (1 - opcity < 0 ? 0 : 1 - opcity);
		}
	};
</script>

<style>
	page {
		background-color: #f7f7f7;
	}

	.container {
		padding-bottom: 110rpx;
	}

	.tui-header-box {
		width: 100%;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 995;
	}

	.tui-header {
		width: 100%;
		font-size: 18px;
		line-height: 18px;
		font-weight: 500;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-header-icon {
		position: fixed;
		top: 0;
		left: 10px;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		height: 32px;
		transform: translateZ(0);
		z-index: 9999;
	}

	.tui-header-icon .tui-badge {
		background: #e41f19 !important;
		position: absolute;
		right: -4px;
	}

	.tui-icon-ml {
		margin-left: 20rpx;
	}

	.tui-icon-box {
		position: relative;
		height: 20px !important;
		width: 20px !important;
		padding: 6px !important;

		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-banner-swiper {
		position: relative;
	}

	.tui-banner-tag {
		position: absolute;
		color: #fff;
		bottom: 30rpx;
		right: 0;
	}

	.tui-slide-image {
		width: 100%;
		height: 100%;
		display: block;
	}

	/*顶部菜单*/

	.tui-menu-box {
		box-sizing: border-box;
	}

	.tui-menu-header {
		font-size: 34rpx;
		color: #fff;
		height: 32px;
		display: flex;
		align-items: center;
	}

	.tui-menu-itembox {
		color: #fff;
		padding: 40rpx 10rpx 0 10rpx;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		font-size: 26rpx;
	}

	.tui-menu-item {
		width: 22%;
		height: 160rpx;
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		background: rgba(0, 0, 0, 0.4);
		margin-right: 4%;
		margin-bottom: 4%;
	}

	.tui-menu-item:nth-of-type(4n) {
		margin-right: 0;
	}

	.tui-badge-box {
		position: relative;
	}

	.tui-badge-box .tui-badge-class {
		position: absolute;
		top: -8px;
		right: -8px;
	}

	.tui-msg-badge {
		top: -10px;
	}

	.tui-icon-up_box {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-menu-text {
		padding-top: 12rpx;
	}

	.tui-opcity .tui-menu-text,
	.tui-opcity .tui-badge-box {
		opacity: 0.5;
		transition: opacity 0.2s ease-in-out;
	}

	/*顶部菜单*/

	/*内容 部分*/

	.tui-padding {
		padding: 0 30rpx;
		box-sizing: border-box;
	}

	.tui-ml-auto {
		margin-left: auto;
	}

	/* #ifdef H5 */
	.tui-ptop {
		padding-top: 44px;
	}

	/* #endif */

	.tui-size {
		font-size: 24rpx;
		line-height: 24rpx;
	}

	.tui-gray {
		color: #999;
	}

	.tui-icon-red {
		color: #ff201f;
	}

	.tui-border-radius {
		border-bottom-left-radius: 24rpx;
		border-bottom-right-radius: 24rpx;
		overflow: hidden;
	}

	.tui-radius-all {
		border-radius: 24rpx;
		overflow: hidden;
	}

	.tui-mtop {
		margin-top: 26rpx;
	}

	.tui-pro-detail {
		box-sizing: border-box;
		color: #333;
	}

	.tui-product-title {
		background: #fff;
		padding: 30rpx 0;
	}

	.tui-pro-pricebox {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #ff201f;
		font-size: 36rpx;
		font-weight: bold;
		line-height: 44rpx;
	}

	.tui-pro-price {
		display: flex;
		align-items: center;
	}

	.tui-price {
		font-size: 58rpx;
	}

	.tui-original-price {
		font-size: 26rpx;
		line-height: 26rpx;
		padding: 10rpx 30rpx;
		box-sizing: border-box;
	}

	.tui-line-through {
		text-decoration: line-through;
	}

	.tui-collection {
		color: #333;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		height: 44rpx;
	}

	.tui-scale-collection {
		transform: scale(0.7);
		transform-origin: center 90%;
		line-height: 24rpx;
		font-weight: normal;
		margin-top: 4rpx;
	}

	.tui-pro-titbox {
		font-size: 32rpx;
		font-weight: 500;
		position: relative;
		padding: 0 150rpx 0 30rpx;
		box-sizing: border-box;
	}

	.tui-pro-title {
		padding-top: 20rpx;
	}

	.tui-share-btn {
		display: block;
		background: transparent;
		margin: 0;
		padding: 0;
		border-radius: 0;
		border: 0;
	}

	.tui-share-btn::after {
		border: 0;
	}

	.tui-share-box {
		display: flex;
		align-items: center;
	}

	.tui-share-position {
		position: absolute;
		right: 0;
		top: 10rpx;
	}

	.tui-share-text {
		padding-left: 8rpx;
	}

	.tui-sub-title {
		padding: 20rpx 0;
		line-height: 32rpx;
	}

	.tui-sale-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 30rpx;
	}

	.tui-discount-box {
		background: #fff;
	}

	.tui-list-cell {
		width: 100%;
		position: relative;
		display: flex;
		align-items: center;
		font-size: 26rpx;
		line-height: 26rpx;
		padding: 36rpx 30rpx;
		box-sizing: border-box;
	}

	.tui-right {
		position: absolute;
		right: 30rpx;
		top: 30rpx;
	}

	.tui-top40 {
		top: 40rpx !important;
	}

	.tui-bold {
		font-weight: bold;
	}

	.tui-list-cell::after {
		content: '';
		position: absolute;
		border-bottom: 1rpx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 126rpx;
	}

	.tui-last::after {
		border-bottom: 0 !important;
	}

	.tui-flex-center {
		display: flex;
		align-items: center;
	}


	.tui-cell-title {
		width: 66rpx;
		padding-right: 30rpx;
		flex-shrink: 0;
	}

	.tui-promotion-box {
		display: flex;
		align-items: center;
		padding: 10rpx 0;
		width: 80%;
	}

	.tui-promotion-box text {
		width: 70%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tui-basic-info {
		background: #fff;
	}

	.tui-addr-box {
		width: 76%;
	}

	.tui-addr-item {
		padding: 10rpx;
		line-height: 34rpx;
	}

	.tui-guarantee {
		background: #fdfdfd;
		display: flex;
		flex-wrap: wrap;
		padding: 20rpx 30rpx 30rpx 30rpx;
		font-size: 24rpx;
	}

	.tui-guarantee-item {
		color: #999;
		padding-right: 30rpx;
		padding-top: 10rpx;
	}

	.tui-pl {
		padding-left: 4rpx;
	}

	.tui-cmt-box {
		background: #fff;
	}

	.tui-between {
		justify-content: space-between !important;
	}

	.tui-cmt-all {
		color: #ff201f;
		padding-right: 8rpx;
	}

	.tui-cmt-content {
		font-size: 26rpx;
	}

	.tui-cmt-user {
		display: flex;
		align-items: center;
	}

	.tui-acatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 30rpx;
		display: block;
		margin-right: 16rpx;
	}

	.tui-cmt {
		padding: 14rpx 0;
	}

	.tui-attr {
		font-size: 24rpx;
		color: #999;
		padding: 6rpx 0;
	}

	.tui-cmt-btn {
		padding: 50rpx 0 30rpx 0;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-nomore-box {
		padding-top: 10rpx;
	}

	.tui-product-img {
		display: flex;
		flex-direction: column;
		transform: translateZ(0);
	}

	.tui-product-img image {
		width: 100%;
		display: block;
	}

	/*底部操作栏*/

	.tui-col-7 {
		width: 58.33333333%;
	}

	.tui-col-5 {
		width: 41.66666667%;
	}

	.tui-operation {
		width: 100%;
		height: 100rpx;
		background: rgba(255, 255, 255, 0.98);
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: space-between;
		z-index: 10;
		bottom: 0;
		left: 0;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-safearea-bottom {
		width: 100%;
		height: env(safe-area-inset-bottom);
	}

	.tui-operation::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		border-top: 1rpx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.tui-operation-left {
		display: flex;
		align-items: center;
	}

	.tui-operation-item {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		position: relative;
	}

	.tui-operation-text {
		font-size: 22rpx;
		color: #333;
	}

	.tui-opacity {
		opacity: 0.5;
	}

	.tui-scale-small {
		transform: scale(0.9);
		transform-origin: center center;
	}

	.tui-operation-right {
		height: 100rpx;
		padding-top: 0;
	}

	.tui-right-flex {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-flex-1 {
		flex: 1;
		padding: 16rpx;
	}

	/*底部操作栏*/

	/*底部选择弹层*/

	.tui-popup-class {
		border-top-left-radius: 24rpx;
		border-top-right-radius: 24rpx;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-popup-box {
		position: relative;
		padding: 30rpx 0 100rpx 0;
	}

	.tui-popup-btn {
		width: 100%;
		position: absolute;
		left: 0;
		bottom: 0;
	}

	/* .tui-popup-btn .tui-btn-class {
		width: 90% !important;
		display: block !important;
		font-size: 28rpx !important;
	} */

	/* .tui-icon-close {
		position: absolute;
		top: 30rpx;
		right: 30rpx;
	} */
	.selected{
		background:#eb0909 !important;
		color: #FFFFFF;
	}
	.tui-product-box {
		display: flex;
		align-items: flex-end;
		font-size: 24rpx;
		padding-bottom: 30rpx;
	}

	.tui-popup-img {
		height: 200rpx;
		width: 200rpx;
		border-radius: 24rpx;
		display: block;
	}

	.tui-popup-price {
		padding-left: 20rpx;
		padding-bottom: 8rpx;
	}

	.tui-amount {
		color: #ff201f;
		font-size: 36rpx;
	}

	.tui-number {
		font-size: 24rpx;
		line-height: 24rpx;
		padding-top: 12rpx;
		color: #999;
	}

	.tui-popup-scroll {
		font-size: 26rpx;
	}
	.selected-text{
		margin-left: 6.25rpx;
		color:#fc872d;
	}
	.tui-scrollview-box {
		padding: 0 30rpx 60rpx 30rpx;
		box-sizing: border-box;
	}

	.tui-attr-title {
		padding: 10rpx 0;
		color: #333;
	}

	.tui-attr-box {
		font-size: 0;
		padding: 20rpx 0;
	}
	.clearbutton{
	  padding: 0;
	  outline:none;
	border:none;
	list-style: none;
	background-color:rgba(0,0,0,0);
	line-height: 34rpx;
	}
	.tui-attr-item {
		max-width: 100%;
		min-width: 200rpx;
		height: 64rpx;
		display: -webkit-inline-flex;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: #f7f7f7;
		padding: 0 26rpx;
		box-sizing: border-box;
		border-radius: 32rpx;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		font-size: 26rpx;
	}

	.tui-attr-active {
		background: #fcedea !important;
		color: #e41f19;
		font-weight: bold;
		position: relative;
	}

	.tui-attr-active::after {
		content: '';
		position: absolute;
		border: 1rpx solid #e41f19;
		width: 100%;
		height: 100%;
		border-radius: 40rpx;
		left: 0;
		top: 0;
	}

	.tui-number-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0 30rpx 0;
		box-sizing: border-box;
	}

	/*底部选择弹层*/
</style>
