<template>
  <v-app>
    <v-main id="home">
      <v-container fill-height fluid>
        <v-row align="center" justify="center" class="text-center">
            <v-col>
              <img
              src="@/assets/logo.png"
              style="width:100%;max-width:600px;"
              />
              <h2 class="mt-3 font-weight-light">Glove Box Analysis System</h2>
              <v-btn
                elevation="2"
                outlined
                class="mt-8"
                to="/login"
              >Login</v-btn>
          </v-col>
        </v-row>
      </v-container>
      <div class="left-bottom-corner"></div>
      <div class="right-top-corner"></div>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => {
    return {
    }
  },
  methods: {
  }
};
</script>

<style scoped>
  #home {
    background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("~@/assets/home-bg.jpg");
    background-attachment: fixed;
    background-position: center;
    background-size: cover;
  }
  .right-top-corner {
    border-right: 2px solid white;
    border-top: 2px solid white;
    height: 150px;
    width:  150px;
    position: absolute;
    right: 40px;
    top: 40px;
  }
  .left-bottom-corner {
    border-left: 2px solid white;
    border-bottom: 2px solid white;
    height: 150px;
    width:  150px;
    position: absolute;
    left: 40px;
    bottom: 40px;
  }
</style>

