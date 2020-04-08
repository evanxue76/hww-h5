<template>
  <!-- 服务确定 -->
  <div class="servicesToDetermineBox">
    <section class="servicesToDetermineContent">
      <!-- 用户地址 -->
      <div class="add_Show_Box" v-show="receiveModeCode">
        <div class="addressBox" v-show="addressBoxCode" @click="selectOperation(1)">
          <div class="userInfo">
            <span>{{address.name}}</span>
            <span>{{address.tel}}</span>
          </div>
          <div class="userAddress" @click="addressListCode=true">
            <span class v-if="address.preferred ===1 ">【默认地址】</span>
            {{address.address}}
          </div>
        </div>
        <div class="addressBox NoColor" v-show="addressBoxCodes">
          <center @click="selectOperation(1)">
            {{add_msg}}
            <span class>
              <i class="van-icon van-icon-arrow van-cell__right-icon"></i>
            </span>
          </center>
        </div>
      </div>
      <!-- 服务名称 -->
      <div class="serviceName">
        <span class>服务名称</span>
        <span class>会员服务</span>
      </div>
      <!-- 是否需要设备 and 领取方式 -->
      <van-cell-group>
        <van-cell title="是否需要设备" is-link :value="equipmentValue" @click="equipmentShow=true"/>
        <van-cell
          title="领取方式"
          is-link
          :value="receiveModeValue"
          @click="receiveModeShow=true"
          v-show="receiveModeCode"
        />
      </van-cell-group>
      <van-popup v-model="equipmentShow" position="bottom" :overlay="true">
        <van-picker
          show-toolbar
          title
          :columns="equipmentList"
          @cancel="res=>onCancel(res,'1')"
          @confirm="(value,index)=>onConfirm(value,index,'1')"
        />
      </van-popup>
      <van-popup v-model="receiveModeShow" position="bottom" :overlay="true">
        <van-picker
          show-toolbar
          title
          :columns="receiveModeList"
          @cancel="res=>onCancel(res,'2')"
          @confirm="onConfirm"
        />
      </van-popup>
      <!-- 医生信息 -->
      <p class="separateTitle">签约医生</p>
      <div class="doctorBox" v-show="doctorBoxCode" @click="selectOperation(2)">
        <div class="imgBox">
          <div class>
            <img :src="doctorData.photo" v-show="doctorData.photo" alt>
            <img :src="u_p" v-show="!doctorData.photo" alt>
          </div>
        </div>
        <div class="doctorInfo">
          <div class="user">
            <span class="name">{{doctorData.doctorName}}</span>
            <!-- <i class="vertical"></i> -->
            <span class="title">{{doctorData.department}}</span>
            <span class="title">{{doctorData.acadmicTitle}}</span>
          </div>
          <div class="doctorName">{{doctorData.hospitalName}}</div>
        </div>
        <div class="arrowRight">
          <i class="van-icon van-icon-arrow van-cell__right-icon"></i>
        </div>
      </div>
      <div class="doctorBox NoColor" v-show="doctorBoxCodes">
        <center @click="selectOperation(2)">
          {{doctor_msg}}
          <span class>
            <i class="van-icon van-icon-arrow van-cell__right-icon"></i>
          </span>
        </center>
      </div>
      <!-- 服务时长 -->
      <p class="separateTitle">服务时长</p>
      <div class="serviceTimeBox">
        <div
          class="item"
          v-for="(item,index) in separateList"
          :key="index"
          @click="selectStyle(item, index)"
          :class="{'active':item.active}"
        >
          <div class="lengthOfTime">{{item.lengthOfName}}</div>
          <div class="price" :class="{pricePlus:!item.originalPrice}">￥{{item.price}}</div>
          <div class="originalPrice" v-if="item.originalPrice">￥{{item.originalPrice}}</div>
        </div>
      </div>
      <div class="bothEnds postage" v-show="equipmentCode">
        <span class>邮费</span>
        <span class>￥{{postage}}</span>
      </div>
      <div class="bothEnds equipment" v-show="equipmentCode">
        <span class>设备</span>
        <div class>
          <span class="original_price">￥{{original_price}}</span>
          <span class>￥{{EquipPrice}}</span>
        </div>
      </div>
      <!-- <p class="ps">开通12个月服务赠送心电帖设备</p> -->
      <div class="bothEnds payWay">
        <span class>支付方式</span>
        <span class>微信支付</span>
      </div>
      <!-- <div class="radioBox">
        <input
          type="radio"
          class
          v-model="radio"
          value="1"
          @click="serviceNotices"
          ref="serviceNotice"
        >我已阅读
        <span class="serviceGuidelinesColor" @click="serviceCauseCode=true">《服务须知》</span>
      </div>-->
    </section>
    <footer class="footerMenu">
      <div class="price">
        总计：
        <span class="priceNum">￥{{total_Num}}</span>
      </div>
      <button
        type="button"
        class="operation"
        @click="goToPay"
        :class="{hide_code:goToPay_code}"
        :disabled="goToPay_code"
      >{{goToPay_msg}}</button>
    </footer>
    <serviceCause @clauseShow="clauseShow" v-show="serviceCauseCode"></serviceCause>
  </div>
