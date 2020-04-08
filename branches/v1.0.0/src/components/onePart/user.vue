<template>
  <div class="user">
    <section class="user-info">
      <van-cell-group>
        <van-row type="flex" justify="center">
          <img :src="this.hw_user_message.photo ? this.hw_user_message.photo : photo" alt>
        </van-row>
        <van-row type="flex" justify="center">
          <p style="font-size: 20px;font-weight: bold;">{{ this.hw_user_message.nickName }}</p>
        </van-row>
      </van-cell-group>
    </section>

    <section>
      <van-cell-group>
        <van-cell size="large" class="order" title="订单" is-link to="Order"/>
        <van-cell size="large" class="record" title="健康档案" is-link @click='toUpload'/>
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
      photo: require('../../assets/image/pic_user.png')
    };
  },
  created() {
    let userData = localStorage.getItem("hw_user_message");
    this.hw_user_message = JSON.parse(userData);
  },
  methods: {
  	toUpload(){
  		this.$router.push({
  			name: 'Upload',
  			params: {
  				type: 2
  			}
  		})
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