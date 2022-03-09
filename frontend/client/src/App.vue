<template>
  <div id="app">
    <v-app>
      <v-navigation-drawer
        v-model="drawer"
        :clipped="$vuetify.breakpoint.lgAndUp"
        app
        v-if="isLoggedIn && privateRoute()"
      >
        <v-list dense>
          <template v-for="item in navItems">
            <v-list-item :key="item.text" link :to="item.to" :href="getHref(item.href)">
              <v-list-item-action>
                <v-icon small>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-divider></v-divider>
          <v-list-item link @click="logout">
            <v-list-item-action>
              <v-icon small>exit_to_app</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                Log out
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar
        :clipped-left="$vuetify.breakpoint.lgAndUp"
        app
        v-if="isLoggedIn && privateRoute()"
      >
        <v-toolbar-title class="ml-0">
          <v-app-bar-nav-icon
            @click.stop="drawer = !drawer"
          ></v-app-bar-nav-icon>
        </v-toolbar-title>
        <img
          src="./assets/logo.png"
          width="100"
          class="d-inline-block ml-3"
        />
      </v-app-bar>

      <v-main class="content" dark>
        <div class="pa-4">
          <router-view />
        </div>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "App",
  data: () => ({
    dialog: false,
    drawer: null,
    navItems: [
      {
        icon: "account_balance_wallet",
        text: "Glove Box Dashboard",
        to: "/dashboard",
      },
      {
        icon: "account_balance_wallet",
        text: "Battery Cell Charts",
        to: "/chart"
      }
    ],
  }),
  computed: {
    ...mapGetters(["isLoggedIn", "getToken"]),
  },
  methods: {
    ...mapMutations(["setToken"]),
    getHref: function(href) {
      if (href && href.indexOf('jwt') > -1) {
        return `${href}${this.getToken}`;
      }
      return href || '';
    },
    privateRoute() {
      return this.$route.meta.requiresLogin;
    },
    logout () {
      this.setToken(null);
      this.$router.replace('/login')
    }
  },
};
</script>