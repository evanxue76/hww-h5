<template>
  <div class="homePage">
    <div class="homeTotal">
      <!--<van-nav-bar class="homeNav" title="ECG心电测量记录" left-arrow>
	      	<van-icon name="cross" slot="left" />
      </van-nav-bar>-->
      <div class="homeMenu">
        <div class="user" @click="toUser">
          <img
            :src="
              this.hw_user_message.photo ? this.hw_user_message.photo : userIcon
            "
          />
          {{ hw_user_message.nickName }}
        </div>
        <div class="message">
          <span
            class="doctorMessage"
            v-show="docUnReadCount"
            @click="toAllMessage"
            >您有{{ docUnReadCount }}条医生回复消息</span
          >
          <van-icon class="iconBell" :info="totalCount" />
          <img :src="bellIcon" @click="toAllMessage" />
        </div>
      </div>
      <div class="homeMenu">
        <div class="measured">
          今日已测量
          <span>{{ data.number }}</span
          >次
        </div>
        <div class="homeRecord" @click="historicalRecord">查看历史</div>
      </div>
    </div>

    <div class="noData" v-if="data.ecgImageIndexPath == ''">
      <div class="history_content">
        <div class="ecgResult">暂时无数据</div>
      </div>
    </div>
    <div
      :class="{ haveData: dataShow }"
      class="homeReport"
      v-else
      @click="toReport"
    >
      <div class="history_content">
        <div class="result">
          <div class="ecgResult" v-if="data.ecgResultBrief == ''">
            干扰数据，请重新测量
          </div>
          <div class="ecgResult" v-else>{{ data.ecgResultBrief }}</div>
          <div class="scoreResult">
            <van-icon class="iconLike" name="like" />
            <span>{{ data.heartRate }}bpm</span>
          </div>
        </div>

        <div class="ecgPic">
          <img :class="{ activeImg: imgShow }" :src="data.ecgImageIndexPath" />
        </div>
        <div class="recordTime">
          <div>{{ data.takeTime | formatDateFilter }}</div>
          <div>时长：{{ data.length }}秒</div>
        </div>
      </div>
    </div>
    <!-- 会员服务  问医生-->
    <div class="serve">
      <div class="member" @click="intoServices">
        <div class="serve_content">
          <p>报告解读</p>
          <span>专业心电医生人工解读</span>
        </div>
      </div>
      <div class="askDoctor" @click="askDoctor">
        <div class="serve_content">
          <p>图文咨询</p>
          <span>临床医生24小时图文咨询</span>
        </div>
      </div>
    </div>
    <!-- 健康趋势图 -->
    <div class="healthTrend" @click="enterReportTend">
      <p class="trendTitle">健康趋势图</p>
      <p class="trendcon">{{ healthTrendData.suggest }}</p>
    </div>

    <!--<div class="risk">
			<p class="riskTitle">风险评估</p>
			<p class="riskcon">每月健康趋势图已生成，查看健康趋势图</p>
    </div>-->
    <!-- 今日健康 -->
    <!-- <div class="todayHealth">
      <div class="healthTitle" @click="todayHealth">
        <div class>今日健康</div>
        <div class>〉</div>
      </div>
      <div class="healthContent">
        <div
          class="healthUnit"
          v-for="(item, index) in healthList"
          :key="index"
          @click="articleDetails(item)"
        >
          <img
            :src="
              'http://ycxt.995120.cn:9090/tm/infoManageApi/' +
                item.cover +
                '.action'
            "
          />
          <p class="content_title">{{ item.categoryName }}</p>
        </div>
      </div>
    </div>-->
    <div class="footer">
      <!--本服务由浙江好络维医疗技术有限公司提供-->
      <p>本服务由国家远程医疗与互联网医学中心与</p>
      <p>浙江好络维医疗技术有限公司共同提供</p>
      <p>服务电话：400-0785-120</p>
    </div>
    <!-- 设备使用图解 -->
    <div class="device_teaching" v-if="is_device_teaching">
      <div class="sketch">表带示意图</div>
      <div class="tips">您还没有绑定任何心电测量设备</div>
      <div class="gogo_pay">立即购买</div>
      <div class="already_pay" @click="is_device_teaching = false">
        已经购买
      </div>
    </div>
    <!-- 绑定手机号 -->
    <div class="device_teaching" v-if="is_bd">
      <div class="binding_box">
        <div class="bd_close" @click="is_bd = !is_bd">
          <van-icon name="cross" color="#ccc" size="24px" />
        </div>
        <div class="bd_title">绑定手机号</div>
        <div class="bd_input">
          <input
            type="text"
            placeholder="请输入手机号"
            v-model="hwMobile"
            maxlength="11"
            @keyup="proving1('integral')"
          />
          <!-- <span class="placeholder">请输入手机号</span> -->
        </div>
        <div class="bd_input">
          <input
            type="text"
            placeholder="请输入验证码"
            v-model="code"
            maxlength="6"
          />
          <button
            class="hqyzm"
            @click="huoquyzm"
            :class="{ huoquctive: is_code }"
            :disabled="is_code"
          >
            {{ codeMsg }}
          </button>
        </div>
        <div class="bd_tips">
          为更好给您提供持续的心脏健康管理服务，请绑定手机号码。
        </div>
        <div
          class="bd_btn"
          :class="{ bd_btn_active: is_bdi }"
          @click="bd_mobile"
        >
          <button :disabled="is_bdi">{{ bd_btn_msg }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from "../../lib/util";
import utils from "../../lib/utils";
import { dateDot } from "../../lib/time";
export default {
  data() {
    return {
      hwMobile: "",
      code: "",
      codeMsg: "获取验证码",
      bd_btn_msg: "绑定",
      is_bd: true,
      is_bdi: false,
      active: 0,
      docUnReadCount: "",
      totalCount: "",
      ecg: require("../../assets/image/ecg.png"),
      userIcon: require("../../assets/image/pic_user.png"),
      bellIcon: require("../../assets/image/icon_msg.png"),
      data: {},
      healthList: [],
      healthTrendData: {},
      hw_user_message: {},
      is_device: "", //设备使用图解
      is_device_teaching: false,
      imgShow: false,
      dataShow: false,
      is_code: null
    };
  },
  created() {
    if (this.$route.params.is_device === 1) {
      this.is_device = this.$route.params.is_device;
    }
    let userData = localStorage.getItem("hw_user_message");
    this.hw_user_message = JSON.parse(userData);
    this.is_bd = this.hw_user_message.isPopup == 0 ? true : false;
    this.unreadMessage();
    this.obtionData();
    this.healthTrend();
    //this.obtainHealth();
    this.get_binding_device();

    //  let type = this.$route.params.type
    //  if (type == 5) {
    //  	this.$router.push({
    //	        name: "EcgReport"
    //	    });
    //  }
  },
  mounted() {
    //	let Url = window.location.pathname
    //if (this.pathName == '/hwh/homePage') {
    //	window.addEventListener('popstate',function(e){
    //				if (Url == '/hwh/homePage') {
    //					this.$store.state.data.status = true
    //				}else{
    //					this.$store.state.data.status = false
    //				}
    //			window.open("about:blank","_self").close()
    //		},false)
    //}
  },
  methods: {
    // 绑定手机
    async bd_mobile() {
      if (!/^[1][0-9]{10}$/.test(this.hwMobile)) {
        this.$toast("请输入正确的手机号码");
        return;
      }
      if (this.is_code == null) {
        this.$toast("请获取验证码");
        return;
      }
      if (this.code.length != 6) {
        this.$toast("验证码错误");
        return;
      }
      let Url = "",
        params = {
          reqHead: {
            functionId: "HWW002014002"
          },
          body: {
            hwMobile: this.hwMobile,
            code: this.code,
            userNo: this.hw_user_message.userNo
          }
        };
      this.is_bdi = true;
      this.bd_btn_msg = "绑定中···";
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          this.is_bd = false;
          this.$toast("绑定成功");
        } else {
          this.bd_btn_msg = "绑定";
          this.is.bdi = false;
          this.code = "";
          this.$toast(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        console.log(e);
        this.bd_btn_msg = "绑定";
        this.is.bdi = false;
        this.code = "";
        if (e.message.includes("Network")) {
          this.$toast("网络连接错误，请检查网络连接，再重新尝试!");
        } else {
          this.$toast(`error： ${e.message}`);
        }
      }
    },
    //正则校验
    proving1() {
      this.hwMobile = this.hwMobile.replace(/[^\.\d]/g, "");
      this.hwMobile = this.hwMobile.replace(".", "");
    },
    // 获取验证码
    async huoquyzm() {
      if (!/^[1][0-9]{10}$/.test(this.hwMobile)) {
        this.$toast("请输入手机号码");
        return;
      }
      let Url = "",
        params = {
          reqHead: {
            functionId: "HWW002014001"
          },
          body: {
            mobile: this.hwMobile
          }
        };
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          this.is_code = true;
          this.$toast("发送成功");
          let second = 60;
          this.codeMsg = `重新获取(${second})`;
          let timer = setInterval(() => {
            second = second - 1;
            this.codeMsg = `重新获取(${second})`;
            if (second === 0) {
              clearInterval(timer);
              this.codeMsg = "获取验证码";
              this.is_code = false;
            }
          }, 1000);
        } else {
          this.$toast(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        console.log(e);
        if (e.message.includes("Network")) {
          this.$toast("网络连接错误，请检查网络连接，再重新尝试!");
        } else {
          this.$toast(`error： ${e.message}`);
        }
      }
    },
    async get_binding_device() {
      let isHwProtocol = this.hw_user_message.isHwProtocol;
      let isPopup = this.hw_user_message.isPopup;
      let Url = "";
      let params = {
        reqHead: {
          functionId: "HWW002011001"
        },
        body: {
          managerNo: this.hw_user_message.managerNo,
          userNo: this.hw_user_message.userNo
        }
      };
      try {
        let res = await util.ajax.post(Url, params);
        if (res.data.respHead.respCode === "000") {
          if (res.data.body.data === 0 && this.is_device === 1) {
            if (isHwProtocol == 0 && isPopup == 0) {
              this.is_device_teaching = true;
              this.dot_show = true;
            }
          }
        } else {
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
    obtionData() {
      let self = this;
      let Url = "";
      let params = {
        reqHead: {
          functionId: "HWW002001001"
        },
        body: {
          userNo: this.hw_user_message.userNo
        }
      };
      util.ajax.post(Url, params).then(function(res) {
        self.data = res.data.body.data;
        if (self.data) {
          self.dataShow = true;
        }
        if (self.data.ecgImageIndexPath) {
          self.imgShow = true;
        }
      });
    },
    toReport() {
      let reportId = this.data.reportId;
      localStorage.setItem("hw_reportId", reportId);
      this.$router.push({
        name: "EcgReport"
      });
    },
    unreadMessage() {
      let self = this;
      let Url = "";
      let params = {
        reqHead: {
          functionId: "HWW002003005"
        },
        body: {
          distinction: 0,
          userNo: this.hw_user_message.managerNo
        }
      };
      util.ajax
        .post(Url, params)
        .then(function(res) {
          if (res.data.respHead.respCode == "000") {
            let docUnReadCount = res.data.body.data.docUnReadCount - 0;
            let unReadCount = res.data.body.data.unReadCount;
            self.docUnReadCount = docUnReadCount;
            self.totalCount = docUnReadCount + unReadCount;
            if (self.totalCount == 0) {
              self.totalCount = "";
            }
          } else {
            return;
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    toUser() {
      this.$router.push({
        name: "User"
      });
    },
    toAllMessage() {
      this.$router.push({
        name: "Msg_list"
      });
    },
    historicalRecord() {
      this.$router.push({ path: "/historyRecord" });
    },
    healthTrend() {
      let self = this;
      let Url = "";
      let params = {
        reqHead: {
          functionId: "HWW002005002"
        },
        body: {
          userNo: this.hw_user_message.userNo
        }
      };
      util.ajax
        .post(Url, params)
        .then(function(res) {
          self.healthTrendData = res.data.body.data;
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    enterReportTend() {
      this.$router.push({
        name: "ReportTend",
        params: { type: this.healthTrendData.type }
      });
    },
    intoServices() {
      //    this.$router.push({
      //      name: "MemberServices"
      //    });
      sessionStorage.setItem("hw_fromPath", "");
      this.$router.push({
        name: "ReportInterpret"
      });
    },
    askDoctor() {
      sessionStorage.setItem("hw_fromPath", "");
      this.$router.push({
        name: "DoctorList"
      });
    },
    obtainHealth() {
      let self = this;
      let Url = "hwh/api/tm/infoManageApi/queryArticleCategoryList.action";
      let params = {
        //    	limit: 5
        pageSize: 3,
        start: 1
      };
      utils.ajax.get(Url, { params }).then(function(res) {
        self.healthList = res.data.recordList;
      });
    },
    todayHealth() {
      this.$router.push({
        name: "InformationCategory"
      });
    },
    articleDetails(item) {
      let category = JSON.stringify(item);
      localStorage.setItem("category", category);
      this.$router.push({
        name: "ArticleCategory"
      });
      //    this.$router.push({
      //      name: "CategoryContent",
      //      params: { articleBid: item.articleBid }
      //    });
    }
  },
  filters: {
    formatDateFilter(val) {
      if (val == "") {
        return;
      } else {
        return dateDot(val);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.homePage {
  .device_teaching {
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba($color: #000, $alpha: 0.5);
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
      position: relative;
      width: 90%;
      color: #333333;
      background-color: #fff;
      padding: 24px 0;
      box-sizing: border-box;
      .bd_title {
        text-align: center;
        font-size: 22px;
      }
      .bd_input {
        font-size: 24px;
        position: relative;
        margin: 0 40px;
        margin-top: 50px;
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
        margin: 0 40px;
        font-size: 14px;
        line-height: 20px;
        margin-top: 44px;
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
    }
    .tips {
      margin-bottom: 20px;
      color: #ffffff;
    }
    .gogo_pay {
      height: 48px;
      background-color: #fb6522;
      font-size: 16px;
      color: #fff;
      width: 80%;
      text-align: center;
      line-height: 48px;
      margin-bottom: 24px;
    }
    .already_pay {
      font-size: 16px;
      color: #fff;
      text-decoration: underline;
    }
    .bd_close {
      position: absolute;
      right: 16px;
      top: 10px;
    }
  }
}
.homePage .homeNav {
  background: #f2f2f2;
}
.homePage .homeNav .van-nav-bar__text {
  color: #000000;
}
.homePage .homeTotal .van-nav-bar .van-icon {
  color: #000000;
}
.homePage .homeNav .van-nav-bar__title {
  color: #000000;
  font-weight: bold;
}
.homePage .homeMenu {
  display: flex;
  font-size: 14px;
  padding: 14px 0 0;
  justify-content: space-between;
}
.homePage .iconManager {
  font-size: 30px;
  background: #fbf1e4;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  color: #ffba6b;
  vertical-align: middle;
  text-align: center;
}
.homePage .iconBell {
  font-size: 30px;
  /*background: #FBF1E4;*/
  /*width: 35px;*/
  /*height: 35px;*/
  /*border-radius: 50%;*/
  color: #ffba6b;
  vertical-align: middle;
}
.homePage .user {
  margin-left: 3%;
}
.homePage .message {
  margin-right: 4%;
  display: flex;
  align-items: center;
}
.homePage .measured {
  margin-left: 3%;
}
.homePage .homeRecord {
  margin-right: 2%;
  color: #fc7641;
}
.homePage .homeReport {
  width: 94%;
  margin-left: 3%;
  margin-top: 14px;
  background: #f48f44;
  background: linear-gradient(to top right, #f77339, #f79c52);
  font-size: 14px;
  text-align: left;
  color: #ffffff;
  border-radius: 6px;
}
.homePage .dataShow {
  height: 175px;
}
.homePage .noData {
  width: 94%;
  height: 80px;
  line-height: 80px;
  margin-left: 3%;
  margin-top: 14px;
  background: #f48f44;
  background: linear-gradient(to top right, #f77339, #f79c52);
  font-size: 14px;
  text-align: left;
  color: #ffffff;
  border-radius: 6px;
}
.homePage .scoreResult {
  margin-right: 3%;
  padding-top: 6px;
}
.homePage .iconLike {
  font-size: 16px;
  vertical-align: middle;
  margin-right: 6px;
}
.homePage .recordTime {
  display: flex;
  justify-content: space-between;
  height: 32px;
  line-height: 32px;
  margin-left: 3%;
  margin-right: 3%;
}
.homePage .ecgPic {
}
.homePage .ecgPic img {
  width: 94%;
  margin-left: 3%;
}
.homePage .ecgPic .activeImg {
  height: 100px;
}
.homePage .result {
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
}
.homePage .ecgResult {
  margin: 8px 3% 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.homePage .planting {
  margin-top: 16px;
  width: 94%;
  margin-left: 3%;
}
.homePage .planting img {
  width: 100%;
  height: 100px;
}
.homePage .healthTrend {
  background: url(../../assets/image/pic_home_graph.png) no-repeat;
  background-size: 100% 100%;
  width: 94%;
  height: 100px;
  margin-left: 3%;
  margin-top: 16px;
  text-align: left;
}
.homePage .trendTitle {
  font-size: 16px;
  padding-top: 16px;
  margin-left: 28px;
}
.homePage .trendcon {
  width: 80%;
  font-size: 14px;
  margin-top: 10px;
  margin-left: 28px;
  line-height: 20px;
  color: #888;
}
.homePage .serve {
  width: 94%;
  height: 164px;
  margin-left: 3%;
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}
.homePage .serve_content {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-top: 80px;
  /*justify-content: flex-end;*/
  padding: 0 16px;
  & > p {
    font-size: 18px;
    color: #333;
    padding-bottom: 16px;
    font-weight: bold;
  }
  & > span {
    color: #888;
    font-size: 12px;
    padding-bottom: 26px;
  }
}
.homePage .member {
  background: url(../../assets/image/pic_home_analyse.png) no-repeat;
  background-size: 100% 100%;
  width: 48%;
  height: 164px;
  text-align: left;
  color: #333333;
  font-size: 16px;
  position: relative;
}
.homePage .askDoctor {
  background: url(../../assets/image/pic_home_onlinetalk.png) no-repeat;
  background-size: 100% 100%;
  width: 48%;
  height: 164px;
  text-align: left;
  color: #333333;
  font-size: 16px;
}

.homePage .risk {
  background: url(../../assets/image/bgpic_subhealth.png);
  width: 94%;
  height: 100px;
  margin-left: 3%;
  margin-top: 16px;
  text-align: left;
}
.homePage .riskTitle {
  font-size: 16px;
  padding-top: 16px;
  margin-left: 28px;
}
.homePage .riskcon {
  font-size: 12px;
  margin-top: 16px;
  margin-left: 28px;
}
.homePage .todayHealth {
  margin-bottom: 10px;
  margin-top: 16px;
  width: 94%;
  margin-left: 3%;
  font-size: 14px;
}
.homePage .healthTitle {
  display: flex;
  justify-content: space-between;
}
.homePage .healthContent {
  /*width: 100%;*/
  height: 72px;
  overflow-x: scroll;
  overflow-y: hidden;
  display: flex;
  margin-top: 12px;
}
.homePage .healthContent img {
  height: 70px;
  margin-right: 8px;
  border-radius: 6px;
}
.homePage .footer {
  /*position: absolute;
	bottom: 20px;
	left: 0;
	right: 0;
	margin: auto;*/
	margin-top: 20px;
  font-size: 14px;
  line-height: 20px;
  color: #989397;
  text-align: center;
}
.homePage .user img {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  vertical-align: middle;
}
.message img {
  width: 22px;
  height: 22px;
  border-radius: 50%;
}
.homePage .message .van-info {
  top: -22px;
  right: -22px;
}
.homePage .doctorMessage {
  font-size: 12px;
  padding: 3px 6px 2px;
  background: #eb5e5e;
  color: #ffffff;
  border-radius: 30px;
}
.homePage .healthUnit {
  position: relative;
}
.homePage .content_title {
  position: absolute;
  font-size: 16px;
  color: #ffffff;
  top: 16px;
  left: 16px;
}
</style>
