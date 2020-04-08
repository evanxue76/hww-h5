<template>
  <div class="applyUnscramble">
    <div class="ecgReport">
      <div class="history_content">
        <div class="recordTime">
          <div>{{ ecg_data.ecgElectrocardioDetail.heartStatus }}</div>
          <div></div>
        </div>
        <div class="scoreResult">
          <van-icon class="iconLike" name="like" />
          <span>{{ ecg_data.heartRate }}bpm</span>
        </div>
        <div class="ecgPic">
          <img :src="ecg_data.fileImagePath" v-if="ecg_data.fileImagePath" />
        </div>
        <div class="recordTime">
          <div>{{ ecg_data.takeTime | format_date }}</div>
          <div>时长：{{ ecg_data.length }}s</div>
        </div>
      </div>
    </div>

    <div class="applyServe">
      <van-cell-group>
        <van-cell title="服务类型" :value="hw_service_type" />
      </van-cell-group>
      <!--<div class="fuwu_title">服务类型</div>
      <div class="fuwu_box">
        <div class="item" v-for="(item, index) in fuwu_data.serviceList" :key="index" @click="toggle_fuwu_active(item)" :class="{ fuwu_active: item.is_active }" >
        
          <div class="fuwu_info" v-if="item.status === 1">
            <div class="fuwu_pic">
              <img :src="xiesi_img[item.serviceType]" alt />
            </div>
            <div class="serviceName">{{ item.serviceName }}</div>
            <div class="fuwu_price">
              ￥{{
                fuwu_data.isMember === 1 ? item.vipPrice/100.00 : item.commonPrice/100.00
              }}/次
            </div>
          </div>
          <div class="fuwu_brief">{{ xiesi[item.serviceType] }}</div>
        </div>
      </div>-->
    </div>

    <div class="applyPayment">
      <van-cell-group>
        <!--<van-cell title="折扣" v-model="'￥' + fuwu_data.discount/100.00" />
        <van-cell title="需支付" v-model="fuwu_data_price" />
        <van-cell title="支付方式" :value="data.payMode" />-->
        <van-cell title="折扣" value="0" />
        <van-cell title="需支付" v-model="hw_picArt_price" />
        <van-cell title="支付方式" value="微信支付" />
      </van-cell-group>
    </div>
    <div class="footer">
      <div class="totalPrice">
        总计：
        <span class="price">{{ hw_picArt_price }}</span>
      </div>
      <div class="submit" @click="onsubmit">确认支付</div>
    </div>
  </div>
</template>

