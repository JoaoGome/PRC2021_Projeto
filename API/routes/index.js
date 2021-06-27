var express = require('express');
var router = express.Router();
var axios = require('axios')
var gdb = require('../utils/graphdb')

// devolve um array com lista de nomes dos artistas
router.get('/artistas', async function(req, res) 
{
  var query = `
  select ?s ?name (MIN(?rated) as ?rRated) where { 
    ?s a :Artista .
    ?s :nome ?name .
    ?s :hasAlbum ?album .
    ?album :hasMusic ?m .
    ?m :ratedR ?rated .
} 
group by ?s ?name
order by ?name
              `

  var result = await gdb.execQuery(query);
  var results = [];
  
  var filter = false
  if (req.query.rRated && req.query.rRated == "false") filter = true;
  
  result.results.bindings.map(b => {
    if (!filter || (filter && b.rRated.value == "False") )
      results.push({
        "id": b.s.value.split('#')[1],
        "name": b.name.value,
        "imagem": b.name.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace('!','') + ".jpeg"
      });
  })

  res.send(results);

});

// vai buscar lista de artistas ordenados por popularity (devolve nome e imagem do artista) 
router.get('/artistas/popularity', async function(req, res) 
{
  var query = `
  select ?art ?nartista (SUM(?popularity) as ?popularity) (MIN(?rated) as ?rRated) where { 
    ?art a :Artista .
    ?art :hasAlbum ?album .
    ?album :hasMusic ?music .
    ?album :hasMusic ?m .
    ?m :ratedR ?rated .
    ?music :popularity ?popularity .
    ?art :nome ?nartista .
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
router.get('/artistas/:name', async function(req, res) 
{
  if (req.params.name)
  {
    var query = `
              select ?name ?image where { 
                ?artista a :Artista .
                ?artista :nome "${req.params.name}" .
                ?artista :hasAlbum ?album .
                ?album :nome ?name .
                ?album :image ?image .
              }
              order by (?name)
                `

    var result = await gdb.execQuery(query);
    var results = [];
    
    result.results.bindings.map(b => {
      info = 
      {
        "nome": b.name.value,
        "image": b.image.value
      }
      results.push(info)
    })

    res.send(results);
  }
  

});

// devolve um array com lista de nomes dos albuns
router.get('/albuns', async function(req, res) 
{
  var query = `
  select ?s ?name ?image ?artist ?d (MIN(?rated) as ?rRated) where { 
    ?s a :Album .
    ?s :nome ?name .
    ?s :image ?image .
    ?a :hasAlbum ?s .
    ?a :nome ?artist .
    ?s :data ?d .
    ?s :hasMusic ?m .
    ?m :ratedR ?rated .
  }  
GROUP BY ?s ?name ?image ?artist ?d
              `

  var result = await gdb.execQuery(query);
  var results = [];

  var filter = false
  if (req.query.rRated && req.query.rRated == "false") filter = true;
  
  result.results.bindings.map(b => {
    if (!filter || (filter && b.rRated.value == "False") )
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
  var query = `
  select ?album ?nome ?nartista (SUM(?popularity) as ?popularity) (SAMPLE(?imagem) as ?imagem) (MIN(?rated) as ?rRated) where { 
    ?album a :Album .
    ?album :nome ?nome .
    ?album :hasMusic ?music .
    ?music :popularity ?popularity .
    ?album :image ?imagem .
    ?artista :hasAlbum ?album .
    ?artista :nome ?nartista .
    ?album :hasMusic ?m .
    ?m :ratedR ?rated .
  }
group by ?album ?nome ?nartista 
order by desc (?popularity) 
limit 100
              `

  var result = await gdb.execQuery(query);
  var results = [];

  var filter = false
  if (req.query.rRated && req.query.rRated == "false") filter = true;
  
  result.results.bindings.map(b => {
    if (!filter || (filter && b.rRated.value == "False") )
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
  var query = `
  select ?album ?nome ?nartista (SUM(?danceability) as ?danceability) (SAMPLE(?imagem) as ?imagem) (MIN(?rated) as ?rRated) where { 
    ?album a :Album .
    ?album :nome ?nome .
    ?album :hasMusic ?music .
    ?music :danceability ?danceability .
    ?album :image ?imagem .
    ?artista :hasAlbum ?album .
    ?artista :nome ?nartista .
    ?album :hasMusic ?m .
    ?m :ratedR ?rated .
    
  }
group by ?album ?nome ?nartista 
order by desc (?danceability) 
limit 100
              `

  var result = await gdb.execQuery(query);
  var results = [];

  var filter = false
  if (req.query.rRated && req.query.rRated == "false") filter = true;
  
  result.results.bindings.map(b => {
    if (!filter || (filter && b.rRated.value == "False") )
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
        "id": req.params.id,
        "imagem": b.image.value,
        "name": b.nome.value,
        "date": b.data.value,
        "tracks": b.numeroTracks.value,
        "artist":{
          "id": b.artista_id.value.split('#')[1],
          "name": b.artista_name.value,
          "imagem": b.artista_name.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace('!','') + ".jpeg"
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

// vai buscar os nomes e duraçao de cada musica do album
router.get('/albuns/musics/:name', async function(req, res) 
{
  if (req.params.name)
  {
    var query = `
                select ?name ?duracao where { 
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

// vai buscar lista de albuns de um dado ano. (artista, album)
router.get('/albuns/ano/:ano', async function(req, res) 
{

  if (req.params.ano)
  {
    var query = `
              select ?album ?nomeAlbum ?nartista ?data (MIN(?rated) as ?rRated) where { 
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
  select ?musica ?nomeMusica ?nomeAlbum ?nartista ?data where { 
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
              select ?musica ?nomeMusica ?nomeAlbum ?nartista ?popularity ?data ?imagem where { 
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
  select (SAMPLE(?musica) as ?musica) ?nomeMusica ?nartista (MAX(?danceability) as ?danceability) (SAMPLE(?imagem) as ?imagem) where { 
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


// vai buscar lista de musicas de um dado ano. (devolve nome musica, artista, album)
router.get('/musicas/ano/:ano', async function(req, res) {

  var filter = '';
  if (req.query.rRated && req.query.rRated == "false") filter = 'FILTER(?rated = "False")';

  if (req.params.ano)
  {
    var query = `
              select ?musica ?nomeMusica ?nomeAlbum ?nartista ?data where { 
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


// vai buscar toda a informação de musicas com o nome
router.get('/musicas/:name', async function(req, res) 
{
  if (req.params.name)
  {
    var query = `
                select ?nartista ?duracao ?nome ?danceability ?popularity ?ratedR ?ano where { 
                  ?musica a :Musica .
                  ?musica :nome "${req.params.name}" .
                  ?musica :duracao ?duracao .
                  ?musica :danceability ?danceability .
                  ?musica :popularity ?popularity .
                  ?musica :ratedR ?ratedR .
                  ?musica :ofAlbum ?album .
                  ?album :nome ?nome .
                  ?album :data ?ano .
                  ?artista :hasAlbum ?album .
                  ?artista :nome ?nartista .
                }
                `

    var result = await gdb.execQuery(query);
    var results = [];
  
    result.results.bindings.map(b => {
      info = 
      {
        "artista": b.nartista.value,
        "duracao": b.duracao.value,
        "album": b.nome.value,
        "danceability": b.danceability.value,
        "popularity": b.popularity.value,
        "ratedR": b.ratedR.value,
        "data": b.ano.value
      }

      results.push(info)
    })

    res.send(results);
  }
  

});


// vai buscar todas as musicas com menor duração 
router.get('/musicas/duracao/:duracao', async function(req, res) {
  
  var filter = '';
  if (req.query.rRated && req.query.rRated == "false") filter = 'FILTER(?rated = "False")';

  if (req.params.duracao){
    var query = `
                select ?nomeMusica ?nomeAlbum ?nartista ?duracao where { 
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

// vai buscar toda a informação de uma musica de um dado album
router.get('/musicas/:album/:name', async function(req, res) 
{
  var filter = '';
  if (req.query.rRated && req.query.rRated == "false") filter = 'FILTER(?rated = "False")';

  if (req.params.name && req.params.album)
  {
    var query = `
                  select ?nartista ?duracao ?danceability ?popularity ?ratedR ?ano where { 
                    ?musica a :Musica .
                    ?musica :nome "${req.params.name}" .
                    ?musica :duracao ?duracao .
                    ?musica :danceability ?danceability .
                    ?musica :popularity ?popularity .
                    ?musica :ratedR ?ratedR .
                    ?musica :ofAlbum ?album .
                    ?album :nome "${req.params.album}" .
                    ?album :data ?ano .
                    ?artista :hasAlbum ?album .
                    ?artista :nome ?nartista .
                    ${filter}
                }
                `

    var result = await gdb.execQuery(query);
    var results = [];
  
    result.results.bindings.map(b => {
      info = 
      {
        "artista": b.nartista.value,
        "duracao": b.duracao.value,
        "album": req.params.album,
        "danceability": b.danceability.value,
        "popularity": b.popularity.value,
        "ratedR": b.ratedR.value,
        "data": b.ano.value
      }

      results.push(info)
    })

    res.send(results);
  }

});

module.exports = router;
