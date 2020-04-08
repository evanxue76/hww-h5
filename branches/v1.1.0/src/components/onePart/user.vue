<template>
  <div class="user">
    <section class="user-info">
      <van-cell-group>
        <van-row type="flex" justify="center">
          <img
            :src="
              this.hw_user_message.photo ? this.hw_user_message.photo : photo
            "
            alt
          />
        </van-row>
        <van-row type="flex" justify="center">
          <p style="font-size: 20px;font-weight: bold;">
            {{ this.hw_user_message.nickName }}
          </p>
        </van-row>
      </van-cell-group>
    </section>

    <section>
      <van-cell-group>
        <van-cell size="large" class="order" title="订单" is-link to="Order" />
        <van-cell
          size="large"
          class="record"
          title="健康档案"
          is-link
          @click="toUpload"
        />
        <van-cell
          size="large"
          class="order"
          title="手机号"
          is-link
          :value="mobil"
          @click="go_to_tel"
        />
      </van-cell-group>
    </section>
  </div>
</template>

<script>
import util from "../../lib/util";

export default {
  data() {
    return {
      hw_user_message: {},
      mobil: "",
      photo: require("../../assets/image/pic_user.png")
    };
  },
  created() {
    let userData = localStorage.getItem("hw_user_message");
    this.hw_user_message = JSON.parse(userData);
    this.get_mobil();
  },
  methods: {
    toUpload() {
      this.$router.push({
        name: "HealthFile",
        params: {
          type: 2
        }
      });
    },
    // 跳转绑定页面
    go_to_tel() {
      this.$router.push({
        name: "Binding_tel",
        params: {
          type: this.mobil === "未绑定" ? 2 : 1,
          mobil: this.mobil === "未绑定" ? "" : this.mobil
        }
      });
    },
    // 查询用户绑定手机号
    async get_mobil() {
      let Url = "",
        params = {
          reqHead: {
            functionId: "HWW002014003"
          },
          body: {
            userNo: this.hw_user_message.userNo
          }
        };
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          this.mobil = res.data.body.data ? res.data.body.data : "未绑定";
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
    }
  }
};
</script>

<style>
.user-info {
  display: flex;
  justify-content: center;
}

.user-info img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.user-info > div {
  height: 130px;
  padding-top: 20px;
  line-height: 40px;
}

.van-cell--large .van-cell__title {
  font-weight: bold;
}
</style>
