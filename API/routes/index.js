var express = require('express');
var router = express.Router();
var axios = require('axios')
var gdb = require('../utils/graphdb')

// devolve um array com lista de nomes dos artistas
router.get('/artistas', async function(req, res) 
{
  var filter = ''
  if (req.query.rRated && req.query.rRated === "false") filter = 'FILTER(?rated = "False")'
  
  var query = `
  select distinct ?id ?name (MIN(?rated) as ?rRated) where { 
    ?id a :Artista .
    ?id :nome ?name ;
        :hasAlbum ?album .
    ?album :hasMusic ?m .
    ?m :ratedR ?rated .
    ${filter}
} 
group by ?id ?name
order by ?name
              `

  var result = await gdb.execQuery(query);
  var results = [];

  result.results.bindings.map(b => {
      results.push({
        "id": b.id.value.split('#')[1],
        "name": b.name.value,
        "imagem": b.name.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace('!','') + ".jpeg"
      });
  })

  res.send(results);

});

// vai buscar lista de artistas ordenados por popularity (devolve nome e imagem do artista) 
router.get('/artistas/popularity', async function(req, res) 
{
  var filter = ''
  if (req.query.rRated && req.query.rRated === "false") filter = 'FILTER(?rated = "False")'
  
  var query = `
  select distinct ?art ?nartista (SUM(?popularity) as ?popularity) (MIN(?rated) as ?rRated) where { 
    ?art a :Artista .
    ?art :hasAlbum ?album .
    ?album :hasMusic ?music .
    ?album :hasMusic ?m .
    ?m :ratedR ?rated .
    ?music :popularity ?popularity .
    ?art :nome ?nartista .
    ${filter}
  }
group by ?art ?nartista 
order by desc (?popularity) 
limit 60
              `

  var result = await gdb.execQuery(query);
  var results = [];

  result.results.bindings.map(b => {
    info = 
    {
      "id": b.art.value.split('#')[1],
      "name": b.nartista.value,
      "popularity": b.popularity.value,
      "imagem": b.nartista.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace('!','') + ".jpeg"
    }

    results.push(info)
  })

  res.send(results);
  

});

// vai buscar os albuns + imagem deste artista
router.get('/artistas/:id', async function(req, res) 
{
  var filter = ''
  if (req.query.rRated && req.query.rRated === "false") filter = 'FILTER(?rated = "False")'
  
  if (req.params.id)
  {
    var query = `
    select ?name (COUNT(?album_id) as ?nr) where { 
      :${req.params.id} :nome ?name ;
                        :hasAlbum ?album_id .
    }
    group by ?name
                `

    var result = await gdb.execQuery(query);
    var results = [];
    
    result.results.bindings.map(b => {
      info = 
      {
        "principal":{
          "name": b.name.value,
          "imagem": b.name.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace('!','') + ".jpeg",
          "info":{
            "albuns": b.nr.value
          }
        },
        "albuns": []
      }
      results.push(info)
    })

    var query = `
    select distinct ?id ?name ?imagem ?date where {
      :${req.params.id} :hasAlbum ?id .
      ?id :nome ?name ;
          :image ?imagem ;
          :data ?date ;
          :hasMusic ?m .
      ?m :ratedR ?rated .
      ${filter}
    }  
    `
    var result = await gdb.execQuery(query);

    result.results.bindings.map(b => {
      results[0]["albuns"].push({
        "name":b.name.value, 
        "imagem":b.imagem.value, 
        "year":b.date.value.split('-')[0], 
        "date":b.date.value, 
        "id":b.id.value.split('#')[1]
      })
    })


    res.send(results);
  }
  

});


