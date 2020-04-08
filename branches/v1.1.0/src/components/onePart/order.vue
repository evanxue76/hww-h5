<template>
  <div class="order">
  	<div class="noData" v-if='show'>
    	<img :src="noDataPic"/>
    	<div class="noDataRat">暂无订单</div>
    </div>
  	<van-list
        v-model="loading"
        :finished="finished"
        @load="onLoad"
        :offset="10"
        loading-text="正在加载"
        finished-text="没有更多数据了"
        v-else
      >
    <section>
      <van-cell-group class="order-list" v-for="(item, index) in orderList" :key="index">
        <div class="order-list-info">
        	<div class="search-details" @click="orderInfo(item)">
          <span class="imgSTAT">
            <img
              v-if="item.type == 3 || item.type == 12 || item.type == 13 || item.type == 14"
              :src="impPic.memberPic"
              alt="会员相关服务"
            >
            <img v-else :src="impPic.reportPic" alt="咨询相关服务">
          </span>
          <div class="order-details">
            <div>{{ item.type | type }}</div>
            <div>{{ item.createdAt | createdAt }}</div>
          </div>
          </div>
          <div class="order-price">
            <div>{{ item.value | price }}</div>
            <div v-if="item.status == 0">
            	<span class="againPay" @click="payAgain(item)">立即支付</span>
            </div>
            <div v-else>{{ item.status | status }}</div>
          </div>
        </div>
      </van-cell-group>
    </section>
    </van-list>
    
    
    <van-popup v-model="show5">
      <van-nav-bar title="订单详情" left-arrow @click-left="show5 = false;"/>
      <div>
        <van-cell-group class="order-status">
          <div class="status-item1">{{detalisData.type | type}}</div>
          <div class="status-item2">{{detalisData.value | price}}</div>
          <div class="status-item3">{{detalisData.status | status}}</div>
        </van-cell-group>
        <van-cell-group>
          <div class="status-detail">
            <div class="status-detail-label">
              <div>付款方式</div>
              <div>付款时间</div>
              <div>订单号</div>
            </div>
            <div class="status-detail-content">
              <div>{{detalisData.payType | payTypeFilter}}</div>
              <div>{{detalisData.timeEnd | createdAt}}</div>
              <div>{{detalisData.orderNo}}</div>
            </div>
          </div>
        </van-cell-group>
      </div>
    </van-popup>
  </div>
</template>

<script>
import util from "../../lib/util";
import utils from "../../lib/utils";
import { formatDate, formatSecond } from "../../lib/time";

