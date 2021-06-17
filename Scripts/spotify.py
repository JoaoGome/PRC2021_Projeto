import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import csv
import re
import json

client_id = "35c6dc14162f4f5e93d4ed2b67f3000c"
client_secret = "b06cf8f28e15449f90c43f6300e0d416"

pastAlbuns = []
pastMusics = []

client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager) #spotify object to access API

artists = []
with open('../Datasets/1.csv') as csvFile:
    rowNumber = 0
    csv_reader = csv.reader(csvFile, delimiter=",")
    for row in csv_reader:
        if rowNumber == 0:
            rowNumber += 1

        else:
            artists.append(row[0])

for artist in artists:
    info = ''
    albuns = []
    artist_uri = ''
    result = sp.search(artist) 
    for nome in result['tracks']['items'][0]['artists']:
        if(nome['name'] == artist.strip()):
            artist_uri = nome['uri']

    if artist_uri != '':
        sp_albums = sp.artist_albums(artist_uri, album_type='album')
        if (sp_albums['items'] != []):
            album_names = []
            album_uris = []
            for i in range(len(sp_albums['items'])):
                album_name = sp_albums['items'][i]['name']
                musics = []
                if (album_name not in albuns):
                    while (album_name in pastAlbuns):
                        album_name = album_name + '_'
                
                    pastAlbuns.append(album_name)
                    album_date = sp_albums['items'][i]['release_date']
                    album_numberTracks = sp_albums['items'][i]['total_tracks']
                    album_uri = sp_albums['items'][i]['uri']
                    album_image = sp_albums['items'][i]['images'][0]['url']
                    albuns.append(album_name)
                    tracks = sp.album_tracks(album_uri)

                    if (tracks['items'] != []):
                        for n in range(len(tracks['items'])):
                            music_name = tracks['items'][n]['name']

                            if music_name not in musics:

                                while (music_name in pastMusics):
                                    music_name = music_name + '_'

                                pastMusics.append(music_name)
                                musics.append(music_name)
                                music_number = tracks['items'][n]['track_number']
                                minutes = int(tracks['items'][n]['duration_ms']/(1000*60))%60
                                seconds = int(tracks['items'][n]['duration_ms']/1000)%60
                                music_duration = f'''{minutes}:{seconds}'''
                                music_ratedR = tracks['items'][n]['explicit']
                                music_uri = tracks['items'][n]['uri']
                                try:
                                    music_danceability = sp.audio_features(music_uri)[0]['danceability']    
                                except:
                                    music_danceability = -1
                                
                                try:
                                    music_popularity = sp.track(music_uri)['popularity']
                                except:
                                    music_popularity = -1

                                info += f'''
                                        ###  http://prc.di.uminho.pt/2021/Projeto#Music_{re.sub(r'[^a-zA-Z0-9_]+','',music_name)}
                                        :Music_{re.sub(r'[^a-zA-Z0-9_]+','',music_name)} rdf:type owl:NamedIndividual ,
                                        :Musica ;
                                        :ofAlbum :Album_{re.sub(r'[^a-zA-Z0-9_]+','',album_name)} ;
                                        :danceability {music_danceability} ;
                                        :duracao "{music_duration}" ;
                                        :musicNumber {music_number} ;
                                        :nome "{music_name.replace('"','').replace('_','')}" ;
                                        :popularity {music_popularity} ;
                                        :ratedR "{music_ratedR}" .
                                        '''

                    info += f'''
                            ###  http://prc.di.uminho.pt/2021/Projeto#Album_{re.sub(r'[^a-zA-Z0-9_]+','',album_name)}
                            :Album_{re.sub(r'[^a-zA-Z0-9_]+','',album_name)} rdf:type owl:NamedIndividual ,
                            :Album ; '''

                    for music in musics:
                        info += f'''
                                :hasMusic :Music_{re.sub(r'[^a-zA-Z0-9_]+','',music)} ;'''
                        
                    info += f'''
                            :data "{album_date}" ;
                            :image "{album_image.replace('"','')}" ;
                            :nome "{album_name.replace('"','').replace('_','')}" ;
                            :numberTracks {album_numberTracks} .
                            '''
        info += f'''
                ###  http://prc.di.uminho.pt/2021/Projeto#Artist_{re.sub(r'[^a-zA-Z0-9]+','',artist)}
                :Artist_{re.sub(r'[^a-zA-Z0-9]+','',artist)} rdf:type owl:NamedIndividual ,
                :Artista ; '''

        for albun in albuns:
            info += f'''
                    :hasAlbum :Album_{re.sub(r'[^a-zA-Z0-9_]+','',albun)} ; '''
                    
        info += f'''
                :nome "{artist.strip()}" .
        '''
        print(info)
        