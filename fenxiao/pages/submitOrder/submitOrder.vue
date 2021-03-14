<template>
	<view class="container">
		<view class="tui-box">
			<tui-list-cell :arrow="true" unlined :radius="true" @click="chooseAddr">
				<view class="tui-address">
					<view v-if="userAddress.name">
						<view class="tui-userinfo">
							<text class="tui-name">{{userAddress.name}}</text>{{userAddress.phone}}
						</view>
						<view class="tui-addr">
							<view class="tui-addr-tag">{{userAddress.regions.merger_name}}</view>
							<text>{{userAddress.detail}}</text>
						</view>
					</view>
					<view class="tui-none-addr" v-else>
						<image src="/static/images/index/map.png" class="tui-addr-img" mode="widthFix"></image>
						<text>选择收货地址</text>
					</view>
				</view>
				<view class="tui-bg-img"></view>
			</tui-list-cell>
			<view class="tui-top tui-goods-info">
				<tui-list-cell :hover="false" :lineLeft="false">
					<view class="tui-goods-title">
						商品信息
					</view>
				</tui-list-cell>
				<block v-for="(item,index) in goodslist" :key="index">
					<tui-list-cell :hover="false" padding="0">
						<view class="tui-goods-item">
							<image :src="item.goods.thumb" class="tui-goods-img"></image>
							<view class="tui-goods-center">
								<view class="tui-goods-name">{{item.goods.goods_name}}</view>
								<view class="tui-goods-attr">{{item.spec_val}}</view>
							</view>
							<view class="tui-price-right">
								<view>￥{{item.goods_price}}</view>
								<view>x{{item.number}}</view>
							</view>
						</view>
					</tui-list-cell>
				</block>
				<tui-list-cell :hover="false">
					<view class="tui-padding tui-flex">
						<view>商品总额</view>
						<view>￥{{totalPrice}}</view>
					</view>
				</tui-list-cell>
				<!-- <tui-list-cell :arrow="hasCoupon" :hover="hasCoupon">
					<view class="tui-padding tui-flex">
						<view>优惠券</view>
						<view :class="{'tui-color-red':hasCoupon}">{{hasCoupon?"满5减1":'没有可用优惠券'}}</view>
					</view>
				</tui-list-cell>
				<tui-list-cell :hover="true" :arrow="true">
					<view class="tui-padding tui-flex">
						<view>发票</view>
						<view class="tui-invoice-text">不开发票</view>
					</view>
				</tui-list-cell> -->
				<tui-list-cell :hover="false">
					<view class="tui-padding tui-flex">
						<view>配送费</view>
						<view>￥{{freight}}</view>
					</view>
				</tui-list-cell>
				<tui-list-cell :hover="false" :lineLeft="false" padding="0">
					<view class="tui-remark-box tui-padding tui-flex">
						<view>订单备注</view>
						<input type="text" class="tui-remark" 
							placeholder="选填: 请先和商家协商一致" 
							placeholder-class="tui-phcolor"
							 @input="textareaBInput" 
						></input>
					</view>
				</tui-list-cell>
				<tui-list-cell :hover="false" unlined>
					<view class="tui-padding tui-flex tui-total-flex">
						<view class="tui-flex-end tui-color-red">
							<view class="text-grey">合计： </view>
							<view class="tui-price-large  text-price">{{totalPrice}}</view>
						</view>
					</view>
				</tui-list-cell>
			</view>

			<!-- <view class="tui-top">
				<tui-list-cell unlined :hover="insufficient" :radius="true" :arrow="insufficient">
					<view class="tui-flex">
						<view class="tui-balance">余额支付<text class="tui-gray">(￥2019.00)</text></view>
						<switch color="#19be6b" class="tui-scale-small" v-show="!insufficient" />
						<view class="tui-pr-30 tui-light-dark" v-show="insufficient">余额不足, 去充值</view>
					</view>
				</tui-list-cell>
			</view> -->
		</view>
		<view class="tui-safe-area"></view>
		<view class="tui-tabbar">
			<view class="tui-flex-end tui-color-red tui-pr-20">
				<view class="text-grey">实付金额: </view>
				<view class="tui-price-large text-price">{{totalPrice}}</view>
			</view>
			<view class="tui-pr25">
				<tui-button width="200rpx" height="70rpx" :size="28" type="danger" shape="circle" @click="submiorder" v-if="subType==0">确认支付</tui-button>
				<tui-button width="200rpx" height="70rpx" :size="28" :disabled="opensub" type="danger" shape="circle" @click="nowsuborder" v-if="subType==1">确认支付</tui-button>
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
				opensub:false,
				shoppingCart:[],
				userAddress:{},
				totalPrice:0,
				freight:0,
				is_usecache:0,
				remark:'',
				goodslist:[],
				cartIds:'',
				hasCoupon: true,
				insufficient: false,
				show: false,
				goods_id:'',
				goodsNumber:'',
				spec_id:'',
				subType:0,
				goods_type:0
			}
		},
		onLoad(options) {
			let that = this
			that.goods_id     = options.goods_id || '';
			that.goodsNumber  = options.goodsNumber || '';
			that.spec_id      = options.specKeyId || '';
			that.goods_type   = options.goods_type || '';
			
			that.cartIds = options.cartIds || '';
			if(that.goods_id){
				that.subType = 1
			}
			
			console.log('初始1',that.cartIds,that.spec_id)
		},
		onShow() {
			let that = this
			that.initPage()
			
			uni.getStorage({
			    key: 'addressSet',
			    success: function (res) {
					console.log('地址缓存',res)
					if(res.data.name){
						that.is_usecache = 1
						that.userAddress = res.data
						that.address_id = res.data.address_id
					}
					
			    },
				complete(res) {
					console.log('地址缓存错误',res)
					console.log(res)
				}
			});
			
		},
		methods: {
			initPage(){
				let that = this
				
				if(that.subType==0){
					that.getCartlist()
				}else if(that.subType==1){
					that.getdetail()
				}
				
				if(that.is_usecache==0){
					that.getdefalut()
				}
				
			},
			textareaBInput(e) {
				this.remark = e.detail.value
			},
			getCartlist(){
				var that = this;
				let totalPrice = 0;
				let totalNumber =0;
				
				that.tui.request("/diandi_shop/cart/list","POST",{
					cart_ids:that.cartIds
				}).then((res)=>{
					if(res.code==200){
						
						that.shoppingCart = res.data
						
						that.shoppCart = res.data
						that.goodslist = res.data.goods
						console.log('购物车商品列表',res.data.goods)
						that.goodsTotalPrice = res.data.goodsTotalPrice
						//总价
						that.totalPrice   = res.data.total_price;
						that.freight   = res.data.freight;
						that.totalNumber  = res.data.goodsTotalNumber;
						
						that.delivery_times = res.data.delivery_times
						console.log('购物车列表数据1',res.data.delivery_times[0])
						
						that.multiArray = res.data.delivery_times;
						if(res.data.delivery_times[0][0]==undefined || res.data.delivery_times[0][0]==''){
							 that.tabCur=1
						}
						
					}else{
						that.tui.toast(res.message);
					}
					console.log('商品详情222',res.data);
				}).catch((res)=>{})
			},
			getdefalut(){
				let that = this
				that.tui.request("/diandi_shop/address/getdefault","POST",{}).then((res)=>{
					if(res.code==200){
						that.userAddress = res.data
						console.log('默认收货地址',res)
						that.address_id = res.data.address_id
						that.userName = res.data.member.username
						that.mobile = res.data.member.mobile
						that.address = res.data.member.address
					}else{
						that.tui.toast(res.message);
					}
					console.log('商品详情222',res.data);
				}).catch((err)=>{
					console.log("错误",err);
				});
			},
			// 获取详情
			getdetail(){
				let that = this
				let goods_id = that.goods_id
				
				that.tui.request("/diandi_distribution/order/orderdetail","GET",{
					goods_id:goods_id,
					goods_number: that.goodsNumber,
					spec_id: that.spec_id,
					goods_type: that.goods_type,
				}).then((res)=>{
					console.log('商品详情立即购买',res.code==200,res.code,res.data)
					if(res.code==200){
						let  goodsNumber = that.goodsNumber
						let  spec_id     = that.spec_id
						that.goodslist  = res.data.goods
						console.log('that.goodslist详情',that.goodslist)
						//总价
						that.totalPrice   = res.data.total_price;
						that.freight   = res.data.freight;
						that.totalNumber  = res.data.goodsTotalNumber;
					}else{
						that.opensub = true
						that.tui.toast(res.message);
					}
				}).catch((res)=>{
					console.log('获取详情失败',res)
				})
				
			},	
			// 计算配送距离
			getlocation(){
				let that = this
				
				uni.getLocation({
				    type: 'wgs84',
				    success: function (res) {
				        console.log('纬度：' + res.latitude);
				        console.log('经度：' + res.longitude);
						that.detail = res.address;
						
						that.tui.request("/diandi_shop/store/distance","GET",{
							lat:res.latitude,
							lng:res.longitude
						}).then((res)=>{
							if(res.code==200){
								if(ress.data.is_distance==1){
									
									that.is_distance=1;
									that.bgname='text-gray';
									that.tui.toast('抱歉，超出配送距离','none',3000)
								}
								 // that.TabCur = ress.data.is_distance
								console.log('距离',ress.data);
							}else{
								that.tui.toast(res.message);
							}
							console.log('商品详情222',res.data);
						}).catch((err)=>{
							console.log("错误",err);
						});
						
					
				    }
				});
			},
			selectAreas(){
				uni.navigateTo({
					url:"../address/selects"
				})
			},
			submiorder(){
				
				let that = this
				console.log()
				if(that.is_distance==1){
					that.tui.toast('超出配送范围，不能下单')
					return false;
				}
				
				if(that.is_submit){
					that.wechatpay();
					return false;
				} 
				let address_id = that.address_id
				console.log('过后',that.shoppingCart)
				let ids = []
				that.shoppingCart.goods.forEach(item=>{
					ids.push(item.id)
				})
				console.log('购物车id',ids,JSON.stringify(ids))
				let data = {
					goods: JSON.stringify(ids),
					total_price: that.shoppingCart.total_price,
					express_price: that.shoppingCart.freight,
					express_type: 0,
					name: that.userName,
					phone: that.mobile,
					delivery_time:'',
					detail: that.address,
					address_id:address_id,
					remark:that.remark
				}
				
				
				that.tui.request("/diandi_distribution/order/createorder","POST",data).then((res)=>{
						console.log('订单提交',res.code,res)
						if(res.code==200){
							let orderInfo = res.data
							that.orderInfo = orderInfo
							that.is_submit = true
							that.wechatpay();
							console.log(res)
						}else{
							that.tui.toast(res.message);
						}
					console.log('商品详情222',res.data);
				}).catch((err)=>{
					console.log("错误",err);
				});
			},
			nowsuborder(){
				let that = this
				console.log()
				if(that.is_distance==1){
					that.tui.toast('超出配送范围，不能下单')
					return false;
				}
				
				if(that.is_submit){
					that.wechatpay();
					return false;
				} 
				let address_id = that.address_id
				let ids = []
				ids.push(that.goods_id)
				console.log('购物车id',ids,JSON.stringify(ids))
				let data = {
					goods: JSON.stringify(ids),
					spec_id:that.spec_id,
					goods_id:that.goods_id,
					goods_num:that.goodsNumber,
					order_type: that.goods_type,
					total_price: that.totalPrice,
					express_price: that.freight,
					express_type: 0,
					name: that.userName,
					phone: that.mobile,
					delivery_time:'',
					detail: that.address,
					address_id:address_id,
					remark:that.remark
				}
				
				
				that.tui.request("/diandi_distribution/order/creategoodsorder","POST",data).then((res)=>{
						console.log('订单提交',res.code,res)
						if(res.code==200){
							let orderInfo = res.data
							that.orderInfo = orderInfo
							that.is_submit = true
							that.wechatpay();
							console.log(res)
						}else{
							that.tui.toast(res.message);
						}
					console.log('商品详情222',res.data);
				}).catch((err)=>{
					console.log("错误",err);
				});
			},
			async wechatpay(e){
			   let that = this;		  
			   let fans = uni.getStorageSync('fans'),orderInfo=that.orderInfo;
			   console.log('订单支付信息组合',{
								openid:fans.openid,
								trade_type:'JSAPI',
								body:orderInfo.body,
								out_trade_no:orderInfo.order_no,
								total_fee:orderInfo.pay_price,
							},orderInfo)
					// 获取支付参数
					
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
											url:"../success/success?order_id="+orderInfo.order_id,
											complete(res) {
												console.log('支付成功后',res)
											}
										})
									},
									fail: function (err) {
										console.log('fail:' + JSON.stringify(err));
										
										let msg = err.errMsg=='requestPayment:fail cancel'?'取消支付':err.errMsg
										that.tui.toast(msg)
										uni.redirectTo({
											url:"../myOrder/myOrder",
											complete(res) {
												console.log(res)
											}
										})
									}
								});
								
								console.log(parameters)
							}else{
								that.tui.toast(parameters.message)
							}
							
				}).catch((err)=>{
					console.log("错误",err);
				});
				
				
			   
			  
				return false;
				console.log(this.address,this.userName,this.mobile)
					
			},
			chooseAddr() {
				uni.navigateTo({
					url: "../address/address"
				})
			},
			btnPay() {
				this.show = true
			},
			popupClose() {
				this.show = false
			}
		}
	}