<script>
import util from "@/lib/util";
import utils from "@/lib/utils";
import { formatDate } from "@/lib/time";
export default {
  data() {
    return {
      fuwu_item: {}, //选中服务
      ecg_data: {},
      xiesi: { 3: "专业心电医生人工解读", 1: "24小时内不限次数咨询" },
      xiesi_img: {
        3: require("../../assets/image/icon_ecg.png"),
        1: require("../../assets/image/icon_pic.png")
      },
      fuwu_data: {}, //获取单次服务价格
      ecg: require("../../assets/image/ecg.png"),
      id: "",
      data: {
        serveMechanism: "国家远程医疗与互联网医学中心",
        serveType: 1,
        servePrice: "5.00",
        discount: 0,
        needPay: "100.00",
        payMode: "微信支付"
      },
      hw_user_message: {},
      hw_picArt_price: "",
      hw_service_type: ""
    };
  },
  created() {
    let userData = localStorage.getItem("hw_user_message");
    this.hw_user_message = JSON.parse(userData);
    this.hw_picArt_price = localStorage.getItem("hw_picArt_price");
    this.hw_service_type = localStorage.getItem("hw_service_type");
    //	  this.ecg_data = JSON.parse(localStorage.getItem('ecg_data'))
    //  this.get_goods_list();
    this.get_router();
  },
  methods: {
    //  toggle_fuwu_active(item) {
    //    if (this.fuwu_item.id != item.id) {
    //      this.get_goods_list(item.serviceType);
    //      return;
    //    }
    //    this.fuwu_data.serviceList.forEach(item => {
    //      item.is_active = false;
    //    });
    //    this.fuwu_item = item;
    //    item.is_active = true;
    //    this.fuwu_data.serviceList = Object.assign(
    //      [],
    //      this.fuwu_data.serviceList
    //    );
    //  },
    get_router() {
      if (!this.$route.params.ecg_data) {
        this.ecg_data = JSON.parse(localStorage.getItem("ecg_data"));
        return;
      }
      this.ecg_data = this.$route.params.ecg_data;
      localStorage.setItem(
        "ecg_data",
        JSON.stringify(this.$route.params.ecg_data)
      );
    },
    //  async get_goods_list(serviceType) {
    //    let Type = serviceType || 3;
    //    let Url = "";
    //    let params = {
    //      reqHead: {
    //        functionId: "HWW002009002"
    //      },
    //      body: {
    //        managerNo: this.hw_user_message.managerNo,            //  143
    //        serviceType: Type
    //      }
    //    };
    //    try {
    //      let res = await util.ajax.post(Url, params);
    //      if (res.data.respHead.respCode === "000") {
    //        res.data.body.data.serviceList.forEach(i => {
    //          if (i.serviceType === Type) {
    //            i["is_active"] = true;
    //            this.fuwu_item = i;
    //          }
    //        });
    //        this.fuwu_data = res.data.body.data;
    //      } else {
    //        this.$toast(`${res.data.respHead.respMsg}`);
    //      }
    //      this.$toast.clear();
    //    } catch (e) {
    //      this.$toast.clear();
    //      this.$toast("网络连接错误，请检查网络连接，再重新尝试!");
    //    }
    //  },
    onClickLeft() {
      console.log("返回");
      history.go(-1);
    },
    onConfirm(value, index) {
      let type;
      if (index == 0) {
        type = 1;
      } else if (index == 1) {
        type = 3;
      } else if (index == 2) {
        type = 5;
      }
      this.data.serveType = type;
    },
    async onsubmit() {
      let self = this;
      let docId = localStorage.getItem("hw_docId");
      let titleId = localStorage.getItem("hw_titleId");
      this.$toast.loading({
        mask: true,
        message: "加载中..."
      });
      let serviceTypeId = "";
      if (this.hw_service_type == "图文咨询") {
        serviceTypeId = 1;
      } else {
        serviceTypeId = 3;
      }
      let infoId = localStorage.getItem("infoId");
      let obj = {
        1: 4,
        3: 6
      };
//      let Url = "http://api-test.995120.cn/hww/hwpay/createOrder";
      let Url = "http://api.995120.cn/hww/hwpay/createOrder";
      let params = {
        reqHead: {},
        body: {
          //balanceId: this.fuwu_data.balanceId,
          docId: docId,
          titleId: titleId,
          category: "service",
          infoId: infoId, // 12
          payType: 1,
          reportId: this.ecg_data.ecgElectrocardioDetail.reportId,
          requestDate: this.dateFtt("yyyyMMddhhmmss", new Date()),
          requestStyle: "MWEB",
          serviceTypeId: serviceTypeId,
          type: obj[serviceTypeId],
          userNo: this.hw_user_message.managerNo //  143
        }
      };
      try {
        let res = await utils.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
//            		window.location.href = res.data.body.data.mweb_url + '&redirect_url=http%3a%2f%2fapi-test.995120.cn%2fhwh%2fpayResult?docId=' + res.data.body.data.docId + '%26orderId=' + res.data.body.data.orderId + '%26serviceTypeId=' + res.data.body.data.serviceTypeId
            		window.location.href = res.data.body.data.mweb_url + '&redirect_url=http%3a%2f%2fapi.995120.cn%2fstatic%2fhm505%2fhwh%2fpayResult?docId=' + res.data.body.data.docId + '%26orderId=' + res.data.body.data.orderId + '%26serviceTypeId=' + res.data.body.data.serviceTypeId
        } else if(res.data.respHead.respCode == '100'){
            	self.$toast.clear()
            	self.$router.push({
            		name: 'order'
            	})
        }else {
          this.$toast(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        console.log(e);
        //      if (e.message.includes("Network")) {
        this.$toast("网络连接错误，请检查网络连接，再重新尝试!");
        //      } else {
        //        this.$toast(`error： ${e.message}`);
        //      }
      }
    },
    dateFtt(fmt, date) {
      //author: meizz
      var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    }
  },
  filters: {
    format_date(val) {
      return formatDate(val);
    }
  },
  computed: {
    chioceType: function() {
      if (this.data.serveType == 1) {
        return "图文咨询";
      } else if (this.data.serveType == 3) {
        return "心电分析";
      } else {
        return "心电图解读";
      }
    },
    fuwu_data_price() {
      let num = (this.fuwu_data.price - this.fuwu_data.discount) / 100.0;
      return `￥${num}`;
    }
  }
};
</script>

<style lang="scss">
.applyUnscramble {
  width: 100%;
  height: 100%;
  background: #eee;
  padding-bottom: 45px;
  overflow: auto;
  .ecgReport {
    margin: 6px 16px 12px 16px;
    background: #f48f44;
    box-sizing: border-box;
    background: #ffffff;
    font-size: 14px;
    text-align: left;
    color: #4c4c4c;
    border-radius: 6px;
  }
  .scoreResult {
    display: flex;
    align-items: center;
  }
  .iconLike {
    font-size: 16px;
    vertical-align: middle;
    margin-right: 6px;
    color: #e95f5f;
  }
  .recordTime {
    display: flex;
    justify-content: space-between;
  }
  .ecgPic {
    box-sizing: border-box;
    width: 100%;
  }
  .ecgPic img {
    height: 70px;
    width: 100%;
    max-width: 100%;
    max-height: 100%;
  }
  .applyServe {
    text-align: left;
    margin-top: 12px;
  }
  .serveList {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }
  .applyPayment {
    text-align: left;
    margin-top: 10px;
    padding-bottom: 45px;
  }
  .van-cell__value {
    flex-grow: 2.5;
  }
  .footer {
    /*display: flex;*/
    /*justify-content: space-between;*/
    position: fixed;
    width: 100%;
    bottom: 0;
    font-size: 14px;
    text-align: center;
  }
  .footer div {
    display: inline-block;
    width: 50%;
    height: 48px;
    line-height: 48px;
  }
  .totalPrice {
    background: #ffffff;
  }
  .totalPrice .price {
    color: #fb6522;
  }
  .submit {
    background: #fb6522;
    color: #ffffff;
  }
  .history_content {
    padding: 10px;
    & > div {
      margin-bottom: 10px;
    }
  }
  .fuwu_box {
    width: 94%;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    margin-left: 3%;
    .item {
      flex: 0 0 45%;
      box-sizing: border-box;
      text-align: center;
      font-size: 16px;
      margin-bottom: 20px;
      .fuwu_pic {
        text-align: center;
        margin: 0 auto;
        width: 32px;
        height: 32px;
        margin-bottom: 6px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .fuwu_info {
        height: 80px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #fff;
        padding-top: 10px;
        padding-bottom: 13px;
        margin-bottom: 8px;
      }
      .serviceName {
        color: #333;
        margin-bottom: 11px;
      }
      .fuwu_price {
        color: #fb6522;
      }
      .fuwu_brief {
        color: #888;
        font-size: 12px;
      }
    }
    .fuwu_active {
      .fuwu_info {
        border: 3px solid #fb6522;
      }
    }
  }
  .fuwu_title {
    padding: 10px 15px;
    color: #888;
    font-size: 14px;
  }
}

.applyUnscramble .showBtn {
  width: 100px;
  height: 40px;
  line-height: 40px;
  margin-bottom: 60px;
  background: #fb6422;
  color: #ffffff;
  font-size: 14px;
}
</style>
