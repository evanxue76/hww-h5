<template>
  <div class="im_wrap">
    <div class="top_tips">{{ fuwu_msg }}</div>
    <div class="im_list" ref="im_list">
      <div
        class="item"
        v-for="(item, index) in msg_list"
        :key="index"
        :class="{ myMsg: item.msgBelonged === 0 }"
      >
        <div class="time">{{ item.sendTime | $_tudan_isToday }}</div>
        <!-- 医生 -->
        <div class="box1" v-if="item.msgBelonged === 1">
          <div class="imgBox">
            <img v-if="docPhoto" :src="docPhoto" alt />
            <img v-else :src="m_docPhoto" alt />
          </div>
          <div class="msgBox">
            <span v-html="item.msg"></span>
          </div>
        </div>
        <!-- 用户 -->
        <div class="box2" v-if="item.msgBelonged === 0">
          <template v-if="item.msgType === 1">
            <div class="msgBox">
              <span v-html="item.msg"></span>
            </div>
            <div class="imgBox">
              <img v-if="userPhoto" :src="userPhoto" alt />
              <img v-else :src="m_userPhoto" />
            </div>
          </template>
          <template v-else>
            <div class="msgBox">
              <div class="patient_data">
                <div class="title">病人资料</div>
                <div class>
                  姓名：{{ item.symptom.name }}/{{
                    item.symptom.sex | f_sex
                  }}/{{ item.symptom.age }}
                </div>
                <div class="text-overflow">
                  心电诊断：{{ item.symptom.analyzeResult }}
                </div>
                <div
                  class="patient_jump"
                  @click="go_to_info(item.symptom.infoId)"
                >
                  点击查看更多
                </div>
              </div>
            </div>
            <div class="imgBox">
              <img v-if="userPhoto" :src="userPhoto" alt />
              <img v-else :src="m_userPhoto" />
            </div>
          </template>
        </div>
      </div>
    </div>

    <footer class="im_footer" v-if="is_msg">
      <div class="im_footer_input">
        <input type="text" v-model="msg" maxlength="500" />
      </div>
      <div class="im_btn" @click="enterMsg(1)">
        <button>发送</button>
      </div>
    </footer>
  </div>
</template>

