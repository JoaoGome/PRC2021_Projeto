<template>
  <v-app id="inspire">
    <v-system-bar app class="pink lighten-5">
      <v-spacer></v-spacer>
    </v-system-bar>

    <v-app-bar app >
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

      <v-divider></v-divider>

      <v-switch
        v-model="rRated"
        :label="`R-Rated Music`"
        color="cyan"
        class="ml-4"
      ></v-switch>

    </v-navigation-drawer>
      <v-main class="pink lighten-5">
        <v-container>
          <router-view :rRated="rRated" />
        </v-container>
      </v-main>
  </v-app>
</template>

<script>
  export default {
    data: () => ({ 
      rRated: null,
      inicio: true,
      drawer: null,
      printit: '',

    }),
    created: function(){
      if (this.$route.query.rRated == "false") this.rRated = false
      else this.rRated = true
    },
    computed:{
      items(){ 
        return [
          { title: 'Top', icon: 'mdi-arrow-up-bold', to:`/?rRated=${this.rRated}` },
          { title: 'Artists', icon: 'mdi-account-group', to:`/artists?rRated=${this.rRated}` },
          { title: 'Albuns', icon: 'mdi-music-circle', to:`/albuns?rRated=${this.rRated}` },
          { title: 'Music', icon: 'mdi-music', to:`/music?rRated=${this.rRated}` },
          { title: "Let's dance", icon: 'mdi-flare', to:`/dance?rRated=${this.rRated}` },
        ]
      }

    },
    methods:{
      reloadRchanged(filterRrated){
        window.location.href = `${window.location.pathname}?rRated=${filterRrated}`;
      },
      getURL(s){
        console.log(s)
        return '/'
      }
    },
    watch: {
      rRated(newValue){
        if(!this.inicio)
          this.reloadRchanged(newValue)
        this.inicio = false; 
      }
    }

  }
</script>