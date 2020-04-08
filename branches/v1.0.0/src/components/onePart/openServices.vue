<template>
  <div class="openServices">
    <!-- <div class="headerTotal">
	      <van-nav-bar class="headerNav" title="服务开通" left-text="" @click-left="onClickLeft">
	      	<van-icon name="cross" slot="left" />
		  </van-nav-bar>
    </div>-->
    <div class="openSection">
      <div class="servicesName">
        <div>服务名称</div>
        <div>{{ name }}</div>
      </div>
      <div class="servicesDuration">
        <div class="durationTitle">服务套餐</div>
        <div class="choiceDuration">
          <div
            class="singDuration"
            v-for="(item, index) in setmealList"
            :key="index"
            @click="choiceDuration(item)"
            :class="{ active: item.selected }"
          >
            <div class="servicesTime">{{ item.packetTypeName }}</div>
            <div class="newesPrice">￥{{ item.price | priceFilter }}</div>
          </div>
        </div>
      </div>
      <div class="servicesName">
        <div>支付方式</div>
        <div>微信支付</div>
      </div>
      <div class="agreement">
        <input type="checkbox" v-model="checked" id="checkbg" />
        已阅读并同意
        <span class="served" @click="searchService">《服务须知》</span>
      </div>
      <div class="payment">
        <div class="totalPrice">
          总计：
          <span>￥{{ totalPrice | priceFilter }}</span>
        </div>
        <div :class="checked ? 'confirm' : 'disconfirm'" @click="confirm">
          确认支付
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from "@/lib/util";
import utils from "@/lib/utils";
import { toast_loding } from "@/lib/public";
import { formatSecond } from '@/lib/time'
export default {
  data() {
    return {
      name: "心电监测服务",
      setmealList: [],
      checked: false,
      totalPrice: "",
      id: "",
      packetType: "",
      hw_service_data: {},
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
          this.setmealList = res.data.body.data;
          this.setmealList.map(item => {
            this.$set(item, "selected", false);
          });
        } else {
          this.$toast(`${res.data.respHead.respMsg}`);
        }
        this.$toast.clear();
      } catch (e) {
        console.log(e);
        this.$toast.clear();
        if (e.message.includes("Network")) {
          this.$toast("网络连接错误，请检查网络连接，再重新尝试!");
        } else {
          this.$toast(`error： ${e.message}`);
        }
      }
    },
    choiceDuration(item) {
      this.setmealList.forEach(function(item) {
        item.selected = false;
      });
      item.selected = true;
      this.totalPrice = item.price;
      this.id = item.id;
      this.packetType = item.packetType;
    },
    searchService(){
    	this.$router.push({
        name: "ServiceMatter"
      });
    },
    confirm() {
      let self = this;
      let dateTime = new Date();
      let requestDate = formatSecond(dateTime)
      if (this.checked == false) {
        return;
      } else {
        if (this.totalPrice == 0) {
          this.$toast('请选择服务套餐')
        } else {
        	this.$toast.loading({
				    mask: true,
				  	message: '加载中...'
				  });
            let Url = "http://api-test.995120.cn/hww/hwpay/createOrder";
//        let Url = "http://api.995120.cn/hww/hwpay/createOrder";
          let params = {
            reqHead: {},
            body: {
              category: "sign",
              packetType: this.packetType,
              payType: 1,
              requestDate: requestDate,
              requestStyle: "MWEB",
              type: 3,
              userNo: this.hw_user_message.managerNo
            }
          };
          utils.ajax.post(Url, params).then(function(res) {
            if (res.data.respHead.respCode == "000") {
            	window.location.href = res.data.body.data.mweb_url + '&redirect_url=http%3a%2f%2fapi-test.995120.cn%2fhwh%2fpayResult?type=3%26orderId=' + res.data.body.data.orderId;
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
    }
  },
  filters: {
    priceFilter(val) {
      return val / 100;
    }
  }
};
</script>

<style>
.openServices {
  height: 100%;
  background: #eeeeee;
}
.openSection .bg {
  width: 100%;
  height: 10px;
  background: #eeeeee;
}
.openServices .servicesName {
  display: flex;
  justify-content: space-between;
  width: 94%;
  padding: 12px 3%;
  font-size: 14px;
  background: #ffffff;
}
.openServices .servicesDuration {
  text-align: left;
  width: 100%;
  background: #eeeeee;
  font-size: 14px;
  margin-top: 12px;
  padding-bottom: 20px;
}
.openServices .durationTitle {
  margin-left: 3%;
  padding: 8px 0;
  font-size: 12px;
  color: #666666;
}
.openServices .choiceDuration {
  width: 94%;
  margin-left: 3%;
  display: flex;
  justify-content: space-between;
}
.openServices .singDuration {
  /*width: 4.4rem;
  height: 2.8rem;*/
  width: 45%;
  height: 80px;
  font-size: 16px;
  background: #ffffff;
  /*border-radius: 0.15rem;*/
  border-radius: 6px;
  border: 1px solid #e6e6e6;
  text-align: center;
}
.openServices .servicesTime {
  /*margin-top: 0.25rem;*/
  /*margin-top: 0.65rem;*/
  margin-top: 17px;
}
.openServices .servicesPrice {
  /*margin-top: 0.3rem;*/
  margin-top: 10px;
  color: #fb8855;
}
.openServices .newesPrice {
  /*margin-top: 0.3rem;*/
  margin-top: 10px;
  color: #fb8855;
}
.openServices .oldPrice {
  /*margin-top: 0.22rem;*/
  margin-top: 10px;
  text-decoration: line-through;
  color: #999999;
}
.openServices .active {
  border: 2px solid #fb8855;
}
.openServices .agreement {
  text-align: left;
  font-size: 12px;
  background: #eeeeee;
  margin-top: 10px;
  padding: 8px 3%;
  display: flex;
}
.openServices .agreement input {
  background: white;
  z-index: 100;
  margin-right: 5px;
}
.openServices .agreement .checked {
}
.openServices .van-checkbox__icon {
  background: white;
}
.openServices .payment {
  width: 100%;
  position: fixed;
  bottom: 0;
  font-size: 14px;
  height: 48px;
  line-height: 48px;
}
.openServices .payment div {
  display: inline-block;
  width: 50%;
}
.openServices .totalPrice {
  background: #ffffff;
  text-align: center;
}
.openServices .totalPrice span {
  color: #fb8855;
}
.openServices .confirm {
  background: #fb8855;
  color: #ffffff;
  text-align: center;
}
.openServices .disconfirm {
  background: #f5ac8b;
  color: #ffffff;
  text-align: center;
}
.openServices .served {
  color: #fb8855;
}
</style>
