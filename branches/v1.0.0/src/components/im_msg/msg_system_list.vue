<template>
  <div class="msg_system_list_wrap">
    <div class="msg_system_list">
      <div
        class="item"
        v-for="(item, index) in systemMsg_list"
        :key="index"
        @click="is_value(item)"
      >
        <div class="item_time">{{ item.createdAt | $_tudan_isToday }}</div>
        <div class="item_content">
          <div class="title_type_1">
            {{ item.type | type_filter }}
            <div class="item_tips" v-if="item.readyFlag === 0"></div>
          </div>
          <div class="title_type_2">{{ item.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from "@/lib/util";
import { toast_loding } from "@/lib/public";
export default {
  created() {
    if (JSON.parse(localStorage.getItem("hw_user_message")) != null) {
      this.user_info = JSON.parse(localStorage.getItem("hw_user_message"));
    }
    this.get_list();
  },
  components: {},
  data() {
    return {
      systemMsg_list: []
    };
  },
  methods: {
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
          this.systemMsg_list = res.data.body.data.systemMsg;
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
    },
    is_value(item) {
      if (item.readyFlag === 0) {
        this.post_msg_tag_read(item);
      }
      //分析完成
      if (item.type === 2) {
        this.look_ecg_report(item.sourceId);
        return;
      }
      //心电解读
      if (item.type === 10) {
        this.ecg_interpretation(item.sourceId);
        return;
      }
    },
    //心电解读
    ecg_interpretation(id) {
      this.$router.push({ name: "Ecg_interpretation", params: { id } });
    },
    //心电报告
    look_ecg_report(id) {
      localStorage.setItem("hw_reportId", id);
      this.$router.push({
        name: "EcgReport"
      });
    },
    //标记已读
    async post_msg_tag_read(item) {
      let Url = "";
      let params = {
        reqHead: {
          functionId: "HWW002003003"
        },
        body: {
          distinction: 0,
          id: item.id
        }
      };

      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          this.get_list();
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
    }
  },
  filters: {
    type_filter(val) {
      let obj = {
        1: "图文咨询",
        2: "分析完成",
        3: "心电分析申请",
        4: "服务结束",
        5: "服务开通",
        6: "心电详细分析报告",
        7: "服务升级",
        8: "服务续费",
        9: "服务续费",
        10: "心电解读"
      };
      return obj[val] || "未定义";
    }
  }
};
</script>

<style lang="scss">
.msg_system_list_wrap {
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
  font-size: 12px;
  .msg_system_list {
    height: 100%;
    overflow: auto;
    .item {
      display: flex;
      flex-direction: column;
      padding: 16px;
      //   margin-bottom: 32px;
      .item_time {
        color: #888;
        font-size: 12px;
        text-align: center;
        margin-bottom: 8px;
      }
      .item_content {
        background-color: #fff;
        padding: 16px;
      }

      .title_type_1 {
        color: #333;
        font-size: 16px;
        margin-bottom: 17px;
        display: flex;
      }
      .item_tips {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #e95f5f;
        margin-left: 4px;
        margin-top: -6px;
      }
      .title_type_2 {
        color: #888;
        font-size: 14px;
        margin-bottom: 2px;
      }
    }
  }
}
</style>
