<template>
  <div class="mb-5">
    <v-btn
      dark
      :loading="loading && !autoRefreshing"
      :disabled="loading"
      @click="dialog = true"
    >
      Edit Widget
    </v-btn>
    <v-chip
       class="ml-3"
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
    <v-card v-if="plotlyData" :loading="autoRefreshing" class="mt-5 mr-5">
        <Plotly :data="plotlyData" :layout="plotlyLayout" :display-mode-bar="false"></Plotly>
    </v-card>
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-form ref="form" lazy-validation>
          <v-card-title class="text-h5">
            Asset Chart
          </v-card-title>
          <v-card-text>
            <v-select
              :items="options.exchanges"
              label="Exchange"
              v-model="selected.exchange"
              :rules="[rules.required]"
            ></v-select>
            <v-select
              :items="options.assets[selected.exchange]"
              label="Coin"
              v-model="selected.asset"
              :rules="[rules.required]"
            ></v-select>
            <v-select
              :items="options.intervals"
              label="Interval"
              v-model="selected.interval"
              :rules="[rules.required]"
            ></v-select>
            <v-select
              :items="options.indicators"
              label="Indicator"
              v-model="selected.indicator"
              :rules="[rules.required]"
            ></v-select>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
              text
              :disabled="loading"
              @click="clearChart"
            >
              Remove
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              text
              :disabled="loading"
              @click="dialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              text
              :loading="loading"
              :disabled="loading"
              @click="submitDialog"
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import EventService from '@/services/EventService.js';
import { Plotly } from 'vue-plotly';

