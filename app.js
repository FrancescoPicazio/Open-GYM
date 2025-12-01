// app.js — versione completa e corretta
// Include: dati workout (con campo "img" per ogni esercizio), UI, timer sticky, image modal, progress badges.

// -----------------------------
// WORKOUT DATA (aggiunto campo "img" a ogni esercizio / nested)
// Sostituisci gli URL delle immagini con quelli reali che preferisci.
// Per esercizi senza immagine ho usato placeholder con il nome codificato.
const workoutData = {
  "Scheda 1": {
    "Cardio Iniziale": {
      "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrLlM-gm6GQPI5M5ZaH0cZ_X6TdAMOBDcnbQ&s",
      "andamento": [{"velocita": 6, "pendenza": 4, "tempo": 10, "unita": "m"}],
      "descrizione": "Riscaldamento cardio",
      "media": []
    },
    "Mobilita": {
      "Rotazioni braccia": {
        "img": "https://hips.hearstapps.com/mnh-it/files/articoli/6/8/7/6876/B_rotazione-con-le-braccia_1.png",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 30}],
        "recupero": 30,
        "unita": "s",
        "descrizione": "",
        "media": []
      },
      "scapular push-up": {
        "img": "https://liftmanual.com/wp-content/uploads/2023/04/scapula-push-up.jpg",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 12}],
        "recupero": 0,
        "unita": "s",
        "descrizione": "",
        "media": []
      },
      "rotazioni con elastico": {
        "img": "https://www.schedasmart.com/assets/img/uploads/extrarotazione-elastico.jpg",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 12}],
        "recupero": 30,
        "unita": "s",
        "descrizione": "",
        "media": []
      },
      "wall slides": {
        "img": "https://fitnessprogramer.com/wp-content/uploads/2021/02/wall-slide.gif",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 10}],
        "recupero": 30,
        "unita": "s",
        "descrizione": "",
        "media": []
      },
      "open book": {
        "img": "https://liftmanual.com/wp-content/uploads/2023/04/open-book-stretch.jpg",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 6}],
        "recupero": 30,
        "unita": "s",
        "descrizione": "",
        "media": []
      }
    },
    "Panca piana bilanciere": {
      "img": "https://www.muscoli.info/Media/MuscoliInfo/Immagini/Esercizi/distensioni-con-bilanciere-su-panca-piana.jpg",
      "ripetizioni": [
        {"kg": 45, "n_ripetizioni": 6},
        {"kg": 45, "n_ripetizioni": 6},
        {"kg": 45, "n_ripetizioni": 6},
        {"kg": 45, "n_ripetizioni": 6}
      ],
      "recupero": 90,
      "unita": "s",
      "descrizione": "",
      "media": []
    },
    "Panca inclinata manubri": {
      "img": "https://www.my-personaltrainer.it/2023/01/10/distensioni-su-panca-inclinata-con-manubri-orig.jpeg",
      "ripetizioni": [
        {"kg": 15, "n_ripetizioni": 8},
        {"kg": 15, "n_ripetizioni": 8},
        {"kg": 15, "n_ripetizioni": 8}
      ],
      "recupero": 90,
      "unita": "s",
      "descrizione": "",
      "media": []
    },
    "Croci ai cavi": {
      "img": "https://www.muscoli.info/Media/MuscoliInfo/Immagini/Esercizi/croci-ai-cavi-alti-in-piedi.jpg",
      "ripetizioni": [
        {"kg": 0, "n_ripetizioni": 12},
        {"kg": 0, "n_ripetizioni": 12},
        {"kg": 0, "n_ripetizioni": 12}
      ],
      "recupero": 45,
      "unita": "s",
      "descrizione": "",
      "media": []
    },
    "Military press bilanciere": {
      "img": "https://static.strengthlevel.com/images/exercises/military-press/military-press-400.avif",
      "ripetizioni": [
        {"kg": 25, "n_ripetizioni": 6},
        {"kg": 25, "n_ripetizioni": 6},
        {"kg": 25, "n_ripetizioni": 6},
        {"kg": 25, "n_ripetizioni": 6}
      ],
      "recupero": 90,
      "unita": "s",
      "descrizione": "",
      "media": []
    },
    "Alzate laterali": {
      "img": "https://www.my-personaltrainer.it/2023/01/12/alzate-laterali_900x760.jpeg",
      "ripetizioni": [
        {"kg": 8, "n_ripetizioni": 12},
        {"kg": 8, "n_ripetizioni": 12},
        {"kg": 8, "n_ripetizioni": 12}
      ],
      "recupero": 45,
      "unita": "s",
      "descrizione": "",
      "media": []
    },
    "Face pull": {
      "img": "https://weighttraining.guide/wp-content/uploads/2016/10/Face-pull-resized.png",
      "ripetizioni": [
        {"kg": 0, "n_ripetizioni": 15},
        {"kg": 0, "n_ripetizioni": 15},
        {"kg": 0, "n_ripetizioni": 15}
      ],
      "recupero": 45,
      "unita": "s",
      "descrizione": "",
      "media": []
    },
    "French press bilanciere EZ": {
      "img": "https://www.muscoli.info/Media/MuscoliInfo/Immagini/Esercizi/french-press-con-bilanciere-sagomato-sdraiati-su-panca-piana.jpg",
      "ripetizioni": [
        {"kg": 12, "n_ripetizioni": 10},
        {"kg": 12, "n_ripetizioni": 10},
        {"kg": 12, "n_ripetizioni": 10}
      ],
      "recupero": 60,
      "unita": "s",
      "descrizione": "",
      "media": []
    },
    "Pushdown cavi": {
      "img": "https://articoli.nonsolofitness.it/resources/big/775dd5778455d8a268e590c1005152ea.jpg.webp",
      "ripetizioni": [
        {"kg": 35, "n_ripetizioni": 12},
        {"kg": 35, "n_ripetizioni": 12},
        {"kg": 35, "n_ripetizioni": 12}
      ],
      "recupero": 45,
      "unita": "s",
      "descrizione": "",
      "media": []
    },
    "Finisher funzionale 3 giri": {
      "Push-up": {
        "img": "https://training.fit/wp-content/uploads/2020/02/liegestuetze.png",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 12}],
        "recupero": 30,
        "unita": "s",
        "descrizione": "",
        "media": []
      },
      "Mountain climbers": {
        "img": "https://training.fit/wp-content/uploads/2020/03/bergsteiger-fitnessband.png",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 30}],
        "recupero": 0,
        "unita": "s",
        "descrizione": "",
        "media": []
      },
      "Dips su panca": {
        "img": "https://static.strengthlevel.com/images/exercises/bench-dips/bench-dips-400.avif",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 12}],
        "recupero": 30,
        "unita": "s",
        "descrizione": "",
        "media": []
      }
    },
    "HIIT": {
      "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrLlM-gm6GQPI5M5ZaH0cZ_X6TdAMOBDcnbQ&s",
      "andamento": [
        {"velocita": 10, "pendenza": 0, "tempo": 30, "unita": "s"},
        {"velocita": 6, "pendenza": 0, "tempo": 30, "unita": "s"},
        {"velocita": 10, "pendenza": 0, "tempo": 30, "unita": "s"},
        {"velocita": 6, "pendenza": 0, "tempo": 30, "unita": "s"},
        {"velocita": 10, "pendenza": 0, "tempo": 30, "unita": "s"},
        {"velocita": 6, "pendenza": 0, "tempo": 30, "unita": "s"},
        {"velocita": 10, "pendenza": 0, "tempo": 30, "unita": "s"},
        {"velocita": 6, "pendenza": 0, "tempo": 30, "unita": "s"},
        {"velocita": 10, "pendenza": 0, "tempo": 30, "unita": "s"},
        {"velocita": 6, "pendenza": 0, "tempo": 30, "unita": "s"},
        {"velocita": 10, "pendenza": 0, "tempo": 30, "unita": "s"},
        {"velocita": 6, "pendenza": 0, "tempo": 30, "unita": "s"},
        {"velocita": 10, "pendenza": 0, "tempo": 30, "unita": "s"},
        {"velocita": 6, "pendenza": 0, "tempo": 30, "unita": "s"},
        {"velocita": 10, "pendenza": 0, "tempo": 30, "unita": "s"},
        {"velocita": 6, "pendenza": 0, "tempo": 30, "unita": "s"},
        {"velocita": 10, "pendenza": 0, "tempo": 30, "unita": "s"},
        {"velocita": 6, "pendenza": 0, "tempo": 30, "unita": "s"},
        {"velocita": 10, "pendenza": 0, "tempo": 30, "unita": "s"},
        {"velocita": 6, "pendenza": 0, "tempo": 30, "unita": "s"}
      ],
      "descrizione": "10’ totali, 30'' ON / 30'' OFF",
      "media": []
    }
  },
  "Scheda 2": {
    "Cardio Iniziale": {
      "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrLlM-gm6GQPI5M5ZaH0cZ_X6TdAMOBDcnbQ&sg",
      "andamento": [{"velocita": 6, "pendenza": 4, "tempo": 10, "unita": "m"}],
      "descrizione": "",
      "media": []
    },
       "Mobilita": {
      "Shoulder CARs (rotazioni lente e ampie)": {
        "img": "https://thegolfperformancecenter.com/wp-content/uploads/2018/12/Tyler_-11-2.jpg",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 20}, {"kg": 0, "n_ripetizioni": 20}],
        "recupero": 30,
        "unita": "s",
        "descrizione": "",
        "media": []
      },
      "Scapular pull-up": {
        "img": "https://pelank.com/wp-content/uploads/2025/01/Scapula-Pull-up.gif",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 10}],
        "recupero": 0,
        "unita": "s",
        "descrizione": "",
        "media": []
      },
      "Cat-cow": {
        "img": "https://liftmanual.com/wp-content/uploads/2023/04/cat-cow-stretch.jpg",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 10}],
        "recupero": 30,
        "unita": "s",
        "descrizione": "",
        "media": []
      },
      "Band lat stretch (allungamento dorsale con elastico)": {
        "img": "https://i.ytimg.com/vi/O_n8yYWgNZE/maxresdefault.jpg",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 10}],
        "recupero": 30,
        "unita": "s",
        "descrizione": "",
        "media": []
      },
      "Scapular retraction con elastico": {
        "img": "https://s3assets.skimble.com/assets/1963536/image_iphone.jpg",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 6}],
        "recupero": 30,
        "unita": "s",
        "descrizione": "",
        "media": []
      }
    },
    "Deadlift / Rematore bilanciere": {
      "img": "https://liftmanual.com/wp-content/uploads/2023/04/strongman-deadlift.jpg",
      "ripetizioni": [
        {"kg": 45, "n_ripetizioni": 6},
        {"kg": 45, "n_ripetizioni": 6},
        {"kg": 45, "n_ripetizioni": 6},
        {"kg": 45, "n_ripetizioni": 6}
      ],
      "recupero": 90,
      "unita": "s",
      "descrizione": "",
      "media": []
    },
    "Pull-up / Lat machine": {
      "img": "https://training.fit/wp-content/uploads/2020/02/latzug-1024x573.png",
      "ripetizioni": [
        {"kg": 0, "n_ripetizioni": 8},
        {"kg": 0, "n_ripetizioni": 8},
        {"kg": 0, "n_ripetizioni": 8},
        {"kg": 0, "n_ripetizioni": 8}
      ],
      "recupero": 90,
      "unita": "s",
      "descrizione": "",
      "media": []
    },
    "Bent-over one arm row": {
      "img": "https://training.fit/wp-content/uploads/2020/02/rudern-kurzhantel-800x448.png",
      "ripetizioni": [
        {"kg": 18, "n_ripetizioni": 10},
        {"kg": 18, "n_ripetizioni": 10},
        {"kg": 18, "n_ripetizioni": 10}
      ],
      "recupero": 60,
      "unita": "s",
      "descrizione": "",
      "media": []
    },
    "Lat pulldown close grip": {
      "img": "https://images.squarespace-cdn.com/content/v1/5ffcea9416aee143500ea103/1638412155997-IDN7VJK5V4UXL4SKOPAE/Close%2BGrip%2BV-Bar%2BPulldown.jpeg",
      "ripetizioni": [
        {"kg": 45, "n_ripetizioni": 10},
        {"kg": 45, "n_ripetizioni": 10},
        {"kg": 45, "n_ripetizioni": 10}
      ],
      "recupero": 60,
      "unita": "s",
      "descrizione": "",
      "media": []
    },
    "Curl bilanciere": {
      "img": "https://static.wixstatic.com/media/c7a3e2_f50061c2c60c4c3699fe1937e36c2289~mv2.jpg/v1/fill/w_740,h_460,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/c7a3e2_f50061c2c60c4c3699fe1937e36c2289~mv2.jpg",
      "ripetizioni": [
        {"kg": 10, "n_ripetizioni": 8},
        {"kg": 10, "n_ripetizioni": 8},
        {"kg": 10, "n_ripetizioni": 8},
        {"kg": 10, "n_ripetizioni": 8}
      ],
      "recupero": 60,
      "unita": "s",
      "descrizione": "",
      "media": []
    },
    "Curl martello": {
      "img": "https://www.my-personaltrainer.it/2023/01/04/hammer-curl-orig.jpeg",
      "ripetizioni": [
        {"kg": 10, "n_ripetizioni": 10},
        {"kg": 10, "n_ripetizioni": 10},
        {"kg": 10, "n_ripetizioni": 10}
      ],
      "recupero": 45,
      "unita": "s",
      "descrizione": "",
      "media": []
    },
    "Curl ai cavi": {
      "img": "https://articoli.nonsolofitness.it/resources/big/c7e643b885d3368796a19800b102675b.jpg.webp",
      "ripetizioni": [
        {"kg": 0, "n_ripetizioni": 12},
        {"kg": 0, "n_ripetizioni": 12},
        {"kg": 0, "n_ripetizioni": 12}
      ],
      "recupero": 45,
      "unita": "s",
      "descrizione": "",
      "media": []
    },
    "Rear delt / Face pull": {
      "img": "https://liftmanual.com/wp-content/uploads/2023/04/cable-rear-delt-row.jpg",
      "ripetizioni": [
        {"kg": 0, "n_ripetizioni": 12},
        {"kg": 0, "n_ripetizioni": 12},
        {"kg": 0, "n_ripetizioni": 12}
      ],
      "recupero": 45,
      "unita": "s",
      "descrizione": "",
      "media": []
    },
    "Finisher funzionale 3 giri": {
      "Rematore manubri": {
        "img": "https://www.muscoli.info/Media/MuscoliInfo/Immagini/Esercizi/rematore-con-manubri-a-presa-neutra-in-piedi.jpg",
        "ripetizioni": [{"kg": 18, "n_ripetizioni": 12}],
        "recupero": 30,
        "unita": "s",
        "descrizione": "",
        "media": []
      },
      "Face pull": {
        "img": "https://trainingstation.co.uk/cdn/shop/articles/face-pulls-muscles-used_fe27890e-ac33-489a-bb21-a9bbcc84bfae_1400x.png?v=1738219155",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 15}],
        "recupero": 0,
        "unita": "s",
        "descrizione": "",
        "media": []
      },
      "Pull-up assistiti": {
        "img": "https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F29971101.png&w=640&q=80",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 10}],
        "recupero": 30,
        "unita": "s",
        "descrizione": "",
        "media": []
      }
    },
    "LISS": {
      "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrLlM-gm6GQPI5M5ZaH0cZ_X6TdAMOBDcnbQ&sg",
      "andamento": [{"velocita": 5.5, "pendenza": 5, "tempo": 10, "unita": "m"}],
      "descrizione": "Camminata in pendenza",
      "media": []
    }
  },
  "Scheda 3": {
    "Cardio Iniziale": {
      "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrLlM-gm6GQPI5M5ZaH0cZ_X6TdAMOBDcnbQ&sg",
      "andamento": [{"velocita": 6, "pendenza": 4, "tempo": 10, "unita": "m"}],
      "descrizione": "",
      "media": []
    },
   "Mobilita": {
      "Hip circles": {
        "img": "https://fitnessprogramer.com/wp-content/uploads/2021/01/hip-circles.gif",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 10}, {"kg": 0, "n_ripetizioni": 10}],
        "recupero": 30,
        "unita": "s",
        "descrizione": "",
        "media": []
      },
      "Deep squat hold": {
        "img": "https://liftmanual.com/wp-content/uploads/2023/04/full-squat-mobility.jpg",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 20}],
        "recupero": 0,
        "unita": "s",
        "descrizione": "",
        "media": []
      },
      "Leg swings (frontali + laterali)": {
        "img": "https://www.lyfta.app/_next/image?url=%2Fthumbnails%2F35021201.jpg&w=3840&q=75",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 15}, {"kg": 0, "n_ripetizioni": 15}],
        "recupero": 30,
        "unita": "s",
        "descrizione": "",
        "media": []
      },
      "Cat-cow": {
        "img": "https://liftmanual.com/wp-content/uploads/2023/04/cat-cow-stretch.jpg",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 8}],
        "recupero": 30,
        "unita": "s",
        "descrizione": "",
        "media": []
      },
      "Glute bridge attivazione": {
        "img": "https://www.barbrothers.it/wp-content/uploads/2019/12/Muscoli-coinvolti-nel-glute-bridge.jpg",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 15}],
        "recupero": 30,
        "unita": "s",
        "descrizione": "",
        "media": []
      }
    },
    "Hip thrust": {
      "img": "https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-hip-thrust.jpg",
      "ripetizioni": [
        {"kg": 30, "n_ripetizioni": 8},
        {"kg": 30, "n_ripetizioni": 8},
        {"kg": 30, "n_ripetizioni": 8},
        {"kg": 30, "n_ripetizioni": 8}
      ],
      "recupero": 90,
      "unita": "s",
      "descrizione": "",
      "media": []
    },
    "Squat bilanciere": {
      "img": "https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F23591101.png&w=3840&q=75",
      "ripetizioni": [
        {"kg": 20, "n_ripetizioni": 8},
        {"kg": 20, "n_ripetizioni": 8},
        {"kg": 20, "n_ripetizioni": 8},
        {"kg": 20, "n_ripetizioni": 8}
      ],
      "recupero": 90,
      "unita": "s",
      "descrizione": "",
      "media": []
    },
    "Leg press": {
      "img": "https://fitnessprogramer.com/wp-content/uploads/2015/11/Leg-Press.gif",
      "ripetizioni": [
        {"kg": 120, "n_ripetizioni": 10},
        {"kg": 120, "n_ripetizioni": 10},
        {"kg": 120, "n_ripetizioni": 10},
        {"kg": 120, "n_ripetizioni": 10}
      ],
      "recupero": 90,
      "unita": "s",
      "descrizione": "",
      "media": []
    },
    "Lunge manubri": {
      "img": "https://static.strengthlevel.com/images/exercises/dumbbell-lunge/dumbbell-lunge-800.jpg",
      "ripetizioni": [
        {"kg": 10, "n_ripetizioni": 12},
        {"kg": 10, "n_ripetizioni": 12},
        {"kg": 10, "n_ripetizioni": 12}
      ],
      "recupero": 60,
      "unita": "s",
      "descrizione": "",
      "media": []
    },
    "Leg extension": {
      "img": "https://training.fit/wp-content/uploads/2020/03/beinstrecken-geraet-1.png",
      "ripetizioni": [
        {"kg": 0, "n_ripetizioni": 12},
        {"kg": 0, "n_ripetizioni": 12},
        {"kg": 0, "n_ripetizioni": 12}
      ],
      "recupero": 45,
      "unita": "s",
      "descrizione": "",
      "media": []
    },
    "Leg curl sdraiato": {
      "img": "https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F05821101.png&w=640&q=80",
      "ripetizioni": [
        {"kg": 20, "n_ripetizioni": 12},
        {"kg": 20, "n_ripetizioni": 12},
        {"kg": 20, "n_ripetizioni": 12}
      ],
      "recupero": 45,
      "unita": "s",
      "descrizione": "",
      "media": []
    },
    "Calf seduto": {
      "img": "https://www.muscoli.info/Media/MuscoliInfo/Immagini/Esercizi/polpacci-calf-alla-macchina-seduti.jpg",
      "ripetizioni": [
        {"kg": 20, "n_ripetizioni": 15},
        {"kg": 20, "n_ripetizioni": 15},
        {"kg": 20, "n_ripetizioni": 15}
      ],
      "recupero": 30,
      "unita": "s",
      "descrizione": "",
      "media": []
    },
    "Chest press": {
      "img": "https://liftmanual.com/wp-content/uploads/2023/04/machine-inner-chest-press.jpg",
      "ripetizioni": [
        {"kg": 30, "n_ripetizioni": 8},
        {"kg": 30, "n_ripetizioni": 8},
        {"kg": 30, "n_ripetizioni": 8}
      ],
      "recupero": 60,
      "unita": "s",
      "descrizione": "",
      "media": []
    },
    "Rematore pulley inversa": {
      "img": "data:image/jpeg;base64,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",
      "ripetizioni": [
        {"kg": 35, "n_ripetizioni": 10},
        {"kg": 35, "n_ripetizioni": 10},
        {"kg": 35, "n_ripetizioni": 10}
      ],
      "recupero": 60,
      "unita": "s",
      "descrizione": "",
      "media": []
    },
    "Addome": {
      "Plank": {
        "img": "https://fitnessprogramer.com/wp-content/uploads/2021/02/plank.gif",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 60}],
        "recupero": 0,
        "unita": "s",
        "descrizione": "",
        "media": []
      },
      "Cable crunch": {
        "img": "https://training.fit/wp-content/uploads/2020/01/kabelzugcrunches-800x448.png",
        "ripetizioni": [
          {"kg": 70, "n_ripetizioni": 15},
          {"kg": 70, "n_ripetizioni": 15},
          {"kg": 70, "n_ripetizioni": 15}
        ],
        "recupero": 30,
        "unita": "s",
        "descrizione": "",
        "media": []
      }
    },
    "Finisher funzionale 3 giri": {
      "Bulgarian split squat": {
        "img": "https://fitnessprogramer.com/wp-content/uploads/2021/05/Dumbbell-Bulgarian-Split-Squat.gif",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 10}],
        "recupero": 30,
        "unita": "s",
        "descrizione": "",
        "media": []
      },
      "Kettlebell swing": {
        "img": "https://liftmanual.com/wp-content/uploads/2023/04/kettlebell-swing.jpg",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 15}],
        "recupero": 0,
        "unita": "s",
        "descrizione": "",
        "media": []
      },
      "Plank to elbow tap": {
        "img": "https://spotebi.com/wp-content/uploads/2016/03/plank-shoulder-tap-exercise-illustration-spotebi.jpg",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 30}],
        "recupero": 0,
        "unita": "s",
        "descrizione": "",
        "media": []
      },
      "Jump squat": {
        "img": "https://liftmanual.com/wp-content/uploads/2023/04/double-jump-squat.jpg",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 10}],
        "recupero": 30,
        "unita": "s",
        "descrizione": "",
        "media": []
      }
    },
    "LISS": {
      "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrLlM-gm6GQPI5M5ZaH0cZ_X6TdAMOBDcnbQ&sg",
      "andamento": [{"velocita": 5.5, "pendenza": 5, "tempo": 10, "unita": "m"}],
      "descrizione": "",
      "media": []
    }
  },
  "Note": {
    "Settimane 3-4": "Carichi principali: +2,5 kg panca/squat/military/hip thrust/deadlift - Accessori +1-2 kg o +1-2 ripetizioni - HIIT/LISS +1-2 minuti",
    "Settimane 5-6": "Aumento ulteriori 2,5-5 kg principali - Accessori +1-2 kg - HIIT/LISS +1-2 minuti",
    "Settimane 7-8": "Massimizzare i carichi mantenendo tecnica - Aumentare densità finisher - Cardio alla massima durata gestibile"
  }
};


