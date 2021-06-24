<template>
  <v-container>
    <v-main class="grey lighten-2">
      <v-container>
        <v-row>
          <template v-for="c in categorias">
            <v-col
              :key="c"
              class="mt-2"
              cols="12"
            >
              <strong>Top {{c}}</strong>
            </v-col>

            <v-col
              v-for="j in 6"
              :key="`${c}${j}`"
              cols="6"
              md="2"
            >
              <v-sheet height="150"></v-sheet>
            </v-col>
          </template>
        </v-row>
      </v-container>
    </v-main>
  </v-container>
</template>


<script>
 export default {
    data: () => ({ 
      categorias: ["Artists", "Albuns", "Music"]
    }),
  }
</script>