</template>

<script>
//import serviceCause from './../clause/serviceCause'
//import utils from './../../../utils/utils'
// import wxJsSdk from 'weixin-js-sdk'
//import axios from 'axios'
//import { dateFtt } from './../../../utils/funs'
export default {
  created() {
//  this.getSessionStorageVal()
    // console.log(wxJsSdk)
    // console.log(wxJsSdk.chooseWXPay)
  },
  mounted() { },
//components: { serviceCause },
//computed: {
//  total_Num() {
//    let num = Number(this.lengthOfTimePrice) + Number(this.postage) + Number(this.EquipPrice)
//    return /\./.test(num) ? `${num}` : ` ${num}.00`
//  }
//},
  data() {
    return {
//    u_p:require("./pic_user.png"),
      aid:'',
      doctor_msg: '签约医生加载中···',
      add_msg: '默认地址加载中···',
      goToPay_code: false,
      goToPay_msg: '确认支付',
      addressId: '',//地址id
      doctorId: '',//医生id
      durationIndex: '',//服务时长选择时的下标
      orderUrl: 'http://api.995120.cn/wxpay/createOrder',
      isEquiment: 1,//是否需要设备 1:需要设备 | 0:不需要
      lengthOfTimePrice: '',//服务时长价格
      lengthOfTime: '',//服务时长时间
      postage: '10.00',//邮费
      EquipPrice: '0.00',//设备售价价格
      original_price: '0.00',//设备原价价格
      switchCode: 0, //路由跳转 判断是否切换地址医生
      addressSwitchCode: {},
      doctorSwitchCode: {},
      userNo: '',
      openId: '',
      address: {
        //地址
        id: '',
        name: '',
        tel: '',
        preferred: '',
        address: ''
      },
      doctorData: {}, //医生信息
      doctorBoxCode: false, //医生显示
      doctorBoxCodes: true, //医生显示
      addressBoxCode: false, //地址显示
      addressBoxCodes: true, //添加地址显示
      receiveModeCode: true, //领取方式显示
      equipmentCode: true, //设备价格显示
      addressListCode: false, //地址列表展开
      serviceCauseCode: false, //服务须知条款展开
      code: 0, //服务须知 radio
      radio: '', //服务须知 radio
      userAddressCode: true, //是否显示默认地址
      serviceName: '', //服务名称
      equipmentShow: false, //是否需要设备 选择控件 是否显示
      equipmentValue: '是',
      receiveModeValue: '邮寄',
      receiveModeShow: false, //领取方式 选择控件 是否显示
      equipmentList: ['是', '否'], //是否需要设备 集合
      receiveModeList: ['邮寄'], //领取方式 集合
      separateList: []//服务时长集合
    }
  },
  methods: {
    //.查看职称对应签约服务价格
    async queryServiceFee() {
      if (this.aid === '') {
        return
      }
      this.separateList = []
      let Url = ''
      let params = {
        "reqHead": {
          'functionId': 'B2C001026001'
        },
        "body": {
          id: this.aid
        }
      }
      try {
        let res = await utils.ajax.post(Url, params);
        console.log(res);
        let strealine = res.data.body.data
        if (res.status == "200" && res.data.respHead.respCode == "000") {
          this.separateListPush('一季度', '3', this.setServicePrice(strealine.realprice3m), this.setServicePrice(strealine.showprice3m), false, this.setServicePrice(strealine.deviceRealprice3m), this.setServicePrice(strealine.deviceShowprice3m))
          this.separateListPush('半年', '6', this.setServicePrice(strealine.realprice6m), this.setServicePrice(strealine.showprice6m), false, this.setServicePrice(strealine.deviceRealprice6m), this.setServicePrice(strealine.deviceShowprice6m))
          this.separateListPush('一年', '12', this.setServicePrice(strealine.realprice12m), this.setServicePrice(strealine.showprice12m), false, this.setServicePrice(strealine.deviceRealprice12m), this.setServicePrice(strealine.deviceShowprice12m))
        } else {
          this.$toast(`${res.data.respHead.respMsg}`)
        }
      } catch (e) {
        console.log(e);
        this.$toast(`网络连接错误,请稍后再试!`)
      }
    },
    //数组添加
    separateListPush(lengthOfName, lengthOfTime, price, originalPrice, active, deviceRealprice, deviceShowprice) { //名字、时长、服务售价、服务原价、状态、设备售价、设备原价
      this.separateList.push({ lengthOfName, lengthOfTime, price, originalPrice, active, deviceRealprice, deviceShowprice })
    },
    //设置服务时长价格
    setServicePrice(val) {
      return val / 100
    },
    //查询用户的邀请医生
    async queryInviteDoctor() {
      let Url = ''
      let params = {
        "reqHead": {
          'functionId': 'B2C001001022'
        },
        "body": {
          id: this.userNo
        }
      }
      try {
        let res = await utils.ajax.post(Url, params);
        console.log(res);
        if (res.status == "200" && res.data.respHead.respCode == "000") {
          if (res.data.body.data === '') {
            this.doctorBoxCodes = true
            this.doctorBoxCode = false
            this.doctor_msg = '请选择签约医生'
            return
          }
          this.doctorData = res.data.body.data //Object.assign({}, this.doctorData, res.data.body.data)
          this.doctorBoxCodes = false
          this.doctorBoxCode = true
          this.aid = res.data.body.data.aid
          this.doctorId = this.doctorData.id
          this.queryServiceFee()
        } else {
          this.$toast(`${res.data.respHead.respMsg}`)
        }
      } catch (e) {
        console.log(e);
        this.$toast(`网络连接错误,请稍后再试!`)
      }
    },
    //非空校验
    nonEmptyCheck() {
      let flag = 1
      if (this.isEquiment === 1) {
        if (!this.address.id) {
          this.$toast('请选择收获地址!')
          flag = 0
          return flag
        }
      }

      if (!this.doctorData.id) {
        this.$toast('请选择签约医生!')
        flag = 0
        return flag
      }

      if (this.lengthOfTime === '') {
        this.$toast('请选择服务时长!')
        flag = 0
        return flag
      }
      return flag
    },
    // 支付
    async goToPay() {
      //非空校验
      if (this.nonEmptyCheck() === 0) {
        return
      }
      this.$toast('提交订单中...')
      let params = {
        reqHead: {},
        body: {
          category: "sign",
          userNo: this.userNo, // 用户id
          payType: 1, //支付方式，微信支付
          type: 3, //签约服务订单
          isEquiment: this.isEquiment, //是否需要设备 1:需要设备 | 0:不需要
          dateLength: this.lengthOfTime, //开通服务的月数，此处表示6个月
          docId: this.doctorId, //医生id
          quantity: 1, //数量，就是1
          requestStyle: 'JSAPI',
          requestDate: dateFtt('yyyyMMddhhmmss', new Date()) //时间戳 new Date()
        }
      }
      if (this.isEquiment === 1) {
        params.body['addressid'] = this.addressId //收件人地址id
      }
      console.log(params)
      this.goToPay_msg = '支付中...'
      this.goToPay_code = true
      try {
        let res = await axios.post(this.orderUrl, params)
        let _this = this
        console.log(res)
        if (
          res.status == '200' &&
          res.data.respHead.respCode == '000'
        ) {
          res.data.body.data['package'] = res.data.body.data.packAge
          delete res.data.body.data.packAge
          this.JsApiData = res.data.body.data
          this.jsApiCall(this.JsApiData, _this)
          console.log(this.JsApiData)
        } else {
          this.goToPay_msg = '确认支付'
          this.goToPay_code = false
          this.$toast(`${res.data.respHead.respMsg}`)
        }
      } catch (e) {
        console.log(e)
        this.goToPay_msg = '确认支付'
        this.goToPay_code = false
        this.$toast(`网络连接错误,请稍后再试!`)
      }
    },
    //正式发起微信支付
    jsApiCall(jsapi, _this) {
      WeixinJSBridge.invoke('getBrandWCPayRequest', jsapi, function (res) {
        console.log(res)
        if (res.err_msg == 'get_brand_wcpay_request:ok') {
          // alert('支付成功')
          //你的业务逻辑
          //code: 1:成功、0失败
          _this.$router.push({
            name: 'ProvisioningStatus',
            params: { code: 1 }
          })
          // alert('支付成功点击后')
        } else {
          // alert('支付失败')
          // alert(JSON.stringify(res.err_msg))
          _this.$router.push({
            name: 'ProvisioningStatus',
            params: { code: 0 }
          })
        }
      })
    },
    //换医生2  or 换地址 1
    selectOperation(type) {
      let name
      type === 1 ? name = 'AddressList' : name = 'ChooseADoctor'
      this.$router.push({
        name,
        params: {
          click: 'toggle',
          isEquiment: this.isEquiment,
          durationIndex: this.durationIndex,
          doctorId: this.doctorId,
          address: this.address,
          addressId: this.addressId,
          doctorData: this.doctorData
        }
      })
    },
    // 获取缓存的值
    getSessionStorageVal() {
      this.userNo = this.$cookie.get('userNo') === undefined ? '' : this.$cookie.get('userNo')
      this.openId = this.$cookie.get('openId')
      console.log(this.$route.params)
      if (this.$route.params.switchCode) {
        if (this.$route.params.address.id) {
          this.addressBoxCode = true
          this.addressBoxCodes = false
        } else {
          this.addressBoxCodes = true
          this.addressBoxCode = false
        }
        if (this.$route.params.doctorData.id) {
          this.doctorBoxCode = true
          this.doctorBoxCodes = false
          this.aid = this.$route.params.doctorData.aid
          this.queryServiceFee()
        } else {
          this.doctorBoxCodes = true
          this.doctorBoxCode = false
          this.doctor_msg = '请选择签约医生'
        }
        if (this.$route.params.isEquiment == 0) {
          this.isEquiment = this.$route.params.isEquiment
          this.addressBoxCode = false
          this.receiveModeCode = false
          this.postage = 0
          this.EquipPrice = 0
          this.original_price = 0
          this.equipmentValue = '否'
        } else {
          this.isEquiment = this.$route.params.isEquiment
          this.equipmentValue = '是'
          this.addressBoxCode = true
          this.receiveModeCode = true
        }
        this.durationIndex = this.$route.params.durationIndex
        this.doctorId = this.$route.params.doctorData.id
        this.address = this.$route.params.address
        this.addressId = this.$route.params.address.id
        this.doctorData = this.$route.params.doctorData
      } else {
        this.geAddresstList() // 查询默认地址
        this.queryInviteDoctor() //查询医生
        localStorage.removeItem('addressSwitchCode')
        localStorage.removeItem('doctorSwitchCode')
        localStorage.removeItem('address')
        localStorage.removeItem('doctorData')
      }
    },
    //选择设备 领取方式
    onConfirm(value, index, type) {
      console.log(value)
      console.log(index)
      console.log(type)
      // 控制地址显示
      if (value === '否') {
        this.addressBoxCode = false
        this.receiveModeCode = false
        this.postage = 0
        this.EquipPrice = 0
        this.isEquiment = 0
        this.original_price = 0
        // this.equipmentCode = false
      } else if (value === '是') {
        this.addressBoxCode = true
        this.receiveModeCode = true
        // this.equipmentCode = true
        this.postage = '10.00'
        this.EquipPrice = '0.00'
        this.isEquiment = 1
      }
      if (type === '1') {
        // type 1= 是否需要设备  2 =领取方式
        this.equipmentValue = value
        this.equipmentShow = false
      } else {
        this.receiveModeValue = value
        this.receiveModeShow = false
      }
    },
    // 底部弹窗 取消
    onCancel(res, type) {
      console.log(res)
      if (type === '1') {
        // type 1= 是否需要设备  2 =领取方式
        this.equipmentShow = false
      } else {
        this.receiveModeShow = false
      }
    },
    //控制 服务时长
    selectStyle(item, index) {
      console.log(item)
      this.separateList.forEach(item => {
        item.active = false
      })
      item.active = true
      this.lengthOfTime = item.lengthOfTime
      this.lengthOfTimePrice = item.price
      this.durationIndex = index
      if (this.isEquiment === 0) {
        return
      }
      this.EquipPrice = item.deviceRealprice
      this.original_price = item.deviceShowprice
    },
    // 勾选服务须知
    serviceNotices() {
      if (this.code === 0 && this.$refs.serviceNotice.checked === true) {
        this.radio = 1
        this.code = 1
        sessionStorage.setItem('radio', this.radio)
      } else {
        this.code = 0
        this.radio = 0
        this.$refs.serviceNotice.checked = false
        sessionStorage.setItem('radio', this.radio)
      }
    },
    clauseShow(val) {
      this.serviceCauseCode = val
    },
    // 查询默认地址
    async geAddresstList() {
      let params = {
        reqHead: {
          functionId: 'B2C002102004'
        },
        body: {
          userNo: this.userNo
        }
      }
      try {
        let res = await utils.ajax.post('', params)
        console.log(res)
        if (
          res.status == '200' &&
          res.data.respHead.respCode == '000'
        ) {
          // 没有默认地址
          if (res.data.body.data.datas.length === 0) {
            this.address = {}
            this.addressBoxCode = false
            this.addressBoxCodes = true
            this.add_msg = '暂无默认地址，点击添加地址'
            return
          }
          this.addressBoxCode = true
          this.addressBoxCodes = false
          res.data.body.data.datas.map(i => {
            if (i.preferred === 1) {
              this.address['id'] = i.id
              this.address['preferred'] = i.preferred
              this.address['name'] = i.receiver
              this.address['tel'] = i.phone
              this.address['address'] = `${i.provName}${
                i.cityName
                }${i.distName}${i.address}`
            }
          })
        } else {
          // this.loading = false
          this.$toast(`${res.data.respHead.respMsg}`)
        }
      } catch (e) {
        console.log(e)
        this.$toast(`网络连接错误,请稍后再试!`)
      }
    }
  },
  watch: {}
}
</script>

