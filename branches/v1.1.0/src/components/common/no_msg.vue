<template>
  <div class="no_box">
    <div class="p_box">
      <img src="./pic_none.png" alt />
      <div class="no_msg">
        {{ msg }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["msg"],
  created() {},
  components: {},
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss">
.no_box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #f2f2f2;
  .p_box {
    width: 104px;
    height: 104px;
    & > img {
      width: 100%;
      height: 100%;
    }
    .no_msg {
      padding-top: 22px;
      color: #888;
      font-size: 16px;
      text-align: center;
    }
  }
}
</style>
