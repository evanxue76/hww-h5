<template>
  <div class="doctor_list">
    <van-search
      placeholder="请输入姓名、医院、地区搜索医生"
      v-model="doctorName"
      background="#f2f2f2"
      @search="onSearch"
    />

    <div class="choice_box">
      <div class="item" @click="s_filter(1)">
        <span>
          {{ area_name }}
          <i class="item-i" :class="{ i_up: is.region, i_dow: !is.region }"></i>
        </span>
      </div>
      <div class="item" @click="s_filter(2)">
        <span>
          {{ level_name }}
          <i
            class="item-i"
            :class="{ i_up: is.level_box, i_dow: !is.level_box }"
          ></i>
        </span>
      </div>
    </div>
    <!-- 级别 -->
    <div class="level_box" v-if="is.level_box">
      <div
        class="item"
        :class="{ itemActive: i.code }"
        v-for="(i, index) in level_list"
        :key="index"
        @click="level_cut(i)"
      >
        {{ i.name }}
        <i v-if="i.code">
          <img src="./../../assets/image/icon_tick.png" alt />
        </i>
      </div>
    </div>
    <!-- 医生列表 -->
    <van-list
      v-model="is_loading"
      :finished="finished"
      @load="onLoad"
      :immediate-check="immediateCheck"
      v-if="!is.not_doctor"
    >
      <section class="doctorList">
        <div
          class="item"
          v-for="(item, index) in doctorList"
          :key="index"
          @click="choiceItem(item)"
        >
          <div class="up">
            <div class="imgBox">
              <div class="headPortrait">
                <img :src="item.photo" v-show="item.photo" alt />
                <img :src="u_p" v-show="!item.photo" alt />
              </div>
            </div>
            <div class="info">
              <p class="infoTitle">
                <span class>{{ item.doctorName }}</span>
                <span class>{{ item.department }}</span>
                <span class>{{ item.academicTitleId | f_title }}</span>
              </p>
              <p class="hospitalName">{{ item.hospitalName }}</p>
              <p class="goodAt">
                擅长：
                <span>{{ item.speciality }}</span>
              </p>
            </div>
          </div>
          <div class="down">
            <p class="price">
              ￥{{ item.minPrice | min_filter }}
              <span>起</span>
            </p>
            <ul class="business">
              <li
                v-for="(bus, index) in item.services"
                :key="index"
                v-if="bus.serviceType === 1"
              >
                {{ bus.serviceName }}
              </li>
            </ul>
          </div>
          <div class="suspension" v-if="item.flag === 1">
            <span class>已签约</span>
          </div>
        </div>
      </section>
    </van-list>
    <!-- 地区 -->
    <div class="level_box" v-if="is.area">
      <van-tree-select
        :items="province_list"
        :main-active-index="mainActiveIndex"
        :active-id="activeId"
        @navclick="onNavClick"
        @itemclick="onItemClick"
      />
    </div>
    <!-- 遮罩 -->
    <div class="im_tips_modal_overlay" v-if="is.level_box"></div>
    <!-- 无结果 -->
    <div class="no_msg" v-if="is.not_doctor">
      <div class="n_img">
        <img src="./../../assets/image/pic_none_doctor.png" alt />
      </div>
      没有找到符合条件的医生
    </div>
  </div>
</template>

