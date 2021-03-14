<template>
	<view class="tui-addr-box">
		<form :report-submit="true">
			<tui-list-cell :hover="false" padding="0">
				<view class="tui-line-cell">
					<view class="tui-title">收货人</view>
					<input placeholder-class="tui-phcolor"  v-model="name" class="tui-input" name="name" placeholder="请输入收货人姓名" maxlength="15" type="text" />
				</view>
			</tui-list-cell>
			<tui-list-cell :hover="false" padding="0">
				<view class="tui-line-cell">
					<view class="tui-title">手机号码</view>
					<input placeholder-class="tui-phcolor"  v-model="phone" class="tui-input" name="mobile" placeholder="请输入收货人手机号码" maxlength="11"
					 type="text" />
				</view>
			</tui-list-cell>
			<tui-list-cell :arrow="true" padding="0">
				<view class="tui-line-cell">
					<view class="tui-title"><text class="tui-title-city-text">所在城市</text></view>
					<input placeholder-class="tui-phcolor" class="tui-input" v-model="address"
					 @tap="showPicker"
					 disabled name="city" placeholder="请选择城市" maxlength="50" type="text" />
				</view>
			</tui-list-cell>
			
			<!-- <tui-list-cell :arrow="true" padding="0">
					<view class="s-input s-select text-center padding-left-sm" @tap="showPicker">
						<text class="text  wid27">{{text[0]}}</text>
						<image src="/static/images/index/icon_right.png" class="img30 pdr20"></image>
						<text class="text  wid27">{{text[1]}}</text>
						<image src="/static/images/index/icon_right.png" class="img30 pdr20"></image>
						<text class="text wid46">{{text[2]}}</text>
						<image src="/static/images/index/icon_down.png" class="img32 flr"></image>
					</view>
			</tui-list-cell> -->
					
					
		<!-- <view class="search-box">
			
		</view> -->
		
			<tui-list-cell :hover="false" padding="0">
				<view class="tui-line-cell">
					<view class="tui-title">具体地址</view>
					<input placeholder-class="tui-phcolor" v-model="detail" class="tui-input" name="address" placeholder="请输入详细的收货地址" maxlength="50" type="text" />
				</view>
			</tui-list-cell>
			<!-- 默认地址 -->
			<tui-list-cell :hover="false" padding="0">
				<view class="tui-swipe-cell">
					<view>设为默认地址</view>
					<switch checked color="#19be6b" class="tui-switch-small"  @change="isDefault"/>
				</view>
			</tui-list-cell>
			<!-- 保存地址 -->
			<view class="tui-addr-save">
				
				<tui-button shadow type="danger" height="88rpx" shape="circle"  @click="saveaddress" v-if="address_id==0">保存收货地址</tui-button>
				<tui-button shadow type="danger" height="88rpx" shape="circle" @click="editaddress" v-if="address_id>0">保存收货地址</tui-button>
			</view>
			<view class="tui-del" v-if="false">
				<tui-button shadow type="gray" height="88rpx" shape="circle">删除收货地址</tui-button>
			</view>
		</form>
		
		<!--picker-view start-->
		<view class="tui-mask-screen" :class="[showPickerStatus?'tui-mask-show':'']" @tap="hidePicker"></view>
		<view class="tui-picker-box" :class="[showPickerStatus?'tui-pickerbox-show':'']">
			<view class="picker-header tui-list-item">
				<view class="btn-cancle" hover-class="tui-opcity" :hover-stay-time="150" @tap.stop="hidePicker">取消</view>
				<view class="btn-sure" hover-class="tui-opcity" :hover-stay-time="150" @tap.stop="picker">确定</view>
			</view>
			<picker-view indicator-style="height: 50px;" class="picker-view" :value="value" @change="columnPicker">
				<picker-view-column>
					<view v-for="(item,index) in proviceArr" :key="index" class="item">{{item.name}}</view>
				</picker-view-column>
				<picker-view-column>
					<view v-for="(item,index) in cityArr" :key="index" class="item">{{item.name}}</view>
				</picker-view-column>
				<picker-view-column>
					<view v-for="(item,index) in districtArr" :key="index" class="item">{{item.name}}</view>
				</picker-view-column>
			</picker-view>
		</view>
		<!--picker-view end-->
	</view>