// -----------------------------
// DOM references & storage
const storageKey = 'workout_progress_v4';
let persistEnabled = true;

const app = document.getElementById('app');
const tabsEl = document.getElementById('tabs');
const summaryEl = document.getElementById('summary');
const persistToggle = document.getElementById('persistToggle');
const resetBtn = document.getElementById('resetProgress');
const themeToggle = document.getElementById('themeToggle');

if(persistToggle) persistToggle.addEventListener('change', e => persistEnabled = e.target.checked);
if(resetBtn) resetBtn.addEventListener('click', ()=> {
  if(confirm('Resettare tutto il progresso?')){
    localStorage.removeItem(storageKey);
    location.reload();
  }
});
if(themeToggle) themeToggle.addEventListener('click', ()=>{
  const cur = localStorage.getItem('theme') || 'dark';
  const next = cur === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('theme', next);
});

// -----------------------------
// progress persistence
function loadProgress(){ try{ const raw = localStorage.getItem(storageKey); return raw? JSON.parse(raw) : {}; }catch(e){return {}}}
function saveProgress(progress){ if(!persistEnabled) return; localStorage.setItem(storageKey, JSON.stringify(progress)); }
let progress = loadProgress();

// -----------------------------
// audio, utils
function beep(){ try{ const ctx = new (window.AudioContext||window.webkitAudioContext)(); const o = ctx.createOscillator(); const g = ctx.createGain(); o.type='sine'; o.frequency.value=880; g.gain.setValueAtTime(0.0001, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime+0.02); o.connect(g); g.connect(ctx.destination); o.start(); setTimeout(()=>{ o.stop(); ctx.close(); }, 300);}catch(e){} }
function fmt(seconds){ if(seconds<=0) return '00:00'; const mm = Math.floor(seconds/60).toString().padStart(2,'0'); const ss = Math.floor(seconds%60).toString().padStart(2,'0'); return `${mm}:${ss}`; }
function computeDuration(exer, set, andamentoSegment){
  if(andamentoSegment){
    const u = andamentoSegment.unita || 's';
    const t = andamentoSegment.tempo || 0;
    return u === 'm' ? t*60 : t;
  }
  if(exer && typeof exer.recupero === 'number' && exer.recupero > 0) return exer.recupero;
  if(exer && exer.unita === 's' && set && typeof set.n_ripetizioni === 'number' && set.n_ripetizioni >= 10) return set.n_ripetizioni;
  return 0;
}