<script>
import util from "@/lib/util";
export default {
  data() {
    return {
      cityId: "",
      area_name: "全国",
      province_list: [
        {
          text: "全国",
          id: ""
        }
      ],
      // 左侧高亮元素的index
      mainActiveIndex: 0,
      // 被选中元素的id
      activeId: 1,
      items: [
        {
          // 导航名称
          text: "所有城市",
          // 该导航下所有的可选项
          children: [
            {
              // 名称
              text: "温州",
              // id，作为匹配选中状态的标识
              id: 1
            },
            {
              text: "杭州",
              id: 2
            }
          ]
        }
      ],
      level_name: "全部级别",
      is: {
        level_box: false,
        area: false,
        not_doctor: false,
        region: false
      },
      im_tips_show: true,
      pageNum: 0,
      isDoctor: 0,
      u_p: require("./../../assets/image/pic_doctor.png"),
      doctorName: "",
      finished: false,
      immediateCheck: false,
      is_loading: false,

      level_list: [
        {
          id: 0,
          code: true,
          name: "全部级别"
        },
        {
          id: 1,
          code: false,
          name: "普通医生"
        },
        {
          id: 2,
          code: false,
          name: "专家医生"
        }
      ],
      doctorList: [] //医生集合
    };
  },
  created() {
    this.get_list();
    this.get_province_list();
  },
  methods: {
    // 选择医生
    choiceItem(item) {
      this.$router.push({
        name: "DoctorDetails",
        params: {
          item: item
        }
      });
    },
    //
    s_filter(type) {
      if (type === 1) {
        this.is.area = !this.is.area;
        this.is.level_box = false;
      } else {
        this.is.level_box = !this.is.level_box;
        this.is.area = false;
      }
    },
    // 滚动加载
    onLoad() {
      console.log("触底了");
      // 异步更新数据
      // setTimeout(() => {
      // 加载状态结束
      this.is_loading = true;
      this.pageNum++;
      this.get_list(3);
      // 数据全部加载完成
      // this.finished = true
      // }, 500)
    },
    async get_list(type) {
      // type 0： 页面加载 搜索框  1：地区 排序 筛选  3:滚动加载
      let Url = "",
        params = {
          reqHead: {
            functionId: "HWW002012001"
          },
          body: {
            areaId: "",
            cityId: this.cityId,
            doctorName: this.doctorName,
            isDoctor: this.isDoctor,
            pageNum: this.pageNum,
            pageSize: 15
          }
        };
      this.$toast("加载中···");
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        this.is_loading = false;
        // this.$toast.clear();
        if (res.data.respHead.respCode === "000") {
          this.$toast.clear();
          if (type === 3) {
            res.data.body.data.length > 0
              ? (this.doctorList = this.doctorList.concat(res.data.body.data))
              : (this.finished = true);
          } else {
            if (res.data.body.data.length > 0) {
              this.is.not_doctor = false;
              this.doctorList = res.data.body.data;
              // localStorage.setItem("hw_doctorList", this.doctorList);
            } else {
              this.is.not_doctor = true;
              this.doctorList = [];
            }
          }
        } else {
          this.finished = true;
          // this.$toast.clear();
          this.$toast(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        // this.$toast.clear();
        console.log(e);
        this.finished = true;
        if (e.message.includes("Network")) {
          this.$toast("网络连接错误，请检查网络连接，再重新尝试!");
        } else {
          this.$toast(`error： 出问题了,请刷新重试!`);
        }
      }
    },
    onSearch() {
      this.pageNum = 0;
      this.get_list(1);
    },
    // 级别切换
    level_cut(item) {
      this.level_list.forEach(i => {
        i.code = false;
      });
      item.code = true;
      this.is.level_box = false;
      this.isDoctor = item.id;
      this.level_name = item.name;
      this.pageNum = 0;
      this.get_list(1);
    },
    // 地区左侧点击
    onNavClick(index) {
      this.mainActiveIndex = index;
      if (this.province_list[index].text != "全国") {
        this.get_shi(index);
      } else {
        this.area_name = "全国";
        this.is.area = false;
        this.pageNum = 0;
        this.cityId = "";
        this.get_list();
      }
    },
    // 获取市
    async get_shi(index) {
      let Url = "",
        params = {
          reqHead: {
            functionId: "HWW099001002"
          },
          body: {
            number: this.province_list[index].id
          }
        };
      this.$toast("加载中···");
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          let arr = [];
          res.data.body.data.forEach(i => {
            arr.push({ id: i.id, text: i.pcctvname });
          });
          this.province_list[index]["children"] = arr;
          this.$set(this.province_list, index, this.province_list[index]);
        } else {
          this.$toast(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        this.$toast.clear();
        this.$toast("网络连接不稳定，请检查网络！");
      }
    },
    // 地区右侧点击
    onItemClick(data) {
      this.cityId = data.id;
      this.activeId = data.id;
      this.area_name = data.text;
      this.pageNum = 0;
      this.is.area = false;
      this.get_list(1);
    },
    async get_province_list() {
      let Url = "",
        params = {
          reqHead: {
            functionId: "HWW099001001"
          },
          body: {}
        };
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          res.data.body.data.forEach(i => {
            this.province_list.push({ id: i.id, text: i.pcctvname });
          });
        } else {
          this.$toast(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        this.$toast("网络连接不稳定，请检查网络！");
      }
    }
  },
  filters: {
    min_filter(val) {
      return val ? val / 100 : val;
    },
    f_title(val) {
      let title_list = [
        {
          id: 1,
          name: "住院医师"
        },
        {
          id: 2,
          name: "主治医师"
        },
        {
          id: 3,
          name: "副主任医师"
        },
        {
          id: 4,
          name: "主任医师"
        }
      ];
      let arr = ["住院医师", "主治医师", "副主任医师", "主任医师"];
      return arr[val - 1] || "";
    }
  }
};
</script>

<style lang="scss">
.doctor_list {
  width: 100%;
  /*height: 100%;*/
  background: #f2f2f2;
  .no_msg {
    text-align: center;
    position: fixed;
    top: 104px;
    height: 100%;
    width: 100%;
    left: 0;
    right: 0;
    background-color: #fff;
    font-size: 14px;
    .n_img {
      width: 104px;
      height: 104px;
      margin: 0 auto;
      margin-top: 160px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .level_box {
    position: fixed;
    top: 103px;
    left: 0;
    width: 100%;
    z-index: 999;
    height: 100%;
    .item {
      height: 48px;
      line-height: 48px;
      color: #333;
      font-size: 16px;
      background-color: #fff;
      width: 100%;
      padding: 0 16px;
      border-bottom: 1px solid #dadada;
      display: flex;
      & > i {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-left: 10px;
        & > img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .itemActive {
      color: #fb6522;
    }
  }
  .van-search__content {
    background-color: #fff;
    border-radius: 5px;
    display: flex;
    align-items: center;
  }
  .van-cell {
    display: flex;
    align-items: center;
  }
  .van-tree-select__nitem--active::after {
    background-color: #fb6522;
  }
  .choice_box {
    position: relative;
    display: flex;
    width: 100%;
    border-bottom: 1px solid #dadada;
    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #333;
      font-size: 16px;
      width: 50%;
      height: 48px;
      background-color: #fff;
      box-sizing: border-box;
      & > span {
        position: relative;
      }
      .item-i {
        position: absolute;
        border-left: 5px solid transparent;
        border-top: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 5px solid transparent;
      }
      .i_dow {
        top: 6px;
        right: -25px;
        border-top: 8px solid #dadada;
      }
      .i_up {
        top: 0px;
        right: -25px;
        border-bottom: 8px solid #dadada;
      }
    }
    .item:first-child {
      border-right: 1px solid #dadada;
    }
  }

  .doctorList {
    .item {
      display: flex;
      position: relative;
      width: 100%;
      height: 100%;
      background-color: #fff;
      padding: 16px;
      //   margin-bottom: 10px;
      border-bottom: 10px solid #f2f2f2;
      box-sizing: border-box;
      overflow: hidden;
      flex-direction: column;
      .up {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 60px;
        margin-bottom: 16px;
      }
      .down {
        display: flex;
        text-align: center;
        .price {
          flex: 0 0 20%;
          font-size: 16px;
          color: #fb6522;
          & > span {
            font-size: 12px;
          }
        }
        .business {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          box-sizing: border-box;
          flex: 0 0 75%;
          width: 75%;
          margin-left: 15px;
          text-align: left;
          & > li {
            /*flex: 1;*/
            padding: 0 4px;
            display: inline-block;
            border: 1px solid #fb6522;
            text-align: center;
            box-sizing: border-box;
            margin-right: 10px;
            font-size: 12px;
            color: #fb6522;
            height: 18px;
            line-height: 16px;
          }
        }
      }
      .imgBox {
        display: flex;
        flex: 0 0 20%;
        justify-content: center;
        .headPortrait {
          width: 60px;
          height: 60px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .info {
        display: flex;
        flex-direction: column;
        flex: 0 0 75%;
        width: 75%;
        margin-left: 15px;
        line-height: 0;
        box-sizing: border-box;
        font-size: 0;
        & > p {
          width: 100%;
          height: 20px;
          font-size: 12px;
          display: flex;
          align-items: center;
        }
        .infoTitle {
          & > span {
            display: inline-block;
            margin-right: 10px;
            font-size: 14px;
            color: #333;
          }
        }
        .hospitalName {
          color: #333333;
          font-size: 14px;
        }
        .goodAt {
          color: #888;
          overflow: hidden; /*超出部分隐藏*/
          white-space: nowrap; /*不换行*/
          text-overflow: ellipsis; /*超出部分文字以...显示*/
        }
      }
      .suspension {
        position: absolute;
        top: 20px;
        right: -7px;
        width: 72px;
        line-height: 26px;
        height: 25px;
        background-color: #4ac995;
        border-radius: 25px;
        text-align: center;
        & > span {
          color: #fff;
        }
      }
    }
  }
  .im_tips_modal_overlay {
    position: fixed;
    top: 103px;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 99;
  }
}
// .doctor_list .search {
//   width: 94%;
//   height: 30px;
//   border-radius: 4px;
//   margin-left: 3%;
// }
// .doctor_list .search_filed {
//   height: 28px;
//   line-height: 28px;
//   font-size: 12px;
//   width: 100%;
//   border: none;
//   text-align: center;
//   border-radius: 5px;
// }
// ::-webkit-input-placeholder {
//   color: #999999;
// }
</style>
