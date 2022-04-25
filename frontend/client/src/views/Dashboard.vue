<template>
   <div>
      <v-row
         no-gutters
         >
         <v-col
            cols="12"
            sm="6"
            >
            <h2>Glove Box Dashboard</h2>
            <v-chip
               class="my-3"
               :color="'cyan'"
               v-bind:class="[!autoRefreshing ? 'visibility-hidden' : '']"
               outlined
               small
               >
               <v-icon left small>
                  mdi-refresh
               </v-icon>
               Auto Refreshing
            </v-chip>
         </v-col>
         <!-- <v-col
            cols="12"
            sm="6"
            >
            <v-select
               v-model="selectedInterval"
               :items="intervals"
               @change="getEventData"
               label="Refresh Interval"
               ></v-select>
         </v-col> -->
      </v-row>
      <v-data-table
         :headers="headers"
         :items="assets"
         :items-per-page="30"
         class="elevation-1"
         :loading="loading"
         loading-text="Loading... Please wait"
         >
         <template v-slot:item.acceptable="{ item }">
            <span v-bind:class="[item.acceptable == false ? 'red--text' : item.acceptable == true ? 'green--text' : 'white--text']">{{ item.acceptable }}</span>
         </template>
         <!-- <template v-slot:item.datetime="{ item }">
            <span v-bind:class="[isStale(item.datetime) ? 'red--text' : '']">{{ new Date(item.datetime).toLocaleString() }}</span>
         </template> -->
      </v-data-table>
   </div>
</template>

<script>
import EventService from '@/services/EventService.js';

export default {
  data: () => {
    return {
      loading: false,
      autoRefreshing: false,
      headers: [
        {
          text: 'Variable',
          align: 'start',
          sortable: false,
          value: 'variable',
        },
        { text: 'Measurement', value: 'measurement' },
        { text: 'Acceptable', value: 'acceptable' },
        { text: 'Datetime', value: 'datetime' },
        // { text: 'Increase', value: 'increase' },
        // { text: 'Decrease', value: 'decrease' },
      ],
      intervals: [
        '1m',
      ],
      selectedInterval: '1m',
      assets: [
        {
          "variable": "Relative Humidity",
          "measurement": 0,
          "acceptable": "true",
          "datetime": "",
          // "increase": "No",
          // "decrease": "No",
        },
        {
          "variable": "Oxygen",
          "measurement": 0,
          "acceptable": "true",
          "datetime": "",
          // "increase": "No",
          // "decrease": "No",
        },
        {
          "variable": "Temperature",
          "measurement": 0,
          "acceptable": "true",
          "datetime": "",
          // "increase": "No",
          // "decrease": "No",
        },
      ],
      countDown: null,
      alert: true
    }
  },
  created: async function() {
    this.getEventData();
  },
  mounted: async function() {
    this.refreshCountDown();
  },
  methods: {
    // isStale: function(datetime) {
    //   const interval = this.getSecondsFromInterval(this.selectedInterval);
    //   const seconds = ((new Date(datetime).getTime() + (interval * 1000)) - new Date().getTime())/1000;
    //   return seconds < 0;
    // },
    getSecondsFromInterval(interval) {
      if (interval == '1m') {
          return 60;
      }
      return 0;
    },
    getMostRecentDatetime(times) {
        if (times.length) {
            times.sort(function compare(a, b) {
              var dateA = new Date(a);
              var dateB = new Date(b);
              return dateB - dateA;
            });
            return new Date(times[0]).toLocaleString();
        }
        return null;
    },
    refreshCountDown() {
      // setInterval(() => {
      //   const times = this.assets.map(a => a.datetime)
      //   const datetime = this.getMostRecentDatetime(times);
      //   const interval = this.interval;
      //   if (datetime) {
      //     const intervalSeconds = this.getSecondsFromInterval(interval);
      //     const seconds = Math.round(((new Date(datetime).getTime() + (intervalSeconds * 1000)) - new Date().getTime())/1000);
      //     const retrySeconds = 60; // retry once data becomes stale and a new snapshot should be available
      //     const retry = ((seconds % retrySeconds === 0) && seconds < 1);
      //     if (retry) {
      //       this.autoRefreshing = true;
      //       this.getEventData();
      //     }
      //   }
      // }, 1000)
      setInterval(() => {
        this.autoRefreshing = true;
        this.getEventData();
      }, 7500)
    },
    async getEventData() {
      this.loading = true;
      // Use the eventService to call the getEventSingle() method
      try {
        const data = await EventService.getData()
        console.log(data);
        // humidity
        this.assets[0].measurement = data[0][24]["sensor_reading"];
        this.assets[0].acceptable = data[0][24]["in_range"];
        this.assets[0].datetime = data[0]["time"].split(" ")[1];
        // oxygen
        this.assets[1].measurement = data[1][24]["sensor_reading"];
        this.assets[1].acceptable = data[1][24]["in_range"];
        this.assets[1].datetime = data[1]["time"].split(" ")[1];
        // temp
        this.assets[2].measurement = data[2][24]["sensor_reading"];
        this.assets[2].acceptable = data[2][24]["in_range"];
        this.assets[2].datetime = data[2]["time"].split(" ")[1];
        // console.log(this.assets);
      } catch (e) {
        this.assets = [];
        console.log(e);
      }
      this.loading = false;
      this.autoRefreshing = false;
    }
  },
};
</script>


<style scoped>
.visibility-hidden {
  visibility: hidden;
}
</style>