// -----------------------------
// image modal helpers
const imgModalEl = document.getElementById('imgModal');
const imgModalImg = document.getElementById('imgModalImg');
const imgModalTitle = document.getElementById('imgModalTitle');
const imgModalClose = document.getElementById('imgModalClose');
const imgModalBackdrop = document.getElementById('imgModalBackdrop');

function openImageModal(url, title){
  if(!imgModalEl || !imgModalImg) return;
  imgModalImg.src = url;
  imgModalImg.alt = title || 'Esercizio';
  imgModalTitle.textContent = title || '';
  imgModalEl.classList.remove('hidden');
  imgModalEl.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}
function closeImageModal(){
  if(!imgModalEl) return;
  imgModalEl.classList.add('hidden');
  imgModalEl.setAttribute('aria-hidden','true');
  imgModalImg.src = '';
  imgModalTitle.textContent = '';
  document.body.style.overflow = '';
}
if(imgModalClose) imgModalClose.addEventListener('click', closeImageModal);
if(imgModalBackdrop) imgModalBackdrop.addEventListener('click', closeImageModal);
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape' && imgModalEl && !imgModalEl.classList.contains('hidden')) closeImageModal();
});

// -----------------------------
// sticky timer (single global instance)
const sticky = {
  el: document.getElementById('stickyTimer'),
  title: document.getElementById('stickyTitle'),
  sub: document.getElementById('stickySub'),
  count: document.getElementById('stickyCount'),
  startBtn: document.getElementById('stickyStart'),
  pauseBtn: document.getElementById('stickyPause'),
  resetBtn: document.getElementById('stickyReset'),
  progressBar: document.getElementById('stickyProgress'),
  closeBtn: document.getElementById('stickyClose'),
  active: null, // {id, scheda, exercise}
  timer: null,
  remaining: 0,
  total: 0
};