// devolve um array com lista de nomes dos albuns
router.get('/albuns', async function(req, res) 
{
  var filter = ''
  if (req.query.rRated && req.query.rRated === "false") filter = 'FILTER(?rated = "False")'
  
  var query = `
  select distinct ?s ?name ?image ?artist ?d where { 
    ?s a :Album .
    ?s :nome ?name .
    ?s :image ?image .
    ?a :hasAlbum ?s .
    ?a :nome ?artist .
    ?s :data ?d .
    ?s :hasMusic ?m .
    ?m :ratedR ?rated .
    ${filter}
  }  
GROUP BY ?s ?name ?image ?artist ?d
              `

  var result = await gdb.execQuery(query);
  var results = [];

  result.results.bindings.map(b => {
    results.push({
      "name":b.name.value, 
      "artist":b.artist.value, 
      "imagem":b.image.value, 
      "year":b.d.value.split('-')[0], 
      "date":b.d.value, 
      "id":b.s.value.split('#')[1]
    });
  })

  res.send(results);

});

// vai buscar lista de albuns ordenados por danceability (devolve nome e imagem do album, artista e danceability) 
router.get('/albuns/popularity', async function(req, res) 
{
  var filter = ''
  if (req.query.rRated && req.query.rRated === "false") filter = 'FILTER(?rated = "False")'
  
  var query = `
  select distinct ?album ?nome ?nartista (SUM(?popularity) as ?popularity) (SAMPLE(?imagem) as ?imagem) (MIN(?rated) as ?rRated) where { 
    ?album a :Album .
    ?album :nome ?nome .
    ?album :hasMusic ?music .
    ?music :popularity ?popularity .
    ?album :image ?imagem .
    ?artista :hasAlbum ?album .
    ?artista :nome ?nartista .
    ?album :hasMusic ?m .
    ?m :ratedR ?rated .
    ${filter}
  }
group by ?album ?nome ?nartista 
order by desc (?popularity) 
limit 100
              `

  var result = await gdb.execQuery(query);
  var results = [];

  result.results.bindings.map(b => {
    info = 
    {
      "id": b.album.value.split('#')[1],
      "name": b.nome.value,
      "artist": b.nartista.value,
      "popularity": b.popularity.value,
      "imagem": b.imagem.value
    }

    results.push(info)
  })

  res.send(results);
  

});

// vai buscar lista de albuns ordenados por danceability (devolve nome e imagem do album, artista e danceability) 
router.get('/albuns/danceability', async function(req, res) 
{
  var filter = ''
  if (req.query.rRated && req.query.rRated === "false") filter = 'FILTER(?rated = "False")'
  
  var query = `
  select distinct ?album ?nome ?nartista (SUM(?danceability) as ?danceability) (SAMPLE(?imagem) as ?imagem) (MIN(?rated) as ?rRated) where { 
    ?album a :Album .
    ?album :nome ?nome .
    ?album :hasMusic ?music .
    ?music :danceability ?danceability .
    ?album :image ?imagem .
    ?artista :hasAlbum ?album .
    ?artista :nome ?nartista .
    ?album :hasMusic ?m .
    ?m :ratedR ?rated .
    ${filter}
    
  }
group by ?album ?nome ?nartista 
order by desc (?danceability) 
limit 100
              `

  var result = await gdb.execQuery(query);
  var results = [];

  result.results.bindings.map(b => {
    info = 
    {
      "id": b.album.value.split('#')[1],
      "name": b.nome.value,
      "artist": b.nartista.value,
      "danceability": b.danceability.value,
      "imagem": b.imagem.value
    }

    results.push(info)
  })

  res.send(results);
  

});

