<template>
  <div class="memberServices">
    <!-- <div class="headerTotal">
	      <van-nav-bar class="headerNav" title="服务开通" left-text="返回" left-arrow @click-left="onClickLeft">
		  </van-nav-bar>
    </div>-->
    <div class>
      <img :src="pic" :class="{ active: openService }" />
      <div class="btn" @click="openServices" v-if="num == 1">立即开通</div>
      <div class="overdue" v-if="data.expire">
        {{ data.expire | getDatesFilter }}
      </div>
      <div class="standBtn" v-if="num == 2">
        <div class="renew" @click="clickRenew">续费</div>
        <div class="upgrade" @click="upgrade">升级为尊享套餐</div>
      </div>
      <div class="btn" @click="enjoyRenew" v-if="num == 3">续费</div>
    </div>
  </div>
</template>

<script>
import util from "@/lib/util";
import { getDates } from "@/lib/time";
import { toast_loding } from "@/lib/public";
export default {
  data() {
    return {
      pic: require("../../assets/image/pic_servicedetail.png"),
      openService: true,
      num: 1,
      data: {},
      hw_user_message: {}
    };
  },
  created() {
  	let userData = localStorage.getItem('hw_user_message')
	  this.hw_user_message = JSON.parse(userData)
    this.obtainData();
    this.pro()
  },
  methods: {
  	pro(){
  	 	console.log(this.$store.state.data.userNo)
  	},
    onClickLeft() {
      history.go(-1);
    },
    async obtainData() {
      let Url = "";
      let params = {
        reqHead: {
          functionId: "HWW002010005"
        },
        body: {
          managerNo: this.hw_user_message.managerNo //50  1   143
        }
      };
      toast_loding(this);
      try {
        let res = await util.ajax.post(Url, params);
        if (res.data.respHead.respCode === "000") {
        	this.$toast.clear();
          this.data = res.data.body.data;
          if (this.data.action == "new") {
            this.num = 1;
          } else {
            this.data.currentPacket === 2 ? (this.num = 2) : (this.num = 3);
            if (new Date().valueOf() > this.data.expire) {
              this.num = 1;
            }
          }
        } else {
          this.$toast(`${res.data.respHead.respMsg}`);
        }
        
      } catch (e) {
        console.log(e);
        this.$toast.clear();
//      if (e.message.includes("Network")) {
          this.$toast("网络连接错误，请检查网络连接，再重新尝试!");
//      } else {
//        this.$toast(`error： ${e.message}`);
//      }
      }
    },
    openServices() {
      this.$router.push({
        name: "OpenServices"
      });
    },
    clickRenew() {
      this.$router.push({
        name: "StandRenew",
        params: { hw_service_data: this.data }
      });
    },
    upgrade() {
      this.$router.push({
        name: "UpgradePackage"
      });
    },
    enjoyRenew() {
      this.$router.push({
        name: "EnjoyPackage",
        params: { hw_service_data: this.data }
      });
    }
  },
  filters: {
    getDatesFilter(val) {
      if (new Date().valueOf() > val) {
        return "当前套餐已到期";
      }
      return `当前套餐将在${getDates(val)}到期`;
    }
  }
};
</script>

<style>
.memberServices img {
  width: 100%;
  margin-bottom: 25px;
}
.memberServices .active {
  margin-bottom: 70px;
}
.memberServices .btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  line-height: 48px;
  position: fixed;
  bottom: 0;
  background: #fb6522;
  color: #fff;
  text-align: center;
}
.memberServices .overdue {
  position: fixed;
  bottom: 48px;
  width: 100%;
  height: 40px;
  line-height: 40px;
  background: #f2f2f2;
  color: #888;
  font-size: 14px;
  padding-left: 3%;
}
.memberServices .standBtn {
  width: 100%;
  height: 48px;
  line-height: 48px;
  font-size: 16px;
  position: fixed;
  bottom: 0;
  text-align: center;
}
.memberServices .standBtn div {
  display: inline-block;
  width: 50%;
}
.memberServices .renew {
  color: #fb6522;
  background: #ffffff;
}
.memberServices .upgrade {
  background: #fb6522;
  color: #ffffff;
}
</style>