// utility: stop current sticky timer without marking progress
function cancelStickyTimer(){
  if(sticky.timer) clearInterval(sticky.timer);
  sticky.timer = null;
  sticky.active = null;
  sticky.remaining = 0;
  sticky.total = 0;
  if(sticky.el) sticky.el.classList.add('hidden');
  if(sticky.startBtn) sticky.startBtn.disabled = false;
  if(sticky.pauseBtn) sticky.pauseBtn.disabled = true;
  updateStickyDisplay();
}

// start sticky timer (replaces any running)
function startStickyFor(id, scheda, exercise, totalSeconds){
  // cancel existing
  cancelStickyTimer();
  sticky.active = { id, scheda, exercise };
  sticky.total = totalSeconds;
  sticky.remaining = totalSeconds;
  if(sticky.title) sticky.title.textContent = `${exercise}`;
  if(sticky.sub) sticky.sub.textContent = `${scheda}`;
  if(sticky.el) sticky.el.classList.remove('hidden');
  updateStickyDisplay();
  // start interval
  sticky.timer = setInterval(()=>{
    sticky.remaining -= 1;
    updateStickyDisplay();
    if(sticky.remaining <= 0){
      clearInterval(sticky.timer);
      sticky.timer = null;
      // when timer ends: mark progress and sync checkbox
      const sid = sticky.active && sticky.active.id;
      if(sid){
        progress[sid] = true;
        saveProgress(progress);
        // update summary and badge
        updateSummary();
        if(sticky.active.scheda && sticky.active.exercise){
          updateProgressIndicator(sticky.active.scheda, sticky.active.exercise);
        }
        // sync checkbox (programmatic change -> non user-initiated)
        const cb = document.querySelector(`[data-id="${sid}"]`);
        if(cb && !cb.checked){
          cb.checked = true;
          // add running->completed class to its wrapper if present
          const lab = cb.closest('.checkbox');
          if(lab) lab.classList.remove('running'); lab && lab.classList.add('checked');
        }
      }
      // beep & hide after short pause
      beep();
      setTimeout(()=>{ if(sticky.el) sticky.el.classList.add('hidden'); }, 400);
      sticky.active = null;
      sticky.remaining = 0;
      sticky.total = 0;
      updateStickyDisplay();
    }
  }, 1000);
}