</script>

<style>
	.container {
		padding-bottom: 98rpx;
	}

	.tui-box {
		padding: 20rpx 0 118rpx;
		box-sizing: border-box;
	}

	.tui-address {
		min-height: 80rpx;
		padding: 10rpx 0;
		box-sizing: border-box;
		position: relative;
	}

	.tui-userinfo {
		font-size: 30rpx;
		font-weight: 500;
		line-height: 30rpx;
		padding-bottom: 12rpx;
	}

	.tui-name {
		padding-right: 40rpx;
	}

	.tui-addr {
		font-size: 24rpx;
		word-break: break-all;
		padding-right: 25rpx;
	}

	.tui-addr-tag {
		padding: 5rpx 8rpx;
		flex-shrink: 0;
		background: #EB0909;
		color: #fff;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 25rpx;
		line-height: 25rpx;
		transform: scale(0.8);
		transform-origin: 0 center;
		border-radius: 6rpx;
	}

	.tui-bg-img {
		position: absolute;
		width: 100%;
		height: 8rpx;
		left: 0;
		bottom: 0;
		background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL0AAAAECAMAAADszM6/AAAAOVBMVEUAAAAVqfH/fp//vWH/vWEVqfH/fp8VqfH/fp//vWEVqfH/fp8VqfH/fp//vWH/vWEVqfH/fp//vWHpE7b6AAAAEHRSTlMA6urqqlVVFRUVq6upqVZUDT4vVAAAAEZJREFUKM/t0CcOACAQRFF6r3v/w6IQJGwyDsPT882IQzQE0E3chToByjG5LwMgLZN3TQATmdypCciBya0cgOT3/h//9PgF49kd+6lTSIIAAAAASUVORK5CYII=") repeat;
	}

	.tui-top {
		margin-top: 20rpx;
		overflow: hidden;
	}

	.tui-goods-title {
		font-size: 28rpx;
		display: flex;
		align-items: center;
	}

	.tui-padding {
		box-sizing: border-box;
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

	.tui-flex {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 26rpx;
	}

	.tui-total-flex {
		justify-content: flex-end;
	}

	.tui-color-red,
	.tui-invoice-text {
		color: #E41F19;
		padding-right: 30rpx;
	}

	.tui-balance {
		font-size: 28rpx;
		font-weight: 500;
	}

	.tui-black {
		color: #222;
		line-height: 30rpx;
	}

	.tui-gray {
		color: #888888;
		font-weight: 400;
	}

	.tui-light-dark {
		color: #666;
	}

	.tui-goods-price {
		display: flex;
		align-items: center;
		padding-top: 20rpx;
	}

	.tui-size-26 {
		font-size: 26rpx;
		line-height: 26rpx;
	}

	.tui-price-large {
		font-size: 34rpx;
		line-height: 32rpx;
		font-weight: 600;
	}

	.tui-flex-end {
		display: flex;
		align-items: flex-end;
		padding-right: 0;
	}

	.tui-phcolor {
		color: #B3B3B3;
		font-size: 26rpx;
	}

	/* #ifndef H5 */
	.tui-remark-box {
		padding: 22rpx 30rpx;
	}

	/* #endif */
	/* #ifdef H5 */
	.tui-remark-box {
		padding: 26rpx 30rpx;
	}

	/* #endif */

	.tui-remark {
		flex: 1;
		font-size: 26rpx;
		padding-left: 64rpx;
	}

	.tui-scale-small {
		transform: scale(0.8);
		transform-origin: 100% center;
	}

	.tui-scale-small .wx-switch-input {
		margin: 0 !important;
	}

	/* #ifdef H5 */
	>>>uni-switch .uni-switch-input {
		margin-right: 0 !important;
	}

	/* #endif */
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

	.tui-pr-30 {
		padding-right: 30rpx;
	}

	.tui-pr-20 {
		padding-right: 20rpx;
	}

	.tui-none-addr {
		height: 80rpx;
		padding-left: 5rpx;
		display: flex;
		align-items: center;
	}

	.tui-addr-img {
		width: 36rpx;
		height: 46rpx;
		display: block;
		margin-right: 15rpx;
	}


	.tui-pr25 {
		padding-right: 25rpx;
	}

	.tui-safe-area {
		height: 1rpx;
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
