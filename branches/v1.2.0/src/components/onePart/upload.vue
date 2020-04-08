<template>
  <div class="upload">
    <!--<div class="headerTotal">
      <van-nav-bar
        class="headerNav"
        title="上传看病资料"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </div>-->
    <section>
      <van-cell-group>
        <van-field
          label="姓名"
          placeholder="姓名"
          input-align="right"
          v-model="infoSelected.name"
          :disabled="statusd"
        />
        <van-field
          v-if="statusd"
          label="性别"
          input-align="right"
          is-link
          @click="clickSelect('gender')"
          v-model="infoSelected.sex"
          :disabled="statusd"
        />
        <van-cell
          v-else
          title="性别"
          is-link
          @click="clickSelect('gender')"
          v-model="infoSelected.sex"
        />
        <van-field
          type="number"
          label="年龄"
          placeholder="年龄"
          input-align="right"
          v-model="infoSelected.age"
          :disabled="statusd"
        />
        <van-field
          type="number"
          label="联系电话"
          placeholder="联系电话"
          input-align="right"
          v-model="infoSelected.emergencyTelephone"
          :disabled="statusd"
        />
      </van-cell-group>
    </section>

    <section>
      <div class="page-title">
        <p>基本情况</p>
      </div>
      <van-cell-group>
        <van-field
          type="number"
          label="身高（cm）"
          placeholder="身高（cm）"
          input-align="right"
          v-model="infoSelected.height"
          :disabled="statusd"
        />
        <van-field
          type="number"
          label="体重（kg）"
          placeholder="体重（kg）"
          input-align="right"
          v-model="infoSelected.weight"
          :disabled="statusd"
        />
        <!--<van-field
          type="number"
          label="BMI"
          placeholder="BMI"
          input-align="right"
          v-model="infoSelected.bmi"
        />-->
        <van-cell title="BMI" v-model="bmiComputed" />
      </van-cell-group>
    </section>

    <section>
      <section>
        <div class="page-title">
          <p>症状</p>
        </div>
        <van-cell-group>
          <van-field
            placeholder="无"
            input-align="left"
            v-model="infoSelected.symptom"
            :disabled="statusd"
          />
        </van-cell-group>
      </section>

      <div class="page-title">
        <p>既往史</p>
      </div>
      <van-cell-group>
        <!--<van-cell
          title="高血压、糖尿病"
          is-link
          v-model="infoSelected.pastHistory"
        />-->
        <van-field
          placeholder="无"
          input-align="left"
          v-model="infoSelected.pastHistory"
          :disabled="statusd"
        />
      </van-cell-group>
    </section>

    <section>
      <div class="page-title">
        <p>过敏史</p>
      </div>
      <van-cell-group>
        <van-field
          placeholder="无"
          input-align="left"
          v-model="infoSelected.allergyHistory"
          :disabled="statusd"
        />
      </van-cell-group>
    </section>

    <section>
      <div class="page-title">
        <p>家族史</p>
      </div>
      <van-cell-group>
        <van-field
          placeholder="无"
          input-align="left"
          v-model="infoSelected.familyHistory"
          :disabled="statusd"
        />
      </van-cell-group>
    </section>

    <section>
      <div class="page-title">
        <p>临床检查</p>
      </div>
      <van-cell-group>
        <!--<van-cell title="ECG" />-->
        <van-field
          placeholder="无"
          input-align="left"
          v-model="infoSelected.clinicalExamination"
          :disabled="statusd"
        />
        <van-row type="flex" justify="center">
          <van-uploader
            multiple
            :after-read="onRead"
            :max="3"
            v-for="(item, index) in picList"
            :key="index"
            :disabled="disabled"
          >
            <img
              :src="item"
              style="width: 1.8rem; height: 1.8rem; position: relative;"
              @click="judges"
              :class="{ limitActive: disabled }"
            />
            <img
              v-show="isShow"
              class="delete"
              :src="delete_pic"
              v-if="index != 0"
              @click="deletePic(index)"
            />
          </van-uploader>
        </van-row>
      </van-cell-group>
    </section>

    <section>
      <div class="page-title">
        <p>临床诊断</p>
      </div>
      <van-cell-group>
        <van-field
          placeholder="无"
          input-align="left"
          v-model="infoSelected.clinicalDiagnosis"
          :disabled="statusd"
        />
        <van-row type="flex" justify="center">
          <!--<van-col span="6">-->

          <van-uploader
            multiple
            :after-read="onReads"
            v-for="(items, index) in diagnosisList"
            :key="index"
            :disabled="disable"
          >
            <!--<van-icon
                name="photograph"
                size="1rem"
            />-->
            <img
              :src="items"
              style="width: 1.8rem; height: 1.8rem; position: relative;"
              @click="judge"
              :class="{ indexActive: disable }"
            />
            <img
              v-show="isShow"
              class="delete"
              :src="delete_pic"
              v-if="index != 0"
              @click="deleteDia(index)"
            />
          </van-uploader>

          <!--</van-col>-->
          <!--<van-col span="6"></van-col>
          <van-col span="6"></van-col>
          <van-col span="6"></van-col>-->
        </van-row>
      </van-cell-group>
    </section>

    <footer class="next-step">
      <span @click="nextStep" v-if="type == 3" style="display:none;"></span>
      <span @click="nextStep" v-else-if="type == 2">保存</span>
      <span @click="nextStep" v-else>下一步</span>
    </footer>

    <van-popup v-model="showList" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        :columns="columns"
        :default-index="1"
        @change="onChange"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import util from "../../lib/util";
