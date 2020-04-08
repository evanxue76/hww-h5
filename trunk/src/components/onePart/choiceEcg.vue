<template>
  <div class="choiceEcg">
    <div class="ecgContent">
      <div class="commentary">
        为方便医生了解您的情况，请选择健康资料
      </div>
      <div class="explain">
        已将导联脱落或干扰波等无法分析的心电图进行过滤
      </div>
      <van-list
        v-model="loading"
        :finished="finished"
        @load="onLoad"
        :offset="10"
        loading-text="正在加载"
        finished-text="没有更多数据了"
      >
        <section class="reportList">
          <div
            class="item"
            v-for="(item, index) in reportList"
            :key="index"
            @click="ecgDetails(item)"
            :class="{ active: item.selected }"
          >
            <div class="history_content">
              <div class="scoreResult">
                <div class="ecgResult">
                  {{item.ecgElectrocardioDetail.ecgResultBrief}}
                </div>
                <div>
                  <van-icon name="like" />
                  <span>{{ item.heartRate }}bpm</span>
                </div>
              </div>

              <div class="ecgPic">
                <img :src="item.fileImagePath" />
              </div>
              <div class="recordTime">
                <div>{{ item.takeTime | dateFilter }}</div>
                <div>时长：{{ item.length }}秒</div>
              </div>
            </div>
          </div>
        </section>
      </van-list>
    </div>
    <div class="submit" @click="ecgConfig">
      <span>确定</span>
    </div>
  </div>
</template>

<script>
import { formatDate } from "../../lib/time";
import util from "../../lib/util";

export default {
  data() {
    return {
      loading: false,
      finished: false,
      reportList: [],
      id: "",
      pageNum: 0,
      item: {},
      hw_user_message: {}
    };
  },
  created(){
  	let userData = localStorage.getItem('hw_user_message')
	  this.hw_user_message = JSON.parse(userData)
  },
  methods: {
    onLoad() {
      let self = this;
      let Url = "";
      let params = {
        reqHead: {
          functionId: "HWW002001002"
        },
        body: {
          userNo: this.hw_user_message.userNo,     //943
          pageSize: 5,
          pageNum: this.pageNum
        }
      };
      util.ajax.post(Url, params).then(function(res) {
      	console.log(res)
        self.reportList = self.reportList.concat(res.data.body.data.datas);
        self.addField(self.reportList);
        self.loading = false;
        self.pageNum++;
        if (self.reportList.length >= res.data.body.data.total) {
          self.finished = true;
        }
      });
    },
    addField(reportList) {
      let self = this;
      reportList.map(function(item) {
        self.$set(item, "selected", false);
      });
    },
    ecgDetails(item) {
      this.reportList.forEach(item => {
        item.selected = false;
      });
      this.item = item;
      item.selected = true;
      this.id = item.id;
    },
    ecgConfig() {
      if (this.id == "") {
        this.$toast('请选择心电')
      } else {
      	let ecg_data = JSON.stringify(this.item)
      	localStorage.setItem('ecg_data',ecg_data)
        this.$router.push({
//      	name: 'Upload',
//      	params:{type:1}
        	name: 'ApplyUnscramble'
        })
      }
    }
  },
  filters: {
    dateFilter: function(val) {
      return formatDate(val);
    }
  }
};
</script>

<style lang="scss">
.choiceEcg {
  background: #f2f2f2;
}
.choiceEcg .ecgContent {
  height: 100%;
  background: #eeeeee;
}
.commentary {
  font-size: 14px;
  text-align: left;
  width: 92%;
  margin-left: 4%;
  padding: 8px 0 4px;
}
.reportList {
  padding-bottom: 50px;
  .item {
    width: 92%;
    margin-left: 4%;
    background: #ffffff;
    margin-top: 8px;
    border-radius: 6px;
    display: flex;
    align-items: center;

    .history_content {
      width: 90%;
      margin-left: 5%;

      .scoreResult {
        display: flex;
        justify-content: space-between;
        padding-top: 8px;
        padding-bottom: 8px;
        font-size: 14px;
        .van-icon-like {
          color: #e95f5f;
        }
        .ecgResult {
          width: 70%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        span {
          vertical-align: top;
          margin-left: 6px;
        }
      }
      .recordTime {
        display: flex;
        justify-content: space-between;
        padding-bottom: 8px;
        font-size: 12px;
      }

      .ecgPic {
        padding-bottom: 8px;
        img {
          width: 100%;
          height: 70px;
        }
      }
    }
  }
}

.reportList .van-checkbox__icon .van-icon {
  background: #ffffff;
}
.reportList .van-checkbox__icon--checked .van-icon {
  background: #1989fa;
}
.reportList .van-checkbox {
  margin-left: 15px;
}
.reportList .active {
  border: 1px solid #fb6522;
}
.choiceEcg .submit {
  font-size: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  line-height: 60px;
  color: #ffffff;
  background: #ffffff;
  text-align: center;
}
.choiceEcg .submit span{
	display: inline-block;
	width: 50%;
	height: 36px;
	line-height: 36px;
	background: #fb6522;
	border-radius: 6px;
}
.choiceEcg .explain{
	font-size: 13px;
	width: 92%;
  margin-left: 4%;
	color: #999B9C;
}
</style>
