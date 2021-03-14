<template>
	<view class="content">
		<TNoticeBar :list="list"></TNoticeBar>
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
	</view>
</template>

<script>
import TNoticeBar from '../../components/t-notice-bar.vue'
console.log(TNoticeBar);
	export default {
		components:{TNoticeBar},
		data() {
			return {
				title: 'Hello',
				list:['1分钟前，无夏购买了会员','2分钟前，无夏购买了会员','3分钟前，无夏购买了会员']
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
