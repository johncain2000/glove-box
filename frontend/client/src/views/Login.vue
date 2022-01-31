<template>
  <v-app>
    <v-main id="login">
      <v-container fluid fill-height grid-list-md>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12 signup-card">
              <v-card-text>
                <v-layout row wrap>
                  <v-flex xs12>
                    <div>
                      <div class="headline text-center">
                        <v-img style="max-width:400px;max-height:150px;display: inline-block;" src="@/assets/logo.png"></v-img>
                      </div>
                    </div>
                    <br />
                    <v-form>
                      <v-text-field
                        prepend-icon="email"
                        name="email"
                        label="Email"
                        type="email"
                        v-model="email"
                      ></v-text-field>
                      <v-text-field
                        prepend-icon="lock"
                        name="password"
                        label="Password"
                        id="password"
                        type="password"
                        v-model="password"
                      ></v-text-field>
                      <v-btn class="mt-2" @click="login" block large>Sign In</v-btn>
                    </v-form>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <v-snackbar
        v-model="snackbar"
        color="red"
        timeout="3000"
      >
        Wrong information. Please try again.
        <template v-slot:action="{ attrs }">
          <v-btn
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
import { mapMutations } from "vuex";
import EventService from '@/services/EventService.js';

export default {
  name: "login",
  data() {
    return {
      email: "",
      password: "",
      snackbar: false
    };
  },
  methods: {
    ...mapMutations(["setUser", "setToken"]),
    async login() {
      if (!this.email || !this.password) {
        return;
      }
      try {
        const response = await EventService.login({email: this.email, password: this.password})
        const { user, token } = response;
        this.setUser(user);
        this.setToken(token);
        if (token) {
          this.$router.push("/dashboard");
        }
      } catch (e) {
        this.snackbar = true;
      }
    },
  }
};
</script>

<style scoped>
#login {
  background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("~@/assets/login-bg.jpg");
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
}
.signup-card {
  padding: 15px;
}
</style>