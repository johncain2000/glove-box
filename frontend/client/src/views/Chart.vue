<template>
    <v-container>
        <v-row>
          <v-col cols="12" md="8">
            <h1 class="headline mb-2 grey--text">Battery Cell Environment Visual </h1>
            <template>
              <div id="app">
                <GChart
                  type="BubbleChart"
                  :data="chartData"
                  :options="chartOptions"
                  style="width: 700px; height: 300px;"
                />    
              </div>
            </template>
          </v-col>

          <v-col cols="12" md="4">
            <h1 class="headline mb-2 grey--text">Battery Cell Environment Details </h1>
            <v-data-table
              :headers="headers"
              :items="battery_cells"
              :items-per-page="4"
              class="elevation-1"
              >
            </v-data-table>
          </v-col>

          <v-col cols="12" md="4">
            <h1 class="headline  grey--text">Within Ideal Environment </h1>
            <v-progress-circular
              :value="76"
              color="pink lighten-2"
              size="150"
              width="15"
            >76%</v-progress-circular>
            <h1 class="headline pl-5">456 </h1>
            <h6 class=" grey--text pl-5">with 25 days </h6>
          </v-col>

          <!-- <v-col cols="12" md="8">
            <h1 class="headline  grey--text">Within Ideal Environment Time Series </h1>
            <v-container fluid>
                <v-sparkline
                  :value="value"
                  :gradient="gradient"
                  :smooth="radius || false"
                  :padding="padding"
                  :line-width="lineWidth"
                  :stroke-linecap="lineCap"
                  :gradient-direction="gradientDirection"
                  :fill="fill"
                  :type="type"
                  :auto-line-width="autoLineWidth"
                  auto-draw
                  :show-labels="showLabels"
                  :label-size="labelSize"
                ></v-sparkline>
            </v-container>
          </v-col> -->
        </v-row>
    </v-container>
</template>

<script>
import { GChart } from "vue-google-charts";
 const gradients = [
    ['#222'],
    ['#42b3f4'],
    ['red', 'orange', 'yellow'],
    ['purple', 'violet'],
    ['#00c6ff', '#F0F', '#FF0'],
    ['#f72047', '#ffd200', '#1feaea'],
  ]
export default {
    data () {
      return {
        chartData: [
            ["ID", "X", "Y", "Rating"],
            ["B1", 80, 167, 125],
            ["B2", 79, 136, 120],
            ["B3", 75, 184, 100],
            ["B4", 76, 278, 100],
            ["B5", 81, 200, 130],
            ["B6", 74, 170, 100],
            ["B7", 68, 477, 80]
        ],
        chartOptions: {
            colorAxis: { colors: ["red", "green", "red"] },
        },
        showLabels: false,
        lineWidth: 2,
        labelSize: 7,
        radius: 10,
        padding: 8,
        lineCap: 'round',
        gradient: gradients[5],
        value: [0, 2, 5, 9, 5, 10, 3, 5, -4, -10, 1, 8, 2, 9, 0],
        gradientDirection: 'top',
        gradients,
        fill: false,
        type: 'trend',
        autoLineWidth: false,
        headers: [
            {
            text: 'Battery Cell',
            align: 'start',
            sortable: false,
            value: 'battery_cell',
            },
            { text: 'Oxygen', value: 'oxygen' },
            { text: 'Temperature', value: 'temperature' },
            { text: 'Relative Humidity', value: 'relative_humidity' },
        ],
        battery_cells: [
          {
            "battery_cell": "B1",
            "oxygen": 22,
            "temperature": 55,
            "relative_humidity": 12
          },
          {
            "battery_cell": "B2",
            "oxygen": 25,
            "temperature": 35,
            "relative_humidity": 62
          },
          {
            "battery_cell": "B3",
            "oxygen": 26,
            "temperature": 53,
            "relative_humidity": 32
          },
          {
            "battery_cell": "B4",
            "oxygen": 20,
            "temperature": 50,
            "relative_humidity": 82
          },
          {
            "battery_cell": "B5",
            "oxygen": 12,
            "temperature": 56,
            "relative_humidity": 14
          },
          {
            "battery_cell": "B6",
            "oxygen": 92,
            "temperature": 52,
            "relative_humidity": 19
          },
          {
            "battery_cell": "B7",
            "oxygen": 25,
            "temperature": 56,
            "relative_humidity": 42
          }
        ]  
      }
    },
    components: {
    GChart
  },
  }
</script>
<style scoped>
.v-progress-circular {
  margin: 1rem;
}
</style>