<style lang="scss">
.servicesToDetermineBox {
  box-sizing: border-box;
  .servicesToDetermineContent {
    padding-bottom: 80px;
    .separateTitle {
      padding: 0 10px;
      margin-bottom: 10px;
      font-size: 14px;
      color: #888;
    }
    .addressBox {
      padding: 10px;
      background-color: #fff;
      .userInfo {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
      }
    }
    .serviceName {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      background-color: #fff;
      margin-top: 10px;
    }
    .van-cell-group {
      font-size: 12px;
      background-color: transparent;
      margin-bottom: 10px;
      .van-cell {
        padding: 10px;
        font-size: 12px;
      }
    }
    .doctorBox {
      display: flex;
      align-items: center;
      // padding: 10px 10px;
      background-color: #fff;
      margin-bottom: 15px;
      height: 90px;
      .imgBox {
        flex: 0 0 30%;
        // width: 30%;
        margin-right: 10px;
        text-align: center;
        & > div {
          width: 70px;
          height: 70px;
          margin: 0 auto;
        }
        img {
          width: 90%;
          height: 100%;
        }
      }
      .doctorInfo {
        flex: 1;
        .user {
          display: flex;
          margin-bottom: 5px;
          align-items: center;
          height: 30px;
          .name {
            display: inline-block;
            margin-right: 5px;
          }
          .vertical {
            display: inline-block;
            height: 80%;
            width: 1px;
            border-right: 1px solid #ddd;
          }
          .title {
            display: inline-block;
            margin-left: 10px;
          }
        }
      }
      .arrowRight {
        justify-content: flex-start;
        margin-right: 10px;
      }
    }
    .serviceTimeBox {
      display: flex;
      justify-content: center;
      margin: 16px 0;
      .item {
        display: flex;
        flex-direction: column;
        text-align: center;
        background-color: #fff;
        flex: 0 0 27%;
        height: 104px;
        padding-bottom: 15px;
        border-radius: 5px;
        font-size: 16px;
        border: 2px solid transparent;
        margin-right: 3%;
        .lengthOfTime {
          margin-top: 12px;
          margin-bottom: 10px;
        }
        .price {
          color: #4ac995;
          margin-bottom: 10px;
        }
        .originalPrice {
          text-decoration: line-through;
          color: #888;
          margin-bottom: 10px;
        }
        .pricePlus {
          margin-top: 14px;
        }
        // & > div {
        //     margin-bottom: 10px;
        // }
      }
      .item:last-child {
        margin-right: 0;
      }
      & > .active {
        border: 2px solid #4ac995;
      }
    }
    .ps {
      padding: 10px;
      margin-bottom: 10px;
      color: #888;
      padding-top: 1px;
    }
    .postage {
      border-bottom: 1px solid #eee;
    }
    .equipment {
      margin-bottom: 10px;
    }
    .payWay {
      @extend .equipment;
    }
    .radioBox {
      display: flex;
      align-items: center;
      padding: 0 10px;
      align-items: center;
      height: 20px;
      line-height: 20px;
      & > input[type="radio"] {
        position: relative;
        appearance: none;
        outline: none;
        margin-right: 10px;
        width: 16px;
        height: 16px;
        cursor: pointer;
        vertical-align: center;
        background: #fff;
        border: 1px solid #ccc;
      }
      & > input[type="radio"]:checked::after {
        content: "\2713";
        display: block;
        position: absolute;
        top: 1px;
        left: 2px;
        right: 0;
        bottom: 0;
        width: 12px;
        height: 12px;
        line-height: 10px;
        color: red;
        font-size: 12px;
      }
      // & > input[type='radio'],input[type='radio']:checked::after {
      //     border-radius: 50%;
      // }
    }
    .serviceGuidelinesColor {
      color: #6587eb;
    }
  }

  .footerMenu {
    display: flex;
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    max-width: 750px;
    height: 48px;
    line-height: 48px;
    background-color: #e5e5e5;
    color: #333;
    border-top: 1px solid #eee;
    margin: 0 auto;
    font-size: 16px;
    .price {
      flex: 0 0 50%;
      padding-left: 10px;
      box-sizing: border-box;
      background-color: #fff;
      .priceNum {
        color: #4ac995;
      }
    }
    .operation {
      flex: 0 0 50%;
      text-align: center;
      background-color: #4ac995;
      color: #fff;
      border: 0;
    }
    .hide_code {
      background-color: #bbb;
      border: 1px solid #bbb;
    }
  }
  // 两端展示
  .bothEnds {
    display: flex;
    justify-content: space-between;
    padding: 14px;
    background-color: #fff;
    .original_price {
      text-decoration: line-through;
      color: #888;
      margin-right: 10px;
    }
  }
  .NoColor {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    text-align: center;
    color: #4ac995;
    width: 100%;
    font-size: 16px;
    height: 70px;
    center {
      width: 100%;
      position: relative;
      span {
        position: absolute;
        right: 16px;
        top: -2px;
      }
    }
  }
}
</style>