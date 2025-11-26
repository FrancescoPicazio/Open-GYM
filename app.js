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
      "img": "https://image.shutterstock.com/image-photo/group-people-doing-warmup-exercises-260nw-1936299110.jpg",
      "ripetizioni": [
        {"kg": 0, "n_ripetizioni": 10},
        {"kg": 0, "n_ripetizioni": 20},
        {"kg": 0, "n_ripetizioni": 15},
        {"kg": 0, "n_ripetizioni": 8},
        {"kg": 0, "n_ripetizioni": 15}
      ],
      "recupero": 0,
      "unita": "s",
      "descrizione": "",
      "media": []
    },
    "Hip thrust": {
      "img": "https://image.shutterstock.com/image-photo/athlete-doing-hip-thrust-exercise-260nw-1799391299.jpg",
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
      "img": "https://image.shutterstock.com/image-photo/strong-man-squatting-barbell-260nw-1701578423.jpg",
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
      "img": "https://image.shutterstock.com/image-photo/young-man-exercising-leg-press-220260nw-541495181.jpg",
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
      "img": "https://image.shutterstock.com/image-photo/woman-doing-dumbbell-lunges-260nw-1722057494.jpg",
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
      "img": "https://image.shutterstock.com/image-photo/woman-doing-leg-extension-exercise-260nw-1770202640.jpg",
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
      "img": "https://image.shutterstock.com/image-photo/woman-doing-leg-curl-exercise-260nw-1793992081.jpg",
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
      "img": "https://image.shutterstock.com/image-photo/man-doing-seated-calf-raise-260nw-1932490419.jpg",
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
      "img": "https://image.shutterstock.com/image-photo/woman-doing-chest-press-machine-260nw-1769178029.jpg",
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
      "img": "https://image.shutterstock.com/image-photo/athlete-doing-seated-cable-row-exercise-260nw-1920011093.jpg",
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
        "img": "https://image.shutterstock.com/image-photo/man-doing-plank-exercise-260nw-1720132610.jpg",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 60}],
        "recupero": 0,
        "unita": "s",
        "descrizione": "",
        "media": []
      },
      "Cable crunch": {
        "img": "https://image.shutterstock.com/image-photo/man-doing-cable-crunch-exercise-260nw-1918066698.jpg",
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
      "img": "https://image.shutterstock.com/image-photo/functional-training-260nw-1797385988.jpg",
      "Bulgarian split squat": {
        "img": "https://image.shutterstock.com/image-photo/woman-doing-bulgarian-split-squat-260nw-1765723338.jpg",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 10}],
        "recupero": 30,
        "unita": "s",
        "descrizione": "",
        "media": []
      },
      "Kettlebell swing": {
        "img": "https://image.shutterstock.com/image-photo/man-doing-kettlebell-swings-exercise-260nw-1725140253.jpg",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 15}],
        "recupero": 0,
        "unita": "s",
        "descrizione": "",
        "media": []
      },
      "Plank to elbow tap": {
        "img": "https://image.shutterstock.com/image-photo/woman-doing-plank-elbow-tap-260nw-1932729886.jpg",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 30}],
        "recupero": 0,
        "unita": "s",
        "descrizione": "",
        "media": []
      },
      "Jump squat": {
        "img": "https://image.shutterstock.com/image-photo/woman-doing-jump-squats-260nw-177384034.jpg",
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
