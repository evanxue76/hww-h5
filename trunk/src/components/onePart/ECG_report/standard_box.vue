<template>
  <div class="standard_wrap">
    <div class="titles">
      <span>测量指标</span>
      <span>结果</span>
      <span>参考范围</span>
    </div>
    <div class="list">
      <div
        class="item"
        v-for="(item, index) in list"
        :key="index"
        :class="{ bg: index % 2 }"
      >
        <div class>{{ item.name }}</div>
        <div class="icon_box">
          <span :class="{isRed:item.state!=0}">{{ item.ecg }}</span><span :class="{isRed:item.state!=0}">{{ item.company }}</span>
          <i class="tips_icon" v-if="!item.type">
            <img v-if="item.state === 1" src="./icon_dataup.png" alt />
            <img v-if="item.state === 2" src="./icon_datadown.png" alt />
          </i>
        </div>
        <div class>{{ item.range }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array
    }
  },
  created() {
    this.get_router();
  },
  components: {},
  data() {
    return {};
  },
  methods: {
    get_router() {
      if (this.$route.params.list) {
        this.list = this.$route.params.list;
      }
    }
  }
};
</script>

<style lang="scss">
.standard_wrap {
  font-size: 14px;
  // padding-bottom: 32px;
  .titles {
    display: flex;
    color: #888;
    padding-top: 22px;
    margin-bottom: 8px;
    & > span {
      flex: 1;
      text-align: center;
    }
  }
  .list {
    display: flex;
    flex-flow: wrap;
    .item {
      flex: 100%;
      display: flex;
      text-align: center;
      & > div {
        flex: 1;
        color: #333;
        height: 28px;
        line-height: 28px;
        background-color: #fafafa;
      }
      .icon_box {
        display: flex;
        align-items: center;
        justify-content: center;
        .isRed{
          color: red;
        }
      }
    }
    .bg {
      & > div {
        background-color: #fff;
      }
    }
  }
  .tips_icon {
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-left: 2px;
    & > img {
      width: 100%;
      height: 100%;
      vertical-align: super;
    }
  }
}
</style>