<script>
import util from "@/lib/util";
import ip_config from "@/lib/global";
import { toast_loding } from "@/lib/public";
import { second_todo_date } from "@/lib/time";
export default {
  created() {
    this.get_router();
    this.rebound();
  },
  mounted() {
    //console.log(this.$refs);
    let box = this.$refs.im_list;
    box.addEventListener("scroll", () => {
      //console.log(`s：${this.$refs.im_list.scrollTop}`);
      let current_offset_top = this.$refs.im_list.scrollTop;
      if (this.is_first === 2) {
        this.is_first = 3;
        return;
      }

      if (this.is_no_data) {
        return;
      }
      if (current_offset_top <= 20 && !this.pull_Loading) {
        //console.log("didi");
        this.pull_Loading = true;
        this.get_talkMsg_list();
        //console.log(this.$refs);
      }
      //console.log(`e：${this.$refs.im_list.scrollTop}`);
    });
  },
  components: {},
  computed: {},
  data() {
    return {
      pull_Loading: false,
      is_first: 1,
      is_no_data: false,
      list_loading: false,
      list_finished: true,
      fuwu_msg: "加载中···",
      fuwu_time: "",
      is_msg: false, //控制下拉刷新
      isLoading: false, //控制下拉刷新
      docId: "", //医生id
      userNo: "", //用户id
      pageNum: 0, //当前页数
      docPhoto: "", //医生头像
      userPhoto: "", //用户头像
      m_userPhoto: require("../../assets/image/pic_user.png"),
      m_docPhoto: require("../../assets/image/pic_doctor.png"),
      msg: "", //消息
      ws: null,
      timer: "", //定时器
      msg_list: [], //消息列表
      wsUrl_list: {
        //websoket连接地址
        "http://192.168.9.136:2130/hww/": "ws://api-test.995120.cn/hwws/",
        "http://api-test.995120.cn/hww/": "ws://api-test.995120.cn/hwws/"
//      "http://192.168.9.136:2130/hww/": "ws://api.995120.cn/hwws/",
//      "http://api.995120.cn/hww/": "ws://api.995120.cn/hwws/"
      },
      host1: ip_config.developmentUrl.host1
    };
  },
  methods: {
    onLoad() {},
    //处理iOS 微信客户端6.7.4 键盘收起页面未下移bug
    rebound() {
      /iphone|ipod|ipad/i.test(navigator.appVersion) &&
        document.addEventListener(
          "blur",
          e => {
            document.body.scrollIntoView(false);
          },
          true
        );
    },
    // 下拉刷新
    onRefresh() {
      //console.log(this.$refs);
      let div = this.$refs.im_list;
      let scrollHeight = div.offsetHeight;
      //console.log(scrollHeight);
      this.get_talkMsg_list();
      //console.log(div.scrollTop);
      div.scrollTop = div.scrollHeight - scrollHeight;
      //console.log(div.scrollHeight);
      // ++this.pageNum;
    },
    get_router() {
      if (!this.$route.params.item) {
        let item = JSON.parse(localStorage.getItem("im_item"));
        this.item = item;
        this.docId = item.docId;
        this.userNo = item.userNo;
        this.get_talkMsg_list();
        this.get_dateTime(item.applyId);
        document.title = JSON.parse(localStorage.getItem("im_item")).docName;
        return;
      }
      this.item = this.$route.params.item;
      document.title = this.$route.params.item.docName;
      this.docId = this.$route.params.item.docId;
      this.userNo = this.$route.params.item.userNo;
      localStorage.setItem("im_item", JSON.stringify(this.$route.params.item));
      this.get_dateTime(this.$route.params.item.applyId);
      this.get_talkMsg_list();
      this.post_msg_tag_read();
    },
    // 查询服务到期时间
    async get_dateTime(applyId) {
      this.is_msg = false;
      let Url = "";
      let params = {
        reqHead: {
          functionId: "HWW002004002"
        },
        body: {
          applyId: applyId
        }
      };
      toast_loding(this);
      try {
        let res = await util.ajax.post(Url, params);
        //console.log(res);
        if (res.data.respHead.respCode === "000") {
          this.fuwu_time = res.data.body.data.dateTime;
          this.fuwu_times();
          if (res.data.body.data.dateTime > 0) {
            this.init_websocket();
            this.is_msg = true;
          }
        } else {
          this.$toast(`${res.data.respHead.respMsg}`);
        }
        this.$toast.clear();
      } catch (e) {
        //console.log(e);
        this.$toast.clear();
//      if (e.message.includes("Network")) {
          this.$toast("网络连接错误，请检查网络连接，再重新尝试!");
//      } else {
//        this.$toast(`error： ${e.message}`);
//      }
      }
    },
    // 计算到期时间
    fuwu_times() {
      let timer = setInterval(() => {
        if (this.fuwu_time <= 0) {
          this.fuwu_msg = "本次服务已结束";
          this.is_msg = false;
          if (this.ws != null) {
            this.ws.onclose();
          }
          clearInterval(timer);
        } else if (this.fuwu_time > 0) {
          this.fuwu_msg = `本次服务时间还剩 ${second_todo_date(
            this.fuwu_time
          )}`;
        }
        --this.fuwu_time;
      }, 1000);
    },
    // 获取历史记录
    async get_talkMsg_list() {
      let Url = "";
      let params = {
        reqHead: {
          functionId: "HWW002004001"
        },
        body: {
          docId: this.docId,
          typeFlag: 1,
          userNo: this.userNo,
          pageNum: this.pageNum,
          pageSize: 10
        }
      };
      toast_loding(this);
      try {
        let res = await util.ajax.post(Url, params);
        //console.log(res);
        if (res.data.respHead.respCode === "000") {
          this.post_msg_tag_read();
          ++this.pageNum;
          this.pull_Loading = false;
          if (
            Array.isArray(res.data.body.data.records) &&
            res.data.body.data.records.length > 0
          ) {
            res.data.body.data.records.forEach(i => {
              if (i.symptom) {
                i.symptom = JSON.parse(i.symptom);
              }
              this.msg_list.unshift(i);
            });
            if (this.is_first === 3) {
              this.$nextTick(() => {
                this.$refs.im_list.scrollTop =
                  this.$refs.im_list.scrollWidth * 2;
                //console.log(`nextTick：${this.$refs.im_list.scrollTop}`);
              });
            }
          } else {
            this.is_no_data = true;
            this.$toast("没数据了！");
          }
          this.docPhoto = res.data.body.data.docPhoto
            ? res.data.body.data.docPhoto
            : "";
          this.userPhoto = res.data.body.data.userPhoto
            ? res.data.body.data.userPhoto
            : "";
          this.userNo = res.data.body.data.userNo;
          this.docId = res.data.body.data.docId;
        } else {
          this.$toast(`${res.data.respHead.respMsg}`);
        }
        this.$toast.clear();
      } catch (e) {
        //console.log(e);
        this.$toast.clear();
        if (e.message.includes("Network")) {
          this.$toast("网络连接错误，请检查网络连接，再重新尝试!");
        } else {
          this.$toast(`error： ${e.message}`);
        }
      }
      this.isLoading = false;
      if (this.is_first === 1) {
        this.is_first = 2;
        this.go_to_bottom();
        //console.log("这是啥");
      }
    },
    //标记已读
    async post_msg_tag_read() {
      if (this.item.unReadCount === 0) {
        return;
      }
      let Url = "";
      let params = {
        reqHead: {
          functionId: "HWW002003003"
        },
        body: {
          distinction: 1,
          id: this.item.id
        }
      };

      try {
        let res = await util.ajax.post(Url, params);
        //console.log(res);
      } catch (e) {
        //console.log(e);
      }
    },
    // 初始化ws
    init_websocket() {
      let _this = this;
      let url = `${this.wsUrl_list[this.host1]}${this.userNo}/2`;
      let ws = new WebSocket(url);
      this.ws = ws;
      ws.onopen = evt => {
        // Web Socket 已连接上，使用 send() 方法发送数据
        this.enterMsg(0);
        //console.log("连接成功...");
      };
      ws.onmessage = evt => {
        this.websocketonmessage(evt);
        //console.log("数据已接收...");
      };
      ws.onclose = function() {
        // 关闭 websocket
        _this.open_ws_timer(0);
        //console.log("连接已关闭...");
        // _this.websocket();
        ws.close();
        _this.ws = null;
      };
      // 路由跳转时结束websocket链接
      this.$router.afterEach(function() {
        ws.close();
      });
    },
    //websoket数据接收
    websocketonmessage(e) {
      let obj = JSON.parse(e.data);
      this.msg_list.push(obj);
      this.go_to_bottom();
      //console.log(obj);
    },
    //发送消息
    enterMsg(type) {
      if (this.ws === null) {
        return this.$toast(`网络错误,请刷新页面!`);
      }
      if (type === 0) {
        this.open_ws_timer(1);
        return;
      }
      if (type === 1 && this.msg === "") {
        return this.$toast("请填写内容！");
      }
      if (this.msg.length > 500) {
        return this.$toast("字数超上限，最多发送500字，请分批发送！");
      }

      let params = {
        applyId: this.item.applyId,
        docId: this.docId,
        userNo: this.userNo,
        msg: this.msg,
        msgType: 1,
        recipient: 1
      };

      if (type === 1) {
        this.ws.send(JSON.stringify(params));
        this.msg_list.push({ msgType: 1, msgBelonged: 0, msg: this.msg });
        this.msg = "";
        this.go_to_bottom();
        // this.get_talkMsg_list(JSON.parse(localStorage.getItem("im_item")));
      }
      // //console.log("数据发送完成");
    },
    // 开启定时器发送心跳
    open_ws_timer(type) {
      if (type === 0) {
        clearInterval(this.timer);
        this.timer = null;
        return;
      }
      let msg = { msg: "心跳内容", msgType: 2 };
      this.timer = setInterval(() => {
        this.ws.send(JSON.stringify(msg));
      }, 5000);
      // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
      this.$once("hook:beforeDestroy", () => {
        clearInterval(this.timer);
      });
    },
    // 跳转 看病资料详情页
    go_to_info(info_id) {
      this.$router.push({
        name: "Upload",
        params: { info_id: info_id, is_im: 1 }
      });
    },
    // 回复到底部
    go_to_bottom() {
      this.$nextTick(() => {
        this.$refs.im_list.scrollTop = this.$refs.im_list.scrollHeight;
        //console.log("go_to_bottom");
      });
    }
  },
  filters: {
    f_sex(val) {
      let obj = {
        0: "男",
        1: "女"
      };
      return obj[val] || "";
    }
  },
  watch: {
    msg(val) {
      this.msg = val.replace(
        /\uD83C[^\\u0000-\\uFFFF]|\uD83D[^\\u0000-\\uFFFF]/g,
        ""
      );
    }
  }
};
</script>