// vai buscar os dados do album
router.get('/albuns/:id', async function(req, res) 
{
  var filter = ''
  if (req.query.rRated && req.query.rRated === "false") filter = 'FILTER(?rated = "False")'
  if (req.params.id)
  {
    var query = `
              select ?artista_id ?artista_name ?nome ?image ?numeroTracks ?data (GROUP_CONCAT(?music_nr;separator="|") as ?music_nr) (GROUP_CONCAT(?music_dur;separator="|") as ?music_dur) (GROUP_CONCAT(?music_id) as ?music_id) (GROUP_CONCAT(?music;separator="|") as ?music) where { 
                :${req.params.id} :nome ?nome ;
                                  :image ?image ;
                                  :numberTracks ?numeroTracks ;
                                  :data ?data ;
                                  :hasMusic ?music_id .
                ?artista_id :hasAlbum :${req.params.id} ;
                            :nome ?artista_name .
                ?music_id :ratedR ?rated ;
                          :nome ?music ;
                          :duracao ?music_dur ;
                          :musicNumber ?music_nr .
                ${filter}
            }
            GROUP BY ?nome ?image ?numeroTracks ?data ?artista_id ?artista_name
                `

    var result = await gdb.execQuery(query);
    var results = [];
    
    result.results.bindings.map(b => {
      info = 
      {
        "artist":{
          "id": b.artista_id.value.split('#')[1],
          "name": b.artista_name.value,
          "imagem": b.artista_name.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace('!','') + ".jpeg"
        },
        "principal": {
          "id": req.params.id,
          "imagem": b.image.value,
          "name": b.nome.value,
          "info":{
            "date": b.data.value,
            "tracks": b.numeroTracks.value,
          },
        },
        "music":[]
      }
      var music_ids = b.music_id.value.split(" ")
      var music_names = b.music.value.split("|")
      var music_durs = b.music_dur.value.split("|")
      var music_nrs = b.music_nr.value.split("|")
      for (var i=0; i < music_ids.length ; i++){
        info["music"].push({
          "id": music_ids[i].split('#')[1],
          "musica": music_names[i],
          "duration": music_durs[i],
          "nr": music_nrs[i],
        })
      }
      results.push(info)
    })

    res.send(results);
  }
  

});

// (not used) vai buscar os nomes e duraçao de cada musica do album
router.get('/albuns/musics/:name', async function(req, res) 
{
  if (req.params.name)
  {
    var query = `
                select distinct ?name ?duracao where { 
                  ?album a :Album .
                  ?album :nome "${req.params.name}" .
                  ?album :hasMusic ?music .
                  ?music :nome ?name .
                  ?music :duracao ?duracao .
                 }
                `

    var result = await gdb.execQuery(query);
    var results = [];
    
    result.results.bindings.map(b => {
      info = 
      {
        "nome": b.name.value,
        "duração": b.duracao.value,
      }
      results.push(info)
    })

    res.send(results);
  }
  

});

// (not used) vai buscar lista de albuns de um dado ano. (artista, album)
router.get('/albuns/ano/:ano', async function(req, res) 
{

  if (req.params.ano)
  {
    var query = `
              select distinct ?album ?nomeAlbum ?nartista ?data (MIN(?rated) as ?rRated) where { 
                ?album a :Album .
                ?album :nome ?nomeAlbum .
                ?album :data ?data .
                ?artista :hasAlbum ?album .
                ?artista :nome ?nartista .
                ?album :hasMusic ?m .
                ?m :ratedR ?rated .
              }
              `

    var result = await gdb.execQuery(query);
    var results = [];

    var filter = false
    if (req.query.rRated && req.query.rRated == "false") filter = true;
    
    result.results.bindings.map(b => {
      if (!filter || (filter && b.rRated.value == "False") )
      if (b.data.value.includes(req.params.ano))
      {
        info = 
        {
          "id": b.album.value.split('#')[1],
          "name": b.nomeAlbum.value,
          "artist": b.nartista.value,
        }

        results.push(info)
      }
      
    })

    res.send(results);
    }
  
});


