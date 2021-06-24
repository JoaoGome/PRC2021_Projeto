<template>
  <v-app id="inspire">
    <v-system-bar app>
      <v-spacer></v-spacer>
    </v-system-bar>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-img
        lazy-src="@/assets/music.png"
        max-height="50"
        max-width="50"
        src="@/assets/music.png"
      ></v-img>
      <v-toolbar-title>All the Music</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      fixed
      temporary
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            Music Time
          </v-list-item-title>
          <v-list-item-subtitle>
            Search it!
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        dense
        nav
      >
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.to"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
      <v-main class="grey lighten-2">
        <v-container>
          <router-view/>
        </v-container>
      </v-main>
  </v-app>
</template>

<script>
  export default {
    data: () => ({ 
      drawer: null,
      items: [
          { title: 'Top', icon: 'mdi-arrow-up-bold', to:'/' },
          { title: 'Artists', icon: 'mdi-account-group', to:'/artists' },
          { title: 'Albuns', icon: 'mdi-music-circle', to:'/albuns' },
          { title: 'Music', icon: 'mdi-music', to:'/music' },
          { title: "Let's dance", icon: 'mdi-flare', to:'/dance' },
        ]
    }),
  }
</script>