export default {
  data() {
    return {
    	loading: false,
      finished: false,
      show: false,
      show5: false,
      orderList: [],
      pageNum: 0,
      impPic: {
        memberPic: require("../../assets/image/icon_order_vip.png"),
        reportPic: require("../../assets/image/icon_order_report.png")
      },
      noDataPic: require('../../assets/image/pic_none.png'),
      detalisData: {},
      hw_user_message: {},
      priceUrl: ''
    };
  },
  created() {
  	let userData = localStorage.getItem('hw_user_message')
	  this.hw_user_message = JSON.parse(userData)
    //this.getInfo();
  },
  filters: {
    createdAt(val) {
    	if (val == '') {
    		return ''
    	}
      return formatDate(val);
    },
    type(val) {
      switch (val) {
        case 3:
          return "服务开通";
          break;
        case 4:
          return "图文咨询";
          break;
        case 6:
          return "心电图人工解读";
          break;
        case 11:
          return "心电详细分析报告";
          break;
        case 12:
          return "服务续费";
          break;
        case 13:
          return "服务升级";
          break;
        case 14:
          return "服务续费";
          break;
      }
    },
    price(val) {
      if (val == 0) {
        return 0;
      } else {
        let valR = val * 0.01;
        return " - " + valR.toFixed(2);
      }
    },
    status(val) {
      switch (val) {
        case 0:
          return "支付中";
          break;
        case 1:
          return "支付成功";
          break;
        case 2:
          return "支付失败";
          break;
        case 3:
          return "已发货";
          break;
        case 4:
          return "订单过期关闭";
          break;
        case 5:
          return "取消 ";
          break;
        case 6:
          return "退款 ";
          break;
      }
    },
    payTypeFilter(val){
    	switch (val){
    		case 1:
    			return '微信支付';
    		case 2:
    			return '支付宝支付';
    		case 3:
    			return '积分支付';
    		case 4:
    			return '免费次数支付'
    		default: '支付失败'
    			break;
    	}
    }
  },
  methods: {
    onLoad() {
      let self = this;
      let Url = "";
      let params = {
        body: {
          userNo: this.hw_user_message.managerNo,
          pageSize: 10,
          pageNum: this.pageNum
        },
        reqHead: {
          functionId: "HWW002008001"
        }
      };
      util.ajax.post(Url, params).then(res => {
      	console.log(res)
        self.orderList = self.orderList.concat(res.data.body.data.datas);
        if (self.orderList.length == 0) {
        	self.show = true
        }else{
        	self.show = false
        }
        self.loading = false;
        self.pageNum++;
        if (self.orderList.length >= res.data.body.data.total) {
          self.finished = true;
        }
        
      });
    },
    payAgain(item){
    	let self = this;
        	this.$toast.loading({
				    mask: true,
				  	message: '加载中...'
				  })
//          let Url = "http://api-test.995120.cn/hww/hwpay/repay";
          let Url = "http://api.995120.cn/hww/hwpay/repay";
          let params = {
          	reqHeae: {},
          	body: {
          		orderId: item.id
          	}
          };
          utils.ajax.post(Url, params).then(function(res) {
          	if (res.data.body.data.disposeFlag) {
          		setTimeout(function(){
          			item.status = 1
          		},3000)
          	}
            if (res.data.respHead.respCode == "000") {
            	self.$toast.clear()
//            	window.location.href = res.data.body.data.mweb_url + '&redirect_url=http%3a%2f%2fapi-test.995120.cn%2fhwh%2fpayResult?docId=' + res.data.body.data.docId + '%26orderId=' + res.data.body.data.orderId + '%26serviceTypeId=' + res.data.body.data.serviceTypeId
            	window.location.href = res.data.body.data.mweb_url + '&redirect_url=http%3a%2f%2fapi.995120.cn%2fstatic%2fhm505%2fhwh%2fpayResult?docId=' + res.data.body.data.docId + '%26orderId=' + res.data.body.data.orderId + '%26serviceTypeId=' + res.data.body.data.serviceTypeId
            }else{
            	self.$toast(`${res.data.respHead.respMsg}`);
            }
          });
    },
    orderInfo(item) {
      this.show5 = true;
      this.detalisData = item
    }
  }
};
</script>

<style scoped>
p {
  font-size: 14px;
}

.order {
  background-color: #f2f2f2;
  height: 100%;
  font-size: 14px;
}

.order-list {
  background-color: #fff;
  /* height: 100px; */
}
.order-list-info,
.status-detail {
  padding: 18px;
  width: 100%;
  display: flex;
  box-sizing: border-box;
  position: relative;
  line-height: 24px;
  background-color: #fff;
  color: #323233;
  font-size: 14px;
  overflow: hidden;
}

.van-popup {
  background-color: #f2f2f2;
  width: 100vw;
  height: 100vh;
}

.imgSTAT,
.imgSTAT img {
  width: 48px;
  height: 48px;
}

.order-status {
  padding: 18px;
  text-align: center;
}

.order-details,
.order-price,
.status-detail-label,
.status-detail-content {
  flex: 1;
  line-height: 24px;
  display: inline-block;
}
.status-detail-label div{
	height: 24px;
}

.order-details {
  margin-left: 14px;
}

.order-details :first-child,
.order-price :first-child {
  font-size: 14px;
}

.order-details :last-child {
  font-size: 12px;
  color: #888;
}

.order-price,
.status-detail-content {
  text-align: right;
}
.status-detail-content div{
	height: 24px;
}

.status-item1,
.status-item2,
.status-item3 {
  line-height: 48px;
  font-weight: bold;
}

.status-item1 {
  font-size: 16px;
}
.status-item2 {
  font-size: 24px;
}

.status-item3 {
  font-size: 12px;
}
.noData{
	text-align: center;
}
.noData img{
	width: 50%;
	margin-top: 20%;
}
.noDataRat{
	margin-top: 22px;
	color: darkgrey;
}
.againPay{
	color: #ffffff;
	padding: 3px 6px;
	background: #FB6422;
	border-radius: 50px;
	font-size: 12px !important;
	z-index: 100;
}
</style>