export default {
  props: ['widgetIndex', 'widgetParams'],
  components: {
    Plotly
  },
  data: () => {
    return {
      rules: {
        required: value => !!value || 'Required.',
      },
      plotlyDatetime: null,
      plotlyData: null,
      plotlyLayout: null,
      options: {
        exchanges: ['Binance', 'Coinbase', 'Gemini', 'FTXUS', 'Kraken'],
        assets: {
        "Binance": ["BTC-USD", "ETH-USD", "ALGO-USD", "MATIC-USD", "ADA-USD", "ATOM-USD", "SOL-USD", "LINK-USD", "GRT-USD"],
        "Coinbase": ["BTC-USD", "ETH-USD", "ADA-USD", "AVAX-USD", "ATOM-USD", "ALGO-USD", "UNI-USD", "DOT-USD", "KEEP-USD", "SOL-USD", "GRT-USD", "MATIC-USD", "WLUNA-USD", "LINK-USD", "GTC-USD", "XLM-USD", "ANKR-USD"],
        "Gemini": ["BTC-USD", "ETH-USD", "MATIC-USD", "LUNA-USD", "LINK-USD"],
        "FTXUS": ["MATIC-USD", "BTC-USD", "ETH-USD", "SOL-USD", "LINK-USD", "GRT-USD"],
        "Kraken": ["ALGO-USD", "MATIC-USD", "BTC-USD", "ETH-USD", "ADA-USD", "ATOM-USD", "DOT-USD", "SOL-USD", "KEEP-USD", "SAND-USD", "RAY-USD", "LINK-USD", "GRT-USD"],
        },
        intervals: ['1m', '5m', '15m', '1h', '4h', '6h', '1d'],
        indicators: ['price', 'index', 'volume'],
      },
      selected: {
        exchange: '',
        asset: '',
        interval: '',
        indicator: '',
      },
      dialog: false,
      loading: false,
      autoRefreshing: false,
    }
  },
  computed: {
  },
  created() {
    if (this.widgetParams) {
        this.selected = this.widgetParams;
        this.getEventData();
    }
  },
  mounted() {
    this.refreshCountDown()
  },
  methods: {
    ...mapMutations(["setWidget"]),
    getSecondsFromInterval(interval) {
      if (interval == '1m') {
          return 60;
      }
      if (interval == '5m') {
          return 300;
      }
      if (interval == '15m') {
          return 900;
      }
      if (interval == '1h') {
          return 3600;
      }
      if (interval == '4h') {
          return 14400;
      }
      if (interval == '6h') {
          return 21600;
      }
      if (interval == '1d') {
          return 86400;
      }
      return 0;
    },
    refreshCountDown() {
      setInterval(() => {
        const datetime = this.plotlyDatetime;
        const interval = this.selected.interval;
        if (datetime) {
          const intervalSeconds = this.getSecondsFromInterval(interval);
          const seconds = Math.round(((new Date(datetime).getTime() + (intervalSeconds * 1000)) - new Date().getTime())/1000);
          const retrySeconds = 60; // retry once data becomes stale and a new snapshot should be available
          const retry = ((seconds % retrySeconds === 0) && seconds < 1);
          if (retry) {
            this.autoRefreshing = true;
            this.getEventData();
          }
        }
      }, 1000)
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
    async getEventData() {
        if (!(this.selected.exchange && this.selected.asset && this.selected.interval)) {
            return;
        }
        this.loading = true;
        try {
          const data = await EventService.getLiveData(this.selected)
          const title = `${this.selected.exchange} ${this.selected.asset} - ${this.selected.interval}`;
          if (this.selected.indicator === 'price') {
            this.setWidget({params: this.selected, index: this.widgetIndex});
            this.plotPrice(data, title);
          }
          if (this.selected.indicator === 'index') {
            this.setWidget({params: this.selected, index: this.widgetIndex});
            this.plotIndex(data, title);
          }
          if (this.selected.indicator === 'volume') {
            this.setWidget({params: this.selected, index: this.widgetIndex});
            this.plotVolume(data, title);
          }
        } catch (e) {
          this.assets = [];
        }
        this.autoRefreshing = false;
        this.loading = false;
        this.dialog = false;
    },
    async submitDialog() {
      const formValid = this.$refs.form.validate();
      if (formValid) {
        this.getEventData()
      }
    },
    clearChart() {
        this.plotlyData = null;
        this.plotlyLayout = null;
        this.dialog = false;
        this.setWidget({params: null, index: this.widgetIndex});
    },
    async plotIndex(data, title) {
        const formattedData = [];
        data.forEach(d => {
            formattedData.push({ index: +d["index"] });
        })
        const index = formattedData.map((obj) => {
            return obj.index;
        });
        const index_sma = data.map((obj) => {
            return obj.indexSMA;
        });
        const times = data.map((obj) => {
            return obj.datetime.$date;
        });
        const mostRecentDatetime = this.getMostRecentDatetime(times);
        const index_upper_bound = Math.max(...index.slice(-50));
        const index_lower_bound = Math.min(...index.slice(-50));
        const time_lower_range = new Date(times[times.length - 51]);
        const time_upper_range = new Date(times[times.length - 1]);
        const plotlyLayout = {
            title: `${title}<br><sup>${mostRecentDatetime}</sup>`,
            margin: { l: 50, r: 50, b: 50, t: 70, pad: 4 },
            xaxis: { range: [time_lower_range, time_upper_range], showgrid: false, type: "date", rangeslider: { visible: false } },
            yaxis: { range: [index_lower_bound, index_upper_bound], showgrid: false },
            plot_bgcolor: 'rgba(0, 0, 0, 0)',
            paper_bgcolor: 'rgba(0, 0, 0, 0)',
            font: {
                size: 12,
                color: 'white'
            },
        };
        const plotlyData = [
            { x: times, y: index, name: "index", type: "bar", showlegend: false, marker: { color: "rgb(78 193 224)" } },
            { x: times, y: index_sma, name: "index_sma", mode: "lines", showlegend: false, line: { color: "red", width: 3 } },
        ];
        this.plotlyDatetime = mostRecentDatetime;
        this.plotlyData = plotlyData;
        this.plotlyLayout = plotlyLayout;
    },
    async plotPrice(data, title) {
      const formattedData = [];
      data.forEach(d => {
          formattedData.push({
              open: +d["open"],
              high: +d["high"],
              low: +d["low"],
              close: +d["close"],
              volume: +d["volume"],
              tema: +d["tema"],
              bb_upper: +d["bb_upper"],
              bb_middle: +d["bb_middle"],
              bb_lower: +d["bb_lower"],
              keltner_middle: +d["keltner_middle"],
              keltner_upper: +d["keltner_upper"],
              keltner_lower: +d["keltner_lower"],
              rsi: +d["rsi"],
              mfi: +d["mfi"],
              macd: +d["macd"],
              signal: +d["signal"],
              cmf: +d["cmf"],
              index: +d["index"],
          });
      })
      const times = data.map((obj) => {
          return obj.datetime.$date;
      });
      const mostRecentDatetime = this.getMostRecentDatetime(times);
      const opens = formattedData.map((obj) => {
          return obj.open;
      });
      const high = formattedData.map((obj) => {
          return obj.high;
      });
      const low = formattedData.map((obj) => {
          return obj.low;
      });
      const close = formattedData.map((obj) => {
          return obj.close;
      });
      const tema = formattedData.map((obj) => {
          return obj.tema;
      });
      const bb_upper = data.map((obj) => {
          return obj.bb_upper;
      });
      const bb_middle = formattedData.map((obj) => {
          return obj.bb_middle;
      });
      const bb_lower = formattedData.map((obj) => {
          return obj.bb_lower;
      });
      const keltner_middle = formattedData.map((obj) => {
          return obj.keltner_middle;
      });
      const keltner_upper = formattedData.map((obj) => {
          return obj.keltner_upper;
      });
      const keltner_lower = formattedData.map((obj) => {
          return obj.keltner_lower;
      });
      const y_upper_bound = Math.max(...close.slice(-50)) + Math.max(...close.slice(-50)) * 0.001;
      const y_lower_bound = Math.min(...close.slice(-50)) - Math.min(...close.slice(-50)) * 0.001;
      const time_lower_range = times[times.length - 51];
      const time_upper_range = times[times.length - 1];
      const plotlyLayout = {
          title: `${title}<br><sup>${mostRecentDatetime}</sup>`,
          legend: { orientation: "h" },
          autosize: true,
          margin: { l: 50, r: 50, b: 50, t: 70, pad: 4 },
          xaxis: { range: [time_lower_range, time_upper_range], showgrid: false, type: "date", rangeslider: { visible: false } },
          yaxis: { range: [y_lower_bound, y_upper_bound], showgrid: false },
          plot_bgcolor: 'rgba(0, 0, 0, 0)',
          paper_bgcolor: 'rgba(0, 0, 0, 0)',
          font: {
            size: 12,
            color: 'white'
          },
      };
      const plotlyData = [
        {
            x: times,
            close: close,
            decreasing: { line: { color: "red" } },
            high: high,
            increasing: { line: { color: "green" } },
            line: { color: "rgba(31,119,180,1)" },
            low: low,
            open: opens,
            type: "candlestick",
        },
        { x: times, y: bb_upper, visible: "legendonly", name: "Bollinger Bands", mode: "lines", legendgroup: "1", line: { color: "rgba(0,0,0,0.4)" } },
        { x: times, y: bb_middle, visible: "legendonly", name: "", mode: "lines", legendgroup: "1", showlegend: false, fill: "tonexty", fillcolor: "rgba(0,0,0,0.35)", line: { color: "rgba(0,0,0,0.4)" } },
        { x: times, y: bb_lower, visible: "legendonly", name: "", mode: "lines", legendgroup: "1", showlegend: false, fill: "tonexty", fillcolor: "rgba(0,0,0,0.35)", line: { color: "rgba(0,0,0,0.4)" } },
        { x: times, y: keltner_middle, visible: "legendonly", name: "Keltner Channel", mode: "lines", legendgroup: "2", line: { color: "purple" } },
        { x: times, y: keltner_upper, visible: "legendonly", name: "", mode: "lines", legendgroup: "2", showlegend: false, line: { color: "purple" } },
        { x: times, y: keltner_lower, visible: "legendonly", name: "", mode: "lines", legendgroup: "2", showlegend: false, line: { color: "purple" } },
        { x: times, y: tema, visible: "legendonly", name: "Tema", mode: "lines", legendgroup: "3", line: { color: "orange" } },
      ];
      this.plotlyDatetime = mostRecentDatetime;
      this.plotlyData = plotlyData;
      this.plotlyLayout = plotlyLayout;
    },
    async plotVolume(data, title) {
        const formattedData = [];
        data.forEach(d => {
            formattedData.push({ date: new Date(d["datetime"]["$date"]), volume: +d["volume"] });
        })
        const times = data.map((obj) => {
            return obj.datetime.$date;
        });
        const mostRecentDatetime = this.getMostRecentDatetime(times);
        const volume = formattedData.map((obj) => {
            return obj.volume;
        });
        const volume_upper_bound = Math.max(...volume.slice(-50)) + 10;
        const volume_lower_bound = Math.min(...volume.slice(-50)) - 10;
        const plotlyLayout = {
            title: `${title}<br><sup>${mostRecentDatetime}</sup>`,
            margin: { l: 50, r: 50, b: 50, t: 70, pad: 4 },
            xaxis: { range: [formattedData.length - 50, formattedData.length], showgrid: false },
            yaxis: { range: [volume_lower_bound, volume_upper_bound], showgrid: false },
            plot_bgcolor: 'rgba(0, 0, 0, 0)',
            paper_bgcolor: 'rgba(0, 0, 0, 0)',
            font: {
                size: 12,
                color: 'white'
            },
        };
        const plotlyData = [{ y: volume, name: "volume", type: "bar", marker: { color: "rgb(78 193 224)" } }];
        this.plotlyDatetime = mostRecentDatetime;
        this.plotlyData = plotlyData;
        this.plotlyLayout = plotlyLayout;
    }
  }
};
</script>


<style scoped>
.visibility-hidden {
  visibility: hidden;
}
</style>