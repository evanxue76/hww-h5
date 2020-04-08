<template>
  <div class="ecg_report">
    <!-- <div class="headerTotal">
      <van-nav-bar
        class="headerNav"
        title="心电报告"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      ></van-nav-bar>
    </div>-->

    <div class="ecgReport">
      <div class="history_content">
        <div class="scoreResult" v-if="data.healthLevel == -1">
          干扰数据，请重新测量
        </div>
        <div v-else class="scoreResult">
          {{ data.ecgElectrocardioDetail.ecgResultBrief }}
        </div>
        <div class="scoreResult">
          <van-icon class="iconLike" name="like" />
          <span>{{ data.heartRate }}bpm</span>
        </div>

        <div class="ecgPic" @click="viewDetails">
          <img :src="data.fileImagePath" />
        </div>
        <div class="recordTime">
          <div>{{ data.takeTime | formatDateFilter }}</div>
          <div>时长：{{ data.length }}s</div>
        </div>
      </div>
    </div>
    <!-- 心电测量结果 -->
    <div
      class="ecg_measurement_result"
      v-if="data.ecgElectrocardioDetail.ecgLevel != 0"
    >
      <div class="measurement_title">
        心电测量结果
        <van-icon
          class="picBot questionIcon"
          name="question-o"
          @click="is_measurement = !is_measurement"
        />
        <div
          class="measurement_contnet"
          v-if="is_measurement"
          @click="is_measurement = !is_measurement"
        >
          关于病情的描述系本软件结合医疗机器检查情况与大数据综合分析的结果，仅供您参考，可能由于网络或软件稳定性相关问题出现误差等情况，如您对相应检查结果及分析建议存在任何异议的，建议前往医院复诊确认。
        </div>
      </div>
      <standardBox :list="ecg_result_list" />
      <div class="hide-article-box hide-article-pos text-center" v-if="is_all">
        <div class="vive_jg" @click="view_all">查看其他正常指标</div>
      </div>
      <div
        class="vive_jg"
        style="padding:10px 0"
        v-if="!is_all"
        @click="collapse_view_all"
      >
        收起
      </div>
    </div>
    <div class="heartHealth">
      <!--<div class v-if="data.healthLevel == -1">-->
      <div>
        <div class="heartStatus ecg_content">
          <div>
            <span class="artTop">心电分析印象</span>
            <!--<van-icon class="picBot questionIcon" name="question-o" />-->
          </div>
          <!--<div>
					<van-icon class='picBot xinIcon' name="like" />
					<span class="artTop">64bmp</span>
          </div>-->
        </div>
        <div class="ecg_content ecg_result">
          {{ data.ecgElectrocardioDetail.ecgResultTZ }}
        </div>
      </div>
      
      
      <!--<div class v-else>
        <div class="heartStatus ecg_content">
          <div>
            <span class="artTop">心电分析印象</span>
          </div>
        </div>
        <div class="ecg_content ecg_result">
          {{ data.ecgElectrocardioDetail.ecgResultTz }}
        </div>

        <div class="ecg_content pathogeny">
          <div class="t-item_icon">
            <span class="iconWid">
              <van-icon class="pathogeny_icon" name="search" />
            </span>
            <span class="ecg_title">病因分析</span>
          </div>
          <div class="analysisResults">
            {{ data.ecgElectrocardioDetail.abnorAnalysis }}
          </div>
        </div>

        <div class="ecg_content pathogeny">
          <div class="t-item_icon">
            <span class="iconWid">
              <van-icon class="proposal_icon" name="orders-o" />
            </span>
            <span class="ecg_title">处置建议</span>
          </div>
          <div class="analysisResults">
            {{ data.ecgElectrocardioDetail.suggestions }}
          </div>
        </div>

        <div class="ecg_content pathogeny">
          <div class="t-item_icon">
            <span class="iconWid">
              <img class="healthcare" :src="care" />
            </span>
            <span class="ecg_title">保健建议</span>
          </div>
          <div class="analysisResults">
            {{ data.ecgElectrocardioDetail.core }}
          </div>
          
          <div class="analysisResults" @click="wchartPayment" v-else>
            <img :src="payPic" />
          </div>
          
        </div>
      </div>-->
      
      
    </div>
    <div class v-if="data.healthLevel != -1">
      <div
        class="standard_box"
        @click="go_to"
        v-if="data.ecgElectrocardioDetail.ecgLevel === 0"
      >
        查看详细心电测量指标
      </div>
    </div>
    <!-- <div class="heartRate" v-if="analysisShow && paymentShow">
      <div class="ecg_content ecgContentTitle">心率变异性分析</div>
      <div class="ecg_content time">
        心率变异性指数
        <span class="resultScore">
          {{ data.ecgElectrocardioDetail.hrvValue }}
        </span>
      </div>
      <div class="ecg_content scoreStrip">
        <img class="strip" src="../../assets/image/bar_gradient.png" />
        <img
          class="mark"
          :style="heartStyle"
          src="../../assets/image/icon_triangle.png"
        />
        <div class="scoreNum">
          <div>0</div>
          <div>150</div>
          <div>300</div>
          <div>450</div>
          <div>600</div>
        </div>
        <div class="rateVariation">{{ data.ecgElectrocardioDetail.hrv }}</div>
      </div>

      <div class="ecg_content time">
        心脏疾病风险评估
        <span class="resultScore">
          {{ data.ecgElectrocardioDetail.hdriskValue }}
        </span>
      </div>
      <div class="ecg_content scoreStrip">
        <img class="strip" src="../../assets/image/bar_gradient.png" />
        <img
          class="mark"
          :style="pressStyle"
          src="../../assets/image/icon_triangle.png"
        />
        <div class="scoreNum">
          <div>0</div>
          <div>25</div>
          <div>50</div>
          <div>75</div>
          <div>100</div>
        </div>
        <div class="rateVariation">
          {{ data.ecgElectrocardioDetail.hdrisk }}
        </div>
      </div>

      <div class="ecg_content time">
        疲劳指数
        <span class="resultScore">
          {{ data.ecgElectrocardioDetail.fatigueValue }}
        </span>
      </div>
      <div class="ecg_content scoreStrip">
        <img class="strip" src="../../assets/image/bar_gradient.png" />
        <img
          class="mark"
          :style="fatigueStyle"
          src="../../assets/image/icon_triangle.png"
        />
        <div class="scoreNum">
          <div>0</div>
          <div>25</div>
          <div>50</div>
          <div>75</div>
          <div>100</div>
        </div>
        <div class="rateVariation">
          {{ data.ecgElectrocardioDetail.fatigue }}
        </div>
      </div>
    </div>-->
    <div class="footer" v-if="data.healthLevel != -1">
    	<div class="to_homePage">
    		<span @click="to_homePage">返回首页</span>
    	</div>
      <div
        @click="askDoctor"
        class="footMode"
        v-if="data.ecgElectrocardioDetail.state == 0"
      >
        <span class="foot_pic">
          <img class="foot_icon" :src="doctoranaly" />
        </span>
        <span class="foot_art">问医生</span>&nbsp;&nbsp;
        <span class="additional">三甲医院医生专业解读</span>
      </div>
      <div
        @click="analysising"
        class="footMode unscramble"
        v-if="data.ecgElectrocardioDetail.state == 2"
      >
        <span class="foot_pic">
          <img class="foot_icon" :src="doctoranaly" />
        </span>
        <span class="foot_art">解读中...</span>
      </div>
      <div
        @click="searchResult"
        class="footMode"
        v-if="data.ecgElectrocardioDetail.state == 3"
      >
        <span class="foot_pic">
          <img class="foot_icon" :src="doctoranaly" />
        </span>
        <span class="foot_art">查看解读结果</span>
      </div>
    </div>

    <div class="wchartPay" v-if="wchartPayShow">
      <div class="paymentContent">
        <div class="serviceName">
          <div>服务名称</div>
          <div>心电图详细分析报告服务</div>
        </div>
        <div class="serviceDricetion">
          <div>服务介绍</div>
          <div>
            通过人工智能算法自动给出心电分析结果（包括：房颤、心律不齐、心衰等）、保健建议、病因分析、处置建议。
          </div>
        </div>
        <div class="servicePrice">
          <div>服务价格</div>
          <div>1元/次</div>
        </div>
        <div class="payMode">
          <div>支付方式</div>
          <div class="paymentType">
            <div
              class="payItem"
              v-for="(item, index) in modeList"
              :key="index"
              @click="choiceService(item)"
              :class="{ active: item.selected }"
            >
              <div :class="item.num ? 'admission' : 'wchart'">
                {{ item.type }}
              </div>
              <div class="surplus" v-if="item.num == 1">剩余{{ nums }}次</div>
            </div>
          </div>
        </div>
        <div class="serviceBtn">
          <div class="serviceCancle" @click="canclePay">取消</div>
          <div class="servicePay" @click="payMent">立即支付</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from "@/lib/util";
