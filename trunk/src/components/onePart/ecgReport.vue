<template>
  <div class="ecg_report">
    <div class="ecgReport">
      <div class="history_content">
        <div class="scoreResult" v-if="data.healthLevel == -1">干扰数据，请重新测量</div>
        <!-- <div v-else class="scoreResult">
					{{ data.ecgElectrocardioDetail.ecgResultBrief }}
        </div>-->
        <div class="scoreResult">
          <div class="scoreResultV1">
            <van-icon class="iconLike" name="like" />
            <span>{{ data.heartRate }}bpm</span>
          </div>
          <div class="scoreResultV2">
            <van-icon name="arrow" />
          </div>
        </div>

        <div class="ecgPic" @click="viewDetails">
          <img :src="data.ecgImageIndexPath" />
        </div>
        <div class="recordTime">
          <div>{{ data.takeTime | formatDateFilter }}</div>
          <div>时长：{{ data.length }}s</div>
        </div>
      </div>
    </div>
    <!-- 心率分析 -->
    <div class="heartRateAnalysis">
      <div class="hRAtitle">心率分析</div>

      <div class="hRAconent" v-if="data.state!=1">
        <div class="hRAitem">
          <div>
            <span>{{data.avg}}</span> bpm
          </div>
          <div>平均心率</div>
        </div>
        <div class="hRAitem">
          <div>
            <span>{{data.max}}</span> bpm
          </div>
          <div>最高心率</div>
        </div>
        <div class="hRAitem">
          <div>
            <span>{{data.min}}</span> bpm
          </div>
          <div>最低心率</div>
        </div>
        <div class="hRAitem">
          <div>
            <span>{{data.normalRate}}</span> %
          </div>
          <div>正常心率</div>
          <div class="hRAspecial">(60-100bpm)</div>
        </div>
        <div class="hRAitem">
          <div>
            <span>{{data.avg}}</span> %
          </div>
          <div>心率偏快</div>
          <div class="hRAspecial">(>100bpm)</div>
        </div>
        <div class="hRAitem">
          <div>
            <span>{{data.slowRate}}</span> %
          </div>
          <div>心率偏慢</div>
          <div class="hRAspecial">(&lt;60bpm)</div>
        </div>
      </div>
      <div class="hRAconent hRAconentErr" v-else>导联脱落或数据干扰严重，无法进行心率分析</div>
    </div>
    <!-- 心电测量结果 -->
    <div class="ecg_measurement_result" v-if="data.ecgLevel != 0">
      <div class="measurement_title">
        心电测量结果
        <van-icon
          class="picBot questionIcon"
          name="info-o"
          @click="is_measurement = !is_measurement"
        />

        <div
          class="measurement_contnet"
          v-if="is_measurement"
          @click="is_measurement = !is_measurement"
        >关于病情的描述系本软件结合医疗机器检查情况与大数据综合分析的结果，仅供您参考，可能由于网络或软件稳定性相关问题出现误差等情况，如您对相应检查结果及分析建议存在任何异议的，建议前往医院复诊确认。</div>
      </div>
      <div class="zhibiao" v-if="data.state!=1">
        <standardBox :list="ecg_result_list" />
        <div class="hide-article-box hide-article-pos text-center" v-if="is_all">
          <div class="vive_jg" @click="view_all">查看更多</div>
        </div>
        <div class="vive_jg" style="padding:10px 0" v-if="!is_all" @click="collapse_view_all">收起</div>
      </div>
      <div class="hRAconentErr" v-else>导联脱落或数据干扰严重，无法进行心率分析</div>
    </div>
    <!-- 
							<div class v-if="data.healthLevel != -1">
								<div class="standard_box" @click="go_to" v-if="data.ecgLevel === 0">
									查看详细心电测量指标
								</div>
							</div>
    -->
    <div class="footer">
      <!-- <div class="to_homePage">
									<span @click="to_homePage">返回首页</span>
      </div>-->
      <div class="Fitem">
        <div class="to_homePage zhuanjia" v-if="data.state == 0">
          <span @click="askDoctor">专家解读</span>
        </div>
        <div class="to_homePage jieduzhong" v-if="data.state == 2">
          <span>解读中...</span>
        </div>
        <div class="to_homePage zhuanjia" v-if="data.state == 3">
          <span @click="searchResult">查看解读结果</span>
        </div>
      </div>
      <div class="Fitem">
        <div class="to_homePage" @click="is.del=true">
          <span>删除记录</span>
        </div>
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
          <div>通过人工智能算法自动给出心电分析结果（包括：房颤、心律不齐、心衰等）、保健建议、病因分析、处置建议。</div>
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
              <div :class="item.num ? 'admission' : 'wchart'">{{ item.type }}</div>
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
    <!-- 确认提示 -->
    <div class="device_teaching bind_mobile" v-if="is.del">
      <div class="binding_box">
        <div class="content">确定要删除该记录吗</div>
        <div class="bind_btn">
          <span class="cancle_btn" @click="is.del=false">取消</span>
          <span @click="del_ecg">确定</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from "@/lib/util";
