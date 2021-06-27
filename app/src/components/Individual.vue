<template>
  <v-container>
    <v-row dense>
      <v-col cols="12">
        <v-card
          color="#385F73"
          dark
        >
          <div v-if="principal.imagem" class="text-center">
            <v-avatar
              class="ma-3"
              size="280"
              tile
            >
              <v-img :src="getImgUrl(principal.imagem)"></v-img>
            </v-avatar>
          </div>
            
          <v-card-title class="text-h5 justify-center">
            {{principal.name}}
          </v-card-title>

          <v-spacer></v-spacer>
          <v-divider></v-divider>


          <v-row>
            <v-col v-for="(key, i) in Object.keys(principal.info)" :key="i">
              <v-card-subtitle>{{key.charAt(0).toUpperCase() + key.slice(1)}}: {{ principal.info[key] }}</v-card-subtitle>
            </v-col>

          </v-row>

          <v-divider></v-divider>

        </v-card>
      </v-col>
      <v-col
        v-for="(item, i) in items"
        :key="i"
        cols="12"
      >
        <v-card
          :color="item.color"
          dark
          :href="getURL(item)"
        >
          <div class="d-flex flex-no-wrap justify-space-between">
            <v-avatar
              class="ma-3"
              size="125"
              tile
            >
              <v-img :src="item.src"></v-img>
            </v-avatar>
            
            <v-col height=100%>
            <v-card-title
              class="text-h5 mt-4"
              v-text="item.title"
            ></v-card-title>
            <v-card-subtitle v-text="item.subtext"></v-card-subtitle>
            </v-col>
            
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
export default {
  props:["principal", "items"],

  data () {
    return {
      filterRrated: '',
    }
  },

  methods:{
    getImgUrl(imagem){
      if( !imagem.includes('/') ){
        var images = require.context('@/assets/imagens/', false, /\.jpeg$/)
        return images('./' + imagem)
      }
      else
        return imagem
    },
    getURL(item){
      if (this.$route.query.rRated == "false") this.filterRrated = '?rRated=false'
      if(item.subtext === "Artist")
        return "/artist/" + item.id + this.filterRrated
      if(item.subtext === "Album")
        return "/album/" + item.id + this.filterRrated
    },
  }
};
</script>