// devolve um array com lista de nomes das músicas
router.get('/musicas', async function(req, res) 
{
  var filter = '';
  if (req.query.rRated && req.query.rRated == "false") filter = 'FILTER(?rated = "False")';

  var query =  `
  select distinct ?musica ?nomeMusica ?nomeAlbum ?nartista ?data where { 
    ?musica a :Musica .
    ?musica :nome ?nomeMusica .
    ?musica :ofAlbum ?album .
    ?musica :ratedR ?rated .
    ?album :nome ?nomeAlbum .
    ?artista :hasAlbum ?album .
    ?artista :nome ?nartista .
    ?album :data ?data .
    ${filter}
  }
  order by (?nomeMusica) 
  `

  var result = await gdb.execQuery(query);
  var results = [];
  
  result.results.bindings.map(b => {
    results.push({
      "id": b.musica.value.split('#')[1],
      "musica": b.nomeMusica.value,
      "album": b.nomeAlbum.value,
      "artista": b.nartista.value,
      "date": b.data.value.split('-')[0] + '-' + b.data.value.split('-')[1]
    });
  })

  res.send(results);

});

// vai buscar lista de musicas ordenadas por popularidade (devolve nome da musica, album, artista e popularidade) 
router.get('/musicas/popularidade', async function(req, res) 
{
  var filter = '';
  if (req.query.rRated && req.query.rRated == "false") filter = 'FILTER(?rated = "False")';
  var query = `
              select distinct ?musica ?nomeMusica ?nomeAlbum ?nartista ?popularity ?data ?imagem where { 
                ?musica a :Musica .
                ?musica :nome ?nomeMusica .
                ?musica :ofAlbum ?album .
                ?musica :popularity ?popularity .
                ?musica :ratedR ?rated .
                ?album :nome ?nomeAlbum .
                ?artista :hasAlbum ?album .
                ?artista :nome ?nartista .
                ?album :data ?data .
                ?album :image ?imagem .
                ${filter}
              }
              order by desc (?popularity) 
              limit 100
              `

  var result = await gdb.execQuery(query);
  var results = [];


  result.results.bindings.map(b => {
    info = 
    {
      "id": b.musica.value.split('#')[1],
      "name": b.nomeMusica.value,
      "album": b.nomeAlbum.value,
      "artist": b.nartista.value,
      "popularity": b.popularity.value,
      "date": b.data.value,
      "imagem": b.imagem.value
    }

    results.push(info)
  })

  res.send(results);
  

});

// vai buscar lista de musicas ordenadas por danceability (devolve nome da musica, artista, danceability e imagem do album) 
router.get('/musicas/danceability', async function(req, res) 
{
  var filter = '';
  if (req.query.rRated && req.query.rRated == "false") filter = 'FILTER(?rated = "False")';

  var query = `
  select distinct (SAMPLE(?musica) as ?musica) ?nomeMusica ?nartista (MAX(?danceability) as ?danceability) (SAMPLE(?imagem) as ?imagem) where { 
    ?musica a :Musica .
    ?musica :nome ?nomeMusica .
    ?musica :ofAlbum ?album .
    ?musica :danceability ?danceability .
    ?musica :ratedR ?rated .
    ?album :image ?imagem .
    ?artista :hasAlbum ?album .
    ?artista :nome ?nartista .
    ${filter}
}
group by ?nomeMusica ?nartista 
order by desc (?danceability) 
limit 100
              `

  var result = await gdb.execQuery(query);
  var results = [];

  result.results.bindings.map(b => {
    info = 
    {
      "id": b.musica.value.split('#')[1],
      "name": b.nomeMusica.value,
      "artist": b.nartista.value,
      "danceability": b.danceability.value,
      "imagem": b.imagem.value
    }

    results.push(info)
  })

  res.send(results);
  

});

// (not used) vai buscar lista de musicas de um dado ano. (devolve nome musica, artista, album)
router.get('/musicas/ano/:ano', async function(req, res) {

  var filter = '';
  if (req.query.rRated && req.query.rRated == "false") filter = 'FILTER(?rated = "False")';

  if (req.params.ano)
  {
    var query = `
              select distinct ?musica ?nomeMusica ?nomeAlbum ?nartista ?data where { 
                ?musica a :Musica .
                ?musica :nome ?nomeMusica .
                ?musica :ofAlbum ?album .
                ?musica :ratedR ?rated .
                ?album :nome ?nomeAlbum .
                ?album :data ?data .
                ?artista :hasAlbum ?album .
                ?artista :nome ?nartista .
                ${filter}
              }
              `

    var result = await gdb.execQuery(query);
    var results = [];

    result.results.bindings.map(b => {
      if (b.data.value.includes(req.params.ano))
      {
        info = 
        {
          "id": b.musica.value.split('#')[1],
          "name": b.nomeMusica.value,
          "album": b.nomeAlbum.value,
          "artist": b.nartista.value,
        }

        results.push(info)
      }
      
    })

    res.send(results);
    }
  
});

