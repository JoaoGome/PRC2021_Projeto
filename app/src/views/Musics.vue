<template>
  <v-card
    width=100%
    class="mx-auto"
  >
    <v-row class="ml-4 mr-4">
      <v-col v-for="item in alfabeto" :key="item">
        <a :href="getHref(item)">
          {{item}}
        </a>
      </v-col>
    </v-row>
    <Lista tema="Music" :elementos="elementos" :headers="headers" :sort="[]" :sortdesc="[]" />
  </v-card>
</template>

<script>
import Lista from "@/components/Lista.vue";

import axios from 'axios';
export default {
  components: {
    Lista
  },

  data () {
    return {
      alfabeto: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
      elementos:[],
      filterRrated: '',
    }
  },

  created: function () {
    var sLetter = ''
    if (this.$route.query.letter) sLetter = '?letter=' + this.$route.query.letter

    if (this.$route.query.rRated == "false" ){
      if (this.$route.query.letter)
        this.filterRrated = '&rRated=false'
      else
        this.filterRrated = '?rRated=false'
    }
    
    axios
      .get('http://localhost:8080/teste/musicas' + sLetter + this.filterRrated)
      .then(res => {
        this.elementos = res.data;            
        this.search = ''
      })
      .catch(this.r = 'error' )
  },
  computed: {
    headers () {
      return [
        {
          text: 'Musica',
          align: 'start',
          value: 'musica',
        },
        {
          text: 'Album',
          value: 'album',
          filterable: false
        },
        { 
          text: 'Artista', 
          value: 'artista', 
          filterable: false
        },
        { 
          text: 'Date', 
          value: 'date', 
          filterable: false
        },
      ]
    },
  },
  methods:{
    getHref(item){
      var sRrated = ''
      if (this.$route.query.rRated == "false") sRrated = '&rRated=false'
      return `${window.location.pathname}?letter=${item}${sRrated}`
    }
  }
};
</script>
