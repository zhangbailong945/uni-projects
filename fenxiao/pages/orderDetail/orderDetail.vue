<template>
	<view class="container">
		<tui-list-cell arrow backgroundColor="#fefefe" @click="logistics">
			<view class="tui-flex-box">
				<image :src="webURL+'img_order_logistics3x.png'" class="tui-icon-img"></image>
				<view class="tui-logistics">
					<view class="tui-logistics-text">快递已到收货点，请注意查收哦! 投递员: echo. 联系电话: 17788849992</view>
					<view class="tui-logistics-time">2019-06-03 12:02</view>
				</view>
			</view>
		</tui-list-cell>
		<tui-list-cell unlined :hover="false" v-if="orderdetail.address.name">
			<view class="tui-flex-box">
				<image :src="webURL+'img_order_address3x.png'" class="tui-icon-img"></image>
				<view class="tui-addr">
					<view class="tui-addr-userinfo">
						{{orderdetail.address.name}}
						<text class="tui-addr-tel">{{orderdetail.address.phone}}</text>
					</view>
					<view class="tui-addr-text">
						{{orderdetail.address.address_detail}}{{orderdetail.address.detail}}
					</view>
				</view>
			</view>
		</tui-list-cell>

		<view class="tui-order-item" v-if="orderdetail.goods">
			<tui-list-cell :hover="false" :lineLeft="false">
				<view class="tui-goods-title">
					商品信息
				</view>
			</tui-list-cell>
			<block v-for="goods in orderdetail.goods" :key="goods.goods_id">
				<tui-list-cell padding="0">
					<view class="tui-goods-item">
						<image :src="goods.thumb" class="tui-goods-img"></image>
						<view class="tui-goods-center">
							<view class="tui-goods-name">{{goods.goods_name}}</view>
							<view class="tui-goods-attr">黑色，50ml</view>
						</view>
						<view class="tui-price-right">
							<view>￥{{goods.goods_price}}</view>
							<view>x{{goods.total_num}}</view>
						</view>
					</view>
				</tui-list-cell>
			</block>
			<view class="tui-goods-info">
				<view class="tui-price-flex tui-size24">
					<view>商品总额</view>
					<view>￥{{orderdetail.total_price}}</view>
				</view>
				<view class="tui-price-flex  tui-size24">
					<view>配送费</view>
					<view>￥{{orderdetail.express_price}}</view>
				</view>
				<view class="tui-price-flex tui-size32 tui-pbtm20">
					<view class="tui-flex-shrink">合计</view>
					<view class="tui-goods-price">
						<view class="tui-size-24">￥</view>
						<view class="tui-price-large">{{orderdetail.pay_price}}</view>
					</view>
				</view>
				
			</view>
		</view>

		<view class="tui-order-info">
			<tui-list-cell :hover="false">
				<view class="tui-order-title">
					订单信息
				</view>
			</tui-list-cell>
			<view class="tui-order-content">
				<view class="tui-order-flex">
					<view class="tui-item-title">订单号:</view>
					<view class="tui-item-content">{{orderdetail.order_no}}</view>
				</view>
				<!-- <view class="tui-order-flex">
					<view class="tui-item-title">物流单号:</view>
					<view class="tui-item-content">33655511251265578556</view>
				</view> -->
				<view class="tui-order-flex">
					<view class="tui-item-title">创建时间:</view>
					<view class="tui-item-content">{{orderdetail.create_time}}</view>
				</view>
				<view class="tui-order-flex">
					<view class="tui-item-title">付款时间:</view>
					<view class="tui-item-content">{{orderdetail.pay_time}}</view>
				</view>
				<view class="tui-order-flex"  v-if="orderdetail.order_status==2">
					<view class="tui-item-title">发货时间:</view>
					<view class="tui-item-content">{{orderdetail.receipt_time}}</view>
				</view>
				<view class="tui-order-flex">
					<view class="tui-item-title">订单备注:</view>
					<view class="tui-item-content">{{orderdetail.remark}}</view>
				</view>
			</view>
		</view>
		<view class="tui-safe-area"></view>
		<view class="tui-tabbar tui-order-btn">
			<view class="tui-btn-mr"  data-ctype='qxdd' @click="confirms" v-if="orderdetail.order_status==0">
				<tui-button type="black" :plain="true" width="152rpx" height="56rpx" :size="26" shape="circle">取消订单</tui-button>
			</view>
			
			<view class="tui-btn-mr"   v-if="orderdetail.order_status==1">
				<tui-button type="black" :plain="true" width="152rpx" height="56rpx" :size="26" shape="circle">待发货</tui-button>
			</view>
			
			<view class="tui-btn-mr"     data-ctype='qrsh' @click="confirms" v-if="orderdetail.order_status==2">
				<tui-button type="black" :plain="true" width="152rpx" height="56rpx" :size="26" shape="circle">确认收货</tui-button>
			</view>
			
			<view class="tui-btn-mr"    v-if="orderdetail.order_status==4">
				<tui-button type="black" :plain="true" width="152rpx" height="56rpx" :size="26" shape="circle">订单已完成</tui-button>
			</view>
			
			<view class="tui-btn-mr"   v-if="orderdetail.order_status==3">
				<tui-button type="black" :plain="true" width="152rpx" height="56rpx" :size="26" shape="circle">已收货</tui-button>
			</view>
			<view class="tui-btn-mr"    data-ctype='comment' @click="confirms" v-if="orderdetail.order_status==3">
				<tui-button type="black" :plain="true" width="152rpx" height="56rpx" :size="26" shape="circle">去评论</tui-button>
			</view>
			
			
			<view class="tui-btn-mr"
			data-ctype='pay'
			 :data-order_id="orderdetail.order_id"
			 :data-body="orderdetail.order_body"
			 :data-order_no="orderdetail.order_no"
			 :data-pay_price="orderdetail.pay_price"
			 @click="wechatpay"
			 v-if="orderdetail.order_status==0"
			>
				<tui-button type="danger" :plain="true" width="152rpx" height="56rpx" :size="26" shape="circle">立即支付</tui-button>
			</view>
		</view>
		<t-pay-way :show="show" @close="popupClose"></t-pay-way>
	</view>
