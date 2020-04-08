import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import homePage from "./components/onePart/homePage";

Vue.use(Router);

const Route = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      children: [
        {
          path: "/",
          component: resolve => require(["./components/onePart/login.vue"], resolve),
          name: "Login"
        },
        {
          path: "/homePage",
          component: homePage,
          name: "HomePage",
          meta: {
            title: "ECG心电测量记录",
            requiresAuth: true
          }
        },
        {
          path: "/historyRecord",
          component: resolve =>
            require(["./components/onePart/historyRecord.vue"], resolve),
          name: "HistoryRecord",
          meta: {
            title: "历史记录",
            requiresAuth: true
          }
        },
        {
          path: "/ecgReport",
          component: resolve =>
            require(["./components/onePart/ecgReport.vue"], resolve),
          name: "EcgReport",
          meta: {
            title: "心电报告",
            requiresAuth: true
          }
        },
        // {
        //   path: "/memberServices",
        //   component: resolve =>
        //     require(["./components/onePart/memberServices.vue"], resolve),
        //   name: "MemberServices",
        //   meta: {
        //     title: "会员服务",
        //     requiresAuth: true
        //   }
        // },
        {
          path: "/openServices",
          component: resolve =>
            require(["./components/onePart/openServices.vue"], resolve),
          name: "OpenServices",
          meta: {
            title: "服务开通",
            requiresAuth: true
          }
        },
        {
          path: "/choiceEcg",
          component: resolve =>
            require(["./components/onePart/choiceEcg.vue"], resolve),
          name: "ChoiceEcg",
          meta: {
            title: "心电选择",
            requiresAuth: true
          }
        },
        // {
        //   path: "/informationCategory",
        //   component: resolve =>
        //     require(["./components/onePart/informationCategory.vue"], resolve),
        //   name: "InformationCategory",
        //   meta: {
        //     title: "资讯",
        //     requiresAuth: true
        //   }
        // },
        // {
        //   path: "/articleCategory",
        //   component: resolve =>
        //     require(["./components/onePart/articleCategory.vue"], resolve),
        //   name: "ArticleCategory",
        //   meta: {
        //     title: "资讯内容",
        //     requiresAuth: true
        //   }
        // },
        {
          path: "/user",
          component: resolve =>
            require(["./components/onePart/user.vue"], resolve),
          name: "User",
          meta: {
            title: "我的",
            requiresAuth: true
          }
        },
        {
          path: "/applyUnscramble",
          component: resolve =>
            require(["./components/onePart/applyUnscramble.vue"], resolve),
          name: "ApplyUnscramble",
          meta: {
            title: "申请解读",
            requiresAuth: true
          }
        },
        {
          path: "/payResult",
          component: resolve =>
            require(["./components/onePart/payResult.vue"], resolve),
          name: "PayResult",
          meta: {
            title: "支付结果",
            requiresAuth: true
          }
        },
        {
          path: "/upload",
          component: resolve =>
            require(["./components/onePart/upload.vue"], resolve),
          name: "Upload",
          meta: {
            title: "健康档案",
            requiresAuth: true
          }
        },
        {
          path: "/healthFile",
          component: resolve =>
            require(["./components/onePart/healthFile.vue"], resolve),
          name: "HealthFile",
          meta: {
            title: "健康档案",
            requiresAuth: true
          }
        },
        // {
        //   path: "/categoryContent",
        //   component: resolve =>
        //     require(["./components/onePart/categoryContent.vue"], resolve),
        //   name: "CategoryContent",
        //   meta: {
        //     title: "资讯内容",
        //     requiresAuth: true
        //   }
        // },
        {
          path: "/order",
          component: resolve =>
            require(["./components/onePart/order.vue"], resolve),
          name: "order",
          meta: {
            title: "订单",
            requiresAuth: true
          }
        },
        {
          path: "/agreement",
          component: resolve =>
            require(["./components/onePart/agreement.vue"], resolve),
          name: "Agreement",
          meta: {
            title: "",
            requiresAuth: true
          }
        },
        {
          path: "/health-info",
          component: resolve =>
            require(["./components/onePart/health-info.vue"], resolve),
          name: "health-info"
        },
        {
          path: "/reportTend",
          component: resolve =>
            require(["./components/onePart/reportTend.vue"], resolve),
          name: "ReportTend",
          meta: {
            title: "月度趋势报告",
            requiresAuth: true
          }
        },
        {
          path: "/standRenew",
          component: resolve =>
            require(["./components/onePart/standRenew.vue"], resolve),
          name: "StandRenew",
          meta: {
            title: "服务续费",
            requiresAuth: true
          }
        },
        {
          path: "/upgradePackage",
          component: resolve =>
            require(["./components/onePart/upgradePackage.vue"], resolve),
          name: "UpgradePackage",
          meta: {
            title: "套餐升级",
            requiresAuth: true
          }
        },
        {
          path: "/enjoyPackage",
          component: resolve =>
            require(["./components/onePart/enjoyPackage.vue"], resolve),
          name: "EnjoyPackage",
          meta: {
            title: "套餐续费",
            requiresAuth: true
          }
        },
        {
          path: "/standard",
          component: resolve =>
            require([
              "./components/onePart/ECG_report/standard_box.vue"
            ], resolve),
          name: "Standard",
          meta: {
            title: "测量指标",
            requiresAuth: true
          }
        },
        {
          path: "/serviceIntroduce",
          component: resolve =>
            require(["./components/onePart/serviceIntroduce.vue"], resolve),
          name: "ServiceIntroduce"
        },
        {
          path: "/battery_replacement_instructions",
          component: resolve =>
            require([
              "./components/onePart/battery_replacement_instructions.vue"
            ], resolve),
          name: "Battery_replacement_instructions",
          meta: {
            title: "更换电池说明",
            requiresAuth: true
          }
        },
        {
          path: "/test",
          component: resolve =>
            require(["./components/onePart/test.vue"], resolve),
          name: "Test",
          meta: {
            title: "test",
            requiresAuth: true
          }
        },
        ,
        {
          path: "/serviceMatter",
          component: resolve =>
            require(["./components/onePart/serviceMatter.vue"], resolve),
          name: "ServiceMatter",
          meta: {
            title: "服务需知",
            requiresAuth: true
          }
        },
        {
          path: "/reportInterpret",
          component: resolve =>
            require(["./components/onePart/reportInterpret.vue"], resolve),
          name: "ReportInterpret",
          meta: {
            title: "报告解读",
            requiresAuth: true
          }
        },
        {
          path: "/inquiryDoctor",
          component: resolve =>
            require(["./components/onePart/inquiryDoctor.vue"], resolve),
          name: "InquiryDoctor",
          meta: {
            title: "问医生",
            requiresAuth: true
          }
        },
        {
          path: "/doctorList",
          component: resolve =>
            require(["./components/onePart/doctorList.vue"], resolve),
          name: "DoctorList",
          meta: {
            title: "选择医生",
            requiresAuth: true
          }
        },
        {
          path: "/ecgUnscramble",
          component: resolve =>
            require(["./components/onePart/ecgUnscramble.vue"], resolve),
          name: "EcgUnscramble",
          meta: {
            title: "心电解读",
            requiresAuth: true
          }
        },
        {
          path: "/doctorDetails",
          component: resolve =>
            require(["./components/onePart/doctorDetails.vue"], resolve),
          name: "DoctorDetails",
          meta: {
            title: "医生详情",
            requiresAuth: true
          }
        },
        {
          path: "/setUp",
          component: resolve =>
            require(["./components/onePart/setUp.vue"], resolve),
          name: "SetUp",
          meta: {
            title: "设置",
            requiresAuth: true
          }
        },
        {
          path: "/about",
          component: resolve =>
            require(["./components/onePart/about.vue"], resolve),
          name: "About",
          meta: {
            title: "关于",
            requiresAuth: true
          }
        },
        {
          path: "/hw_services",
          component: resolve =>
            require(["./components/onePart/hw_services.vue"], resolve),
          name: "Hw_services",
          meta: {
            title: "服务协议",
            requiresAuth: true
          }
        },
        {
          path: "/hw_privacy",
          component: resolve =>
            require(["./components/onePart/hw_privacy.vue"], resolve),
          name: "Hw_privacy",
          meta: {
            title: "隐私协议",
            requiresAuth: true
          }
        },
        {
          path: "/guideToUse",
          component: resolve =>
            require(["./components/onePart/guideToUse.vue"], resolve),
          name: "GuideToUse",
          meta: {
            title: "使用指南",
            requiresAuth: true
          }
        }
      ]
    },
    // 消息列表
    {
      path: "/msg_list",
      component: resolve =>
        require(["./components/im_msg/msg_list.vue"], resolve),
      name: "Msg_list",
      meta: {
        title: "消息",
        requiresAuth: true
      }
    },
    // 系统消息
    {
      path: "/msg_system_list",
      component: resolve =>
        require(["./components/im_msg/msg_system_list.vue"], resolve),
      name: "Msg_system_list",
      meta: {
        title: "系统消息",
        requiresAuth: true
      }
    },
    // 系统消息
    {
      path: "/ecg_interpretation",
      component: resolve =>
        require(["./components/im_msg/ecg_interpretation.vue"], resolve),
      name: "Ecg_interpretation",
      meta: {
        title: "心电解读",
        requiresAuth: true
      }
    },
    // 聊天
    {
      path: "/im",
      component: resolve => require(["./components/im_msg/im.vue"], resolve),
      name: "Im"
    },
    //
    {
      path: "/binding_tel",
      component: resolve =>
        require(["./components/onePart/user/binding_tel.vue"], resolve),
      name: "Binding_tel"
    }
  ]
});

export default Route;

Route.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});
