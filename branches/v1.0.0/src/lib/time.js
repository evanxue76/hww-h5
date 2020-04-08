// 格式化年月日时分
export function formatDate(date) {
if (date == undefined) {
    return "";
} else {
    let dateTime = new Date(date);
    return (
      dateTime.getFullYear() +
      "-" +
      (dateTime.getMonth() + 1 < 10
        ? "0" + (dateTime.getMonth() + 1)
        : dateTime.getMonth() + 1) +
      "-" +
      (dateTime.getDate() < 10
        ? "0" + dateTime.getDate()
        : dateTime.getDate()) +
      " " +
      (dateTime.getHours() < 10
        ? "0" + dateTime.getHours()
        : dateTime.getHours()) +
      ":" +
      (dateTime.getMinutes() < 10
        ? "0" + dateTime.getMinutes()
        : dateTime.getMinutes())
    );
}
}

export function dateDot(date) {
if (date == undefined) {
    return "";
} else {
    let dateTime = new Date(date);
    return (
      dateTime.getFullYear() +
      "." +
      (dateTime.getMonth() + 1 < 10
        ? "0" + (dateTime.getMonth() + 1)
        : dateTime.getMonth() + 1) +
      "." +
      (dateTime.getDate() < 10
        ? "0" + dateTime.getDate()
        : dateTime.getDate()) +
      " " +
      (dateTime.getHours() < 10
        ? "0" + dateTime.getHours()
        : dateTime.getHours()) +
      ":" +
      (dateTime.getMinutes() < 10
        ? "0" + dateTime.getMinutes()
        : dateTime.getMinutes())
    );
}
}

// 格式化年月日
export function formatDay(date) {
  if (date == undefined) {
    return "";
  } else {
    let dateTime = new Date(date);
    return (
      dateTime.getFullYear() +
      "-" +
      (dateTime.getMonth() + 1 < 10
        ? "0" + (dateTime.getMonth() + 1)
        : dateTime.getMonth() + 1) +
      "-" +
      (dateTime.getDate() < 10 ? "0" + dateTime.getDate() : dateTime.getDate())
    );
  }
}
// 格式化月日
export function formatMonthDay(date) {
  if (date == undefined) {
    return "";
  } else {
    let dateTime = new Date(date);
    return dateTime.getMonth() + 1 + "月" + dateTime.getDate() + "日";
  }
}
// xx年xx月xx日
export function getDates(date) {
  if (date == undefined) {
    return "";
  } else {
    let dateTime = new Date(date);
    return (
      dateTime.getFullYear() +
      "年" +
      (dateTime.getMonth() + 1 < 10
        ? "0" + (dateTime.getMonth() + 1)
        : dateTime.getMonth() + 1) +
      "月" +
      (dateTime.getDate() < 10
        ? "0" + dateTime.getDate()
        : dateTime.getDate()) +
      "日"
    );
  }
}

// 获取当前年
export function formatYear(date) {
  if (date == undefined) {
    return "";
  } else {
    let dateTime = new Date(date);
    return dateTime.getFullYear();
  }
}

export function formatSecond(date) {
  if (date == undefined) {
    return "";
  } else {
    let dateTime = new Date(date);
    return (
      dateTime.getFullYear() +
      "-" +
      (dateTime.getMonth() + 1 < 10
        ? "0" + (dateTime.getMonth() + 1)
        : dateTime.getMonth() + 1) +
      "-" +
      (dateTime.getDate() < 10
        ? "0" + dateTime.getDate()
        : dateTime.getDate()) +
      " " +
      (dateTime.getHours() < 10
        ? "0" + dateTime.getHours()
        : dateTime.getHours()) +
      ":" +
      (dateTime.getMinutes() < 10
        ? "0" + dateTime.getMinutes()
        : dateTime.getMinutes()) +
      ":" +
      (dateTime.getSeconds() < 10
        ? "0" + dateTime.getSeconds()
        : dateTime.getSeconds())
    );
  }
}

//获取昨天时间
export function GetDateStr(AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1; //获取当前月份的日期
  var d = dd.getDate();
  return y + "-" + m + "-" + d;
}

// 获取上一年
export function GetYearStr(AddDayCount) {
  var dd = new Date();
  dd.setFullYear(dd.getFullYear() + AddDayCount); //获取AddDayCount天后的日期
  var y = dd.getFullYear();
  return y;
}

//js时间戳转 时分
export function formatDuring(date) {
  if (date == undefined) {
    return "";
  } else {
    let dateTime = new Date(date);
    return (
      (dateTime.getHours() < 10
        ? "0" + dateTime.getHours()
        : dateTime.getHours()) +
      ":" +
      (dateTime.getMinutes() < 10
        ? "0" + dateTime.getMinutes()
        : dateTime.getMinutes())
    );
  }
}

