<template>
	<view>
		<!--header-->
		<tui-navigation-bar splitLine @init="initNavigation" @change="opcityChange" :scrollTop="scrollTop" title="我的"
		 backgroundColor="255,255,255" color="#333">
			<view class="tui-header-box" :style="{marginTop:top+'px'}">
				<!--个人中心页为主页面，不应有返回键-->
				<!-- #ifndef MP -->
				<view class="tui-header-icon">
					<view class="tui-icon-box tui-icon-message" @tap="href(7)">
						<view class="tui-badge" :class="[opcity>0.85?'tui-badge-red':'tui-badge-white']">1</view>
					</view>
					<view class="tui-icon-box tui-icon-setup" @tap="href(2)">
						<iconfont className="icon-shezhi1" :color="opcity > 0.85 ? '#333' : '#fff'" :size="26"></iconfont>
					</view>
				</view>
				<!-- #endif -->
			</view>

		</tui-navigation-bar>
		<!--header-->
		<view class="tui-mybg-box">
			<image :src="'../../static/images/mall/img_bg_3x.png'" class="tui-my-bg" mode="widthFix"></image>
			<view class="tui-header-center" v-if="list.fans">
				<image :src="list.fans.avatarUrl" class="tui-avatar" @tap="href(3)"></image>
				<view class="tui-info">
					<view class="tui-nickname">{{list.fans.nickname}}
					</view>
					<view class="tui-explain">会员ID:{{list.member_id}}</view>
					<view class="tui-explain" v-if="list.mobile">{{list.mobile}}</view>
					<view class="tui-explain" v-if="!list.mobile">未绑定手机号</view>
				</view>
				<!-- #ifndef MP -->
				<view class="tui-btn-edit">
					<tui-button type="white" :plain="true" shape="circle" width="92rpx" height="40rpx" :size="22" @click="href(3)">编辑</tui-button>
				</view>
				<!-- #endif -->
				<!-- #ifdef MP -->
				<view class="tui-set-box">
					<view class="tui-icon-box" @tap="href(7)">
						<iconfont className="icon-xiaoxizhongxin" color="#fff" :size="24"></iconfont>
						<view class="tui-badge tui-badge-white">1</view>
					</view>
					<view class="tui-icon-box" @tap="href(2)">
						<iconfont className="icon-shezhi1" color="#fff" :size="26"></iconfont>
					</view>
				</view>
				<!-- #endif -->
			</view>
			<view class="tui-header-btm" @tap="href(5)">
				<view class="tui-btm-item">
					<view class="tui-btm-num">{{list.account.user_money}}</view>
					<view class="tui-btm-text">当前余额</view>
				</view>
				<view class="tui-btm-item">
					<view class="tui-btm-num">{{list.account.frozen_money}}</view>
					<view class="tui-btm-text">冻结金额</view>
				</view>
				<view class="tui-btm-item">
					<view class="tui-btm-num">{{list.account.accumulate_money}}</view>
					<view class="tui-btm-text">总收益</view>
				</view>
			</view>
		</view>
		<view class="tui-content-box">
			<view class="tui-box tui-order-box">
				<tui-list-cell :arrow="true" padding="0" :lineLeft="false" @click="orderHref('all')">
					<view class="tui-cell-header">
						<view class="tui-cell-title">我的订单</view>
						<view class="tui-cell-sub">查看全部订单</view>
					</view>
				</tui-list-cell>
				<view class="tui-order-list">
					<view class="tui-order-item"  @click="orderHref(0)">
						<view class="tui-icon-box">
							<image src="/static/images/mall/my/icon_daifukuan_3x.png" class="tui-order-icon"></image>
							<!-- <view class="tui-badge tui-badge-red">1</view> -->
						</view>
						<view class="tui-order-text">待付款</view>
					</view>
					<view class="tui-order-item"  @click="orderHref(1)">
						<view class="tui-icon-box">
							<image src="/static/images/mall/my/icon_daifahuo_3x.png" class="tui-order-icon"></image>
							<!-- <view class="tui-badge tui-badge-red">1</view> -->
						</view>
						<view class="tui-order-text">待收货</view>
					</view>
					<view class="tui-order-item"  @click="orderHref(3)">
						<view class="tui-icon-box">
							<image src="/static/images/mall/my/icon_pingjia_3x.png" class="tui-order-icon"></image>
						</view>
						<view class="tui-order-text">待评价</view>
					</view>
					<view class="tui-order-item" @click="orderHref(4)">
						<view class="tui-icon-box">
							<image src="/static/images/mall/my/icon_daishouhuo_3x.png" class="tui-order-icon"></image>
							<view class="tui-badge tui-badge-red" v-if="false">12</view>
						</view>
						<view class="tui-order-text">已完成</view>
					</view>
				</view>
			</view>

			<view class="tui-box  tui-order-box margin-top-sm" v-if="list.levels">
				<tui-list-cell padding="0" :lineLeft="false" :hover="false">
					<view class="tui-cell-header">
						<view class="tui-cell-title">我的分销</view>
					</view>
				</tui-list-cell>
				<view class="tui-order-list">
					<view class="tui-order-item" @tap="fenxiaoHref(1)">
						<view class="tui-assets-num padding-xs">
							<iconfont className="icon-uniEC" size="22"></iconfont>
						</view>
						<view class="tui-assets-text">我的二维码</view>
					</view>
					<view class="tui-order-item"  @tap="fenxiaoHref(2)">
						<view class="tui-assets-num padding-xs">
							<iconfont className="icon-duiwu"  size="22"></iconfont>
						</view>
						<view class="tui-assets-text">我的团队</view>
					</view>
					<view class="tui-order-item"  @tap="fenxiaoHref(3)">
						<view class="tui-assets-num padding-xs">
							<iconfont className="icon-tuiguang1"  size="22"></iconfont>
						</view>
						<view class="tui-assets-text"  size="22">我的收益</view>
					</view>
					<view class="tui-order-item"  @tap="fenxiaoHref(4)">
						<view class="tui-assets-num padding-xs">
							<iconfont className="icon-keyongyue"  size="22"></iconfont>
						</view>
						<view class="tui-assets-text">申请提现</view>
					</view>
					
				</view>
			</view>

		
			<view class="tui-btn-back" @tap="back">返回</view>
			<!--加载loadding-->
			<tui-loadmore v-if="loadding" :index="3" type="red"></tui-loadmore>
		</view>
		<tab-bar :currentindex="currentTabIndex"></tab-bar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentTabIndex:3,
				list:{},
				webURL: "https://www.thorui.cn/wx",
				top: 0, //标题图标距离顶部距离
				opcity: 0,
				scrollTop: 0.5,
				pageIndex: 1,
				loadding: false,
				pullUpOn: true
			}
		},
		onLoad: function(options) {
			let obj = {};
			// #ifdef MP-WEIXIN
			obj = wx.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-BAIDU
			obj = swan.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-ALIPAY
			my.hideAddToDesktopMenu();
			// #endif

			uni.getSystemInfo({
				success: (res) => {
					this.width = obj.left || res.windowWidth;
					this.height = obj.top ? (obj.top + obj.height + 8) : (res.statusBarHeight + 44);
					this.top = obj.top ? (obj.top + (obj.height - 32) / 2) : (res.statusBarHeight + 6);
					this.scrollH = res.windowWidth * 0.6
				}
			})
			
		},
		onShow() {
			let that = this
			that.initPage()
		},
		methods: {
			initPage(){
				let that = this
				that.tui.request("/diandi_distribution/member/info","GET",{}).then((res)=>{
					console.log(res)
					if (res.code == 200) {
						console.log(res.data)
						that.list = res.data
					} else {
						that.tui.toast(res.message);
					}
				}).catch((res)=>{
					console.log(res)
				})
			},
			orderHref(status){
				uni.redirectTo({
					url:"../myOrder/myOrder?status="+status
				})
			},
			fenxiaoHref(type){
				if(type==1){
					uni.navigateTo({
						url:"./spread/spread"
					})
				}else if(type==2){
					uni.navigateTo({
						url:"./agent/agent"
					})
				}else if(type==3){
					uni.navigateTo({
						url:"./mingxi/mingxi"
					})
				}else if(type==4){
					uni.navigateTo({
						url:"./cash/cash"
					})
				}
			},
			href(page) {
				let url = "";
				switch (page) {
					case 2:
						url = "../set/set"
						break;
					case 3:
						url = "../userInfo/userInfo"
						break;
					case 4:
						url = "../myOrder/myOrder"
						break;
					case 6:
						url = "../coupon/coupon"
						break;
					case 7:
						url = "../message/message"
						break;
					default:
						break;
				}
				if (url) {
					uni.navigateTo({
						url: url
					})
				} else {
					this.tui.toast("功能尚未完善~")
				}
			},
			detail: function() {
				uni.navigateTo({
					url: '../productDetail/productDetail'
				})
			},
			initNavigation(e) {
				this.opcity = e.opcity;
				this.top = e.top;
			},
			opcityChange(e) {
				this.opcity = e.opcity;
			},
			back() {
				uni.navigateBack();
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onPullDownRefresh() {
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 200)
		},
		onReachBottom: function() {
			if (!this.pullUpOn) return;
			this.loadding = true;
			if (this.pageIndex == 4) {
				this.loadding = false;
				this.pullUpOn = false
			} else {
				let loadData = JSON.parse(JSON.stringify(this.productList));
				loadData = loadData.splice(0, 10)
				if (this.pageIndex == 1) {
					loadData = loadData.reverse();
				}
				this.productList = this.productList.concat(loadData);
				this.pageIndex = this.pageIndex + 1;
				this.loadding = false
			}
		}
	}
