<template>
  <div class="upgradePackage">
    <van-cell-group>
      <van-cell title="服务名称" value="心电监测服务" />
      <van-cell title="套餐类型" v-model="service_data.name" />
      <van-cell title="套餐价格" v-model="'￥' + service_data.price" />
    </van-cell-group>
    <van-cell-group class="price">
      <van-cell title="折扣" v-model="'￥' + priceData.discount" />
      <van-cell title="需支付" v-model="'￥' + priceData.payment" />
      <van-cell title="支付方式" value="微信支付" />
    </van-cell-group>
    <div class="direction">
      <div class>套餐说明：</div>
      <p class>
        1、由标准套餐升级到尊享套餐后，套餐内剩余的心电报告人工解读服务和在线图文咨询服务自动由专业医生升级为专家名医。
      </p>
      <p>2、剩余次数保持不变</p>
      <p>3、套餐有效期保持不变</p>
      <div class="serviceMobile">
        客服服务电话：
        <span>400-0785-120</span>
      </div>
    </div>
    <div class="bottom">
      <div class="totalPrice">
        总计：
        <span>￥{{ priceData.payment }}</span>
      </div>
      <div class="confirmPayment" @click="upgradePayment">确认支付</div>
    </div>
  </div>
</template>

<script>
import util from "@/lib/util";
import utils from "@/lib/utils";
import { toast_loding } from "@/lib/public";
import { formatSecond } from "@/lib/time"
export default {
  data() {
    return {
      data: {},
      hw_service_data: {},
      service_data: {
        name: "",
        price: ""
      },
      priceData: {},
      hw_user_message: {}
    };
  },
  created() {
  	let userData = localStorage.getItem('hw_user_message')
	  this.hw_user_message = JSON.parse(userData)
    this.obtionPrice();
  },
  methods: {
    async obtionPrice() {
      let Url = "";
      let params = {
        reqHead: {
          functionId: "HWW002007001"
        },
        body: {}
      };
      toast_loding(this);
      try {
        let res = await util.ajax.post(Url, params);
        if (res.data.respHead.respCode === "000") {
          if (!Array.isArray(res.data.body.data)) {
            return this.$toast("后台返回格式错误!");
          }
          res.data.body.data.forEach(item => {
            if (item.packetType === 1) {
              this.service_data["name"] = item.packetTypeName;
              this.service_data["price"] = item.price / 100;
            }else if (item.packetType === 2) {
            	this.priceData['discount'] = item.price / 100
            	this.priceData['payment'] = this.service_data.price - item.price / 100
            }
          });
        } else {
          this.$toast(`${res.data.respHead.respMsg}`);
        }
        this.$toast.clear();
      } catch (e) {
        this.$toast.clear();
//      if (e.message.includes("Network")) {
          this.$toast("网络连接错误，请检查网络连接，再重新尝试!");
//      } else {
//        this.$toast(`error： ${e.message}`);
//      }
      }
    },
    upgradePayment(){
      this.$toast.loading({
			mask: true,
			message: '加载中...'
	  });
	  let self = this;
      let dateTime = new Date();
      let requestDate = formatSecond(dateTime);
      if (this.checked == false) {
        return;
      } else {
        if (this.totalPrice == 0) {
          alert("请选择套餐");
        } else {
            let Url = "http://api-test.995120.cn/hww/hwpay/createOrder";
//        let Url = "http://api.995120.cn/hww/hwpay/createOrder";
          let params = {
            reqHead: {},
            body: {
              actionType: 1,
              category: "renew",
              payType: 1,
              requestDate: requestDate,
              requestStyle: "MWEB",
              type: 13,
              userNo: this.hw_user_message.managerNo
            }
          }
          utils.ajax.post(Url, params).then(function(res) {
            if (res.data.respHead.respCode == "000") {
            	window.location.href = res.data.body.data.mweb_url + '&redirect_url=http%3a%2f%2fapi-test.995120.cn%2fhwh%2fpayResult?type=5%26orderId=' + res.data.body.data.orderId;
            }else if(res.data.respHead.respCode == '100'){
            	self.$toast.clear()
            	self.$router.push({
            		name: 'order'
            	})
            }else{
            	self.$toast(`${res.data.respHead.respMsg}`);
            }
            
          });
        }
       }
    },
    
  }
};
</script>

<style>
.upgradePackage {
  height: 100%;
  background: #f2f2f2;
}
.upgradePackage .price {
  margin-top: 8px;
}
.upgradePackage .direction {
  font-size: 12px;
  margin-top: 8px;
  margin-left: 3%;
  margin-right: 3%;
  line-height: 20px;
}
.upgradePackage .serviceMobile {
  margin-top: 20px;
}
.upgradePackage .serviceMobile span {
  color: #fb6522;
}
.upgradePackage .bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 48px;
  line-height: 48px;
  text-align: center;
  font-size: 16px;
}
.upgradePackage .bottom div {
  display: inline-block;
  width: 50%;
}
.upgradePackage .totalPrice {
  background: #ffffff;
}
.upgradePackage .totalPrice span {
  color: #fb6522;
}
.upgradePackage .confirmPayment {
  background: #fb6522;
  color: #ffffff;
}
</style>