// update sticky display
function updateStickyDisplay(){
  if(!sticky.count) return;
  sticky.count.textContent = fmt(Math.max(0, Math.round(sticky.remaining)));
  const pct = sticky.total > 0 ? Math.round(100 * (1 - sticky.remaining / sticky.total)) : 0;
  if(sticky.progressBar) sticky.progressBar.value = pct;
}

// -----------------------------
// helpers: badge & progress
function updateProgressIndicator(schedaName, exerName){
  // aggiorna lo status sotto il titolo
  const selector = `[data-status-for="${schedaName}__${exerName}"]`;
  const el = document.querySelector(selector);
  if(el){
    el.textContent = progressForExercise(schedaName, exerName);
  }
}
function cssSafe(s){ return s.replace(/\s+/g,'_').replace(/[^\w\-]/g,''); }

function progressForExercise(schedaName, exerName){
  const exer = workoutData[schedaName][exerName];
  let total = 0, done = 0;
  function scan(obj, prefix){
    if(obj.ripetizioni){
      total += obj.ripetizioni.length;
      for(let i=0;i<obj.ripetizioni.length;i++){
        const key = `${schedaName}__${exerName}__${prefix?prefix+'_':''}set_${i}`;
        if(progress[key]) done++;
      }
    }
    if(obj.andamento){
      total += obj.andamento.length;
      for(let i=0;i<obj.andamento.length;i++){
        const key = `${schedaName}__${exerName}__${prefix?prefix+'_':''}andamento_${i}`;
        if(progress[key]) done++;
      }
    }
    for(const k of Object.keys(obj)){
      if(['ripetizioni','andamento','recupero','unita','descrizione','media','img'].includes(k)) continue;
      if(typeof obj[k] === 'object') scan(obj[k], k);
    }
  }
  scan(exer, '');
  return `${done}/${total} completati`;
}