</template>

<script>
export default {
		data() {
			return {
				name:'',
				address_id:0,
				is_default:true,
				pickaddress:{},
				phone:'',
				detail:'',
				address:'',
				cityData:[],
				proviceArr: [],
				cityArr: [],
				districtArr: [],
				value: [0, 0, 0],
				iconHidden: true,
				showPickerStatus: false,
				text: ["请选择", "请选择", "请选择"],
				searchKey: ""
			}
		},
		onLoad(e){
			let that  = this
			that.address_id = e.id !=undefined?e.id:0;
			console.log('load',e)
			
			that.initPage()
				
				
				
		},
		onShow(e){
			console.log('show',e)
			
			
		},
		methods: {
			initPage(){
				let that = this
				let address_id = that.address_id
				if(address_id){
					that.getAddress()
				}
				that.getCitylist();
			},
			getAddress(){
				let that = this
				
				that.tui.request("/diandi_shop/address/detail","POST",{
					address_id:this.address_id
				}).then((res)=>{
					if(res.code==200){
						that.name = res.data.name
						that.pickaddress[0]= res.data.province_id
						that.pickaddress[1]= res.data.city_id
						that.pickaddress[2]= res.data.region_id
						that.phone = res.data.phone
						that.detail = res.data.detail
						
						
						that.province_id= cityData[value[0]].id;
						that.city_id= cityData[value[0]].children[value[1]].id;
						that.region_id= cityData[value[0]].children[value[1]].children[value[2]].id;
						  
						that.address = [res.data.province.name,res.data.city.name, res.data.region.name];
						
						console.log('地址详情信息',res)
					}else{
						that.tui.toast(res.message);
					}
					console.log('地址详情信息',res.data,res.data.province.name,res.data.city.name, res.data.region.name);
				}).catch((res)=>{
					console.log(res)
				})
			},
			editaddress(e){
				let that = this
					let pickaddress = that.pickaddress
					let access_token = uni.getStorageSync('access_token');
					
					let data = {
						name:that.name,
						province_id:that.province_id,
						city_id:that.city_id,
						region_id:that.region_id,
						phone:that.phone,
						detail:that.detail,
						is_default:that.is_default,
						'access-token':access_token,
						'address_id':that.address_id
					}
					if(!data.name){
						that.tui.toast('请输入收货人')
						return false;
					}
					
					if(!this.iGlobal.regExps.mobile.test(data.phone)){
						that.tui.toast('请输入正确的手机号')
						return false;
					}
					if(!data.province_id){
						that.tui.toast('请输入省份')
						return false;
					}
					if(!data.city_id){
						that.tui.toast('请选择城市')
						return false;
					}
					if(!data.region_id){
						that.tui.toast('请输入区域')
						return false;
					}
					if(!data.detail){
						that.tui.toast('请输入详细地址')
						return false;
					}
					
					if(!data.address_id){
						that.tui.toast('编辑错误')
						return false;
					}
					
					that.tui.request("/diandi_shop/address/edit","POST",data).then((res)=>{
						if(res.code==200){
							uni.navigateBack()
							console.log(res)
						}else{
							that.tui.toast(res.message);
						}
						console.log('商品详情222',res.data);
					}).catch((res)=>{
						console.log(res)
					})
					
			},
			saveaddress(e){
				let that = this 
				let pickaddress = that.pickaddress
				let access_token = uni.getStorageSync('access_token');
				
				let data = {
					name:that.name,
					province_id:that.province_id,
					city_id:that.city_id,
					region_id:that.region_id,
					phone:that.phone,
					detail:that.detail,						
					is_default:that.is_default?1:0,
					'access-token':access_token
				}
				if(!data.name){
					that.tui.toast('请输入收货人')
					return false;
				}
				
				if(!that.iGlobal.regExps.mobile.test(data.phone)){
					that.tui.toast('请输入正确的手机号')
					return false;
				}
				if(!data.province_id){
					that.tui.toast('请输入省份')
					return false;
				}
				if(!data.city_id){
					that.tui.toast('请选择城市')
					return false;
				}
				if(!data.region_id){
					that.tui.toast('请输入区域')
					return false;
				}
				if(!data.detail){
					that.tui.toast('请输入详细地址')
					return false;
				}
				that.tui.request("/diandi_shop/address/add","POST",data).then((res)=>{
					if(res.code==200){
						uni.navigateBack()
						console.log(res)
					}else{
						that.tui.toast(res.message);
					}
					console.log('商品详情222',res.data);
				}).catch((res)=>{
					console.log(res)
				})
			
			},
			getCitylist(){
				let that = this
				that.tui.getCitylist().then((data)=>{
					that.cityData = data
					let  proviceArr =[];
					console.log('llll',data)
					data.forEach((item,index)=>{
						proviceArr.push(item)
					})
					that.proviceArr = proviceArr
					that.cityArr = data[0].children;
					that.districtArr = data[0].children[0].children
					
					console.log('城市列表',data,that.proviceArr,that.cityArr,that.districtArr);
				}).catch((res)=>{
					console.log(res)
				})
			},
			isDefault(e){
				let that = this
				let is_default = e.target.value
				that.is_default = is_default 
				console.log('is_default ',is_default )
			},
			//picker change切换事件
			columnPicker: function(e) {
				let that = this
				let cityData = that.cityData;
				let value = e.detail.value;
				
				//如果两者下标不一致，表示滚动过
				if (this.value[0] !== value[0]) {
					this.cityArr = cityData[value[0]].children;
					this.districtArr = cityData[value[0]].children[0].children;
					this.value = [value[0], 0, 0]
				} else if (this.value[1] !== value[1]) {
					this.cityArr = this.cityArr;
					this.districtArr = cityData[value[0]].children[value[1]].children;
					this.value = [value[0], value[1], 0]
				} else {
					this.value = value
				}
			},
			//确定按钮
			picker: function(e) {
				let that = this
				let cityData = that.cityData;
				let value = this.value;
				if (cityData.length > 0) {
					let provice = cityData[value[0]].name;
					let city = cityData[value[0]].children[value[1]].name;
					let district = cityData[value[0]].children[value[1]].children[value[2]].name;
					
					that.province_id= cityData[value[0]].id;
					that.city_id= cityData[value[0]].children[value[1]].id;
					that.region_id= cityData[value[0]].children[value[1]].children[value[2]].id;
					
					that.address = [provice, city, district];
					console.log(that.address,that.province_id,that.city_id,that.region_id)
					that.showPickerStatus = false
				}
			},
			// 显示picker-view
			showPicker: function() {
				this.showPickerStatus = true
			},
			// 隐藏picker-view
			hidePicker: function() {
				this.showPickerStatus = false
			},
			//input事件
			bindViewInput: function(e) {
				//e.detail.value
				let hidden = true;
				if (e.detail.value != "") {
					hidden = false
				}
				this.iconHidden = hidden;
				this.searchKey = e.detail.value
			},
			resetInput: function(e) {
				this.searchKey = "";
				this.iconHidden = true
			},
		}
	}
	
