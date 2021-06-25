<template>
  <Grid site="albuns" tema="Album"/>
</template>

<script>
import Grid from "@/components/Grid.vue";

export default {
  data(){
      return {
          titulos: [{
            text: 'Album',
            align: 'start',
            value: 'nome',
          },
          {
            text: 'Artist',
            value: 'artista',
          },
          { 
            text: 'Imagem', 
            value: 'imagem', 
          },
          ]
      };
  },

  components: {
    Grid
  },

  
    
    
  
}
          
</script>