function updateSummary(){
  let total=0, done=0;
  for(const schedaName of Object.keys(workoutData)){
    if(schedaName === 'Note') continue;
    const scheda = workoutData[schedaName];
    for(const exerName of Object.keys(scheda)){
      const exer = scheda[exerName];
      function scan(obj, prefix){
        if(obj.ripetizioni){
          total += obj.ripetizioni.length;
          for(let i=0;i<obj.ripetizioni.length;i++){
            const key = `${schedaName}__${exerName}__${prefix?prefix+'_':''}set_${i}`;
            if(progress[key]) done++;
          }
        }
        if(obj.andamento){
          total += obj.andamento.length;
          for(let i=0;i<obj.andamento.length;i++){
            const key = `${schedaName}__${exerName}__${prefix?prefix+'_':''}andamento_${i}`;
            if(progress[key]) done++;
          }
        }
        for(const k of Object.keys(obj)){
          if(['ripetizioni','andamento','recupero','unita','descrizione','media','img'].includes(k)) continue;
          if(typeof obj[k] === 'object') scan(obj[k], k);
        }
      }
      scan(exer, '');
    }
  }
  if(summaryEl) summaryEl.textContent = `${done}/${total} set completati`;
}

// -----------------------------
// RENDER
function render(){
  // tabs
  if(tabsEl) tabsEl.innerHTML = '';
  const keys = Object.keys(workoutData);
  keys.forEach((k, idx)=>{
    const t = document.createElement('button');
    t.className = 'tab' + (idx===0 ? ' active' : '');
    t.textContent = k;
    t.addEventListener('click', ()=> {
      document.querySelectorAll('.tab').forEach(el=>el.classList.remove('active'));
      t.classList.add('active');
      document.querySelectorAll('.scheda').forEach(s=> s.style.display = 'none');
      const target = document.getElementById(`scheda-${cssSafe(k)}`);
      if(target) target.style.display = 'block';
    });
    if(tabsEl) tabsEl.appendChild(t);
  });

  if(app) app.innerHTML = '';
  keys.forEach((schedaName, idx)=>{
    const scheda = workoutData[schedaName];
    const box = document.createElement('section');
    box.className = 'scheda';
    box.id = `scheda-${cssSafe(schedaName)}`;
    if(idx !== 0) box.style.display = 'none';

    const head = document.createElement('div'); head.className = 'scheda-head';
    const title = document.createElement('h2'); title.textContent = schedaName;
    head.appendChild(title);
    const progressWrap = document.createElement('div');
    progressWrap.className = 'small muted';
    progressWrap.textContent = '';
    head.appendChild(progressWrap);
    box.appendChild(head);

    const body = document.createElement('div'); body.className = 'scheda-body';

    if(schedaName === 'Note'){
      const n = document.createElement('div'); n.className = 'muted';
      for(const [k,v] of Object.entries(scheda)){
        const p = document.createElement('p'); p.innerHTML = `<strong>${k}:</strong> ${v}`; n.appendChild(p);
      }
      body.appendChild(n);
      box.appendChild(body);
      if(app) app.appendChild(box);
      return;
    }

    for(const exerName of Object.keys(scheda)){
      const exer = scheda[exerName];
      const ex = document.createElement('div'); ex.className = 'exercise';

      // header
      const exHeader = document.createElement('div'); exHeader.className = 'exercise-header';

    function createThumbIfAvailable(exerObj, exerDisplayName){
        const url = exerObj && exerObj.img ? exerObj.img : null;
        if(!url) return null;
        const img = document.createElement('img');
        img.className = 'exercise-thumb';
        img.src = url;
        img.alt = exerDisplayName || 'Esercizio';
        img.addEventListener('click', (ev)=>{
          ev.stopPropagation();
          openImageModal(url, exerDisplayName);
        });
        return img;
      }
      // LEFT: thumb + text
     // ---- dentro render(), per ogni esercizio: creazione LEFT (thumb + title + status + desc)
    const left = document.createElement('div'); left.className = 'left';

    // create thumbnail if exer has img (la tua funzione createThumbIfAvailable rimane la stessa)
    const thumb = createThumbIfAvailable(exer, exerName);
    if (thumb) left.appendChild(thumb);

    // text block: title, status (qui), descrizione
    const textBlock = document.createElement('div');
    const h3 = document.createElement('h3'); h3.textContent = exerName;
    textBlock.appendChild(h3);

    // status (sotto il titolo, tra titolo e descrizione)
    const statusEl = document.createElement('div');
    statusEl.className = 'small muted status';
    statusEl.setAttribute('data-status-for', `${schedaName}__${exerName}`);
    statusEl.textContent = progressForExercise(schedaName, exerName);
    textBlock.appendChild(statusEl);

    // descrizione sotto lo stato
    const desc = document.createElement('div'); desc.className = 'muted small'; desc.textContent = exer.descrizione || '';
    textBlock.appendChild(desc);

    left.appendChild(textBlock);

    // ---- poi crei right senza il progressIndicator (rimuovi la creazione precedente)
    const right = document.createElement('div');
    right.style.display = 'flex';
    right.style.gap = '8px';
    right.style.alignItems = 'center';
    const collapseBtn = document.createElement('button'); collapseBtn.className='btn ghost'; collapseBtn.textContent='Mostra';
    right.appendChild(collapseBtn);

      exHeader.appendChild(left); exHeader.appendChild(right);
      ex.appendChild(exHeader);

      const content = document.createElement('div'); content.className='exercise-content'; content.style.marginTop='6px'; content.style.display='none';

      // andamento
      if(exer.andamento){
        const sets = document.createElement('div'); sets.className='sets';
        exer.andamento.forEach((seg, si)=>{
          const setEl = document.createElement('div'); setEl.className='set';
          const info = document.createElement('div'); info.className='info';
          info.innerHTML = `<div class="meta"><strong>Segmento ${si+1}</strong> — ${seg.tempo}${seg.unita||'s'} @ v:${seg.velocita||'-'} p:${seg.pendenza||'-'}</div><div class="small muted">${exer.descrizione || ''}</div>`;
          setEl.appendChild(info);
          const ctrl = controlsForSegment(schedaName, exerName, exer, null, seg, `andamento_${si}`);
          setEl.appendChild(ctrl.wrap);
          sets.appendChild(setEl);
        });
        content.appendChild(sets);
      }

      // ripetizioni
      if(exer.ripetizioni){
        const sets = document.createElement('div'); sets.className='sets';
        exer.ripetizioni.forEach((set, si)=>{
          const setEl = document.createElement('div'); setEl.className='set';
          const leftInfo = document.createElement('div'); leftInfo.className='info';
          leftInfo.innerHTML = `<div class="meta">${set.kg} kg × ${set.n_ripetizioni} rep</div><div class="small muted">${exer.unita || ''}</div>`;
          setEl.appendChild(leftInfo);
          const ctrl = controlsForSegment(schedaName, exerName, exer, set, null, `set_${si}`);
          setEl.appendChild(ctrl.wrap);
          sets.appendChild(setEl);
        });
        content.appendChild(sets);
      }

      // nested
      for(const key of Object.keys(exer)){
        if(['ripetizioni','andamento','recupero','unita','descrizione','media','img'].includes(key)) continue;
        const nested = exer[key];
        if(typeof nested === 'object' && (nested.ripetizioni || nested.andamento)){
          const block = document.createElement('div'); block.className='nested';
          const titleN = document.createElement('div');
          const nestedThumb = createThumbIfAvailable(nested, key);
          if(nestedThumb){
            const wr = document.createElement('div'); wr.style.display='flex'; wr.style.alignItems='center'; wr.style.gap='8px';
            wr.appendChild(nestedThumb); const t = document.createElement('div'); t.innerHTML = `<strong>${key}</strong>`; wr.appendChild(t); titleN.appendChild(wr);
          } else {
            titleN.innerHTML = `<strong>${key}</strong>`;
          }
          block.appendChild(titleN);

          if(nested.ripetizioni){
            const sets = document.createElement('div'); sets.className='sets';
            nested.ripetizioni.forEach((set, si)=>{
              const setEl = document.createElement('div'); setEl.className='set';
              const leftInfo = document.createElement('div'); leftInfo.className='info';
              leftInfo.innerHTML = `<div class="meta">${set.kg} kg × ${set.n_ripetizioni} rep</div>`;
              setEl.appendChild(leftInfo);
              const ctrl = controlsForSegment(schedaName, exerName, nested, set, null, `${key}_set_${si}`, key);
              setEl.appendChild(ctrl.wrap);
              sets.appendChild(setEl);
            });
            block.appendChild(sets);
          }

          if(nested.andamento){
            const sets = document.createElement('div'); sets.className='sets';
            nested.andamento.forEach((seg, si)=>{
              const setEl = document.createElement('div'); setEl.className='set';
              const info = document.createElement('div'); info.className='info';
              info.innerHTML = `<div class="meta"><strong>Segmento ${si+1}</strong> — ${seg.tempo}${seg.unita||'s'}</div>`;
              setEl.appendChild(info);
              const ctrl = controlsForSegment(schedaName, exerName, nested, null, seg, `${key}_andamento_${si}`, key);
              setEl.appendChild(ctrl.wrap);
              sets.appendChild(setEl);
            });
            block.appendChild(sets);
          }

          content.appendChild(block);
        }
      }

      ex.appendChild(content);
      collapseBtn.addEventListener('click', ()=>{
        const show = content.style.display === 'none';
        content.style.display = show ? 'block' : 'none';
        collapseBtn.textContent = show ? 'Nascondi' : 'Mostra';
      });

      body.appendChild(ex);
    }

    box.appendChild(body);
    if(app) app.appendChild(box);
  });

  updateSummary();
}

