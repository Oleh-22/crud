// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Track {
  static #list = []
  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.author = author
    this.image = image
  }

  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  static getList() {
    return this.#list.reverse()
  }

  static getById(id) {
    return Track.#list.find((track) => track.id === id)
  }
}
Track.create(
  'Інь Янь',
  'MONATIK & ROXOLANA',
  'https://picsum.photos/100/100',
)
Track.create(
  'Bailo',
  'Selena Gomez',
  'https://picsum.photos/100/100',
)
Track.create(
  'Shamelles',
  'Cam Xdgfhg',
  'https://picsum.photos/100/100',
)
Track.create(
  'Dakiti',
  'NUT SSFR',
  'https://picsum.photos/100/100',
)
Track.create(
  '11 pm',
  'Maluyjhnmma',
  'https://picsum.photos/100/100',
)
Track.create(
  'kol',
  'En Leo',
  'https://picsum.photos/100/100',
)
Track.create(
  'piw',
  'jjon-bbbon',
  'https://picsum.photos/100/100',
)

class Playlist {
  //Масив плелистів
  static #list = []
  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    //масив треків в кожному
    this.tracks = []
    this.image = 'https://picsum.photos/100/100'
  }

  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }

  static getList() {
    return this.#list.reverse()
  }

  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }

  static makeMix(playlist) {
    const allTracks = Track.getList()
    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
    playlist.tracks.push(...randomTracks)
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }

  addTrackById(trackId) {
    this.tracks.unshift(Track.getById(trackId))
  }

  static findListByValue(value) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(value.toLowerCase()),
    )
  }
}
// ================================================================
router.get('/', function (req, res) {
  const list = Playlist.getList()

  res.render('spotify-library', {
    style: 'spotify-library',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
    },
  })
})
// ================================================================
router.get('/spotify-choose', function (req, res) {
  res.render('spotify-choose', {
    style: 'spotify-choose',
    data: {},
  })
})
// ================================================================
router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  res.render('spotify-create', {
    style: 'spotify-create',
    data: { isMix },
  })
})
// ================================================================
router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix
  const name = req.body.name

  if (!name) {
    return res.render('alert-purchase', {
      style: 'alert-purchase',
      data: {
        message: 'Помилка',
        info: 'Введіть назву плейліста',
        link: isMix
          ? '/spotify-create?isMix=true'
          : '/spotify-create',
      },
    })
  }

  const playlist = Playlist.create(name)
  if (isMix) {
    Playlist.makeMix(playlist)
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
// ================================================================
router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)
  const playlist = Playlist.getById(id)

  if (!playlist) {
    return res.render('alert-purchase', {
      style: 'alert-purchase',
      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: '/',
      },
    })
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
// ================================================================
router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)
  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('alert-purchase', {
      style: 'alert-purchase',
      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  playlist.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
// ================================================================
router.get('/spotify-playlist-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)
  const playlist = Playlist.getById(playlistId)
  const track = Track.getById(trackId)

  res.render('spotify-playlist-add', {
    style: 'spotify-playlist-add',
    data: {
      playlistId: playlist.id,
      tracks: Track.getList(),
      name: playlist.name,
    },
  })
})
// ================================================================
router.get(
  '/spotify-playlist-add-track',
  function (req, res) {
    const playlistId = Number(req.query.playlistId)
    const trackId = Number(req.query.trackId)
    const playlist = Playlist.getById(playlistId)
    const track = Track.getById(trackId)

    playlist.addTrackById(trackId)

    res.render('spotify-playlist', {
      style: 'spotify-playlist',
      data: {
        playlistId: playlist.id,
        tracks: playlist.tracks,
        name: playlist.name,
      },
    })
  },
)
// ================================================================
router.get('/spotify-search', function (req, res) {
  const value = ''
  const list = Playlist.findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})
// ================================================================
router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''
  const list = Playlist.findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})
// Підключаємо роутер до бек-енду
module.exports = router
