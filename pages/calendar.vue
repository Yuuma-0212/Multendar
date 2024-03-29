<template>
  <v-main>
    <nav class="nav">
      <ul class="nav__list">
        <li class="nav__list-item">
          <button class="nav__btn" :class="{ active: isActiveNum === '1' }" @click="changeActiveTab('1')">
            Calendar
          </button>
        </li>
        <li class="nav__list-item">
          <button class="nav__btn" :class="{ active: isActiveNum === '2' }" @click="changeActiveTab('2')">
            Add Event
          </button>
        </li>
        <li class="nav__list-item">
          <button class="nav__btn" :class="{ active: isActiveNum === '3' }" @click="changeActiveTab('3')">
            Contact
          </button>
        </li>
      </ul>
    </nav>
    <div class="u-container">
      <ul class="tabs">
        <v-scroll-x-transition :hide-on-leave="true">
          <li class="tabs__item py-10 px-2 px-md-15" v-show="isActiveNum === '1'">
            <v-toolbar flat>
              <v-spacer></v-spacer>
              <v-btn fab text small color="grey darken-2" @click="prev">
                <v-icon> mdi-chevron-left </v-icon>
              </v-btn>
              <v-toolbar-title class="mx-3 calendar__title" v-if="$refs.calendar">
                {{ $refs.calendar.title }}
              </v-toolbar-title>
              <v-btn fab text small color="grey darken-2" @click="next">
                <v-icon> mdi-chevron-right </v-icon>
              </v-btn>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-toolbar flat>
              <v-select class="calendar__selected-area" v-model="selectedArea" left :items="areas" label="地域" outlined
                :dense="true" :hide-details="true" return-object item-text="name" :loading="isLoadingSelectedArea"
                @change="changeForecastArea" item-value="1"></v-select>
              <v-spacer></v-spacer>
              <v-btn class="mr-sm-3" outlined color="grey darken-2" @click="setToday">
                Today
              </v-btn>
              <v-spacer v-if="cWindowW < xsWindowW"></v-spacer>
              <v-menu bottom right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                    <span>{{ typeToLabel[type] }}</span>
                    <v-icon right> mdi-menu-down </v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="type = 'day'">
                    <v-list-item-title>Day</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'week'">
                    <v-list-item-title>Week</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'month'">
                    <v-list-item-title>Month</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = '4day'">
                    <v-list-item-title>4 days</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
            <div class="calendar__calendar">
              <v-calendar ref="calendar" v-model="focus" color="primary" locale="ja-JP"
                :class="{ 'type-week': isTypeWeek }" :show-month-on-first="false" :events="events"
                :event-color="getEventColor" :type="type" :day-format="dayFormatCalendar" @click:event="showEvent"
                @click:date="viewDay" @click:more="viewDay" @change="updateRange">
                <template v-slot:day-label="{ date, day }">
                  <v-row class="ma-0" justify="center">
                    <template v-if="date === dateToday">
                      <v-btn fab color="primary" small elevation="0" @click="cViewDay(date)">
                        <span>{{ day }}</span>
                      </v-btn>
                    </template>
                    <template v-else>
                      <v-btn fab text small @click="cViewDay(date)">
                        <span>{{ day }}</span>
                      </v-btn>
                    </template>
                    <template v-if="forecastWeek[date]">
                      <div class="calendar__weather-img-outer">
                        <img class="calendar__weather-img" :src="forecastWeek[date].icon" />
                      </div>
                    </template>
                  </v-row>
                </template>
                <template v-slot:day-label-header="{ date, day }">
                  <v-row class="ma-0" justify="center" aline-content="center">
                    <template v-if="day === dateToday">
                      <v-btn fab color="primary" small elevation="0" @click="cViewDay(date)">
                        <span>{{ day }}</span>
                      </v-btn>
                    </template>
                    <template v-else>
                      <v-btn fab text small @click="cViewDay(date)">
                        <span>{{ day }}</span>
                      </v-btn>
                    </template>
                    <template v-if="forecastWeek[date]">
                      <div class="calendar__weather-img-outer">
                        <img class="calendar__weather-img" :src="forecastWeek[date].icon" />
                      </div>
                    </template>
                  </v-row>
                  <p class="calendar__temp ma-0" v-if="forecastWeek[date]">
                    <span><font-awesome-icon icon="fa-solid fa-temperature-arrow-up" />
                      {{ forecastWeek[date].tempMax }}</span><br />
                    <span><font-awesome-icon icon="fa-solid fa-temperature-arrow-down" />
                      {{ forecastWeek[date].tempMin }}</span>
                  </p>
                </template>
                <template v-slot:interval="{ date, hour }">
                  <template v-if="date && forecastHour[date + '-' + hour]">
                    <img class="calendar__weather-img-hour" :src="forecastHour[date + '-' + hour].icon" />
                  </template>
                </template>
              </v-calendar>
              <v-dialog v-model="selectedOpenDialog" :activator="selectedElement" max-width="1000px">
                <v-card flat min-height="80vh">
                  <v-row no-gutters>
                    <v-col class="col-12 col-md-8" order-md="2">
                      <Gmap :markers="selectedEvent.markers" />
                    </v-col>
                    <v-col class="col-12 col-md-4" order-md="1">
                      <v-card-text class="calendar__event-info">
                        <v-list>
                          <v-list-item>
                            <v-list-item-action>
                              <v-icon :style="{ color: selectedEvent.color }">mdi-calendar</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                              <v-list-item-title class="calendar__event-detail-text" v-text="selectedEvent.name">
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider inset></v-divider>
                          <v-list-item>
                            <v-list-item-action>
                              <v-icon :style="{ color: selectedEvent.color }">mdi-clock-time-three-outline</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                              <v-list-item-title class="calendar__event-detail-text">
                                {{ selectedEventSdate }} ~
                                {{ selectedEventEdate }}
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider inset></v-divider>
                          <v-list-item>
                            <v-list-item-action>
                              <v-icon :style="{ color: selectedEvent.color }">mdi-map-marker</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                              <v-list-item-title class="calendar__event-detail-text" v-text="selectedEvent.address">
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider inset></v-divider>
                          <v-list-item>
                            <v-list-item-action>
                              <v-icon :style="{ color: selectedEvent.color }">mdi-bell-ring-outline</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                              <v-list-item-title class="calendar__event-detail-text">
                                {{ selectedEvent.notificationTime }}<span class="ml-1">分前に通知</span>
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider inset></v-divider>
                          <v-list-item class="calendar__event-info-list-item">
                            <v-list-item-action>
                              <v-icon :style="{ color: selectedEvent.color }">mdi-note-outline</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                              <v-list-item-title class="calendar__event-detail-text--memo"
                                v-text="selectedEvent.memo"></v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>
                        <v-card-actions class="calendar__event-info-btns mt-2 d-flex align-end">
                          <v-row justify="space-between">
                            <v-btn text color="secondary" @click="selectedOpenDialog = false">
                              <v-icon>mdi-chevron-left</v-icon>戻る
                            </v-btn>
                            <div class="pt-1 mr-2">
                              <v-dialog v-model="eventDeleteDialog" max-width="350">
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn color="error" small v-bind="attrs" v-on="on">
                                    削除
                                  </v-btn>
                                </template>
                                <v-card class="d-flex flex-column align-center">
                                  <v-card-title class="text-body-1">
                                    本当にこのイベントを削除しますか？
                                  </v-card-title>
                                  <v-card-actions class="d-flex justify-end pt-0">
                                    <v-btn color="green darken-1" text @click="eventDeleteDialog = false">
                                      キャンセル
                                    </v-btn>
                                    <v-btn color="error" text @click="deleteEvent(selectedEvent.createAt)">
                                      削除
                                    </v-btn>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>
                            </div>
                          </v-row>
                        </v-card-actions>
                      </v-card-text>
                    </v-col>
                  </v-row>
                </v-card>
              </v-dialog>
            </div>
          </li>
        </v-scroll-x-transition>
        <v-scroll-x-transition :hide-on-leave="true">
          <li class="tabs__item py-10 px-10 px-md-16" v-show="isActiveNum === '2'">
            <v-row justify="center">
              <v-form class="form" max-width="500" ref="form">
                <div>
                  <label class="form__label" for="title">タイトル</label>
                  <v-text-field id="title" class="text-body-2" clearable v-model="title" :rules="[rules.title]" outlined
                    :dense="true"></v-text-field>
                </div>
                <div class="calendar__input-wrapper">
                  <template>
                    <v-dialog ref="dialogDateS" v-model="isOpenDialogDateS" :return-value.sync="dateS" width="290px">
                      <template v-slot:activator="{ on, attrs }">
                        <div class="form__input">
                          <label class="form__label" for="dateS">予定日</label>
                          <v-text-field id="dateS" class="text-body-2" v-model="dateS" v-bind="attrs" v-on="on" readonly
                            outlined :full-width="true" :dense="true"></v-text-field>
                        </div>
                      </template>
                      <v-date-picker v-model="dateS" scrollable locale="ja-jp" :day-format="dayFormatDate">
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="isOpenDialogDateS = false">
                          キャンセル
                        </v-btn>
                        <v-btn text color="primary" @click="$refs.dialogDateS.save(dateS)">
                          決定
                        </v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </template>
                  <div class="mx-3"></div>
                  <template>
                    <v-dialog ref="dialogDateE" v-model="isOpenDialogDateE" :return-value.sync="dateE" width="290px">
                      <template v-slot:activator="{ on, attrs }">
                        <div class="form__input">
                          <label class="form__label" for="dateE">終了日</label>
                          <v-text-field class="text-body-2" v-model="dateE" v-bind="attrs" v-on="on" readonly outlined
                            :dense="true"></v-text-field>
                        </div>
                      </template>
                      <v-date-picker v-model="dateE" scrollable locale="ja-jp" :day-format="dayFormatDate">
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="isOpenDialogDateE = false">
                          キャンセル
                        </v-btn>
                        <v-btn text color="primary" @click="$refs.dialogDateE.save(dateE)">
                          決定
                        </v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </template>
                </div>
                <div class="calendar__input-wrapper">
                  <template>
                    <v-dialog ref="dialogTimeS" v-model="isOpenDialogTimeS" :return-value.sync="timeS" width="290px">
                      <template v-slot:activator="{ on, attrs }">
                        <div class="form__input">
                          <label class="form__label" for="timeS">開始時刻</label>
                          <v-text-field id="timeS" class="text-body-2" clearable placeholder="00:00" v-model="timeS"
                            v-bind="attrs" v-on="on" readonly outlined :dense="true"></v-text-field>
                        </div>
                      </template>
                      <v-time-picker v-if="isOpenDialogTimeS" v-model="timeS" format="24hr" full-width>
                        <v-btn text color="primary" @click="isOpenDialogTimeS = false">
                          キャンセル
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="$refs.dialogTimeS.save(timeS)">
                          決定
                        </v-btn>
                      </v-time-picker>
                    </v-dialog>
                  </template>
                  <div class="mx-3"></div>
                  <template>
                    <v-dialog ref="dialogTimeE" v-model="isOpenDialogTimeE" :return-value.sync="timeE" width="290px">
                      <template v-slot:activator="{ on, attrs }">
                        <div class="form__input">
                          <label class="form__label" for="timeE">終了時刻</label>
                          <v-text-field id="timeE" class="text-body-2" clearable placeholder="00:00" v-model="timeE"
                            v-bind="attrs" v-on="on" readonly outlined :dense="true"></v-text-field>
                        </div>
                      </template>
                      <v-time-picker v-if="isOpenDialogTimeE" v-model="timeE" format="24hr" full-width>
                        <v-btn text color="primary" @click="isOpenDialogTimeE = false">
                          キャンセル
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="$refs.dialogTimeE.save(timeE)">
                          決定
                        </v-btn>
                      </v-time-picker>
                    </v-dialog>
                  </template>
                </div>
                <label class="form__label" for="iptLocation">場所</label>
                <GmapAc @updateEventData="updateEventData" />
                <v-row no-gutters>
                  <div>
                    <label class="form__label" for="iptNotification">通知</label>
                    <div class="calendar__input-notification">
                      <v-text-field id="iptNotification" class="text-body-2" v-model="notificationTime" type="number"
                        max="60" min="0" outlined :dense="true" suffix="分前に通知" @change="matchNum($event)"></v-text-field>
                    </div>
                  </div>
                  <v-col class="ml-4" align-self="center">
                    <v-checkbox v-model="isNotification" :false-value="true" :true-value="false"
                      label="通知を無効にする"></v-checkbox>
                  </v-col>
                </v-row>
                <label class="form__label" for="memo">メモ</label>
                <v-textarea id="memo" class="text-body-2" v-model="memo" outlined clearable no-resize
                  :dense="true"></v-textarea>
                <div class="calendar__event-color mb-7">
                  <span class="text-body-2 mr-3">イベントカラー:</span>
                  <v-swatches v-model="eventColor" :swatches="swatches"></v-swatches>
                </div>
                <v-btn color="primary" width="100%" @click="addSchedule">予定を追加</v-btn>
              </v-form>
            </v-row>
          </li>
        </v-scroll-x-transition>
        <v-scroll-x-transition :hide-on-leave="true">
          <li class="tabs__item" v-show="isActiveNum === '3'">
            <Contact />
          </li>
        </v-scroll-x-transition>
      </ul>
    </div>
  </v-main>