</script>

<style>
	.tui-addr-box {
		padding: 20rpx 0;
	}

	.tui-line-cell {
		width: 100%;
		padding: 24rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}

	.tui-title {
		width: 180rpx;
		font-size: 28rpx;
	}

	.tui-title-city-text {
		width: 180rpx;
		height: 40rpx;
		display: block;
		line-height: 46rpx;
	}

	.tui-input {
		width: 500rpx;
	}

	.tui-input-city {
		flex: 1;
		height: 40rpx;
		font-size: 28rpx;
		padding-right: 30rpx;
	}

	.tui-phcolor {
		color: #ccc;
		font-size: 28rpx;
	}
	.tui-cell-title{
		font-size: 28rpx;
	}
	.tui-addr-label {
		margin-left: 70rpx;
	}

	.tui-label-item {
		width: 76rpx;
		height: 40rpx;
		border: 1rpx solid rgb(136, 136, 136);
		border-radius: 6rpx;
		font-size: 26rpx;
		text-align: center;
		line-height: 40rpx;
		margin-right: 20rpx;
		display: inline-block;
		transform: scale(0.9);
	}
	.tui-label-active{
		background: #E41F19;
		border-color:#E41F19;
		color: #fff;
	}
	.tui-swipe-cell {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		padding: 10rpx 24rpx;
		box-sizing: border-box;
		border-radius: 6rpx;
		overflow: hidden;
		font-size: 28rpx;
	}

	.tui-switch-small {
		transform: scale(0.8);
		transform-origin: 100% center;
	}

	/* #ifndef H5 */
	.tui-switch-small .wx-switch-input {
		margin: 0 !important;
	}

	/* #endif */

	/* #ifdef H5 */
	>>>uni-switch .uni-switch-input {
		margin-right: 0 !important;
	}

	/* #endif */

	.tui-addr-save {
		padding: 24rpx;
		margin-top: 100rpx;
	}

	.tui-del {
		padding: 24rpx;
	}
	
	/* picker start*/
	
	.tui-mask-screen {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 99996;
		transition: all 0.3s ease-in-out;
		opacity: 0;
		visibility: hidden;
	}
	
	.tui-mask-show {
		opacity: 1;
		visibility: visible;
	}
	
	.tui-picker-box {
		width: 100%;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 99999;
		visibility: hidden;
		transform: translate3d(0, 100%, 0);
		transform-origin: center;
		transition: all 0.3s ease-in-out;
		min-height: 20rpx;
		background: #fff;
	}
	
	.tui-pickerbox-show {
		transform: translate3d(0, 0, 0);
		visibility: visible;
	}
	
	.picker-header {
		width: 100%;
		height: 90rpx;
		padding: 0 46rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		font-size: 32rpx;
		background: #fff;
	}
	
	.tui-list-item::after {
		left: 0;
	}
	
	.btn-cancle {
		padding: 20rpx;
		color: #888;
	}
	
	.btn-sure {
		padding: 20rpx;
		color: #5677fc;
	}
	
	.picker-view {
		width: 100%;
		height: 260px;
	}
	
	.item {
		line-height: 50px;
		text-align: center;
	}
	
	/* picker end*/
	
	.search-box {
		width: 672rpx;
		border-radius: 10rpx;
		box-sizing: border-box;
		margin: 80rpx auto 40rpx auto;
		position: relative;
		/* #ifdef MP-ALIPAY */
		background: #fff;
		/* #endif */
	}
	
	.search-box::after {
		content: '';
		position: absolute;
		height: 200%;
		width: 200%;
		border: 1rpx solid #dbe1ef;
		transform-origin: 0 0;
		-webkit-transform-origin: 0 0;
		-webkit-transform: scale(0.5);
		transform: scale(0.5);
		left: 0;
		top: 0;
		border-radius: 20rpx;
		pointer-events: none;
	}
	
	.s-input {
		height: 86rpx;
		padding: 0 21rpx;
		display: flex;
		align-items: center;
	}
	
	.s-img {
		width: 34rpx;
		height: 34rpx;
		margin-right: 17rpx;
		flex-shrink: 0;
	}
	
	.input {
		font-size: 32rpx;
		color: #353535;
		width: 565rpx;
		padding-right: 5rpx;
		box-sizing: border-box;
		height: 100%;
	}
	
	.img30 {
		height: 30rpx;
		width: 30rpx;
	}
	
	.s-select {
		position: relative;
		z-index: 9;
	}
	
	.s-select::before {
		content: '';
		position: absolute;
		border-top: 1rpx solid #dbe1ef;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		top: 0;
		right: 0;
		left: 0;
	}
	
	.text {
		color: #353535;
		font-size: 32rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.wid27 {
		width: 27%;
	}
	
	.wid46 {
		width: 46%;
	}
	
	.img32 {
		height: 32rpx;
		width: 32rpx;
	}
	
	.pdr20 {
		padding-right: 20rpx;
	}
	
	.flr {
		margin-left: auto;
	}
	
	.btn-select {
		padding: 20rpx 40rpx;
	}
</style>