</script>

<style>
	.tui-header-box {
		width: 100%;
		padding: 0 30rpx 0 20rpx;
		box-sizing: border-box;
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		height: 32px;
		transform: translateZ(0);
		z-index: 9999;
	}

	/* #ifndef MP */
	.tui-header-icon {
		min-width: 120rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	/* #endif */
	/* #ifdef MP */
	.tui-set-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	/* #endif */
	.tui-icon-box {
		position: relative;
	}

	.tui-icon-setup {
		margin-left: 8rpx;
	}

	.tui-badge {
		position: absolute;
		font-size: 24rpx;
		height: 32rpx;
		min-width: 20rpx;
		padding: 0 6rpx;
		border-radius: 40rpx;
		right: 10rpx;
		top: -5rpx;
		transform: scale(0.8) translateX(60%);
		transform-origin: center center;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}

	.tui-badge-red {
		background: #F74D54;
		color: #fff;
	}

	.tui-badge-white {
		background: #fff;
		color: #F74D54;
	}

	.tui-badge-dot {
		position: absolute;
		height: 12rpx;
		width: 12rpx;
		border-radius: 50%;
		right: -12rpx;
		top: 0;
		background: #F74D54;
	}

	.tui-mybg-box {
		width: 100%;
		height: 464rpx;
		position: relative;
	}

	.tui-my-bg {
		width: 100%;
		height: 464rpx;
		display: block;
	}

	.tui-header-center {
		position: absolute;
		width: 100%;
		height: 128rpx;
		left: 0;
		top: 120rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}

	.tui-avatar {
		flex-shrink: 0;
		width: 128rpx;
		height: 128rpx;
		display: block;
	}

	.tui-info {
		width: 60%;
		padding-left: 30rpx;

	}

	.tui-nickname {
		font-size: 30rpx;
		font-weight: 500;
		color: #fff;
		display: flex;
		align-items: center;
	}

	.tui-img-vip {
		width: 56rpx;
		height: 24rpx;
		margin-left: 18rpx;
	}

	.tui-explain {
		width: 80%;
		font-size: 24rpx;
		font-weight: 400;
		color: #fff;
		opacity: 0.75;
		padding-top: 8rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tui-btn-edit {
		flex-shrink: 0;
		padding-right: 22rpx;
	}

	.tui-header-btm {
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		position: absolute;
		left: 0;
		top: 280rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #fff;
	}

	.tui-btm-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.tui-btm-num {
		font-size: 32rpx;
		font-weight: 600;
		position: relative;
	}

	.tui-btm-text {
		font-size: 24rpx;
		opacity: 0.85;
		padding-top: 4rpx;
	}

	.tui-content-box {
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		position: relative;
		top: -72rpx;
		z-index: 10;
	}

	.tui-box {
		width: 100%;
		background: #fff;
		box-shadow: 0 3rpx 20rpx rgba(183, 183, 183, 0.1);
		border-radius: 10rpx;
		overflow: hidden;
	}

	.tui-order-box {
		height: 208rpx;
	}

	.tui-cell-header {
		width: 100%;
		height: 74rpx;
		padding: 0 26rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-cell-title {
		font-size: 30rpx;
		line-height: 30rpx;
		font-weight: 600;
		color: #333;
	}

	.tui-cell-sub {
		font-size: 26rpx;
		font-weight: 400;
		color: #999;
		padding-right: 28rpx;
	}

	.tui-order-list {
		width: 100%;
		height: 134rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;

	}

	.tui-order-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.tui-order-text,
	.tui-tool-text {
		font-size: 26rpx;
		font-weight: 400;
		color: #666;
		padding-top: 4rpx;
	}

	.tui-tool-text {
		font-size: 24rpx;
	}

	.tui-order-icon {
		width: 56rpx;
		height: 56rpx;
		display: block;
	}

	.tui-assets-box {
		height: 178rpx;
		margin-top: 20rpx;
	}

	.tui-assets-list {
		height: 84rpx;
	}

	.tui-assets-num {
		font-size: 32rpx;
		font-weight: 500;
		color: #333;
		position: relative;
	}

	.tui-assets-text {
		font-size: 24rpx;
		font-weight: 400;
		color: #666;
		padding-top: 6rpx;
	}

	.tui-tool-box {
		margin-top: 20rpx;
	}

	.tui-flex-wrap {
		flex-wrap: wrap;
		height: auto;
		padding-bottom: 30rpx;
	}

	.tui-tool-item {
		width: 25%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding-top: 30rpx;
	}

	.tui-tool-icon {
		width: 64rpx;
		height: 64rpx;
		display: block;
	}

	.tui-badge-icon {
		width: 66rpx;
		height: 30rpx;
		position: absolute;
		right: 0;
		transform: translateX(88%);
		top: -15rpx;
	}

	/*为你推荐*/
	.tui-product-list {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		flex-wrap: wrap;
		box-sizing: border-box;
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

	.tui-btn-back {
		width: 88rpx;
		height: 88rpx;
		font-size: 26rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background-color: rgba(0, 0, 0, .5);
		color: #fff;
		position: fixed;
		bottom: 150rpx;
		right: 30rpx;
		z-index: 9999;
	}
</style>
