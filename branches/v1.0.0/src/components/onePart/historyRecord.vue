<template>
  <div class="history_record">
    <van-collapse v-if="isShow" v-model="activeName" accordion @change="onChange(realOrderTime[$event],$event)">
      <van-collapse-item v-for='(month,index) in orderTime' :key='index' :title="orderTime[index]">
        <van-list
          v-model="loading"
          :finished="finished"
          @load="onLoad(realOrderTime[index])"
          :offset="10"
          loading-text="正在加载"
          :finished-text="finishEnd"
        >
          <section class="reportList">
            <div class="item" v-for="(item,index) in reportList" :key="index">
              <div class="history_content" @click="ecgDetails(item.id)">
                <div class="scoreResult">
                  <div>{{item.ecgElectrocardioDetail.heartStatus}}</div>
                  <div class="heart_reat">
                    <van-icon name="like" color="#ff0000"/>
                    <span>{{item.heartRate}} bpm</span>
                  </div>
                </div>
                <div class="ecgPic">
                  <img :src="item.fileImagePath">
                </div>
                <div class="recordTime">
                  <div>{{item.takeTime | dateFilter}}</div>
                  <div>时长：{{item.length}} 秒</div>
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
    	isShow : true,
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
  created(){
  	let userData = localStorage.getItem('hw_user_message')
	  this.hw_user_message = JSON.parse(userData)
  },
  mounted(){
  	this.getDate();
  },
  methods: {
    getDate() {
      let date = new Date();
      let month = date.getMonth() + 2;
      let year = date.getFullYear();
      let length = this.hw_user_message.regMonth
      console.log(length)
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
    onChange(date){
      this.loading = true;//下拉加载中
      this.finished = false;//下拉结束
      this.reportList = [];
      this.pageNum = 0;
      if(this.loading && date != undefined){
          this.onLoad(date);
      }
    },
    onLoad(date) {
      let self = this;
      let Url = "";
      let params = {
        reqHead: {
          functionId: "HWW002001006"
        },
        body: {
          userNo: this.hw_user_message.userNo,
//        userNo: 990,
          beginTime: date + "-01",
          pageSize: 6,
          pageNum: this.pageNum
        }
      };
      util.ajax.post(Url, params).then(res => {
      	//console.log(res)
      	if (res.data.body.data.total == 0) {
      			self.finishEnd = "暂无数据";
      			self.finished = true
      			self.loading = false
//    			this.isShow = false;
      	} else {
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
    ecgDetails(id) {
    	localStorage.setItem('hw_reportId', id)
      this.$router.push({
        name: "EcgReport"
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

<style scoped lang="scss">
.history_record {
  height: 100%;
  font-size: 16px;
  background-color: #f2f2f2;
  .pic-none{
  	text-align: center;
  	img {
  		width: 50%;
  		margin-top: 20%;
  	}
  }
  .reportList {
    .item {
      background: #fff;
      margin: -15px;
      padding: 8px 15px;
      border: 15px solid #f2f2f2;

      .history_content {
        .scoreResult {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
          /*height: 16px;*/
          line-height: 16px;
          .heart_reat{
          	min-width: 67px;
          }
          span {
            vertical-align: top;
            margin-left: 6px;
          }
        }
        .recordTime {
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
  }
}
</style>