<template>
  <v-card
    width=100%
    class="mx-auto"
  >
    <Individual tema="Music" :items="items" :principal="principal"  />
  </v-card>

</template>

<script>
import Individual from "@/components/Individual.vue";

import axios from 'axios';
export default {
  components: {
    Individual
  },

  data () {
    return {
      elementos:[],
      filterRrated: '',
      principal: null,
      items: [
        {
          color: '#1F7087',
          src: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          title: 'Supermodel',
          artist: 'Foster the People',
        },
        {
          color: '#952175',
          src: 'https://cdn.vuetifyjs.com/images/cards/halcyon.png',
          title: 'Halcyon Days',
          artist: 'Ellie Goulding',
        },
      ],
    }
  },

  created: function () {
    if (this.$route.query.rRated == "false") this.filterRrated = '?rRated=false'
    
    axios
      .get('http://localhost:8080/teste/musicas/' + this.$route.params.id + this.filterRrated)
      .then(res => {
        this.principal = res.data[0]["principal"]
        this.items = [
          {
            id: res.data[0]["album"]["id"],
            color: '#1F7087',
            src: this.getImgUrl(res.data[0]["album"]["imagem"]),
            title: res.data[0]["album"]["name"],
            subtext: "Album"
          },
          {
            id: res.data[0]["artist"]["id"],
            color: '#0097A7',
            src: this.getImgUrl(res.data[0]["artist"]["imagem"]),
            title: res.data[0]["artist"]["name"],
            subtext: "Artist"
          }
        ]
        this.elementos = res.data[0]["music"]; 

      })
      .catch(this.r = 'error' )
  },
  computed: {
    headers () {
      return [
        {
          text: "Album Music List",
          align: 'start',
          value: 'musica',
        },
        {
          text: "Duration",
          value: 'duration',
        },
      ]
    },
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