</template>

<script>
import { functions } from "~/plugins/firebase.js";
import { addEvent, deleteEvent, getEvents } from "~/plugins/firebase-firestore.js";
import { areas } from "~/plugins/areas.js";
import { reqNotificationPermission } from "~/plugins/firebase-fcm.js";
import { httpsCallable } from 'firebase/functions';
import Contact from "~/components/Contact.vue";
import Gmap from "~/components/Gmap.vue";
import GmapAc from "~/components/GmapAc.vue";

export default {
  components: { Contact, Gmap, GmapAc },
  name: "calendar",
  data: () => ({
    focus: null,
    type: "month",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days"
    },
    selectedEvent: {},
    selectedEventSdate: null,
    selectedEventEdate: null,
    selectedElement: null,
    selectedOpenDialog: false,
    events: [],
    isOpenDialogTimeS: false,
    isOpenDialogTimeE: false,
    isOpenDialogDateS: false,
    isOpenDialogDateE: false,
    timeS: null,
    timeE: null,
    dateS: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    dateE: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    title: "",
    rules: {
      title: (value) => /\S/g.test(value) || "タイトルを入力してください",
    },
    memo: "",
    notificationTime: "0",
    isNotification: true,
    eventColor: "#FF5252",
    eventDeleteDialog: false,
    fcmToken: "",
    swatches: [
      "#FF5252",
      "#FF4081",
      "#7C4DFF",
      "#448AFF",
      "#536DFE",
      "#64FFDA",
      "#69F0AE",
      "#EEFF41",
      "#FFD740",
    ],
    forecastCurrent: null,
    dateToday: null,
    isActiveNum: "1",
    cWindowW: 0,
    xsWindowW: 600,
    areas: null,
    selectedArea: null,
    lat: null,
    lng: null,
    markers: [],
    place: null,
    address: null,
    isTypeWeek: false,
    forecastWeek: {},
    forecastHour: {},
    isLoadingSelectedArea: false,
    isGuest: false
  }),
  async mounted() {
    this.$refs.calendar.checkChange();
    this.cWindowW = window.innerWidth;

    window.addEventListener("resize", () => {
      this.cWindowW = window.innerWidth;
    });

    const uid = this.$cookies.get("uid");
    if (uid === "guest") {
      this.isGuest = true;
      return;
    }

    if (!this.isGuest) {
      await reqNotificationPermission().then((fcmToken) => {
        console.log("fcmToken", fcmToken);
        this.fcmToken = fcmToken;
        this.setNotification(this.fcmToken);
      });
    }

    // 天気予報を取得
    const selectedArea = JSON.parse(
      JSON.stringify(this.$store.getters.getSelectedArea)
    );
    if (Object.keys(selectedArea).length) {
      const forecast = await this.$axios.$get("/getForecast", {
        params: {
          lat: selectedArea.lat,
          lon: selectedArea.lon,
        },
      });

      this.selectedArea = selectedArea;
      this.forecastWeek = forecast.week;
      this.forecastHour = forecast.hour;
    }

    const date = new Date();
    const dateToday = this.formatDate(date);
    this.dateToday = dateToday;

    // イベントの表示処理
    const events = await getEvents(uid);
    if (events !== undefined) {
      this.events = events;
      this.$store.dispatch("setEvents", events);
    }
  },
  async created() {
    this.areas = areas;
  },
  methods: {
    viewDay(date) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        let sFormatDate = "";
        let sTime = "";

        if (event.start != null) {
          const sDate = new Date(event.start);
          const sMonth = this.formatDateDigit(sDate.getMonth() + 1);
          const sDay = this.formatDateDigit(sDate.getDate());
          const shour = this.formatDateDigit(sDate.getHours());
          const sMinute = this.formatDateDigit(sDate.getMinutes());
          sFormatDate = `${sMonth}/${sDay}`;
          sTime = `${shour}:${sMinute}`;
        }

        let eFormatDate = "";
        let eTime = "";

        if (event.end != null) {
          const eDate = new Date(event.end);
          const eMonth = this.formatDateDigit(eDate.getMonth() + 1);
          const eDay = this.formatDateDigit(eDate.getDate());
          const ehour = this.formatDateDigit(eDate.getHours());
          const eMinute = this.formatDateDigit(eDate.getMinutes());
          eFormatDate = `${eMonth}/${eDay}`;
          eTime = `${ehour}:${eMinute}`;
        }

        this.selectedEventSdate = `${sFormatDate} ${sTime}`;
        this.selectedEventEdate = `${eFormatDate} ${eTime}`;
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpenDialog = true))
        );
      };

      if (this.selectedOpenDialog) {
        this.selectedOpenDialog = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      if (this.type === "week") {
        this.isTypeWeek = true;
      } else {
        this.isTypeWeek = false;
      }

      this.events = JSON.parse(JSON.stringify(this.$store.getters.getEvents));
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    cViewDay(date) {
      this.focus = date;
      this.type = "day";
    },
    dayFormatCalendar(date) {
      return new Date(date.date).getDate();
    },
    dayFormatDate(date) {
      return new Date(date).getDate();
    },
    async addSchedule() {
      let start = null;
      let end = null;

      if (this.timeS != null) {
        start = new Date(this.dateS + "T" + this.timeS);
      } else {
        start = new Date(this.dateS);
      }
      if (this.timeE != null) {
        end = new Date(this.dateE + "T" + this.timeE);
      } else {
        end = new Date(this.dateE);
      }

      const newEvent = {
        name: this.title,
        start: start.getTime(),
        end: end.getTime(),
        address: this.address,
        markers: this.markers,
        notificationTime: this.notificationTime,
        isNotification: this.isNotification,
        color: this.eventColor,
        memo: this.memo,
        timed: true,
        createAt: new Date()
      }

      // 同じイベントの場合追加しない
      const eventsL = this.events.length;
      for (let i = 0; i < eventsL; i++) {
        if (JSON.stringify(newEvent) === JSON.stringify(this.events[i])) {
          return;
        }
      }

      this.events.push(newEvent);

      if (this.isGuest) {
        this.$toast.success("登録が完了しました", {
          position: "top-right",
        });

        return;
      }

      await addEvent(newEvent)
        .then(() => {
          this.setNotification(this.fcmToken);
          this.$toast.success("登録が完了しました", {
            position: "top-right",
          });
        })
        .catch((error) => {
          this.$toast.error("登録に失敗しました " + error, {
            position: "top-right",
          });
        });
    },
    changeActiveTab(num) {
      this.isActiveNum = num;
    },
    getOwUrl(param) {
      const url = `https://api.openweathermap.org/data/2.5/${param}?q=Osaka&appid=e55dace96a6165e3793d081519253b8d&units=metric&lang=ja`;
      return url;
    },
    updateEventData(place) {
      this.lat = place.geometry.location.lat();
      this.lng = place.geometry.location.lng();
      this.address = place.formatted_address;
      this.markers.shift();
      this.markers.push({
        position: {
          lat: this.lat,
          lng: this.lng,
        },
      });
    },
    formatDateDigit(date) {
      return ("0" + date).slice(-2);
    },
    matchNum(event) {
      const num = Number(event);

      if (!event.match(/\S/g) || num < 0 || num > 60) {
        this.notificationTime = "0";
        return;
      }

      this.notificationTime = String(num);
    },
    async changeForecastArea(event) {
      this.isLoadingSelectedArea = true;
      await this.$axios
        .$get("/getForecast", {
          params: {
            lat: event.lat,
            lon: event.lon,
          },
        })
        .then((forecast) => {
          this.forecastWeek = forecast.week;
          this.forecastHour = forecast.hour;
        });

      this.$cookies.set("selectedArea", JSON.stringify(event));
      this.isLoadingSelectedArea = false;
    },
    formatDate(date) {
      // YYYY-MM-DDにフォーマット
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ("0" + date.getDate()).slice(-2);
      const fDate = `${date.getFullYear()}-${month}-${day}`;
      return fDate;
    },
    setNotification(fcmToken) {
      const sendMessage = httpsCallable(functions, "sendMessage");
      // イベントの通知設定
      const events = JSON.parse(JSON.stringify(this.events));

      if (events.length > 0) {
        const notificationData = {
          events: events,
          fcmToken: fcmToken,
        };

        sendMessage(notificationData);
      }
    },
    async deleteEvent(eventCreateDate) {
      this.eventDeleteDialog = false;
      this.selectedOpenDialog = false;
      const eventCreateDateSec = JSON.parse(JSON.stringify(eventCreateDate)).seconds;
      const events = JSON.parse(JSON.stringify(this.events));
      const eventsL = this.events.length;
      const deleteCount = 1;

      // 削除するイベントを探す
      for (let i = 0; i < eventsL; i++) {
        if (events[i].createAt.seconds !== eventCreateDateSec) continue;

        if (this.isGuest) {
          this.events.splice(i, deleteCount);
          this.$toast.success("イベントが削除されました", {
            position: "top-right",
          });
        } else {
          await deleteEvent(this.events[i])
            .then(() => {
              this.events.splice(i, deleteCount);
              this.$toast.success("イベントが削除されました", {
                position: "top-right",
              });
            })
            .catch((error) => {
              this.$toast.error("イベントの削除に失敗しました error: " + error, {
                position: "top-right",
              });
            });
        }

        break;
      }
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~vuetify/src/styles/styles.sass";
@import "~/assets/scss/variables.scss";

@mixin event-detail-text($white-space) {
  font-size: 0.875rem;
  word-break: break-all;
  white-space: $white-space;
}

.nav__list-item {
  &:nth-child(1) {
    .nav__btn {
      &::before {
        @include navSubTitle("カレンダー");
      }
    }
  }

  &:nth-child(2) {
    .nav__btn {
      &::before {
        @include navSubTitle("イベント追加");
      }
    }
  }

  &:nth-child(3) {
    .nav__btn {
      &::before {
        @include navSubTitle("お問い合わせ");
      }
    }
  }
}

.type-week {
  width: 600px;
}

.calendar {
  &__calendar {
    height: 500px;
  }

  &__title {
    font-size: 1.5rem;
    font-family: "RocknRollOne";
  }

  &__selected-area {
    max-width: 110px;
  }

  &__input-notification {
    width: 140px;
  }

  &__input-wrapper {
    display: flex;
    justify-content: space-between;
  }

  &__tilde {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__event-color {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  &__weather-img-outer {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__weather-img {
    width: 24px;
    height: 24px;
  }

  &__weather-img-hour {
    width: 20px;
    height: 20px;
    position: absolute;
    margin-top: 12px;
    margin-left: -32px;
  }

  &__temp {
    font-size: 0.75rem;
  }

  &__event-info {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  &__event-info-btns {
    height: 100%;
  }

  &__event-detail-text {
    @include event-detail-text(normal);

    &--memo {
      @include event-detail-text(pre-wrap);
      max-height: 40vh;
      overflow-y: auto;
    }
  }

  &__back-icon {
    font-size: 1.125rem;
  }

  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    &__calendar {
      height: 700px;
    }
  }
}

@media #{map-get($display-breakpoints, 'sm-and-up')} {
  .type-week {
    width: 100%;
  }
}
</style>