// 获取每月有几周
export function getWeeks(year, month) {
  var d = new Date();
  // 该月第一天
  d.setFullYear(year, month - 1, 1);
  var w1 = d.getDay();
  if (w1 == 0) w1 = 7;
  // 该月天数
  d.setFullYear(year, month, 0);
  var dd = d.getDate();
  // 第一个周一
  let d1;
  if (w1 != 1) d1 = 7 - w1 + 2;
  else d1 = 1;
  let week_count = Math.ceil((dd - d1 + 1) / 7);
  return week_count;
}

// 根据年月周获取该周从周一到周日的日期
export function getWeekTime(year, month, weekday) {
  var d = new Date();
  // 该月第一天
  d.setFullYear(year, month - 1, 1);
  var w1 = d.getDay();
  if (w1 == 0) w1 = 7;
  // 该月天数
  d.setFullYear(year, month, 0);
  var dd = d.getDate();
  // 第一个周一
  let d1;
  if (w1 != 1) d1 = 7 - w1 + 2;
  else d1 = 1;
  var monday = d1 + (weekday - 1) * 7;
  var sunday = monday + 6;
  var from = year + "-" + month + "-" + monday;
  var to;
  if (sunday <= dd) {
    to = year + "-" + month + "-" + sunday;
  } else {
    d.setFullYear(year, month - 1, sunday);
    let days = d.getDate();
    to = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + days;
  }
  console.log(weekday + " 从" + from + " 到 " + to + "");
}

//获取每月第几周的周一的日期
export function getMondayTime(year, month, weekday) {
  var d = new Date();
  // 该月第一天
  d.setFullYear(year, month - 1, 1);
  var w1 = d.getDay();
  if (w1 == 0) w1 = 7;
  // 该月天数
  d.setFullYear(year, month, 0);
  var dd = d.getDate();
  // 第一个周一
  let d1;
  if (w1 != 1) d1 = 7 - w1 + 2;
  else d1 = 1;
  var monday = d1 + (weekday - 1) * 7;
  return monday;
}

// 获取周一的日期
export function getMonDate() {
  var d = new Date(),
    day = d.getDay(),
    date = d.getDate();
  if (day == 1) return d;
  if (day == 0) d.setDate(date - 6);
  else d.setDate(date - day + 1);
  return d;
}

// 获得周期名字
export function getDayName(day) {
  var day = parseInt(day);
  if (isNaN(day) || day < 0 || day > 6) return false;
  var weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return weekday[day];
}

//获得当前日期在当月第几周
export function getMonthWeek(a, b, c) {
  var date = new Date(a, parseInt(b) - 1, c),
    w = date.getDay(),
    d = date.getDate();
  return Math.ceil((d + 6 - w) / 7);
}

// 获取当月最后一天日期
export function getLastDay(year, month) {
  var new_year = year; //取当前的年份
  var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）
  if (month > 12) {
    new_month -= 12; //月份减
    new_year++; //年份增
  }
  var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天
  return new Date(new_date.getTime() - 1000 * 60 * 60 * 24).getDate(); //获取当月最后一天日期
}

// 根据分钟返回 XX小时XX分 格式
export function filterTime(str) {
  if (str < 60) {
    return `${str}分钟`;
  }
  if (str !== "0" && str !== "" && str !== null) {
    return (
      (Math.floor(str / 60).toString().length < 2
        ? Math.floor(str / 60).toString()
        : Math.floor(str / 60).toString()) +
      "小时" +
      (str % 60).toString() +
      "分钟"
    );
  } else {
    return "";
  }
}

// 根据时间搓返回 XX小时XX分 格式
export function filterTimes(date) {
  if (date == undefined) {
    return "";
  } else {
    let dateTime = new Date(date);
    return (
      (dateTime.getHours() < 10
        ? "0" + dateTime.getHours()
        : dateTime.getHours()) +
      ":" +
      (dateTime.getMinutes() < 10
        ? "0" + dateTime.getMinutes()
        : dateTime.getMinutes())
    );
  }
}

// 格式化月日时分
export function formatDates(date) {
  if (date == undefined) {
    return "";
  } else {
    let dateTime = new Date(date);
    return (
      (dateTime.getMonth() + 1 < 10
        ? "0" + (dateTime.getMonth() + 1)
        : dateTime.getMonth() + 1) +
      "-" +
      (dateTime.getDate() < 10
        ? "0" + dateTime.getDate()
        : dateTime.getDate()) +
      " " +
      (dateTime.getHours() < 10
        ? "0" + dateTime.getHours()
        : dateTime.getHours()) +
      ":" +
      (dateTime.getMinutes() < 10
        ? "0" + dateTime.getMinutes()
        : dateTime.getMinutes())
    );
  }
}

export function second_todo_date(time) {
  if (null != time && "" != time) {
    if (time > 60 && time < 60 * 60) {
      time = parseInt(time / 60) + "分钟" + parseInt(time % 60) + "秒";
    } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
      time =
        parseInt(time / 3600) +
        "小时" +
        parseInt((time % 3600) / 60) +
        "分钟" +
        parseInt(time % 60) +
        "秒";
    } else {
      time = parseInt(time) + "秒";
    }
  }
  return time;
}