// vai buscar toda a informação de musicas com o id
router.get('/musicas/:id', async function(req, res) 
{
  if (req.params.id)
  {
    var query = `
    select ?name ?duration ?danceability ?popularity ?ratedR ?date ?album_id ?album_name ?album_imagem ?artist_id ?artist_name where { 
      :${req.params.id} :nome ?name ;
                          :duracao ?duration ;
                          :danceability ?danceability ;
                          :popularity ?popularity ;
                          :ratedR ?ratedR ;
                          :ofAlbum ?album_id .
      ?album_id :nome ?album_name ;
                :data ?date ;
                :image ?album_imagem .
      ?artist_id :hasAlbum ?album_id .
      ?artist_id :nome ?artist_name .
    }
                `

    var result = await gdb.execQuery(query);
    var results = [];
  
    result.results.bindings.map(b => {
      var dance = "average"
      if (b.danceability.value > 90) dance = "very high"
      else if (b.danceability.value > 70) dance = "high"
      else if (b.danceability.value < 35) dance = "low"
      else if (b.danceability.value < 15) dance = "very low"
      var popular = "average"
      if (b.danceability.value > 0.90) popular = "very high"
      else if (b.danceability.value > 0.70) popular = "high"
      else if (b.danceability.value < 0.35) popular = "low"
      else if (b.danceability.value < 0.15) popular = "very low"
      
      info = 
      {
        "artist": {
          "id": b.artist_id.value.split('#')[1],
          "name": b.artist_name.value,
          "imagem": b.artist_name.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace('!','') + ".jpeg"
        },
        "album": {
          "id": b.album_id.value.split('#')[1],
          "name": b.album_name.value,
          "imagem": b.album_imagem.value
        },
        "principal":{
          "name": b.name.value,
          "info":{
            "duration": b.duration.value,
            "date": b.date.value,
            "danceability": dance,
            "popularity": popular,
          },
        }
      }
      if ( b.ratedR.value === "True"){
        info["principal"]["info"][""] = "R-Rated"
      }

      results.push(info)
    })

    res.send(results);
  }
  

});

// (not used) vai buscar todas as musicas com menor duração 
router.get('/musicas/duracao/:duracao', async function(req, res) {
  
  var filter = '';
  if (req.query.rRated && req.query.rRated == "false") filter = 'FILTER(?rated = "False")';

  if (req.params.duracao){
    var query = `
                select distinct ?nomeMusica ?nomeAlbum ?nartista ?duracao where { 
                  ?musica a :Musica .
                  ?musica :nome ?nomeMusica .
                  ?musica :duracao ?duracao .
                  ?musica :ofAlbum ?album .
                  ?musica :ratedR ?rated .
                  ?album :nome ?nomeAlbum .
                  ?artista :hasAlbum ?album .
                  ?artista :nome ?nartista .
                  ${filter}
                }
                `

    var result = await gdb.execQuery(query);
    var results = [];
  
    result.results.bindings.map(b => {
      if (parseInt(req.params.duracao) > parseInt(b.duracao.value.split(':')[0]))
      {
        info = 
        { 
          "musica": b.nomeMusica.value,
          "album": b.nomeAlbum.value,
          "artista": b.nartista.value,
          "duracao": b.duracao.value,
        }
        results.push(info)
      }
      
    })

    res.send(results);
  }

});


module.exports = router;