import utils from "@/lib/utils";
import globals from "../../lib/global";
import { formatDate, formatSecond } from "@/lib/time";
import standardBox from "./ECG_report/standard_box";
export default {
  data() {
    return {
      is: {
        del: false
      },
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
      baseUrl: ""
    };
  },
  components: {
    standardBox
  },
  created() {
    let host = globals.developmentUrl.host1;
    let obj = {
      "http://192.168.9.136:2010/hww/":
        "http://122.225.207.105:8080/pacs/h5chart/view?file_id=",
      "http://api-test.995120.cn/hww/":
        "http://api-test.995120.cn/pacs/vertical/view/?file_id=",
      "http://api.995120.cn/hww/":
        "http://api.995120.cn/pacs/vertical/view/?file_id="
    };
    this.baseUrl = obj[host];
    this.user_info = JSON.parse(localStorage.getItem("hw_user_message"));
    this.id = localStorage.getItem("hw_reportId");
    
    if (this.$route.params.isRead === 0) {
      this.upisRead();
    }
    if (!this.$route.params.report_id) {
      this.data = JSON.parse(localStorage.getItem("ecgReportData"));
      return;
    }
    this.report_id = this.$route.params.report_id;
    this.obtionHeartReport();
    this.get_zhibiao();
  },
  methods: {
    // 已读
    async upisRead() {
      let Url = "",
        params = {
          reqHead: {
            functionId: "HWW002001014"
          },
          body: {
            reportId: this.id
          }
        };

      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
      } catch (e) {
        console.log(e);
      }
    },
    areYouSure() {},
    // del_ecg 删除测量记录
    async del_ecg() {
      let Url = "",
        params = {
          reqHead: {
            functionId: "HWW002001013"
          },
          body: {
            reportId: this.id,
            userNo: this.user_info.userNo
          }
        };
      this.$toast.loading({
        mask: true,
        message: "请等待...",
        duration: 0
      });
      this.is.del = false;
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        this.$toast.clear();
        if (res.data.respHead.respCode === "000") {
          this.$toast(`删除成功`);
          this.to_homePage();
        } else {
          this.$toast(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        console.log(e);
        this.$toast.clear();
        this.$toast("网络连接错误，请检查网络连接，再重新尝试!");
      }
    },
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
        this.$toast("网络连接错误，请检查网络连接，再重新尝试!");
      }
    },
    go_to() {
      this.$router.push({
        name: "Standard",
        params: {
          list: this.all_list
        }
      });
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
            localStorage.setItem(
              "ecgReportData",
              JSON.stringify(res.data.body.data)
            );
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
              res.data.body.data.mweb_url +
              "&redirect_url=http%3a%2f%2fapi-test.995120.cn%2fhwh%2fpayResult?type=1%26orderId=" +
              res.data.body.data.orderId;
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
          reportId: this.report_id,
          type: 2
        }
      });
    },
    to_homePage() {
      this.$router.push({
        name: "HomePage"
      });
    }
  },
  computed: {
    style() {
      return {
        left: `${this.score - 2.5}%`
      };
    },
    heartStyle() {
      let hrvValue = this.data.ecgElectrocardioDetail.hrvValue;
      return {
        left: `${hrvValue / 6 - 2.5}%`
      };
    },
    pressStyle() {
      let hdriskValue = this.data.ecgElectrocardioDetail.hdriskValue;
      return {
        left: `${hdriskValue - 2.5}%`
      };
    },
    fatigueStyle() {
      let fatigueValue = this.data.ecgElectrocardioDetail.fatigueValue;
      return {
        left: `${fatigueValue - 2.5}%`
      };
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
  background: #fff;
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
      border-radius: 4px;
      top: -170px;
      left: 0px;
      background-color: rgba($color: #000, $alpha: 0.8);
      padding: 16px;
      color: #fff;
      font-size: 14px;
      line-height: 25px;
      z-index: 999;
    }

    .measurement_contnet:after {
      content: "";
      border-left: 10px solid transparent;
      border-top: 10px solid rgba(0, 0, 0, 0.8);
      border-right: 10px solid transparent;
      border-bottom: 20px solid transparent;
      position: absolute;
      // top: 10px;
      // right: -30px;
      left: 99px;
      bottom: -30px;
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

  .heartRateAnalysis {
    background-color: #fff;
    font-size: 16px;
    border-bottom: 10px solid #f2f2f2;

    .hRAtitle {
      padding: 16px 16px 18px 16px;
      color: #333;
    }

    .hRAconent {
      display: flex;
      flex-wrap: wrap;
      padding: 0 32px;
      padding-bottom: 20px;

      .hRAitem {
        flex: 0 0 33%;
        text-align: center;
        line-height: 1.5;
        color: #333;
        font-size: 14px;

        .hRAspecial {
          color: #888;
          font-size: 12px;
        }

        span {
          font-size: 18px;
          font-weight: bold;
        }
      }

      .hRAitem:nth-child(1),
      .hRAitem:nth-child(2),
      .hRAitem:nth-child(3) {
        border-bottom: 1px solid #eee;
        padding-bottom: 14px;
        margin-bottom: 12px;
      }
    }
    .hRAconentErr {
      width: 100%;
      padding-top: 66px;
      padding-bottom: 84px;
      color: #888;
      font-size: 14px;
      text-align: center;
      box-sizing: border-box;
    }
  }
  .hRAconentErr {
    width: 100%;
    padding-top: 66px;
    color: #888;
    font-size: 14px;
    text-align: center;
    box-sizing: border-box;
  }
  .device_teaching {
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 99;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 14px;
    color: #ffffff;

    .binding_box {
      position: fixed;
      bottom: 0.64rem;
      width: 90%;
      color: #333333;
      background-color: #fff;
      padding: 24px 0;
      box-sizing: border-box;
      border-radius: 0.21rem;

      .bd_title {
        text-align: center;
        font-size: 22px;
      }

      .bd_input {
        font-size: 24px;
        position: relative;
        margin: 0 0.43rem;
        margin-top: 0.6rem;
        height: 45px;
        border-bottom: 1px solid #ccc;
        box-sizing: border-box;

        input {
          border: 0;
          padding-left: 16px;
          // padding-bottom: 13px;
          width: 100%;
          height: 100%;
          box-sizing: border-box;

          &::-webkit-input-placeholder {
            /* Chrome/Opera/Safari */
            color: #888;
            font-size: 14px;
          }
        }

        .placeholder {
          display: inline-block;
          padding-top: 5px;
          color: #e95f5f;
          font-size: 12px;
        }
      }

      .hqyzm {
        position: absolute;
        right: 8px;
        top: 18px;
        font-size: 14px;
        color: #fb6522;
        border: 0;
        background-color: transparent;
      }

      .huoquctive {
        color: #ccc;
      }

      .bd_tips {
        margin: 0 0.43rem;
        font-size: 14px;
        line-height: 20px;
        margin-top: 0.5rem;
      }

      .bd_btn {
        color: #fff;
        margin: 0 32px;
        font-size: 16px;
        height: 48px;
        line-height: 48px;
        margin-top: 26px;
        // width: 100%;
        box-sizing: border-box;
        background-color: #fb6522;
        text-align: center;

        & > button {
          border: 0;
          background-color: transparent;
        }
      }

      .bd_btn_active {
        background-color: #ccc;
      }
    }

    .sketch {
      width: 200px;
      height: 200px;
      text-align: center;
      line-height: 200px;
      color: #333333;
      background-color: #fff;
      margin-bottom: 20px;
      z-index: 1000;
    }

    .tips {
      margin-bottom: 20px;
      color: #ffffff;
    }

    .gogo_pay {
      height: 36px;
      background-color: #fb6522;
      font-size: 16px;
      color: #fff;
      width: 58%;
      border-radius: 6px;
      text-align: center;
      line-height: 36px;
      margin-bottom: 24px;
      z-index: 1000;
    }

    .already_pay {
      font-size: 16px;
      color: #fff;
      text-decoration: underline;
      z-index: 1000;
    }

    .bd_close {
      position: absolute;
      right: 16px;
      top: 10px;
    }

    .bind_btn {
      color: #fb6522;
      font-size: 16px;
      text-align: center;
      margin-top: 1.3rem;
    }

    .bind_btn span {
      display: inline-block;
      width: 50%;
      font-weight: bold;
    }
    .cancle_btn {
      box-sizing: border-box;
      border-right: 1px solid #e8e8e8;
    }
    .content {
      padding: 24px;
      color: #333;
      font-size: 18px;
      line-height: 22px;
      padding-bottom: 8px;
      padding-top: 12px;
      text-align: center;
    }
  }
  .bind_mobile {
    z-index: 9999;
  }
}

.ecg_report .ecgReport {
  padding: 8px 16px;
  box-sizing: border-box;
  font-size: 14px;
  text-align: left;
  color: #4c4c4c;
  background-color: #f2f2f2;
}

.ecg_report .history_content {
  background-color: #fff;
  border-radius: 5px;
  height: 156px;
  padding-top: 16px;
  box-sizing: border-box;
}

.ecg_report .scoreResult {
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
}
.ecg_report .scoreResult .scoreResultV1 {
  display: flex;
  align-items: center;
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
  padding: 0 16px;
  font-size: 12px;
  color: #888;
}

.ecg_report .ecgPic {
  /*padding-bottom: 4px;*/
  margin-top: 8px;
  padding: 0 16px;
}

.ecg_report .ecgPic img {
  width: 100%;
  height: 80px;
}

.ecg_report .ecg_content {
  width: 92%;
  margin-left: 4%;
}

.ecg_report .questionIcon {
  font-weight: bold;
  color: #000;
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

.ecg_report .footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  /*margin-top: 6px;*/
  height: 60px;
  line-height: 60px;
  background: #ffffff;

  color: white;
  z-index: 999;
  display: flex;
  justify-content: space-around;
  padding: 0 10px;
  box-sizing: border-box;

  .Fitem {
    text-align: center;
    flex: 0 0 45%;
  }

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

.ecg_report .to_homePage {
  box-sizing: border-box;
  font-size: 14px;
  display: inline-block;
  background-color: #eee;
  color: #fb6522;
  text-align: center;
  height: 36px;
  line-height: 36px;
  border-radius: 25px;
  vertical-align: middle;
  width: 100%;
}

.ecg_report .zhuanjia {
  background-color: #fb6522;
  color: #fff;
}

.ecg_report .jieduzhong {
  background-color: rgba(251, 101, 34, 0.5);
  color: #fff;
}
</style>
