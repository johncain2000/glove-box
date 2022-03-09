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
         <!-- <template v-slot:item.acceptable="{ item }">
            <span v-bind:class="[item.acceptable === 'NO' ? 'red--text' : item.acceptable === 'YES' ? 'green--text' : 'white--text']">{{ item.action }}</span>
         </template>
         <template v-slot:item.datetime="{ item }">
            <span v-bind:class="[isStale(item.datetime) ? 'red--text' : '']">{{ new Date(item.datetime).toLocaleString() }}</span>
         </template> -->
      </v-data-table>
   </div>
</template>

<script>
// import EventService from '@/services/EventService.js';

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
        { text: 'Increase', value: 'increase' },
        { text: 'Decrease', value: 'decrease' },
      ],
      intervals: [
        '1m',
        '5m',
        '15m',
        '1h',
        '4h',
        '6h',
        '1d',
      ],
      selectedInterval: '1m',
      assets: [
        {
          "variable": "Oxygen",
          "measurement": 25,
          "acceptable": "Yes",
          "increase": "No",
          "decrease": "No",
        },
        {
          "variable": "Temperature",
          "measurement": 15,
          "acceptable": "NO",
          "increase": "Processing",
          "decrease": "No",
        },
        {
          "variable": "Relative Humidity",
          "measurement": 45,
          "acceptable": "NO",
          "increase": "No",
          "decrease": "Processing",
        },
      ],
      countDown: null,
      alert: true
    }
  },
  // created: async function() {
  //   this.getEventData();
  // },
  // mounted: async function() {
  //   this.refreshCountDown();
  // },
  methods: {
    // isStale: function(datetime) {
    //   const interval = this.getSecondsFromInterval(this.selectedInterval);
    //   const seconds = ((new Date(datetime).getTime() + (interval * 1000)) - new Date().getTime())/1000;
    //   return seconds < 0;
    // },
    // getSecondsFromInterval(interval) {
    //   if (interval == '1m') {
    //       return 60;
    //   }
    //   if (interval == '5m') {
    //       return 300;
    //   }
    //   if (interval == '15m') {
    //       return 900;
    //   }
    //   if (interval == '1h') {
    //       return 3600;
    //   }
    //   if (interval == '4h') {
    //       return 14400;
    //   }
    //   if (interval == '6h') {
    //       return 21600;
    //   }
    //   if (interval == '1d') {
    //       return 86400;
    //   }
    //   return 0;
    // },
    // getMostRecentDatetime(times) {
    //     if (times.length) {
    //         times.sort(function compare(a, b) {
    //           var dateA = new Date(a);
    //           var dateB = new Date(b);
    //           return dateB - dateA;
    //         });
    //         return new Date(times[0]).toLocaleString();
    //     }
    //     return null;
    // },
    // refreshCountDown() {
    //   setInterval(() => {
    //     const times = this.assets.map(a => a.datetime)
    //     const datetime = this.getMostRecentDatetime(times);
    //     const interval = this.interval;
    //     if (datetime) {
    //       const intervalSeconds = this.getSecondsFromInterval(interval);
    //       const seconds = Math.round(((new Date(datetime).getTime() + (intervalSeconds * 1000)) - new Date().getTime())/1000);
    //       const retrySeconds = 60; // retry once data becomes stale and a new snapshot should be available
    //       const retry = ((seconds % retrySeconds === 0) && seconds < 1);
    //       if (retry) {
    //         this.autoRefreshing = true;
    //         this.getEventData();
    //       }
    //     }
    //   }, 1000)
    // },
    // async getEventData() {
    //   this.loading = true;
    //   // Use the eventService to call the getEventSingle() method
    //   try {
    //     const data = await EventService.getAssets(this.selectedInterval)
    //     data.forEach(d => {d.datetime = d.datetime['$date']})
    //     this.assets = data;
    //   } catch (e) {
    //     this.assets = [];
    //   }
    //   this.loading = false;
    //   this.autoRefreshing = false;
    // }
  },
};
</script>


<style scoped>
.visibility-hidden {
  visibility: hidden;
}
</style>