import { regName, regTelePhone, regAge, heigAge } from "../../lib/regular";

export default {
  data() {
    return {
      isShow: true,
      statusd: false,
      disable: false,
      disabled: false,
      upload: true,
      showList: false,
      delete_pic: require("../../assets/image/delete.png"),
      columns: [],
      infoOptions: {
        gender: ["男", "女"]
      },
      infoSelected: {
        age: "",
        allergyHistory: "",
        bmi: "",
        clinicalDiagnosis: "",
        clinicalExamination: "",
        emergencyTelephone: "",
        familyHistory: "",
        height: "",
        managerNo: "",
        name: "",
        pastHistory: "",
        sex: "",
        symptom: "",
        weight: ""
      },
      hw_user_message: {},
      type: "",
      filePath: "",
      picList: [require("../../assets/image/icon_addpic.png")],
      picPath: "",
      diagnosisList: [require("../../assets/image/icon_addpic.png")]
    };
  },
  created() {
    let userData = localStorage.getItem("hw_user_message");
    this.hw_user_message = JSON.parse(userData);
    if (this.$route.params.type == 2) {
      this.type = 2;
      document.title = "健康档案";
    } else {
      this.type = 1;
      document.title = "上传看病资料";
    }
    if (this.$route.params.is_im) {
      this.type = 3;
      this.statusd = true;
      this.disable = true;
      this.disabled = true;
      this.isShow = false;
      return this.imInfo();
    }
    this.getInfo();
  },
  methods: {
    getInfo() {
      let self = this;
      let Url = "";
      let params = {
        reqHead: {
          functionId: "HWW002002001"
        },
        body: {
          managerNo: this.hw_user_message.managerNo //  153
        }
      };
      util.ajax.post(Url, params).then(res => {
        self.infoSelected = res.data.body.data.hwMedicalInformation;
        for (var i = 0; i < res.data.body.data.CEList.length; i++) {
          self.picList.push(res.data.body.data.CEList[i].path);
        }
        for (var i = 0; i < res.data.body.data.CDList.length; i++) {
          self.diagnosisList.push(res.data.body.data.CDList[i].path);
        }
        if (self.picList.length == 4) {
          self.disabled = true;
        }
        if (self.diagnosisList.length == 4) {
          self.disable = true;
        }
        self.infoSelected.sex == 0
          ? (self.infoSelected.sex = "男")
          : (self.infoSelected.sex = "女");
      });
    },
    imInfo() {
      let self = this;
      let Url = "";
      let params = {
        reqHead: {
          functionId: "HWW002002003"
        },
        body: {
          id: this.$route.params.info_id
        }
      };
      util.ajax.post(Url, params).then(res => {
        self.infoSelected = res.data.body.data.hwMedicalInformation;
        for (var i = 0; i < res.data.body.data.CEList.length; i++) {
          self.picList.push(res.data.body.data.CEList[i].path);
        }
        for (var i = 0; i < res.data.body.data.CDList.length; i++) {
          self.diagnosisList.push(res.data.body.data.CDList[i].path);
        }
        if (self.picList.length == 4) {
          self.disabled = true;
        }
        if (self.diagnosisList.length == 4) {
          self.disable = true;
        }
        self.infoSelected.sex == 0
          ? (self.infoSelected.sex = "男")
          : (self.infoSelected.sex = "女");
      });
    },
    judge() {
      if (this.disable == true) {
        if (this.type == 3) {
          this.$toast("禁止编辑");
        } else {
          this.$toast("最多上传3张图片");
        }
      } else {
        return;
      }
    },
    judges() {
      if (this.disabled == true) {
        if (this.type == 3) {
          this.$toast("禁止编辑");
        } else {
          this.$toast("最多上传3张图片");
        }
      } else {
        return;
      }
    },
    xxx(inf) {
      let arr = [];
      if (inf == "gender") {
        for (let item in this.infoOptions) {
          arr = this.infoOptions[inf];
        }
        this.columns = arr;
      }
    },
    clickSelect(params) {
      this.showList = true;
      this.xxx(params);
    },
    onClickLeft() {
      history.go(-1);
    },
    onRead(file) {
      let self = this;
      let Url = "/file/uploadePic";
      let formData = new window.FormData();
      formData.append("file", file.file);
      util.ajax
        .post(Url, formData)
        .then(function(res) {
          if (res.data.respHead.respCode == "000") {
            self.$toast("上传成功");
            self.upload = false;
            self.filePath = res.data.body.obj.filePath;
            self.picList.push(res.data.body.obj.filePath);
            if (self.picList.length == 4) {
              self.disabled = true;
            }
          }
        })
        .catch(function(err) {
          self.$toast("上传失败，图片过大");
        });
    },
    deletePic(index) {
      this.picList.splice(index, 1);
      this.disabled = false;
    },
    onReads(file) {
      let self = this;
      let Url = "/file/uploadePic";
      let formData = new window.FormData();
      formData.append("file", file.file);
      util.ajax
        .post(Url, formData)
        .then(function(res) {
          if (res.data.respHead.respCode == "000") {
            self.$toast("上传成功");
            self.upload = false;
            self.picPath = res.data.body.obj.filePath;
            self.diagnosisList.push(res.data.body.obj.filePath);
            if (self.diagnosisList.length == 4) {
              self.disable = true;
            }
          }
        })
        .catch(function(err) {
          self.$toast("上传失败，图片过大");
        });
    },
    deleteDia(index) {
      this.diagnosisList.splice(index, 1);
      this.disable = false;
    },
    nextStep() {
      let self = this;
      let Url = "";
      let sexVal = this.infoSelected.sex;
      sexVal == "男" ? (sexVal = 0) : (sexVal = 1);
      let checkList = [];
      for (var i = 1; i < this.picList.length; i++) {
        checkList.push({ type: 0, path: this.picList[i] });
      }
      let diaList = [];
      for (var i = 1; i < this.diagnosisList.length; i++) {
        diaList.push({ type: 1, path: this.diagnosisList[i] });
      }
      let medicalInformationFileList = [];
      medicalInformationFileList = checkList.concat(diaList);

      let name = this.infoSelected.name;
      if (regName(name) == false) {
        this.$toast("请填写正确的姓名");
        return;
      } else {
        name = regName(name);
      }

      let age = this.infoSelected.age;
      if (regAge(age) == false) {
        this.$toast("请填写正确的年龄");
        return;
      } else {
        age = regAge(age);
      }

      let emergencyTelephone = this.infoSelected.emergencyTelephone;
      if (regTelePhone(emergencyTelephone) == false) {
        this.$toast("请填写正确的手机号码");
        return;
      }

      let weight = this.infoSelected.weight;
      if (heigAge(weight) == false) {
        this.$toast("请填写正确的体重");
        return;
      }

      let height = this.infoSelected.height;
      if (heigAge(height) == false) {
        this.$toast("请填写正确的身高");
        return;
      }

      let params = {
        reqHead: {
          functionId: "HWW002002002"
        },
        body: {
          managerNo: this.hw_user_message.managerNo, // 153
          age: age,
          allergyHistory: this.infoSelected.allergyHistory,
          bmi: this.bmiComputed,
          clinicalDiagnosis: this.infoSelected.clinicalDiagnosis,
          clinicalExamination: this.infoSelected.clinicalExamination,
          emergencyTelephone: this.infoSelected.emergencyTelephone,
          familyHistory: this.infoSelected.familyHistory,
          height: this.infoSelected.height,
          name: name,
          pastHistory: this.infoSelected.pastHistory,
          sex: sexVal,
          symptom: this.infoSelected.symptom,
          weight: this.infoSelected.weight,
          medicalInformationFileList: medicalInformationFileList
        }
      };
      util.ajax
        .post(Url, params)
        .then(res => {
          if (self.type == 2) {
            self.$router.push({
              name: "User"
            });
          } else {
            localStorage.setItem("infoId", res.data.body.data);
            self.$router.push({
              name: "ApplyUnscramble"
            });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    onCancel() {
      this.showList = false;
      this.$toast("取消");
    },
    onConfirm(value, index) {
      this.showList = false;
      if (index == 0 || 1) {
        this.infoSelected.sex = value;
      }
      // this.$toast(`当前值：${value}, 当前索引：${index}`);
    },
    onChange(picker, value, index) {
      // this.$toast(`当前值：${value}, 当前索引：${index}`);
    }
  },
  computed: {
    bmiComputed: function() {
      let height = this.infoSelected.height / 100;
      let weight = this.infoSelected.weight;
      if (height == "" || weight == "") {
        return "";
      }
      let bmi = weight / (height * height);
      return bmi.toFixed(1);
    }
  }
};
</script>

<style scoped>
.upload {
  background-color: #f2f2f2;
  padding-bottom: 50px;
  width: 100%;
}

.page-title {
  padding: 10px 15px;
  line-height: 24px;
  font-size: 14px;
  color: #888;
}

.next-step {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 52px;
  line-height: 46px;
  background: #ffffff;
  text-align: center;
  z-index: 10;
}

.next-step span {
	display: inline-block;
	width: 50%;
  height: 36px;
  line-height: 36px;
  color: #fff;
  font-size: 16px;
  background-color: #fb6522;
  border-radius: 6px;
  vertical-align: middle;
  text-align: center;
  z-index: 10;
}

.van-row {
  padding: 0.2rem 0;
}

.van-row--justify-center {
  justify-content: flex-start;
}
.van-uploader {
  /*width: 92%;*/
  margin-left: 4%;
}
.delete {
  width: 18px;
  height: 18px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 5;
  padding: 0 0 8px 8px;
}
.indexActive {
  z-index: 2;
}
.limitActive {
  z-index: 2;
}
</style>
