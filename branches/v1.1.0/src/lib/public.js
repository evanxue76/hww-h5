export function toast_loding(_this, msg) {
  _this.$toast.loading({
    mask: true,
    forbidClick: true,
    duration: 0,
    message: msg || "加载中..."
  });
}