</template>

<script>
	import tPayWay from "@/components/views/t-pay-way/ti-pay-way"
	export default {
		components: {
			tPayWay
		},
		data() {
			return {
				orderdetail:{},
				order_id:0,
			}
		},
		onLoad(e) {
			let that = this;
			let order_id = e.order_id;
			that.order_id = order_id;
			
			that.tui.request("/diandi_shop/order/detail","POST",{order_id:order_id}).then((res)=>{
				uni.hideLoading();
				if(res.code==200){
					console.log('okok',res.code)
					that.orderdetail = res.data
				}else{
					that.tui.toast(res.message);
				}
				console.log('商品详情222',res.data);
			}).catch((err)=>{
				console.log("错误",err);
			});
			
		},
		onShow(e) {
			console.log('打开',e)
			
		},
		methods: {
			async wechatpay(e){
			   let that = this;	
			   let orderInfo =e.currentTarget.dataset;
			   let fans = uni.getStorageSync('fans');
			   
			   console.log('订单支付信息组合',{
								openid:fans.openid,
								trade_type:'JSAPI',
								body:orderInfo.body,
								out_trade_no:orderInfo.order_no,
								total_fee:orderInfo.pay_price,
							},orderInfo)
							
				that.tui.request("/wechat/basics/payparameters","POST",{
							openid:fans.openid,
							trade_type:'JSAPI',
							body:orderInfo.body,
							out_trade_no:orderInfo.order_no,
							total_fee:orderInfo.pay_price,
				}).then((parameters)=>{
					console.log('支付参数',parameters.code)
					if(parameters.code==200){
						// 获取支付参数
						// 仅作为示例，非真实参数信息。
						uni.requestPayment({
							provider: 'wxpay',
							timeStamp: parameters.data.timestamp,
							nonceStr: parameters.data.nonceStr,
							package: parameters.data.package,
							signType: parameters.data.signType,
							paySign: parameters.data.paySign,
							success: function (res) {
								console.log('success:' + JSON.stringify(res));
								uni.redirectTo({
									url:"detail?order_id="+orderInfo.order_id
								})
							},
							fail: function (err) {
								console.log('fail:' + JSON.stringify(err));
								
								let msg = err.errMsg=='requestPayment:fail cancel'?'取消支付':err.errMsg
								
								that.tui.toast(msg);
								return false;
							}
						});
					}else{
						that.tui.toast(parameters.message);
					}
						console.log(parameters)
				}).catch((err)=>{
					console.log("错误",err);
				});
							
				
			   
			  
				return false;
				console.log(this.address,this.userName,this.mobile)
					
			},
			confirms(e){
				let ctype =e.currentTarget.dataset.ctype
				let that = this;
				let order_id = that.order_id;
				if(ctype=='comment'){
					that.iGlobal.togo('comment',{order_id:order_id})
				    return false;
				}
				that.tui.request("/diandi_shop/order/confirm","POST",{
						order_id:order_id,
						ctype:ctype,
						}).then((res)=>{
					uni.hideLoading();
					if(res.code==200){
						that.iGlobal.showToast(res.message)
						that.orderdetail = res.data;
						console.log('详情',res)
					}else{
						that.tui.toast(res.message);
					}
					console.log('商品详情222',res.data);
				}).catch((err)=>{
					console.log("错误",err);
				});
			}
		}
	}
</script>

