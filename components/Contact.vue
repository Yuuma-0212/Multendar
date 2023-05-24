<template>
  <div>
    <h2 class="section__title">Contact</h2>
    <div class="section__img-outer">
      <img class="section__img" src="/img/letter.png" />
    </div>
    <v-form ref="form" class="form" v-model="valid" lazy-validation>
      <div class="mb-2">
        <label class="form__label" for="e-mail">メールアドレス</label>
        <v-text-field class="mt-1" v-model="mailContents.email" label="example@example.co.jp" single-line outlined
          :dense="true" :rules="eMailRules" id="e-mail" required></v-text-field>
      </div>
      <div class="mb-2">
        <label class="form__label">お問い合わせの種類</label>
        <v-radio-group v-model="mailContents.contactType" row mandatory>
          <div class="mr-5">
            <v-radio class="mb-3" label="不具合" value="不具合"></v-radio>
            <v-radio label="ご要望" value="ご要望"></v-radio>
          </div>
          <div>
            <v-radio class="mb-3" label="感想" value="感想"></v-radio>
            <v-radio label="その他" value="その他"></v-radio>
          </div>
        </v-radio-group>
        <v-text-field class="mt-1" v-model="mailContents.typeOtherContent" label="その他の内容" single-line outlined
          :dense="true"></v-text-field>
      </div>
      <div class="mb-2">
        <label class="form__label" for="contactText">お問い合わせ内容</label>
        <v-textarea id="contactText" v-model="mailContents.contactText" :rules="contactTextRules" single-line outlined
          :no-resize="true" required></v-textarea>
        <v-btn class="section__btn" color="#333333" rounded type="button" width="180" height="50" @click="sendEmail"
          :loading="sendMailLoading">
          送信する
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import { httpsCallable } from 'firebase/functions';
import { functions } from "~/plugins/firebase";

export default {
  name: "Contact",
  data: () => ({
    valid: true,
    sendMailLoading: false,
    mailContents: {
      email: "",
      contactType: "",
      typeOtherContent: "",
      contactText: "",
    },
    eMailRules: [
      v => !!v || "メールアドレスを入力してください",
      v => /.+@.+/.test(v) || "メールアドレスが正しくありません",
    ],
    contactTextRules: [v => !!v || "お問い合わせ内容を入力してください"]
  }),
  methods: {
    async sendEmail() {
      if (!this.$refs.form.validate()) return;

      this.sendMailLoading = true;

      const sendMail = httpsCallable(functions, "sendMail");
      await sendMail(this.mailContents).then(() => {
        this.$refs.form.reset();
        this.$toast.success("送信完了: お問い合わせありがとうございます", {
          position: "top-right",
        });
        this.sendMailLoading = false;
      })
        .catch(error => {
          this.$toast.error("送信失敗: " + error, {
            position: "top-right",
          });
        })
    }
  }
};
</script>

<style lang="scss" scoped></style>