// -----------------------------
// controlsForSegment: checkbox starts/cancels timer, no extra buttons
function controlsForSegment(schedaName, exerName, exerObj, set, andamentoSegmentOrNull, suffix, nestedKey){
  const wrap = document.createElement('div'); wrap.className = 'timer';

  const id = `${schedaName}__${exerName}__${suffix}`;
  const duration = computeDuration(exerObj, set, andamentoSegmentOrNull);

  // duration input
  const inputDur = document.createElement('input'); inputDur.type='number'; inputDur.min=0; inputDur.value = duration; inputDur.title='Durata (s)'; inputDur.style.width='84px';
  const countSpan = document.createElement('div'); countSpan.className='count'; countSpan.textContent = fmt(Number(inputDur.value));

  // checkbox (single control)
  const innerCB = document.createElement('input'); innerCB.type='checkbox'; innerCB.dataset.id = id; innerCB.setAttribute('data-id', id);
  // if already marked in progress, keep checked
  innerCB.checked = !!progress[id];

  const box = document.createElement('label'); box.className='checkbox'; box.appendChild(innerCB);
  if(innerCB.checked) box.classList.add('checked');

  // when user toggles the checkbox
  innerCB.addEventListener('change', (e) => {
    // user-initiated check => start timer (do NOT mark progress yet)
    if(e && e.isTrusted && innerCB.checked){
      const total = Number(inputDur.value) || 0;
      if(total <= 0){
        // no duration => mark immediately (fallback)
        progress[id] = true;
        saveProgress(progress);
        updateSummary();
        updateProgressIndicator(schedaName, exerName);
        box.classList.add('checked');
        return;
      }
      // set running visual and start sticky timer for this set
      box.classList.add('running');
      // Start sticky timer (this replaces any running timer)
      startStickyFor(id, schedaName, exerName, total);
    } else if(e && e.isTrusted && !innerCB.checked){
      // user cancelled before timer ended: if sticky active for this id -> cancel timer and do not mark
      const activeId = sticky.active && sticky.active.id;
      if(activeId === id){
        cancelStickyTimer();
      }
      box.classList.remove('running');
      // ensure we don't save progress (since timer didn't finish)
      delete progress[id];
      saveProgress(progress);
      updateSummary();
      updateProgressIndicator(schedaName, exerName);
      // remove checked visual
      box.classList.remove('checked');
    } else {
      // programmatic changes (from timer end) will set checked true but isTrusted=false: no auto-start
      if(!e.isTrusted && innerCB.checked){
        box.classList.remove('running');
        box.classList.add('checked');
      }
    }
  });

  // when duration edited, update display
  inputDur.addEventListener('input', ()=> {
    const v = Number(inputDur.value) || 0;
    countSpan.textContent = fmt(v);
  });

  wrap.appendChild(inputDur);
  wrap.appendChild(countSpan);
  wrap.appendChild(box);

  return { wrap, checkbox: innerCB, id };
}

