import { filterTimes, formatDate } from "@/lib/time";
export default {
  filters: {
    $_tudan_isToday: value => {
      if (new Date(value).toDateString() === new Date().toDateString()) {
        return filterTimes(value);
      } else {
        return formatDate(value);
      }
    },
    $_tudan_format_date: value => {
      return formatDate(value);
    }
  }
};
