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
    <Grid :elementos="elementos" tema="Album" :keysSort="keysSort" :keysShow="keysShow" />
  </v-card>
</template>

<script>
import Grid from "@/components/Grid.vue";
import axios from 'axios';

export default {
  components: {
    Grid
  },

  data(){
      return {
        alfabeto: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
        filterRrated:'',
        elementos: [],
        keysSort: ['Artist', 'Date', 'Name'],
        keysShow: ['Artist', 'Year'],
      };
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
      .get('http://localhost:8080/teste/albuns'+ sLetter + this.filterRrated)
      .then(res => {
        this.elementos = res.data;
      })
      .catch(this.r = 'error' )
  },

  
  methods:{
    getHref(item){
      var sRrated = ''
      if (this.$route.query.rRated == "false") sRrated = '&rRated=false'
      return `${window.location.pathname}?letter=${item}${sRrated}`
    }
  }
    
    
  
}
          
</script>