// -----------------------------
// theme and init
function applyTheme(t){
  if(t === 'light'){
    document.documentElement.style.setProperty('--bg','#f6f8fb');
    document.documentElement.style.setProperty('--card','#ffffff');
    document.documentElement.style.setProperty('--surface','#fff');
    document.documentElement.style.setProperty('--accent','#2b8cff');
    document.documentElement.style.setProperty('--muted','#6b7280');
    document.documentElement.style.setProperty('--accent-2','#06b6d4');
    document.documentElement.style.setProperty('--success','#16a34a');
    document.documentElement.style.setProperty('--glass','rgba(10,20,40,0.02)');
    document.documentElement.style.setProperty('--glass-2','rgba(10,20,40,0.01)');
    document.body.style.background = 'linear-gradient(180deg,#f8fafc,#eef2ff)';
    document.body.style.color = '#0f1724';
  } else {
    document.documentElement.style.removeProperty('--bg');
    document.documentElement.style.removeProperty('--card');
    document.documentElement.style.removeProperty('--surface');
    document.documentElement.style.removeProperty('--accent');
    document.documentElement.style.removeProperty('--muted');
    document.documentElement.style.removeProperty('--accent-2');
    document.documentElement.style.removeProperty('--success');
    document.documentElement.style.removeProperty('--glass');
    document.documentElement.style.removeProperty('--glass-2');
    document.body.style.background = '';
    document.body.style.color = '';
  }
}

// init
const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);
render();
console.log('Interfaccia mobile-first caricata: checkbox avvia/annulla timer; immagini cliccabili; progresso salvato al termine del timer.');