import utils from "@/lib/utils";
import globals from '../../lib/global'
import { formatDate, formatSecond } from "@/lib/time";
import standardBox from "./ECG_report/standard_box";
export default {
  data() {
    return {
      is_measurement: false,
      ecg_extList: [],
      view_ecg_msg: "查看其他正常指标",
      zc_list: [],
      all_list: [],
      ecg_result_list: [],
      is_ecg_result: false,
      ecg: require("../../assets/image/ecg.png"),
      payPic: require("../../assets/image/pic_report_blur.png"),
      doctoranaly: require("../../assets/image/icon_doctoranaly.png"),
      care: require("../../assets/image/icon_care.png"),
      score: 82,
      heartScore: 246,
      pressScore: 78,
      fatigueScore: 46,
      id: "",
      data: {
        ecgElectrocardioDetail: {}
      },
      analysisShow: false,
      paymentShow: false,
      wchartPayShow: false,
      modeList: [
        {
          type: "免费次数",
          num: true,
          selected: false,
          payType: 4
        },
        {
          type: "微信支付",
          num: false,
          selected: false,
          payType: 1
        }
      ],
      nums: 0,
      payType: "",
      anaecgFileId: "",
      hw_user_message: {},
      user_info: {},
      report_id: "",
      is_all: true,
      baseUrl: ''
    };
  },
  components: {
    standardBox
  },
  created() {
  	let host = globals.developmentUrl.host1
		let obj = {
			'http://192.168.9.136:2010/hww/': 'http://122.225.207.105:8080/pacs/h5chart/view?file_id=',
			'http://api-test.995120.cn/hww/': 'http://api-test.995120.cn/pacs/vertical/view/?file_id=',
			'http://api.995120.cn/hww/': 'http://api.995120.cn/pacs/vertical/view/?file_id='
		}
		this.baseUrl = obj[host]
  	
    if (this.$route.params.report_id) {
      this.report_id = this.$route.params.report_id;
    }
    this.user_info = JSON.parse(localStorage.getItem("hw_user_message"));
    this.id = localStorage.getItem("hw_reportId");
    this.obtionHeartReport();
    this.get_zhibiao();
  },
  methods: {
    view_all() {
      this.ecg_result_list = Object.assign([], this.all_list);
      this.is_all = false;
      this.view_ecg_msg = "收起";
    },
    collapse_view_all() {
      this.is_all = true;
      this.ecg_result_list = this.ecg_extList;
    },
    async get_zhibiao() {
      let Url = "";
      let params = {
        reqHead: {
          functionId: "HWW002001009"
        },
        body: {
          reportId: this.id, //this.id
          userNo: this.user_info.userNo
        }
      };
      try {
        let res = await util.ajax.post(Url, params);
        if (res.data.respHead.respCode === "000") {
          if (Array.isArray(res.data.body.data.extList)) {
            this.is_ecg_result = true;
            this.ecg_extList = res.data.body.data.extList;
            this.ecg_result_list = this.ecg_extList;
            res.data.body.data.normalList.forEach(i => {
              i["type"] = "zc";
            });
            this.all_list = this.all_list.concat(
              res.data.body.data.extList,
              res.data.body.data.normalList
            );
            return;
          }
          this.all_list = res.data.body.data.normalList;
        } else {
          this.$toast(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        //      if (e.message.includes("Network")) {
        this.$toast("网络连接错误，请检查网络连接，再重新尝试!");
        //      } else {
        //        this.$toast(`error： ${e.message}`);
        //      }
      }
    },
    go_to() {
      this.$router.push({ name: "Standard", params: { list: this.all_list } });
    },
    viewDetails() {
      document.title = "心电图";
//    window.location.href = `http://api-test.995120.cn/pacs/vertical/view/?file_id=${this.anaecgFileId}`;
        window.location.href = this.baseUrl + this.anaecgFileId;
//    window.location.href = `http://api.995120.cn/pacs/vertical/view/?file_id=${this.anaecgFileId}`;
    },
    obtionHeartReport() {
      let self = this;
      let Url = "";
      let params = {
        reqHead: {
          functionId: "HWW002001003"
        }, // 31519    31520
        body: {
          // 分析中： 28578        分析完成查看解读结果： 28539  28572      算法分析成功（问医生）： 27005
          reportId: this.id, //this.id // || 27053 //异常已支付：27054      异常未支付：26799      正常未支付： 26782      正常已支付：27053
          userNo: this.user_info.userNo
        }
      };
      this.$toast("加载中···");
      util.ajax
        .post(Url, params)
        .then(function(res) {
          console.log(res);
          if (res.data.respHead.respCode == "000") {
          	self.$toast.clear();
            self.data = res.data.body.data;
            self.anaecgFileId = res.data.body.data.anaecgFileId;
            if (self.data.healthLevel == 1 || self.data.healthLevel == 2) {
              self.analysisShow = false;
            } else {
              self.analysisShow = true;
            }
            if (self.data.ifPayment == 0) {
              self.paymentShow = false;
            } else {
              self.paymentShow = true;
            }
          } else {
            self.$toast(`${res.data.respHead.respMsg}`);
          }
        })
        .catch(function(err) {
          this.$toast("网络连接不稳定，请检查网络！");
        });
    },
    onClickLeft() {
      history.go(-1);
    },
    surplusTimes() {
      let self = this;
      let Url = "";
      let params = {
        reqHead: {
          functionId: "HWW002006001"
        },
        body: {
          titleId: null,
          serviceType: 6,
          userNo: this.user_info.managerNo
        }
      };
      util.ajax.post(Url, params).then(function(res) {
        self.nums = res.data.body.data[0].balanceNum;
      });
    },

    askDoctor() {
      let ecg_data = JSON.stringify(this.data);
      localStorage.setItem("ecg_data", ecg_data);

      sessionStorage.setItem("hw_fromPath", 1);
      this.$router.push({
        name: "InquiryDoctor"
      });
    },
    wchartPayment() {
      this.surplusTimes();
      this.wchartPayShow = true;
      if (this.paymentShow == true) {
        let self = this;
        let Url = "";
        let params = {
          reqHead: {
            functionId: ""
          },
          body: {}
        };
        util.ajax.post(Url, params).then(function(res) {});
      } else {
        this.wchartPayShow = true;
      }
    },
    choiceService(item) {
      this.payType = item.payType;
      let self = this;
      if (item.payType == 4 && this.nums == 0) {
        this.$toast("免费次数已用完");
        return;
      }
      this.modeList.forEach(function(item) {
        item.selected = false;
      });

      item.selected = true;
    },
    canclePay() {
      this.wchartPayShow = false;
      this.modeList.forEach(function(item) {
        item.selected = false;
      });
    },
    payMent() {
      this.$toast.loading({
        mask: true,
        message: "加载中..."
      });
      let self = this;
      let dateTime = new Date();
      let requestDate = formatSecond(dateTime);
      let Url = "http://api-test.995120.cn/hww/hwpay/createOrder";
      let params = {
        reqHead: {},
        body: {
          category: "auto",
          payType: this.payType,
          requestDate: requestDate,
          requestStyle: "MWEB",
          serviceTypeId: 6,
          type: 11,
          userNo: this.user_info.managerNo,
          reportId: this.id
        }
      };
      utils.ajax
        .post(Url, params)
        .then(function(res) {
          if (self.payType == 4 && res.data.respHead.respCode == "000") {
            self.obtionHeartReport();
            self.wchartPayShow = false;
          } else if (self.payType == 1 && res.data.respHead.respCode == "000") {
            self.wchartPayShow = false;
            window.location.href =
              res.data.body.data.mweb_url + "&redirect_url=http%3a%2f%2fapi-test.995120.cn%2fhwh%2fpayResult?type=1%26orderId=" + res.data.body.data.orderId;
          } else if (res.data.respHead.respCode == "100") {
            self.$toast.clear();
            self.$router.push({
              name: "order"
            });
          } else if (res.data.respHead.respCode == "001") {
            self.$toast(`${res.data.respHead.respMsg}`);
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    analysising() {
      console.log("数据解读中");
    },
    searchResult() {
      this.$router.push({
        name: "EcgUnscramble",
        params: {
          reportId: this.data.id,
          type: 2
        }
      });
    },
    to_homePage(){
    	this.$router.push({
    		name: 'HomePage'
    	})
    }
  },
  computed: {
    style() {
      return { left: `${this.score - 2.5}%` };
    },
    heartStyle() {
      let hrvValue = this.data.ecgElectrocardioDetail.hrvValue;
      return { left: `${hrvValue / 6 - 2.5}%` };
    },
    pressStyle() {
      let hdriskValue = this.data.ecgElectrocardioDetail.hdriskValue;
      return { left: `${hdriskValue - 2.5}%` };
    },
    fatigueStyle() {
      let fatigueValue = this.data.ecgElectrocardioDetail.fatigueValue;
      return { left: `${fatigueValue - 2.5}%` };
    }
  },
  filters: {
    formatDateFilter(val) {
      return formatDate(val);
    }
  }
};
</script>

<style lang="scss">
.ecg_report {
  height: 100%;
  background: #f2f2f2;
  padding-bottom: 60px;
  overflow: auto;
  /*.syntheticalScore{
			width: 100%;
			background: #F2F2F2;
			text-align: left;
			padding-top: 10px;
			.ecg_content{
				width: 92%;
				margin-left: 4%;
				.score{
					font-weight: bolder;
				}
			}
		}*/
  .measurement_title {
    position: relative;
    display: flex;
    align-items: center;
    z-index: 999;
    & > .van-icon {
      margin-left: 6px;
    }
    .measurement_contnet {
      position: absolute;
      top: 30px;
      left: 0px;
      background-color: rgba($color: #000, $alpha: 0.8);
      padding: 16px;
      color: #fff;
      font-size: 14px;
      line-height: 25px;
      z-index: 999;
    }
  }
  .t-item_icon {
    display: flex;
    align-items: center;
    & > span {
      display: flex;
      align-items: center;
    }
  }
  .ecg_measurement_result {
    color: #fb6522;
    font-size: 16px;
    color: #333;
    background-color: #fff;
    padding: 16px 16px 0 16px;
    margin-bottom: 8px;
    .vive_jg {
      font-size: 14px;
      text-align: center;
      color: #fb6522;
    }
  }
  .hide-article-box {
    position: relative;
    z-index: 99;
    padding-top: 170px;
    bottom: 2px;
    margin-top: -146px;
    background-image: linear-gradient(
      -180deg,
      rgba(255, 255, 255, 0) 0%,
      #fff 80%
    );
    padding-bottom: 20px;
    margin-bottom: 8px;
  }

  .standard_box {
    height: 48px;
    line-height: 48px;
    font-size: 14px;
    text-align: center;
    background-color: #fff;
    color: #fb6522;
  }
  .heartHealth {
    width: 100%;
    background: #ffffff;
    text-align: left;
    padding-top: 6px;
    /*margin-top: 12px;*/
    padding-bottom: 8px;
    /*margin-bottom: 8px;*/
    .heartStatus {
      height: 30px;
      line-height: 30px;
      display: flex;
      justify-content: space-between;
      .picBot {
        vertical-align: middle;
        margin: 0 8px;
        font-size: 16px;
      }
    }
    .artTop {
      vertical-align: middle;
      font-size: 15px;
    }
    .ecg_result {
      font-size: 14px;
      margin-top: 10px;
      margin-bottom: 10px;
      font-weight: bolder;
    }
    .ecg_title {
      font-size: 16px;
    }
    .pathogeny {
      .pathogeny_icon {
        color: #2cb675;
      }
      .proposal_icon {
        color: #eeb04e;
      }
      .healthcare_icon {
        color: #5fb0e9;
      }
    }
  }

  .heartRate {
    width: 100%;
    background: #ffffff;
    text-align: left;
    /*padding-top: 10px;*/
    /*margin-top: 8px;*/
    margin-bottom: 40px;
    .ecgContentTitle {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .time {
    margin-top: 10px;
    font-size: 13px;
    color: #404040;
  }
  .scoreStrip {
    padding-bottom: 16px;
    position: relative;
    .strip {
      width: 100%;
    }
    .mark {
      width: 5%;
      position: absolute;
      left: 2.5%;
      top: 28px;
    }
    .scoreNum {
      display: flex;
      justify-content: space-between;
      margin-top: 18px;
      color: #a9a9a9;
      font-size: 13px;
    }
  }
}

.ecg_report .ecgReport {
  margin: 6px 16px 12px 16px;
  box-sizing: border-box;
  background: #ffffff;
  font-size: 14px;
  text-align: left;
  color: #4c4c4c;
  border-radius: 6px;
}
.ecg_report .scoreResult {
  margin-left: 3%;
  padding-top: 6px;
}
.ecg_report .iconLike {
  font-size: 16px;
  vertical-align: middle;
  margin-right: 6px;
  color: #e95f5f;
}
.ecg_report .recordTime {
  display: flex;
  justify-content: space-between;
  height: 32px;
  line-height: 32px;
  margin-left: 3%;
  margin-right: 3%;
}
.ecg_report .ecgPic {
  /*padding-bottom: 4px;*/
  margin-top: 8px;
}
.ecg_report .ecgPic img {
  width: 94%;
  margin-left: 3%;
  height: 70px;
}

.ecg_report .ecg_content {
  width: 92%;
  margin-left: 4%;
}
.ecg_report .questionIcon {
  font-weight: bold;
  color: #cdcdcd;
}
.ecg_report .xinIcon {
  color: #e95f5f;
}
.ecg_report .iconWid {
  display: inline-block;
  width: 30px;
  .van-icon {
    font-size: 18px;
    font-weight: bold;
  }
}
.ecg_report .analysisResults {
  margin-top: 8px;
  font-size: 13px;
  line-height: 26px;
  text-indent: 30px;
}
.ecg_report .analysisResults img {
  width: 88%;
}
.ecg_report .rateVariation {
  font-size: 12px;
  margin-top: 10px;
  line-height: 18px;
}
.ecg_report .foot_icon {
  width: 24px;
}
.ecg_report .foot_pic {
	vertical-align: middle;
	/*height: 36px;
	line-height: 36px;*/
  /*display: flex;
  align-items: center;
  justify-content: center;*/
}
.ecg_report .foot_art {
  margin-left: 12px;
  font-size: 16px;
  vertical-align: middle;
}
.ecg_report .resultScore {
  font-size: 16px;
  font-weight: bold;
  margin-left: 4px;
}
.ecg_report .healthcare {
  width: 24px;
}
.ecg_report .wchartPay {
  font-size: 14px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 100;
}
.ecg_report .paymentContent {
  background: #ffffff;
  width: 94%;
  position: absolute;
  top: 4rem;
  left: 0;
  right: 0;
  margin: auto;
}
.ecg_report .serviceName {
  display: flex;
  justify-content: space-between;
  width: 94%;
  padding: 10px 3%;
  border-bottom: 1px solid #f7f7f7;
}
.ecg_report .serviceDricetion {
  width: 94%;
  padding: 10px 3%;
  border-bottom: 1px solid #f7f7f7;
}
.ecg_report .servicePrice {
  display: flex;
  justify-content: space-between;
  width: 94%;
  padding: 10px 3%;
  border-bottom: 1px solid #f7f7f7;
}
.ecg_report .payMode {
  width: 94%;
  padding: 10px 3%;
  border-bottom: 1px solid #f7f7f7;
}
.ecg_report .paymentType {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
.ecg_report .payItem {
  width: 4.2rem;
  height: 2rem;
  /*line-height: 2rem;*/
  border: 1px solid #eeeeee;
  border-radius: 5px;
  text-align: center;
}
.ecg_report .admission {
  margin-top: 0.4rem;
}
.ecg_report .surplus {
  color: #fb6522;
}
.ecg_report .wchart {
  margin-top: 0.7rem;
}
.ecg_report .serviceBtn div {
  display: inline-block;
  width: 50%;
  text-align: center;
  height: 40px;
  line-height: 40px;
}
.ecg_report .serviceCancle {
  color: #fb6522;
}
.ecg_report .servicePay {
  color: #ffffff;
  background: #fb6522;
}
.ecg_report .active {
  border: 1px solid #fb6522;
}
.ecg_report .additional {
  font-size: 12px;
}
.footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    /*margin-top: 6px;*/
    height: 60px;
    line-height: 60px;
    background: #ffffff;
    
    color: white;
    z-index: 999;
    .footMode {
    	display: inline-block;
    	width: 6.6rem;
    	height: 36px;
    	line-height: 36px;
      /*display: flex;*/
      background: #fb6522;
      margin-left: 0.21rem;
      border-radius: 5px;
      text-align: center;
      vertical-align: middle;
      /*align-items: center;*/
      /*justify-content: center;*/
    }
    .unscramble {
      background: #fb8c5b;
    }
  }
.ecg_report .to_homePage{
	box-sizing: border-box;
	font-size: 14px;
	display: inline-block;
	width: 2.35rem;
	margin-left: 0.42rem;
	color: #FB6522;
	border: 1px solid #FB6522;
	/*background: #FB6522;*/
	text-align: center;
	height: 36px;
	line-height: 36px;
	border-radius: 5px;
	vertical-align: middle;
}
</style>