<style>
	.container {
		padding-bottom: 118rpx;
	}

	.tui-order-header {
		width: 100%;
		height: 160rpx;
		position: relative;
		background-color: #EB0909;
	}

	.tui-img-bg {
		width: 100%;
		height: 160rpx;
	}

	.tui-header-content {
		width: 100%;
		height: 160rpx;
		position: absolute;
		z-index: 10;
		left: 0;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 70rpx;
		box-sizing: border-box;
	}

	.tui-status-text {
		font-size: 34rpx;
		line-height: 34rpx;
		color: #FEFEFE;
	}

	.tui-reason {
		font-size: 24rpx;
		line-height: 24rpx;
		color: rgba(254, 254, 254, 0.75);
		padding-top: 15rpx;
		display: flex;
		align-items: center;
	}

	.tui-reason-text {
		padding-right: 12rpx;
	}

	.tui-status-img {
		width: 80rpx;
		height: 80rpx;
		display: block;
	}

	.tui-flex-box {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.tui-icon-img {
		width: 44rpx;
		height: 44rpx;
		flex-shrink: 0;
	}

	.tui-logistics {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 24rpx 0 20rpx;
		box-sizing: border-box;
	}

	.tui-logistics-text {
		font-size: 26rpx;
		line-height: 32rpx;
	}

	.tui-logistics-time {
		font-size: 24rpx;
		line-height: 24rpx;
		padding-top: 16rpx;
		color: #666
	}

	.tui-addr {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-left: 20rpx;
		box-sizing: border-box;
	}

	.tui-addr-userinfo {
		font-size: 30rpx;
		line-height: 30rpx;
		font-weight: bold;
	}

	.tui-addr-text {
		font-size: 24rpx;
		line-height: 32rpx;
		padding-top: 16rpx;
	}

	.tui-addr-tel {
		padding-left: 40rpx;
	}

	.tui-order-item {
		margin-top: 20rpx;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.tui-goods-title {
		width: 100%;
		font-size: 28rpx;
		line-height: 28rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}


	.tui-goods-item {
		width: 100%;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
	}

	.tui-goods-img {
		width: 180rpx;
		height: 180rpx;
		display: block;
		flex-shrink: 0;
	}

	.tui-goods-center {
		flex: 1;
		padding: 20rpx 8rpx;
		box-sizing: border-box;
	}

	.tui-goods-name {
		max-width: 310rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		font-size: 26rpx;
		line-height: 32rpx;
	}

	.tui-goods-attr {
		font-size: 22rpx;
		color: #888888;
		line-height: 32rpx;
		padding-top: 20rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.tui-price-right {
		text-align: right;
		font-size: 24rpx;
		color: #888888;
		line-height: 30rpx;
		padding-top: 20rpx;
	}

	.tui-color-red {
		color: #E41F19;
		padding-right: 30rpx;
	}

	.tui-goods-price {
		width: 100%;
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		font-size: 24rpx;
	}

	.tui-size-24 {
		font-size: 24rpx;
		line-height: 24rpx;
	}

	.tui-price-large {
		font-size: 32rpx;
		line-height: 30rpx;
	}

	.tui-goods-info {
		width: 100%;
		padding: 30rpx;
		box-sizing: border-box;
		background: #fff;
	}

	.tui-price-flex {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-size24 {
		padding-bottom: 20rpx;
		font-size: 24rpx;
		line-height: 24rpx;
		color: #888;
	}

	.tui-size32 {
		font-size: 32rpx;
		line-height: 32rpx;
		font-weight: 500;
	}

	.tui-pbtm20 {
		padding-bottom: 20rpx;
	}

	.tui-flex-shrink {
		flex-shrink: 0;
	}

	.tui-primary-color {
		color: #EB0909;
	}

	.tui-order-info {
		margin-top: 20rpx;
	}

	.tui-order-title {
		position: relative;
		font-size: 28rpx;
		line-height: 28rpx;
		padding-left: 12rpx;
		box-sizing: border-box;
	}

	.tui-order-title::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		border-left: 4rpx solid #EB0909;
		height: 100%;
	}

	.tui-order-content {
		width: 100%;
		padding: 24rpx 30rpx;
		box-sizing: border-box;
		background: #fff;
		font-size: 24rpx;
		line-height: 30rpx;
	}

	.tui-order-flex {
		display: flex;
		padding-top: 18rpx;
	}

	.tui-order-flex:first-child {
		padding-top: 0
	}

	.tui-item-title {
		width: 132rpx;
		flex-shrink: 0;
	}

	.tui-item-content {
		color: #666;
		line-height: 32rpx;
	}

	.tui-safe-area {
		height: 1rpx;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-tabbar {
		width: 100%;
		height: 98rpx;
		background: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		font-size: 26rpx;
		box-shadow: 0 0 1px rgba(0, 0, 0, .3);
		padding-bottom: env(safe-area-inset-bottom);
		z-index: 996;
	}

	.tui-btn-mr {
		margin-right: 30rpx;
	}
</style>
