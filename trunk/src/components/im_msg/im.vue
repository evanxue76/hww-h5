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
        <div class="time" v-if="item.msgType != 5 && item.msgType != 4">
          {{ item.sendTime | $_tudan_isToday }}
        </div>
        <div class="msgcontent">
          <!-- 医生 -->
          <div
            class="box1"
            v-if="
              item.msgBelonged === 1 && item.msgType != 5 && item.msgType != 4
            "
          >
            <div class="imgBox">
              <img v-if="docPhoto" :src="docPhoto" alt />
              <img v-else :src="m_docPhoto" alt />
            </div>
            <div class="msgBox">
              <span v-html="item.msg" @click="img_enlarge(item.msg)"></span>
            </div>
          </div>
          <!-- 用户 -->
          <div class="box2" v-if="item.msgBelonged === 0">
            <template v-if="item.msgType == 0">
              <div class="msgBox">
                <div class="patient_data">
                  <div class="title">病人资料</div>
                  <div>
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
            <template v-if="item.msgType == 1">
              <div class="msgBox">
                <span v-html="item.msg" @click="img_enlarge(item.msg)"></span>
              </div>
              <div class="imgBox">
                <img v-if="userPhoto" :src="userPhoto" alt />
                <img v-else :src="m_userPhoto" />
              </div>
            </template>
          </div>
          <!-- 提示 -->
          <div
            class="im_tips"
            v-if="
              item.msgType === 3 || item.msgType === 4 || item.msgType === 5
            "
          >
            <div class="im_tips_btn" v-if="item.msgType === 3">
              <button @click="is_over(0, index)">继续咨询</button>
              <button @click="edit_im_tips_show(index)">没有了,谢谢！</button>
            </div>
            <div class="im_tips_btn" v-if="item.msgType === 4">
              <span>{{ item.msg }}</span>
            </div>
            <div class="im_tips_btn" v-if="item.msgType === 5">
              <p>{{ item.msg }}</p>
              <span>结束时间：{{ item.sendTime | $_tudan_isToday }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="im_footer" v-if="is_msg">
      <van-uploader :after-read="onRead" accept="image/*">
        <img src="./icon_input_add.png" />
      </van-uploader>
      <div class="im_footer_input">
        <input type="text" v-model="msg" maxlength="500" />
      </div>
      <div class="im_btn" @click="enterMsg">
        <button :disabled="is.btn">发送</button>
      </div>
    </footer>
    <van-image-preview
      v-model="is.image_preview"
      :images="images"
      @change="onChange"
    >
      <!-- <template v-slot:index>第{ index }页</template> -->
    </van-image-preview>
    <!-- <input type="file" id="upload" accept="image" @change="uploads" /> -->

    <section class="cancellation_wrap" v-if="im_tips_show">
      <div class="cancellation_box">
        <p class="pic">
          <img src="./../../assets/image/pic_tip.png" alt />
        </p>
        <p class="cancellation_msg_txt">您将结束本次咨询</p>
        <div class="cancellation_btn">
          <span class="cancle" @click="im_tips_show = false">取消</span>
          <span @click="cancel">确定</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import util from "@/lib/util";
import Exif from "exif-js";
import ip_config from "@/lib/global";
import upImgUrl from "@/lib/upImgUrl";
import { toast_loding } from "@/lib/public";
import { second_todo_date } from "@/lib/time";
export default {
  created() {
    this.user_info = JSON.parse(localStorage.getItem("hw_user_message"));
    if (this.$route.params.type == 1) {
      this.get_applyId();
    } else {
      this.get_router();
    }
    this.rebound();
  },
  mounted() {
    //console.log(this.$refs);
    let box = this.$refs.im_list;
    box.addEventListener("scroll", () => {
      //console.log(`s：${this.$refs.im_list.scrollTop}`);
      let current_offset_top = box.scrollTop;
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
    this.$refs.im_list.scrollTop = this.$refs.im_list.scrollHeight;
  },
  components: {},
  computed: {},
  data() {
    return {
      files: {
        name: "",
        type: ""
      },
      images: [],
      headerImage: null,
      picValue: null,
      upImgUrl,
      item: "",
      applyId: "",
      user_info: {},
      msg_index: "",
      im_tips_show: false,
      is: {
        btn: false,
        image_preview: false
      },
      pull_Loading: false,
      is_first: 1,
      is_no_data: false,
      list_loading: false,
      list_finished: true,
      fuwu_msg: "加载中···",
      fuwu_time: "",
      is_msg: false, //控制发送box
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
        "http://192.168.1.66:2140/hww/": "ws://192.168.1.66:7378/hwws/",
        "http://api-test.995120.cn/hww/": "ws://api-test.995120.cn/hwws/",
        "http://192.168.9.136:2130/hww/": "ws://192.168.9.136:7378/hwws/",
        "http://api.995120.cn/hww/": "ws://api.995120.cn/hwws/",
        "https://api.995120.cn/hww/": "ws://api.995120.cn/hwws/"
      },
      host1: ip_config.developmentUrl.host1
    };
  },
  methods: {
    onChange(e) {
      console.log(e);
    },
    // 放大图片
    img_enlarge(msg) {
      if (msg.indexOf("<img") == -1) {
        return;
      }
      let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
      let src = msg.match(srcReg);

      this.images = [];
      this.images.push(src[1]);
      this.is.image_preview = true;
    },
    // 组件方法 获取 流
    async onRead(file) {
      // console.log(file);
      // console.log(file.file);
      this.files.name = file.file.name; // 获取文件名
      this.files.type = file.file.type; // 获取类型
      this.picValue = file.file; // 文件流
      this.imgPreview(this.picValue);
    },
    // 处理图片
    imgPreview(file) {
      let self = this;
      let Orientation;
      //去获取拍照时的信息，解决拍出来的照片旋转问题
      Exif.getData(file, function() {
        Orientation = Exif.getTag(this, "Orientation");
      });
      // 看支持不支持FileReader
      if (!file || !window.FileReader) return;

      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function() {
          // console.log(this.result);
          let result = this.result;
          let img = new Image();
          img.src = result;
          //判断图片是否大于500K,是就直接上传，反之压缩图片
          if (this.result.length <= 500 * 1024) {
            self.headerImage = this.result;
            self.postImg();
          } else {
            img.onload = function() {
              let data = self.compress(img, Orientation);
              self.headerImage = data;
              self.postImg();
            };
          }
        };
      }
    },
    // 压缩图片
    compress(img, Orientation) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      //瓦片canvas
      let tCanvas = document.createElement("canvas");
      let tctx = tCanvas.getContext("2d");
      // let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio;
      if ((ratio = (width * height) / 4000000) > 1) {
        // console.log("大于400万像素");
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      } else {
        ratio = 1;
      }
      canvas.width = width;
      canvas.height = height;
      //        铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //如果图片像素大于100万则使用瓦片绘制
      let count;
      if ((count = (width * height) / 1000000) > 1) {
        // console.log("超过100W像素");
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
        //            计算每块瓦片的宽和高
        let nw = ~~(width / count);
        let nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(
              img,
              i * nw * ratio,
              j * nh * ratio,
              nw * ratio,
              nh * ratio,
              0,
              0,
              nw,
              nh
            );
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      //修复ios上传图片的时候 被旋转的问题
      if (Orientation != "" && Orientation != 1) {
        switch (Orientation) {
          case 6: //需要顺时针（向左）90度旋转
            this.rotateImg(img, "left", canvas);
            break;
          case 8: //需要逆时针（向右）90度旋转
            this.rotateImg(img, "right", canvas);
            break;
          case 3: //需要180度旋转
            this.rotateImg(img, "right", canvas); //转两次
            this.rotateImg(img, "right", canvas);
            break;
        }
      }
      //进行最小压缩
      let ndata = canvas.toDataURL("image/jpeg", 0.1);
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
      return ndata;
    },
    // 旋转图片
    rotateImg(img, direction, canvas) {
      //最小与最大旋转方向，图片旋转4次后回到原方向
      const min_step = 0;
      const max_step = 3;
      if (img == null) return;
      //img的高度和宽度不能在img元素隐藏后获取，否则会出错
      let height = img.height;
      let width = img.width;
      let step = 2;
      if (step == null) {
        step = min_step;
      }
      if (direction == "right") {
        step++;
        //旋转到原位置，即超过最大值
        step > max_step && (step = min_step);
      } else {
        step--;
        step < min_step && (step = max_step);
      }
      //旋转角度以弧度值为参数
      let degree = (step * 90 * Math.PI) / 180;
      let ctx = canvas.getContext("2d");
      switch (step) {
        case 0:
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);
          break;
        case 1:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, 0, -height);
          break;
        case 2:
          canvas.width = width;
          canvas.height = height;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, -height);
          break;
        case 3:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, 0);
          break;
      }
    },
    //这里写接口
    async postImg() {
      // console.log(this.headerImage);
      let file = this.dataURLtoFile(this.headerImage);
      let formData = new window.FormData();
      formData.append("file", file);
      toast_loding(this, "图片上传中···");
      try {
        let res = await util.ajax.post(this.upImgUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        // console.log(res);
        if (res.status == "200" && res.data.respHead.respCode == "000") {
          // console.log(res.data.body.obj.filePath);
          let msg = `<img src='${res.data.body.obj.filePath}'>`;
          this.$toast.clear();
          let params = {
            applyId: this.applyId,
            docId: this.docId,
            userNo: this.userNo,
            msg: msg,
            msgType: 1,
            recipient: 1
          };
          this.ws.send(JSON.stringify(params));
        } else {
          this.$toast.clear();
          this.$toast(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        console.log(e);
        this.$toast.clear();
        this.$toast(`网络连接错误,请稍后再试!`);
      }
    },
    //将base64转换为文件
    dataURLtoFile(dataurl) {
      var arr = dataurl.split(","),
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], this.files.name, { type: this.files.type });
    },

    // 根据mangerNo 和医生Id ,查询服务id-姚明炯
    async get_applyId() {
      this.docId = this.$route.params.docId;
      this.userNo = this.user_info.managerNo;
      document.title = this.$route.params.docName;
      let Url = "",
        params = {
          reqHead: {
            functionId: "HWW002003006"
          },
          body: {
            docId: this.docId,
            userNo: this.userNo
          }
        };
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        this.applyId = res.data.body.data;
        if (res.data.respHead.respCode === "000") {
          this.get_dateTime(res.data.body.data);
          this.get_talkMsg_list(1);
        } else {
          this.$toast(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        console.log(e);
        this.$toast("网络连接不稳定，请检查网络！");
      }
    },
    //处理iOS 微信客户端6.7.4 键盘收起页面未下移bug
    rebound() {
      /iphone|ipod|ipad/i.test(navigator.appVersion) &&
        document.addEventListener(
          "blur",
          () => {
            document.body.scrollIntoView(false);
          },
          true
        );
    },
    // 下拉刷新
    onRefresh() {
      //console.log(this.$refs);
      let div = this.$refs.im_list;
      this.get_talkMsg_list();
      // console.log(`div:${div}`);
      div.scrollTop = div.scrollHeight - div.offsetHeight;
      // this.go_to_bottom();
    },
    get_router() {
      if (!this.$route.params.item) {
        let item = JSON.parse(localStorage.getItem("im_item"));
        this.item = item;
        this.docId = item.docId;
        this.userNo = item.userNo;
        this.applyId = item.applyId;
        this.get_talkMsg_list();
        this.get_dateTime(item.applyId);
        document.title = JSON.parse(localStorage.getItem("im_item")).docName;
        return;
      }
      this.item = this.$route.params.item;
      document.title = this.$route.params.item.docName;
      this.docId = this.$route.params.item.docId;
      this.userNo = this.$route.params.item.userNo;
      this.applyId = this.$route.params.item.applyId;
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
      this.$toast("加载中···");
      try {
        let res = await util.ajax.post(Url, params);
        //console.log(res);
        if (res.data.respHead.respCode === "000") {
          this.$toast.clear();
          this.fuwu_time = res.data.body.data.dateTime;
          this.fuwu_times();
          if (res.data.body.data.dateTime > 0) {
            this.init_websocket();
            this.is_msg = true;
          }
        } else {
          this.$toast.clear();
          this.$toast(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        this.$toast.clear();
        this.$toast("网络连接不稳定，请检查网络！");
      }
    },
    // 计算到期时间
    fuwu_times() {
      let timer = setInterval(() => {
        if (this.fuwu_time <= 0) {
          this.fuwu_msg = "本次咨询已结束";
          this.is_msg = false;
          if (this.ws != null) {
            this.ws.onclose();
          }
          clearInterval(timer);
        } else if (this.fuwu_time > 0) {
          this.fuwu_msg = `本次咨询剩余时间 ${second_todo_date(
            this.fuwu_time
          )}`;
        }
        --this.fuwu_time;
      }, 1000);
    },
    // 获取历史记录
    async get_talkMsg_list(type) {
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
      this.$toast("加载中···");
      try {
        let res = await util.ajax.post(Url, params);
        //console.log(res);
        this.$toast.clear();
        if (res.data.respHead.respCode === "000") {
          this.post_msg_tag_read();
          ++this.pageNum;
          this.pull_Loading = false;
          if (type === 1) {
            document.title = res.data.body.data.docName;
          }
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
          this.$toast.clear();
          this.$toast(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        this.$toast("网络连接不稳定，请检查网络！");
      }
      this.isLoading = false;
      if (this.is_first === 1) {
        this.is_first = 2;
        this.go_to_bottom();
      }
    },
    //标记已读
    async post_msg_tag_read() {
      if (this.item && this.item.unReadCount === 0) {
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
      await util.ajax.post(Url, params);
    },
    // 初始化ws
    init_websocket(type) {
      let _this = this;
      let url = `${this.wsUrl_list[this.host1]}${this.userNo}/2`;
      let ws = new WebSocket(url);
      this.ws = ws;
      if ((type === 1 && ws.readyState === 0) || ws.readyState === 3) {
        return this.$toast(`当前网络不稳定,请切换网络,重新进页面!`);
      }
      ws.onopen = () => {
        // Web Socket 已连接上，使用 send() 方法发送数据
        this.enterMsg(1);
        // this.openws_timer(1);
        //console.log("连接成功...");
      };
      ws.onmessage = evt => {
        this.websocketonmessage(evt);
        //console.log("数据已接收...");
      };
      ws.onclose = function() {
        // 关闭 websocket
        _this.openws_timer(0);
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
      //recipient
      if (obj.recipient == 0) {
        let params = {
          docId: this.docId,
          userNo: this.userNo,
          recipient: 0
        };
        this.ws.send(JSON.stringify(params));
      }
      if (obj.msg === this.msg && obj.userNo === this.userNo) {
        this.msg_list.push({
          msgType: 1,
          msgBelonged: 0,
          msg: obj.msg,
          sendTime: new Date().getTime()
        });
        this.msg = "";
        this.go_to_bottom();
        this.is.btn = false;
        return;
      }
      this.msg_list.push(obj);
      this.go_to_bottom();
    },
    //发送消息
    enterMsg(type) {
      if (this.ws.readyState === 0 || this.ws.readyState === 3) {
        this.init_websocket(1);
        return;
      }
      if (this.ws === null) {
        return this.$toast(`网络错误,请刷新页面!`);
      }
      if (type === 1) {
        this.openws_timer(1);
        return;
      }
      if (this.msg === "") {
        return this.$toast("请填写内容！");
      }
      if (this.msg.length > 500) {
        return this.$toast("字数超上限，最多发送500字，请分批发送！");
      }
      let params = {
        applyId: this.applyId,
        docId: this.docId,
        userNo: this.userNo,
        msg: this.msg,
        msgType: 1,
        recipient: 1
      };
      this.ws.send(JSON.stringify(params));
      this.is.btn = true;
    },
    // 开启定时器发送心跳
    openws_timer(type) {
      if (type === 0) {
        clearInterval(this.timer);
        this.timer = null;
        return;
      }
      let msg = { msg: "心跳内容111", msgType: 2 };
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
        setTimeout(() => {
          this.$refs.im_list.scrollTop = this.$refs.im_list.scrollHeight;
        }, 200);
      });
    },
    edit_im_tips_show(index) {
      console.log(index);
      this.im_tips_show = true;
      this.msg_index = index;
    },
    // 确认取消
    cancel() {
      this.im_tips_show = false;
      this.is_over(1, this.msg_index);
    },
    // 结束咨询
    async is_over(isOut, index) {
      let Url = "",
        params = {
          reqHead: {
            functionId: "HWW002004003"
          },
          body: {
            applyId: this.item.applyId,
            docId: this.docId,
            userNo: this.userNo,
            isOut
          }
        };
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          this.msg_list[index || this.msg_index].msgType = 6;
          if (isOut === 1) {
            this.get_dateTime(this.msg_list[index || this.msg_index].applyId);
          }
        } else {
          this.$toast(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        this.$toast("网络连接不稳定，请检查网络！");
      }
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
    padding: 33px 16px;
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
          img {
            width: 120px;
          }
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
          img {
            width: 120px;
          }
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
    .im_tips {
      width: 100%;
      text-align: center;
      & > div {
        line-height: 20px;
      }
    }
    .im_tips_btn {
      & > button {
        border: 0;
        background-color: transparent;
        color: #fb6522;
        font-size: 14px;
        padding: 15px;
      }
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
  .van-uploader {
    padding: 0 8px;
    img {
      width: 28px;
      height: 28px;
    }
  }
  .im_footer_input {
    box-sizing: border-box;
    flex: 1;
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
    height: 100%;
    align-items: center;
    display: flex;
    flex: 0 0 15%;
    width: 15%;
    justify-content: center;
    text-align: center;
    & > button {
      background-color: transparent;
      color: #fb6522;
      font-size: 16px;
      border: 0;
    }
  }
  .im_tips_modal {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 85%;
    font-size: 16px;
    overflow: hidden;
    transition: 0.3s;
    background-color: #fff;
    transform: translate3d(-50%, -50%, 0);
    backface-visibility: hidden;
    z-index: 2013;
    text-align: center;
  }
  .im_tips_modal_overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
  }
  .im_tips_img {
    padding: 36px 0;
  }
  .im_tips_content {
    color: #333;
    font-size: 16px;
    margin-bottom: 48px;
  }
  .im_tips_btn {
    // height: 48px;
    // line-height: 48px;
    .im_tips_btn_2 {
      background-color: #fb6522;
      color: #fff;
    }
    .im_tips_btn_1 {
      color: #fb6522;
    }
    & > span {
      display: inline-block;
      width: 50%;
    }
  }
  .cancellation_wrap {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.2);
  }
  .cancellation_box {
    position: absolute;
    bottom: 30px;
    width: 90%;
    margin-left: 5%;
    background: #ffffff;
    border-radius: 8px;
    padding: 18px 0;
  }
  .pic {
    text-align: center;
  }
  .cancellation_box img {
    width: 50px;
    padding-top: 16px;
  }
  .cancellation_btn {
    font-size: 0.5rem;
    text-align: center;
    margin-top: 16px;
    padding-bottom: 10px;
  }
  .cancellation_msg_txt {
    text-align: center;
    margin-top: 18px;
    margin-bottom: 30px;
    font-size: 14px;
  }
  .cancellation_btn span {
    display: inline-block;
    width: 50%;
    padding: 3px 0;
    color: #fb6522;
  }
  .cancellation_btn .cancle {
    box-sizing: border-box;
    border-right: 1px solid lightgray;
  }
}
#upload {
  width: 300px;
  height: 300px;
  background-color: red;
  position: relative;
  right: 0;
  z-index: 999999;
}
</style>
