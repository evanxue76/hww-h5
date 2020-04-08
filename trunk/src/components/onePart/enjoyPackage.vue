<template>
  <div class="enjoyPackage">
    <van-cell-group>
      <van-cell title="服务名称" value="心电监测服务" />
      <van-cell
        title="套餐类型"
        :value="service_data.name"
        is-link
        @click="choicePackage"
      />
      <van-cell title="套餐价格" v-model="'￥' + service_data.price" />
    </van-cell-group>
    <van-cell-group class="price">
      <van-cell title="折扣" value="0" />
      <van-cell title="需支付" v-model="'￥' + service_data.price" />
      <van-cell title="支付方式" value="微信支付" />
    </van-cell-group>
    <div class="direction">
      <div class>续费说明：</div>
      <div class>
        当前套餐有效期至{{
          hw_service_data.expire | getDatesFilter
        }}，续费后有效期延长一年。
      </div>
      <div class="serviceMobile">
        客服服务电话：
        <span>400-0785-120</span>
      </div>
    </div>
    <div class="bottom">
      <div class="totalPrice">
        总计：
        <span>￥{{ service_data.price }}</span>
      </div>
      <div class="confirmPayment" @click="downgrade">确认支付</div>
    </div>
  </div>
</template>

<script>
import util from "@/lib/util";
import utils from "@/lib/utils";
import { getDates, formatSecond } from "@/lib/time";
export default {
  data() {
    return {
      data: {},
      hw_service_data: {},
      service_data: {
        name: "",
        price: ""
      },
      packageType: "",
      types: "",
      hw_user_message: {}
    };
  },
  created() {
    let userData = localStorage.getItem("hw_user_message");
    this.hw_user_message = JSON.parse(userData);
    this.get_router();
  },
  methods: {
    get_router() {
      this.packageType = this.$route.params.packageType;
      if (!this.$route.params.hw_service_data) {
        this.hw_service_data = JSON.parse(
          localStorage.getItem("hw_service_datas")
        );
        this.obtionPrice();
        return;
      }
      this.hw_service_data = this.$route.params.hw_service_data;
      localStorage.setItem(
        "hw_service_datas",
        JSON.stringify(this.$route.params.hw_service_data)
      );
      this.obtionPrice();
    },
    async obtionPrice() {
      let type = 1;
      if (this.packageType != undefined) {
        this.packageType ? (type = 1) : (type = 2);
      }
      this.types = type;
      let Url = "";
      let params = {
        reqHead: {
          functionId: "HWW002007001"
        },
        body: {}
      };
      try {
        let res = await util.ajax.post(Url, params);
        if (res.data.respHead.respCode === "000") {
          if (!Array.isArray(res.data.body.data)) {
            return this.$toast("后台返回格式错误!");
          }
          res.data.body.data.forEach(item => {
            if (item.packetType == type) {
              this.service_data["name"] = item.packetTypeName;
              this.service_data["price"] = item.price / 100;
            }
          });
        } else {
          this.$toast(`${res.data.respHead.respMsg}`);
        }
        //      this.$toast.clear();
      } catch (e) {
        this.$toast("网络连接不稳定，请检查网络！");
      }
    },
    downgrade() {
      this.$toast.loading({
        mask: true,
        message: "加载中..."
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
          let params = {};
          if (this.types == 1) {
            params = {
              reqHead: {},
              body: {
                actionType: 2,
                category: "renew",
                payType: 1,
                requestDate: requestDate,
                requestStyle: "MWEB",
                type: 12,
                userNo: this.hw_user_message.managerNo // 50
              }
            };
          } else {
            params = {
              reqHead: {},
              body: {
                actionType: 3,
                category: "renew",
                payType: 1,
                requestDate: requestDate,
                requestStyle: "MWEB",
                type: 14,
                userNo: this.hw_user_message.managerNo //50
              }
            };
          }
          utils.ajax.post(Url, params).then(function(res) {
            if (res.data.respHead.respCode == "000") {
              if (self.types == 1) {
                window.location.href =
                  res.data.body.data.mweb_url +
                  "&redirect_url=http%3a%2f%2fapi-test.995120.cn%2fhwh%2fpayResult?type=4%26orderId=" +
                  res.data.body.data.orderId;
              } else {
                window.location.href =
                  res.data.body.data.mweb_url +
                  "&redirect_url=http%3a%2f%2fapi-test.995120.cn%2fhwh%2fpayResult?type=6%26orderId=" +
                  res.data.body.data.orderId;
              }
            } else if (res.data.respHead.respCode == "100") {
              self.$toast.clear();
              self.$router.push({
                name: "order"
              });
            } else {
              self.$toast(`${res.data.respHead.respMsg}`);
            }
          });
        }
      }
    },
    //
    choicePackage() {
      this.$router.push({
        name: "ServiceIntroduce"
      });
    }
  },
  filters: {
    getDatesFilter(val) {
      if (new Date().valueOf() > val) {
        return "当前套餐已到期";
      }
      return `当前套餐将在${getDates(val)}到期`;
    }
  }
};
</script>

<style>
.enjoyPackage {
  height: 100%;
  background: #f2f2f2;
}
.enjoyPackage .price {
  margin-top: 8px;
}
.enjoyPackage .direction {
  font-size: 14px;
  margin-top: 8px;
  margin-left: 3%;
  line-height: 24px;
}
.enjoyPackage .serviceMobile {
  margin-top: 20px;
}
.enjoyPackage .serviceMobile span {
  color: #fb6522;
}
.enjoyPackage .bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 48px;
  line-height: 48px;
  text-align: center;
  font-size: 16px;
}
.enjoyPackage .bottom div {
  display: inline-block;
  width: 50%;
}
.enjoyPackage .totalPrice {
  background: #ffffff;
}
.enjoyPackage .totalPrice span {
  color: #fb6522;
}
.enjoyPackage .confirmPayment {
  background: #fb6522;
  color: #ffffff;
}
</style>
