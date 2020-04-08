<template>
  <div class="ecg_interpretation_wrap">
    <div class="item">
      <div class="p">
        <img :src="photo" v-if="photo" />
        <img src="./pic_doctor.png" v-else />
      </div>
      <div class="info">
        <span class="title">{{ info.doctorName }}</span>
        <span class="date">{{ info.createdAt | $_tudan_isToday }}</span>
      </div>
    </div>
    <section class="conent">{{ info.opinion }}</section>
    <!-- <footer class="footer">电子签名：XXXXXXXXXX</footer> -->
  </div>
</template>

<script>
import util from "@/lib/util";
export default {
  created() {
    this.get_router();
  },
  components: {},
  data() {
    return {
      info: {},
      photo: ""
    };
  },
  methods: {
    get_router() {
      if (!this.$route.params.id) {
        return this.$toast("参数丢失，请返回上级页面，重新操作！");
      }
      this.ecg_interpretation(this.$route.params.id);
    },
    async ecg_interpretation(id) {
      let Url = "";
      let params = {
        reqHead: {
          functionId: "HWW002001005"
        },
        body: {
          id
        }
      };
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          this.info = res.data.body.data.ecgElectrocardioAnalysis;
          this.photo = res.data.body.data.photo;
        } else {
          this.$toast(`${res.data.respHead.respMsg}`);
        }
        this.$toast.clear();
      } catch (e) {
        this.$toast("网络连接不稳定，请检查网络！");
      }
    }
  }
};
</script>

<style lang="scss">
.ecg_interpretation_wrap {
  padding: 16px;
  font-size: 12px;
  height: 100%;
  background-color: #fff;
  .item {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    .p {
      height: 40px;
      width: 40px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info {
      display: flex;
      flex-direction: column;
      margin-left: 16px;
      height: 40px;
    }
    .title {
      color: #333;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .date {
      color: #888;
      font-size: 14px;
    }
  }
  .conent {
    font-size: 16px;
    color: #333;
    margin-bottom: 42px;
    line-height: 26px;
  }
  .footer {
    font-size: 14px;
    color: #888;
  }
}
</style>
