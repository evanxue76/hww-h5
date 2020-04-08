<template>
  <div class="msg_list_wrap">
    <!-- 系统消息 -->
    <div class="systemMsg_list" v-if="systemMsg">
      <div class="item" @click="go_to">
        <div class="item_icon">
          <div class="item_badge" v-if="unReadCount > 0">
            <div class="badge__info">{{ unReadCount }}</div>
          </div>
          <img src="./icon_msg_mail.png" alt />
        </div>
        <div class="item_content">
          <div class="content_time">
            <span class="title_type_1">系统消息</span>
            <span class="title_type_2">
              {{ systemMsg.createdAt | $_tudan_isToday }}
            </span>
          </div>
          <div class="txt_ellipsis title_type_3">{{ systemMsg.content }}</div>
        </div>
      </div>
    </div>
    <!-- 医生聊天 -->
    <div class="talkMsg_list">
      <div
        class="item"
        v-for="(item, index) in talkMsg_list"
        :key="index"
        @click="go_to_im(item)"
      >
        <div class="item_icon">
          <div class="item_badge" v-if="item.unReadCount > 0">
            <div class="badge__info">
              {{ item.unReadCount | f_unReadCount }}
            </div>
          </div>
          <img :src="item.docPhoto" alt />
        </div>
        <div class="item_content">
          <div class="content_time">
            <span class="title_type_1">{{ item.docName }}</span>
            <span class="title_type_2">{{ item.time | $_tudan_isToday }}</span>
          </div>
          <div class="txt_ellipsis title_type_3">{{ item.content }}</div>
        </div>
      </div>
    </div>
    <noMsg :msg="no_msg" v-if="is_no" />
  </div>
</template>

<script>
import util from "@/lib/util";
import { toast_loding } from "@/lib/public";
import noMsg from "@/components/common/no_msg";
export default {
  created() {
    if (JSON.parse(localStorage.getItem("hw_user_message")) != null) {
      this.user_info = JSON.parse(localStorage.getItem("hw_user_message"));
    }
    this.get_list();
  },
  mounted() {},
  components: { noMsg },
  data() {
    return {
      systemMsg: {}, //最新一条系统消息
      systemMsg_list: [], //系统消息
      talkMsg_list: [], //医生消息
      unReadCount: "",
      no_msg: "无消息",
      is_no: false,
      user_info: { managerNo: "" }
    };
  },
  methods: {
    // 获取医生用户聊天记录
    go_to_im(item) {
      this.$router.push({
        name: "Im",
        params: { item }
      });
    },
    // 跳转
    go_to() {
      this.$router.push({ name: "Msg_system_list" });
    },
    //   获取列表
    async get_list() {
      let Url = "";
      let params = {
        reqHead: {
          functionId: "HWW002003002"
        },
        body: {
          distinction: 0,
          userNo: this.user_info.managerNo //164 //64 77
        }
      };
      // 加载
      toast_loding(this);
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          if (
            res.data.body.data.systemMsg.length === 0 &&
            res.data.body.data.talkMsg.length === 0
          ) {
            this.is_no = true;
            this.$toast.clear();
            return;
          }
          this.systemMsg = res.data.body.data.systemMsg[0];
          this.systemMsg_list = res.data.body.data.systemMsg;
          this.unReadCount = res.data.body.data.unReadCount;
          this.talkMsg_list = res.data.body.data.talkMsg;
        } else {
          this.$toast(`${res.data.respHead.respMsg}`);
        }
        this.$toast.clear();
      } catch (e) {
        this.$toast.clear();
        console.log(e);
//      if (e.message.includes("Network")) {
          this.$toast("网络连接错误，请检查网络连接，再重新尝试!");
//      } else {
//        this.$toast(`error： ${e.message}`);
//      }
      }
    }
  },
  filters: {
    f_unReadCount(val) {
      return val > 99 ? "99+" : val;
    }
  }
};
</script>

<style lang="scss">
.msg_list_wrap {
  font-size: 12px;
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
  .item {
    display: flex;
    padding: 16px;
    align-items: center;
    box-sizing: border-box;
    border-bottom: 1px solid #eee;
    background-color: #fff;
    .item_icon {
      width: 40px;
      height: 40px;
      & > img {
        width: 100%;
        height: 100%;
      }
    }
    .item_content {
      display: flex;
      flex-direction: column;
      min-width: 0; //因为设置了white-space:nowrap，所以content没法收缩了，设置0后就有了固定尺寸就可以收缩了
      flex: 1;
      margin-left: 16px;
      .title_type_1 {
        font-size: 16px;
        color: #333;
      }
      .title_type_2 {
        font-size: 12px;
        color: #888;
      }
      .title_type_3 {
        font-size: 14px;
        color: #888;
      }
    }
    .item_badge {
      position: relative;
    }
    .badge__info {
      display: flex;
      justify-content: center;
      width: 24px;
      height: 24px;
      align-items: center;
      position: absolute;
      right: 0;
      top: -8px;
      color: #ffffff;
      font-size: 12px;
      box-sizing: border-box;
      padding: 0 3px;
      border-radius: 16px;
      background-color: #e95f5f;
      transform: translateX(50%);
    }
    .content_time {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
  }
  .txt_ellipsis {
    width: 99%;
    overflow: hidden; /*超出部分隐藏*/
    white-space: nowrap; /*不换行*/
    text-overflow: ellipsis; /*超出部分文字以...显示*/
  }
}
</style>
