<template>
  <div class="serviceIntroduce">
    <img :src="enjoyPic" v-if="packageType" />
    <img :src="standPic" v-if="!packageType" />
    <p class="replace" @click="replacePackage">更换套餐</p>
    <div
      class="confirm"
      @click="go_to"
      :class="{ standard_active: !packageType }"
    >
      确定
    </div>
    <div class="bg" v-if="show">
      <div class="choicePackage">
        <p class="choiceTitle">选择套餐</p>
        <div @click="choicePackage(1)">
          <img :src="enjoyIcon" :class="{ active: flag }" />
        </div>
        <div @click="choicePackage(2)">
          <img :src="standTcon" :class="{ active: flags }" />
        </div>
        <div class="btn">
          <div class="cancle" @click="cancle">取消</div>
          <div class="choiceConfirm" @click="choiceConfirm">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      flag: false,
      flags: false,
      show: false,
      packageType: true,
      enjoyPic: require("../../assets/image/pic_servicedetail_high.png"),
      enjoyIcon: require("../../assets/image/pic_package_highlevel.png"),
      standPic: require("../../assets/image/pic_servicedetail_standard.png"),
      standTcon: require("../../assets/image/pic_package_standard.png")
    };
  },
  methods: {
    go_to() {
      this.$router.push({
        name: "EnjoyPackage",
        params: { packageType: this.packageType }
      });
    },
    replacePackage() {
      this.show = true;
    },
    choicePackage(item) {
      if (item == 1) {
        this.flag = true;
        this.flags = false;
      } else if (item == 2) {
        this.flag = false;
        this.flags = true;
      } else {
        return;
      }
    },
    cancle() {
      this.show = false;
      this.flag = false;
      this.flags = false;
    },
    choiceConfirm() {
      if (this.flag == true) {
        this.packageType = true;
      } else if (this.flags == true) {
        this.packageType = false;
      }
      this.show = false;
      this.flag = false;
      this.flags = false;
    }
  }
};
</script>

<style>
	.serviceIntroduce{
		overflow: auto;
	}
.serviceIntroduce img {
  width: 100%;
}
.serviceIntroduce .replace {
  font-size: 15px;
  color: #fb6522;
  margin-left: 5%;
  margin-top: -20px;
  margin-bottom: 48px;
  font-weight: bold;
}
.serviceIntroduce .confirm {
  position: fixed;
  bottom: 0;
  text-align: center;
  font-size: 16px;
  width: 100%;
  height: 48px;
  line-height: 48px;
  background: #e0bf6f;
  color: #ffffff;
}
.serviceIntroduce .bg {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
}
.serviceIntroduce .choicePackage {
  width: 90%;
  text-align: center;
  font-size: 16px;
  background: #ffffff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.serviceIntroduce .choiceTitle {
  padding-top: 24px;
}
.serviceIntroduce .choicePackage img {
  width: 80%;
  margin-top: 16px;
  border-radius: 5px;
}
.serviceIntroduce .btn {
  width: 100%;
  height: 48px;
  line-height: 48px;
  margin-top: 20px;
  text-align: center;
}
.serviceIntroduce .btn div {
  display: inline-block;
  width: 50%;
}
.serviceIntroduce .cancle {
  color: #fb6522;
  border-top: 1px solid #eee;
}
.serviceIntroduce .choiceConfirm {
  background: #fb6522;
  border-top: 1px solid #fb6522;
  color: #ffffff;
}
.serviceIntroduce .active {
  box-sizing: border-box;
  border: 1px solid #fb6522;
}
.serviceIntroduce .standard_active {
  background-color: #fb6522;
}
</style>
