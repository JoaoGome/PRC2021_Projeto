<template>
  <v-card
    width=100%
    class="mx-auto"
  >
    <Individual :elementos="elementos" :items="items" :principal="principal" />

    <Grid tema="Album" :elementos="elementos" :keysSort="['Name', 'Date']" :keysShow="['Year']" />
  </v-card>

</template>

<script>
import Grid from "@/components/Grid.vue";
import Individual from "@/components/Individual.vue";

import axios from 'axios';
export default {
  components: {
    Grid,
    Individual
  },

  data () {
    return {
      elementos:[],
      filterRrated: '',
      principal: null,
    }
  },

  created: function () {
    if (this.$route.query.rRated == "false") this.filterRrated = '?rRated=false'
    
    axios
      .get('http://localhost:8080/teste/artistas/' + this.$route.params.id + this.filterRrated)
      .then(res => {
        res.data[0]["principal"]["imagem"] = this.getImgUrl( res.data[0]["principal"]["imagem"] )
        this.principal = res.data[0]["principal"]
        this.elementos = res.data[0]["albuns"]; 
      })
      .catch(this.r = 'error' )
  },

  methods: {
    getImgUrl(imagem){
      if( !imagem.includes('/') ){
        var images = require.context('@/assets/imagens/', false, /\.jpeg$/)
        return images('./' + imagem)
      }
      else
        return imagem
    },
    
  }
  
};
</script>