<style lang="scss">
.im_wrap {
  font-size: 12px;
  padding-top: 10px;
  height: 100%;
  background-color: #f2f2f2;
  .top_tips {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    background-color: #fff;
    padding: 10px 0;
    color: #fb6522;
    font-size: 14px;
    text-align: center;
  }
  .im_list {
    // padding: 8px 16px;
    // margin-top: 20px;
    // padding-bottom: 100px;
    box-sizing: border-box;
    overflow: auto;
    height: 100%;
    padding: 28px 16px;
    padding-bottom: 50px;
    background-color: #f2f2f2;
    .item {
      margin-bottom: 16px;
      .box1 {
        display: flex;
        // height: 40px;
        box-sizing: border-box;
        margin-bottom: 10px;
        .imgBox {
          width: 40px;
          height: 40px;
          border: 1px solid #ccc;
          margin-right: 4px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .msgBox {
          display: flex;
          align-items: center;
          flex: 0 0 75%;
          width: 75%;
          position: relative;
          box-sizing: border-box;
          margin-left: 20px;
          span {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            background-color: #fff;
            max-width: 100%;
            padding: 9px;
            min-height: 40px;
            box-sizing: border-box;
            word-break: break-all;
            border-radius: 8px;
            font-size: 16px;
            line-height: 22px;
            // &:before {
            //   content: "";
            //   position: absolute;
            //   border-left: 10px solid transparent;
            //   border-top: 10px solid transparent;
            //   border-right: 20px solid #ccc;
            //   border-bottom: 10px solid transparent;
            //   top: 10px;
            //   left: -30px;
            // }
            &:after {
              content: "";
              border-left: 10px solid transparent;
              border-top: 10px solid transparent;
              border-right: 20px solid #fff;
              border-bottom: 10px solid transparent;
              position: absolute;
              top: 10px;
              left: -27px;
            }
          }
        }
      }
    }
    .myMsg {
      .box2 {
        display: flex;
        justify-content: flex-end;
        box-sizing: border-box;
        margin-bottom: 10px;
        .imgBox {
          width: 40px;
          height: 40px;
          border: 1px solid #ccc;
          margin-left: 4px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .msgBox {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex: 0 0 75%;
          width: 75%;
          position: relative;
          box-sizing: border-box;
          margin-right: 20px;
          span {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            background-color: #ffe5c6;
            max-width: 100%;
            padding: 9px;
            min-height: 40px;
            box-sizing: border-box;
            word-break: break-all;
            border-radius: 8px;
            font-size: 16px;
            line-height: 22px;
            // &:before {
            //   content: "";
            //   position: absolute;
            //   border-left: 20px solid #ccc;
            //   border-top: 10px solid transparent;
            //   border-bottom: 10px solid transparent;
            //   top: 10px;
            //   right: -20px;
            // }
            &:after {
              content: "";
              position: absolute;
              border-top: 10px solid transparent;
              border-bottom: 10px solid transparent;
              top: 10px;
              right: -16px;
            }
          }
        }
      }
    }
    .patient_data {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      background-color: #ffe5c6;
      max-width: 100%;
      padding: 12px;
      min-height: 40px;
      box-sizing: border-box;
      border-radius: 8px;
      font-size: 16px;
      line-height: 22px;
      .patient_jump {
        text-align: right;
        margin-top: 5px;
        color: #fb6522;
      }
      &:after {
        content: "";
        position: absolute;
        border-left: 20px solid #ffe5c6;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        top: 10px;
        right: -16px;
      }
      .text-overflow {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    .time {
      text-align: center;
      margin-bottom: 5px;
    }
  }
  .im_footer {
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 48px;
    background-color: #fff;
  }
  .im_footer_input {
    box-sizing: border-box;
    padding-left: 12px;
    flex: 0 0 85%;
    position: relative;
    & > input {
      border-radius: 5px;
      // border-color: #ccc;
      border: 1px solid #ccc;
      height: 32px;
      width: 100%;
      padding: 0 10px;
      box-sizing: border-box;
      font-size: 16px;
      color: #333;
    }
  }
  .im_btn {
    flex: 0 0 15%;
    justify-content: center;
    text-align: center;
    & > button {
      background-color: transparent;
      color: #fb6522;
      font-size: 16px;
      border: 0;
    }
  }
}
</style>
