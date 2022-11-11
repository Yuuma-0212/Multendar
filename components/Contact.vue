<template>
  <div>
    <h2 class="section__title">Contact</h2>
    <div class="section__img-outer">
      <img class="section__img" src="/img/letter.png" />
    </div>
    <v-form class="form" v-model="valid">
      <div class="mb-2">
        <label class="form__label" for="e-mail">メールアドレス</label>
        <v-text-field
          class="mt-1"
          v-model="eMail"
          label="example@example.co.jp"
          single-line
          outlined
          :dense="true"
          :rule="eMailRules"
          id="e-mail"
        ></v-text-field>
      </div>
      <div class="mb-2">
        <label class="form__label">お問い合わせの種類</label>
        <v-row>
          <v-col col="6">
            <v-radio-group v-model="contactType" column>
              <v-radio label="不具合" value="不具合"></v-radio>
              <v-radio label="ご要望" value="ご要望"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col col="6">
            <v-radio-group v-model="contactType" column>
              <v-radio label="感想" value="感想"></v-radio>
              <v-radio label="その他" value="その他"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-text-field
          class="mt-1"
          v-model="typeOtherDetail"
          label="その他の内容"
          single-line
          outlined
          :dense="true"
        ></v-text-field>
      </div>
      <div class="mb-2">
        <label class="form__label" for="contactDetail"
          >お問い合わせの内容</label
        >
        <v-textarea
          id="contactDetail"
          v-model="contactDetail"
          single-line
          outlined
          :no-resize="true"
        ></v-textarea>
        <v-btn
          class="section__btn"
          color="#333333"
          rounded
          type="button"
          width="180"
          height="50"
        >
          送信する
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
export default {
  name: "Contact",
  data: () => ({
    valid: "",
    eMail: "",
    contactType: "",
    typeOtherDetail: "",
    contactDetail: "",
    eMailRules: [
      (v) => !!v || "メールアドレスを入力してください",
      (v) => /.+@.+/.test(v) || "メールアドレスが正しくありません",
    ],
  }),
};
</script>

<style lang="scss" scoped></style>
