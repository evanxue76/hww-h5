<template>
  <div class="binding_tel_box">
    <!-- 已绑定 -->
    <div class="already_box" v-if="is.already">
      <div class="already_tips">您已绑定的手机号码</div>
      <div class="already_tel">{{ tel }}</div>
      <div class="already_btn" @click="replace">
        <button>更换手机号码</button>
      </div>
    </div>
    <!-- 未绑定 -->
    <div class="binding_box" v-if="is.binding">
      <div class="bd_input">
        <p class="bd_title">手机号</p>
        <input
          type="text"
          placeholder="请输入手机号"
          v-model="hwMobile"
          maxlength="11"
          @keyup="proving1('integral')"
        />
      </div>
      <div class="bd_input">
        <p class="bd_title">验证码</p>
        <input
          type="text"
          placeholder="请输入验证码"
          v-model="code"
          maxlength="6"
        />
        <button
          class="hqyzm"
          @click="huoquyzm"
          :class="{ huoquctive: is.code }"
          :disabled="is.code"
        >
          {{ codeMsg }}
        </button>
      </div>
      <div class="bd_tips">
        为更好给您提供持续的心脏健康管理服务，请绑定手机号码。
      </div>
      <div class="bd_btn" :class="{ bd_btn_active: is.bdi }" @click="bd_mobile">
        <button :disabled="is.bdi">{{ bd_btn_msg }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import util from "@/lib/util";
export default {
  created() {
    let userData = localStorage.getItem("hw_user_message");
    this.hw_user_message = JSON.parse(userData);
    if (this.$route.params.type == 1) {
      this.is.already = true;
      document.title = "手机号码";
      this.tel = this.$route.params.mobil;
    } else {
      this.is.binding = true;
      document.title = "绑定手机号码";
    }
  },
  components: {},
  data() {
    return {
      tel: "",
      hw_user_message: {},
      hwMobile: "",
      code: "",
      is: {
        already: false,
        bdi: false,
        binding: false,
        code: false
      },
      bd_btn_msg: "绑定",
      codeMsg: "获取验证码"
    };
  },
  methods: {
    // 绑定手机
    async bd_mobile() {
      if (!/^[1][0-9]{10}$/.test(this.hwMobile)) {
        this.$toast("请输入正确的手机号码");
        return;
      }
      if (this.is.code == null) {
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
      this.is.bdi = true;
      this.bd_btn_msg = "绑定中···";
      this.$toast("加载中···");
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          this.$toast("绑定成功");
          this.$router.push({ name: "HomePage" });
        } else {
          this.bd_btn_msg = "绑定";
          this.is.bdi = false;
          this.code = "";
          this.$toast(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        console.log(e);
        this.code = "";
        this.bd_btn_msg = "绑定";
        this.is.bdi = false;
        this.$toast("网络连接不稳定，请检查网络！");
      }
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
      this.$toast("加载中···");
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          this.is.code = true;
          this.$toast("发送成功");
          let second = 60;
          this.codeMsg = `重新获取(${second})`;
          let timer = setInterval(() => {
            second = second - 1;
            this.codeMsg = `重新获取(${second})`;
            if (second === 0) {
              clearInterval(timer);
              this.codeMsg = "获取验证码";
              this.is.code = false;
            }
          }, 1000);
        } else {
          this.$toast(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        console.log(e);
        this.$toast("网络连接不稳定，请检查网络！");
      }
    },
    //正则校验
    proving1() {
      this.hwMobile = this.hwMobile.replace(/[^\.\d]/g, "");
      this.hwMobile = this.hwMobile.replace(".", "");
    },
    replace() {
      this.is.already = false;
      this.is.binding = true;
      document.title = "更换手机号码";
    }
  }
};
</script>

<style lang="scss">
.binding_tel_box {
  background-color: #fff;
  height: 100%;
  .already_box {
    color: #333;
    text-align: center;
    padding-top: 50px;
    .already_tips {
      font-size: 16px;
      padding: 20px 0;
    }
    .already_tel {
      font-size: 24px;
    }
    .already_btn {
      position: fixed;
      left: 0;
      bottom: 0;
      text-align: center;
      width: 100%;
      & > button {
        background-color: #fb6522;
        color: #fff;
        font-size: 16px;
        height: 48px;
        line-height: 48px;
        width: 100%;
        border: 0;
      }
    }
  }
  .binding_box {
    position: relative;
    width: 100%;
    color: #333;
    background-color: #fff;
    padding: 24px 44px;
    box-sizing: border-box;
    .bd_input {
      font-size: 24px;
      position: relative;
      margin-top: 50px;
      border-bottom: 1px solid #ccc;
      box-sizing: border-box;
      .bd_title {
        font-size: 16px;
      }
      input {
        border: 0;
        padding-left: 16px;
        // padding-bottom: 13px;
        width: 100%;
        height: 65px;
        line-height: 65px;
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
      top: 46px;
      font-size: 14px;
      color: #fb6522;
      border: 0;
      background-color: transparent;
    }
    .huoquctive {
      color: #ccc;
    }
    .bd_tips {
      font-size: 14px;
      line-height: 20px;
      margin-top: 44px;
    }

    .bd_btn {
      position: fixed;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      color: #fff;
      font-size: 16px;
      height: 48px;
      line-height: 48px;
      box-sizing: border-box;
      background-color: #ffffff;
      text-align: center;
      margin-bottom: 12px;
      & > button {
      	display: inline-block;
      	width: 50%;
      	height: 36px;
      	line-height: 36px;
      	border-radius: 6px;
        background-color: #fb6522;
        border: none;
      }
    }
    .bd_btn_active {
      background-color: #ccc;
    }
  }
  .bd_btn_active {
    background-color: #ccc;
  }
}
</style>
