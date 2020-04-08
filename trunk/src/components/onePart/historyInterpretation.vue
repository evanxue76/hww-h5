<template>
  <div class="history_record">
    <van-collapse
      v-if="isShow"
      v-model="activeName"
      accordion
      @change="onChange(realOrderTime[$event],$event)"
    >
      <van-collapse-item v-for="(month,index) in orderTime" :key="index" :title="orderTime[index]">
        <van-list
          v-model="loading"
          :finished="finished"
          @load="onLoad(realOrderTime[index])"
          :offset="10"
          loading-text="正在加载"
          :finished-text="finishEnd"
        >
          <section class="reportList">
            <div
              class="item"
              :class="{itemActive:item.isRead===0}"
              v-for="(item,index) in reportList"
              :key="index"
              @click="ecgDetails(item,item.id)"
            >
              <div class="history_content">
                <div class="scoreResult">
                  <!-- <div v-if="item.ecgElectrocardioDetail.examine == -1">干扰数据，请重新测量</div> -->
                  <div class="heart_reat">
                    <span>{{item.interpretationResultsShort}}</span>
                  </div>
                  <div></div>
                </div>
                <div class="ecgPic">
                  <img :src="item.img" />
                </div>
                <div class="recordTime">
                  <div>{{item.applicationTime | dateFilter}}</div>
                </div>
              </div>
            </div>
          </section>
        </van-list>
      </van-collapse-item>
    </van-collapse>

    <div v-else class="pic-none">
      <img :src="picNone" alt="无记录" />
    </div>
  </div>
</template>

<script>
import { formatDate } from "../../lib/time";
import util from "../../lib/util";

export default {
  data() {
    return {
      picNone: require("../../assets/image/pic_none.png"),
      isShow: true,
      activeName: 0,
      loading: false,
      finished: false,
      reportList: [],
      id: "",
      pageNum: 0,
      item: {},
      orderTime: [],
      realOrderTime: [],
      hw_user_message: {},
      finishEnd: "暂无数据" // 暂无数据
    };
  },
  created() {
    let userData = localStorage.getItem("hw_user_message");
    this.hw_user_message = JSON.parse(userData);
  },
  mounted() {
    this.getDate();
  },
  methods: {
    getDate() {
      let date = new Date();
      let month = date.getMonth() + 2;
      let year = date.getFullYear();
      let length = this.hw_user_message.regMonth;
      console.log(length);
      for (let i = 0; i < length; i++) {
        let fullY;
        let fullX;
        month--;
        if (month <= 0) {
          month = 12;
          year--;
        }
        if (month < 10) {
          fullY = year + "年0" + month + "月";
          fullX = year + "-0" + month;
        } else {
          fullY = year + "年" + month + "月";
          fullX = year + "-" + month;
        }
        this.orderTime.push(fullY);
        //      console.log(this.orderTime)
        this.realOrderTime.push(fullX);
      }
    },
    onChange(date) {
      this.loading = true; //下拉加载中
      this.finished = false; //下拉结束
      this.reportList = [];
      this.pageNum = 0;
      if (this.loading && date != undefined) {
        this.onLoad(date);
      }
    },
    onLoad(date) {
      let self = this;
      let Url = "";
      let params = {
        reqHead: {
          functionId: "HWW002013003"
        },
        body: {
          managerNo: this.hw_user_message.managerNo,
          //        userNo: 990,
          beginTime: date + "-01",
          pageSize: 6,
          pageNum: this.pageNum
        }
      };
      util.ajax.post(Url, params).then(res => {
        console.log(res);
        if (res.data.body.data.total == 0) {
          self.finishEnd = "暂无数据";
          self.finished = true;
          self.loading = false;
          //    			this.isShow = false;
        } else {
          res.data.body.data.datas.map(i => {
            if (i.ecgImageIndexPath) {
              i.ecgImageIndexPath = JSON.parse(i.ecgImageIndexPath);
              i.img = i.ecgImageIndexPath.fb6522;
            } else {
              i.img = "";
            }
          });
          self.reportList = self.reportList.concat(res.data.body.data.datas);
          if (self.reportList.length == 0) {
            self.finishEnd = "暂无数据";
          } else {
            self.finishEnd = "";
          }
          self.loading = false;
          self.pageNum++;
          if (self.reportList.length >= res.data.body.data.total) {
            self.finished = true;
          }
        }
      });
    },
    ecgDetails(row, id) {
      localStorage.setItem("hw_reportId", id);
      this.$router.push({
        name: "EcgReport",
        params: { isRead: row.isRead, report_id: id }
      });
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
.history_record {
  height: 100%;
  font-size: 16px;
  background-color: #fff;
  .pic-none {
    text-align: center;
    img {
      width: 50%;
      margin-top: 20%;
    }
  }
  .reportList {
    .item {
      margin: -15px;
      padding: 8px 15px;
      // border: 15px solid #f2f2f2;

      .history_content {
        background: #fff3e3;
        margin-bottom: 8px;
        padding: 8px 16px;
        border-radius: 5px;

        .scoreResult {
          margin-left: 10px;
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
          /*height: 16px;*/
          line-height: 16px;
          .heart_reat {
            min-width: 67px;
            color: #333;
            font-size: 14px;
            overflow: hidden;
            white-space: nowrap;
            width: 95%;
            text-overflow: ellipsis;
            padding: 8px 0;
          }
          span {
            vertical-align: top;
            margin-left: 6px;
          }
        }
        .recordTime {
          color: #888;
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          height: 16px;
          line-height: 16px;
        }
        .ecgPic {
          margin-bottom: 8px;
          img {
            height: 100px;
            width: 100%;
          }
        }
      }
    }
    .itemActive {
      position: relative;
    }
    .itemActive:before {
      content: "";
      width: 8px;
      height: 8px;
      background-color: #fa2b2e;
      border-radius: 50%;
      position: absolute;
      top: 22px;
      left: 26px;
    }
  }
}

.history_record .van-icon-arrow:before {
  color: #b2b2b2;
}
</style>