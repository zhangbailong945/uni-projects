<template>
	<view class="container">
		<view class="tui-mybg-box">
			<view class="tui-image-box userininf">
				<image :src="'../../../static/images/mall/img_bg_3x.png'" class="tui-my-bg" mode="widthFix"></image>
				<view class="tui-flex userInfo   " >
					<view class="tui-col-12 tui-center">
						<view class="tui-image-box">
							<view class="tui-group-box">
								<image :src="list.fans.avatarUrl"  class="tui-slide-image cu-avatar radius" mode="widthFix" width="80rpx" ></image>
							</view>
						</view>
					</view>
					<view class="tui-col-12 tui-center">
						<text>{{list.fans.nickname}}</text>
					</view>
				</view>
				
			</view>
			
			
		<view class="coupon-list">
			<view class="coupon-item">
				<view class="hidden-box coupon-code tui-shadow-gradual" v-show="show">
					<view class="qrcode-box">
							<image class="qrcode" :src="codePath" mode="widthFix"></image>
					</view>
					<view class="list-item">
						<view class="item-tit">推广码使用说明</view>
						<view class="item-con"></view>
					</view>
		
					<view class="explain">使用说明</view>
					<view class="explain-text" v-for="(items, index) in useDescribe" :key="items">{{ items }}</view>
				</view>
			</view>
		</view>
	</view>
</view>
</template>


<script>
const util = require('@/common/utils/util.js');
const qrCode = require('@/common/libs/weapp-qrcode.js');
export default {
	data() {
		return {
			codePath:'',
			list:{},
			show: false,
			couponNum: 4,
			useDescribe: ['1、出示二维码给你的朋友，扫码后成为您的下级用户', '2、您可以在分销中心查看您的相关收益数据'],
			qrcode_w: uni.upx2px(240)
		};
	},
	onLoad: function(options) {
		let that = this
		that.initPage()
		if (!this.tui.isAndroid()) {
			this.show = true;
		}
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
			
			that.getcode()
		},
		getcode:function(){
			let that = this
			that.tui.request("/wechat/qrcode/getqrcode","POST",{
				'module_name':'diandi_distribution',
				'path':'page/index/index',
				'width':200
			}).then((res)=>{
				console.log(res)
				if (res.code == 200) {
					that.codePath = res.data[0]
					console.log('生成二维码',res.data)
					this.show = true;
				} else {
					that.tui.toast(res.message);
				}
			}).catch((res)=>{
				console.log(res)
			})
		}
	}
};
</script>

<style>
	.cu-avatar{
		width: 80px;
		}
	.avatarUrl{
		width: 100rpx;
		height: 100rpx;
	}
	.userInfo{
		position: absolute;
		width: 100%;
		height: 128rpx;
		left: 0;
		top: 120rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		display: -webkit-box;
		display: -webkit-flex;
		display: block;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
	}
.userininf{
	height: 300rpx;
	background-size:100% 100%;
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
	
/* #ifdef MP-ALIPAY */
.my-canvas {
	position: fixed;
	left: -200px;
	top: 0;
}

/* #endif */

.container {
	padding-bottom: env(safe-area-inset-bottom);
}

.header {
	width: 100%;
	padding: 0 30rpx;
	box-sizing: border-box;
	font-size: 24rpx;
	color: #999;
	height: 54rpx;
	line-height: 54rpx;
	background: #fff;
	display: flex;
	align-items: center;
	position: fixed;
	top: 0;
	/* #ifdef H5 */
	top: 44px;
	/* #endif */
	z-index: 999999;
}

.coupon-num {
	color: #5677fc;
}

.coupon-list {
	width: 100%;
	padding: 54rpx 50rpx;
	box-sizing: border-box;
}

.coupon-item {
	margin-top: 20rpx;
	width: 100%;
	box-shadow: 0 8rpx 10rpx -8rpx #eaeef1;
	border-radius: 2rpx;
}

.coupon {
	height: 160rpx;
	position: relative;
	display: flex;
	align-items: center;
}

.coupon-img {
	width: 100%;
	height: 160rpx;
	position: absolute;
	left: 0;
	top: 0;
	z-index: 0;
}

.left-tit-box {
	width: 414rpx;
	padding-left: 75rpx;
	box-sizing: border-box;
	z-index: 10;
}

.tit {
	width: 290rpx;
	font-size: 30rpx;
	color: #333;
	line-height: 42rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.term {
	width: 228rpx;
	font-size: 24rpx;
	color: #999;
	line-height: 24rpx;
	padding-top: 7rpx;
	white-space: nowrap;
}

.right-detail {
	width: 236rpx;
	text-align: center;
	height: 160rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 10;
}

.detail-txt {
	font-size: 24rpx;
	color: #fff;
	padding-right: 12rpx;
}

.arrow {
	width: 16rpx;
	height: 24rpx;
	transition: all 0.15s ease;
}

.spread {
	width: 24rpx;
	height: 16rpx;
}

.qrcode {
	width: 340rpx;
	height: 340rpx;
	margin: 45rpx auto 43rpx auto;
}

.hidden-box {
	padding: 35rpx 40rpx 27rpx 40rpx;
	box-sizing: border-box;
	color: #333;
	border-top: 1rpx solid #eaeef1;
	background: #fff;
}

.code-tit {
	font-size: 28rpx;
	line-height: 28rpx;
}

.code-num {
	font-size: 30rpx;
	line-height: 30rpx;
	padding-top: 23rpx;
	font-weight: bold;
}

.qrcode-box {
	width: 100%;
	border-bottom: 1rpx dashed #eaeef1;
	margin-bottom: 6rpx;
	text-align: center;
}

.list-item {
	height: 90rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 28rpx;
}

.list-item::after {
	left: 0;
}

.item-tit {
	color: #666;
}

.item-con {
	color: #333;
}

.explain {
	font-size: 28rpx;
	line-height: 28rpx;
	color: #666;
	padding: 33rpx 0 25rpx 0;
}

.explain-text {
	font-size: 28rpx;
	line-height: 41rpx;
	color: #333;
}

.none {
	width: 100%;
	position: fixed;
	text-align: center;
	font-size: 30rpx;
	color: #ccc;
	top: 49%;
}
.tui-rotate_90 {
	transform: rotate(90deg);
}
</style>

