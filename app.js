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
      "img": "https://image.shutterstock.com/image-photo/young-man-running-treadmill-260nw-1916347634.jpg",
      "andamento": [{"velocita": 6, "pendenza": 4, "tempo": 10, "unita": "m"}],
      "descrizione": "",
      "media": []
    },
    "Mobilita": {
      "img": "https://image.shutterstock.com/image-photo/group-women-doing-warmup-exercise-260nw-1937949369.jpg",
      "ripetizioni": [
        {"kg": 0, "n_ripetizioni": 20},
        {"kg": 0, "n_ripetizioni": 8},
        {"kg": 0, "n_ripetizioni": 10},
        {"kg": 0, "n_ripetizioni": 20},
        {"kg": 0, "n_ripetizioni": 12}
      ],
      "recupero": 0,
      "unita": "s",
      "descrizione": "",
      "media": []
    },
    "Deadlift / Rematore bilanciere": {
      "img": "https://image.shutterstock.com/image-photo/athletic-man-doing-deadlift-exercise-260nw-1915654504.jpg",
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
      "img": "https://image.shutterstock.com/image-photo/young-woman-doing-pull-up-260nw-1530134830.jpg",
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
      "img": "https://image.shutterstock.com/image-photo/man-doing-one-arm-dumbbell-260nw-1786528576.jpg",
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
      "img": "https://image.shutterstock.com/image-photo/man-doing-close-grip-lat-260nw-1765150831.jpg",
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
      "img": "https://image.shutterstock.com/image-photo/man-doing-bicep-curls-barbell-260nw-1696231191.jpg",
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
      "img": "https://image.shutterstock.com/image-photo/young-man-doing-hammer-curls-260nw-1934634804.jpg",
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
      "img": "https://image.shutterstock.com/image-photo/young-man-doing-cable-curls-260nw-1934634820.jpg",
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
      "img": "https://image.shutterstock.com/image-photo/woman-doing-face-pull-exercise-260nw-1764587749.jpg",
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
      "img": "https://image.shutterstock.com/image-photo/functional-training-260nw-1797385988.jpg",
      "Rematore manubri": {
        "img": "https://image.shutterstock.com/image-photo/man-doing-one-arm-dumbbell-260nw-1786528576.jpg",
        "ripetizioni": [{"kg": 18, "n_ripetizioni": 12}],
        "recupero": 30,
        "unita": "s",
        "descrizione": "",
        "media": []
      },
      "Face pull": {
        "img": "https://image.shutterstock.com/image-photo/woman-doing-face-pull-exercise-260nw-1764587749.jpg",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 15}],
        "recupero": 0,
        "unita": "s",
        "descrizione": "",
        "media": []
      },
      "Pull-up assistiti": {
        "img": "https://image.shutterstock.com/image-photo/man-doing-assisted-pullups-workout-260nw-1726588509.jpg",
        "ripetizioni": [{"kg": 0, "n_ripetizioni": 10}],
        "recupero": 30,
        "unita": "s",
        "descrizione": "",
        "media": []
      }
    },
    "LISS": {
      "img": "https://image.shutterstock.com/image-photo/walking-on-treadmill-at-gym-260nw-1523907246.jpg",
      "andamento": [{"velocita": 5.5, "pendenza": 5, "tempo": 10, "unita": "m"}],
      "descrizione": "Camminata in pendenza",
      "media": []
    }
  },
  "Scheda 3": {
    "Cardio Iniziale": {
      "img": "https://image.shutterstock.com/image-photo/man-warm-up-running-treadmill-260nw-1357386128.jpg",
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
      "img": "https://image.shutterstock.com/image-photo/walking-on-treadmill-at-gym-260nw-1523907246.jpg",
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
// STORAGE / DOM ELEMENTS
const storageKey = 'workout_progress_v3';
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
// PROGRESS PERSISTENCE
function loadProgress(){ try{ const raw = localStorage.getItem(storageKey); return raw? JSON.parse(raw) : {}; }catch(e){return {}}}
function saveProgress(progress){ if(!persistEnabled) return; localStorage.setItem(storageKey, JSON.stringify(progress)); }
let progress = loadProgress();

// -----------------------------
// AUDIO / UTILITIES
function beep(){ try{ const ctx = new (window.AudioContext||window.webkitAudioContext)(); const o = ctx.createOscillator(); const g = ctx.createGain(); o.type='sine'; o.frequency.value=880; g.gain.setValueAtTime(0.0001, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime+0.02); o.connect(g); g.connect(ctx.destination); o.start(); setTimeout(()=>{ o.stop(); ctx.close(); }, 300);}catch(e){} }

function fmt(seconds){ if(seconds<=0) return '00:00'; const mm = Math.floor(seconds/60).toString().padStart(2,'0'); const ss = Math.floor(seconds%60).toString().padStart(2,'0'); return `${mm}:${ss}`; }

// Duration heuristic (null-safe)
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
// IMAGE MODAL HELPERS
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
// STICKY TIMER
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
  active: null,
  timer: null,
  remaining: 0,
  total: 0
};

if(sticky.startBtn) sticky.startBtn.addEventListener('click', ()=> {
  if(!sticky.active) return;
  if(sticky.remaining <= 0) sticky.remaining = sticky.total;
  startStickyTimer();
});
if(sticky.pauseBtn) sticky.pauseBtn.addEventListener('click', ()=> {
  if(sticky.timer){ clearInterval(sticky.timer); sticky.timer = null; sticky.pauseBtn.textContent = 'Riprendi'; sticky.startBtn.disabled = false; }
  else { startStickyTimer(); sticky.pauseBtn.textContent = 'Pausa'; sticky.startBtn.disabled = true; }
});
if(sticky.resetBtn) sticky.resetBtn.addEventListener('click', ()=> {
  if(sticky.timer){ clearInterval(sticky.timer); sticky.timer = null; }
  sticky.remaining = sticky.total;
  updateStickyDisplay();
  sticky.startBtn.disabled = false;
  sticky.pauseBtn.disabled = true;
});
if(sticky.closeBtn) sticky.closeBtn.addEventListener('click', ()=> {
  if(sticky.el) sticky.el.classList.add('hidden');
});

function startStickyTimer(){
  if(sticky.timer) clearInterval(sticky.timer);
  if(sticky.remaining <= 0) sticky.remaining = sticky.total;
  if(sticky.startBtn) sticky.startBtn.disabled = true;
  if(sticky.pauseBtn) sticky.pauseBtn.disabled = false;
  sticky.timer = setInterval(()=>{
    sticky.remaining -= 1;
    updateStickyDisplay();
    if(sticky.remaining <= 0){
      clearInterval(sticky.timer);
      sticky.timer = null;
      beep();
      if(sticky.pauseBtn) sticky.pauseBtn.disabled = true;
      if(sticky.startBtn) sticky.startBtn.disabled = false;
      // mark progress for active id
      if(sticky.active && sticky.active.id){
        progress[sticky.active.id] = true;
        saveProgress(progress);
        updateSummary();
        if(sticky.active.scheda && sticky.active.exercise){
          updateProgressIndicator(sticky.active.scheda, sticky.active.exercise);
        }
        // sync checkbox visible (if present) but avoid retriggering auto-start: programmatic change will be isTrusted=false
        const cb = document.querySelector(`[data-id="${sticky.active.id}"]`);
        if(cb && !cb.checked){
          cb.checked = true;
          cb.dispatchEvent(new Event('change')); // programmatic, change handler checks isTrusted
        }
      }
    }
  }, 1000);
}

function updateStickyDisplay(){
  if(!sticky.count) return;
  sticky.count.textContent = fmt(Math.max(0, Math.round(sticky.remaining)));
  const pct = sticky.total > 0 ? Math.round(100 * (1 - sticky.remaining / sticky.total)) : 0;
  if(sticky.progressBar) sticky.progressBar.value = pct;
}

// -----------------------------
// HELPERS: progress badge update
function updateProgressIndicator(schedaName, exerName){
  const selector = `[data-progress-for="${schedaName}__${exerName}"]`;
  const el = document.querySelector(selector);
  if(el){
    el.textContent = progressForExercise(schedaName, exerName);
  }
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

      // header with collapse
      const exHeader = document.createElement('div'); exHeader.className = 'exercise-header';

      // LEFT: thumbnail (if available) + title/desc
      const left = document.createElement('div');
      // create thumbnail if exer has img
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
      const thumb = createThumbIfAvailable(exer, exerName);
      if(thumb){
        // place thumbnail and then text in a small horizontal container
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.gap = '10px';
        wrapper.appendChild(thumb);
        const textBlock = document.createElement('div');
        const h3 = document.createElement('h3'); h3.textContent = exerName;
        const desc = document.createElement('div'); desc.className = 'muted small'; desc.textContent = exer.descrizione || '';
        textBlock.appendChild(h3);
        textBlock.appendChild(desc);
        wrapper.appendChild(textBlock);
        left.appendChild(wrapper);
      } else {
        const h3 = document.createElement('h3'); h3.textContent = exerName;
        const desc = document.createElement('div'); desc.className = 'muted small'; desc.textContent = exer.descrizione || '';
        left.appendChild(h3);
        left.appendChild(desc);
      }

      // RIGHT: collapse button + progress indicator
      const right = document.createElement('div'); right.style.display='flex'; right.style.gap='8px'; right.style.alignItems='center';
      const collapseBtn = document.createElement('button'); collapseBtn.className='btn ghost'; collapseBtn.textContent='Mostra';
      const progressIndicator = document.createElement('div'); progressIndicator.className = 'small muted';
      progressIndicator.setAttribute('data-progress-for', `${schedaName}__${exerName}`);
      progressIndicator.textContent = progressForExercise(schedaName, exerName);
      right.appendChild(progressIndicator);
      right.appendChild(collapseBtn);

      exHeader.appendChild(left);
      exHeader.appendChild(right);
      ex.appendChild(exHeader);

      const content = document.createElement('div'); content.className='exercise-content'; content.style.marginTop='6px'; content.style.display='none';

      // andamento (cardio)
      if(exer.andamento){
        const sets = document.createElement('div'); sets.className='sets';
        exer.andamento.forEach((seg, si)=>{
          const setEl = document.createElement('div'); setEl.className='set segment';
          const info = document.createElement('div'); info.className='info';
          info.innerHTML = `<div class="meta"><strong>Segmento ${si+1}</strong> — ${seg.tempo}${seg.unita||'s'} @ v:${seg.velocita||'-'} p:${seg.pendenza||'-'}</div><div class="small muted">${exer.descrizione || ''}</div>`;
          setEl.appendChild(info);

          // controls
          const ctrl = controlsForSegment(schedaName, exerName, exer, null, seg, `andamento_${si}`);
          setEl.appendChild(ctrl.wrap);
          sets.appendChild(setEl);
        });
        content.appendChild(sets);
      }

      // ripetizioni (se esercizio ha array ripetizioni)
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

      // nested (es. Mobilita con singoli esercizi, Finisher, Addome ecc.)
      for(const key of Object.keys(exer)){
        if(['ripetizioni','andamento','recupero','unita','descrizione','media','img'].includes(key)) continue;
        const nested = exer[key];
        if(typeof nested === 'object' && (nested.ripetizioni || nested.andamento)){
          const block = document.createElement('div'); block.className='nested';
          // nested title with thumb if available
          const titleN = document.createElement('div');
          const nestedThumb = createThumbIfAvailable(nested, key);
          if(nestedThumb){
            const wrapper = document.createElement('div'); wrapper.style.display='flex'; wrapper.style.alignItems='center'; wrapper.style.gap='10px';
            wrapper.appendChild(nestedThumb);
            const t = document.createElement('div'); t.innerHTML = `<strong>${key}</strong>`;
            wrapper.appendChild(t);
            titleN.appendChild(wrapper);
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
              const setEl = document.createElement('div'); setEl.className='set segment';
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
// CONTROLS CREATION (checkbox, timer controls) - versione semplificata e robusta
function controlsForSegment(schedaName, exerName, exerObj, set, andamentoSegmentOrNull, suffix, nestedKey){
  const wrap = document.createElement('div');
  wrap.className = 'timer';

  // id coerente per salvataggio/progressi
  const id = `${schedaName}__${exerName}__${suffix}`;

  // durata calcolata (secondi)
  const duration = computeDuration(exerObj, set, andamentoSegmentOrNull);

  // duration input (seconds)
  const inputDur = document.createElement('input');
  inputDur.type = 'number';
  inputDur.min = 0;
  inputDur.value = duration;
  inputDur.title = 'Durata (s)';
  inputDur.style.width = '88px';

  // display del conto alla rovescia
  const countSpan = document.createElement('div');
  countSpan.className = 'count';
  countSpan.textContent = fmt(Number(inputDur.value));

  // bottoni
  const startBtn = document.createElement('button'); startBtn.className = 'btn ghost'; startBtn.textContent = '▶';
  const pauseBtn = document.createElement('button'); pauseBtn.className = 'btn ghost'; pauseBtn.textContent = '⏸'; pauseBtn.disabled = true;
  const resetBtn = document.createElement('button'); resetBtn.className = 'btn ghost'; resetBtn.textContent = '↺';

  // checkbox visibile: la usiamo come elemento "reale" nel DOM
  const innerCB = document.createElement('input');
  innerCB.type = 'checkbox';
  innerCB.checked = !!progress[id];
  innerCB.dataset.id = id;
  innerCB.setAttribute('data-id', id);

  // wrapper visuale per la checkbox (stile)
  const box = document.createElement('label');
  box.className = 'checkbox';
  box.style.marginLeft = '6px';
  box.appendChild(innerCB);
  if(innerCB.checked) box.classList.add('checked');

  // quando l'utente cambia la checkbox:
  // 1) salvo lo stato immediatamente
  // 2) avvio il timer (se duration>0) — ma avvio solo per eventi user-initiated (isTrusted)
  innerCB.addEventListener('change', (e) => {
    if(innerCB.checked){
      progress[id] = true;
      saveProgress(progress);
      box.classList.add('checked');
      updateSummary();
      updateProgressIndicator(schedaName, exerName);
      // avvia il timer solo se l'azione è user-initiated
      if (e && e.isTrusted && Number(inputDur.value) > 0) {
        startBtn.click();
      }
    } else {
      delete progress[id];
      saveProgress(progress);
      box.classList.remove('checked');
      updateSummary();
      updateProgressIndicator(schedaName, exerName);
    }
  });

  // quando si preme start: popola sticky e avvia
  startBtn.addEventListener('click', () => {
    const total = Number(inputDur.value) || 0;
    if (total <= 0) return;
    sticky.active = { scheda: schedaName, exercise: exerName, id: id, nested: nestedKey || null };
    sticky.total = total;
    sticky.remaining = total;
    sticky.title.textContent = `${exerName}${nestedKey ? ' — ' + nestedKey : ''}`;
    sticky.sub.textContent = `${schedaName}`;
    if (sticky.el) sticky.el.classList.remove('hidden');
    updateStickyDisplay();
    startStickyTimer();
    // highlight visivo del set (se presente)
    const allSets = document.querySelectorAll('.set');
    allSets.forEach(s => { if (s && s.style) s.style.outline = 'none'; });
    let el = null;
    if (typeof startBtn.closest === 'function') el = startBtn.closest('.set');
    if (el && el.style) el.style.outline = '2px solid rgba(79,156,255,0.14)';
  });

  // pausa / resume usando il controllo sticky
  pauseBtn.addEventListener('click', () => {
    if(sticky.pauseBtn) sticky.pauseBtn.click();
  });

  // reset locale: se il sticky attivo corrisponde, resetta quello, altrimenti resetta il conteggio locale
  resetBtn.addEventListener('click', () => {
    if (sticky.active && sticky.active.id === id) {
      if(sticky.resetBtn) sticky.resetBtn.click();
    } else {
      countSpan.textContent = fmt(Number(inputDur.value));
    }
  });

  // aggiornamento del display quando la durata viene cambiata manualmente
  inputDur.addEventListener('input', () => {
    const v = Number(inputDur.value) || 0;
    countSpan.textContent = fmt(v);
  });

  // costruzione del wrapper (ordine leggibile)
  wrap.appendChild(inputDur);
  wrap.appendChild(countSpan);
  wrap.appendChild(startBtn);
  wrap.appendChild(pauseBtn);
  wrap.appendChild(resetBtn);
  wrap.appendChild(box);

  // ritorniamo anche l'id così eventuali caller possono usarlo
  return { wrap, startBtn, pauseBtn, resetBtn, checkbox: innerCB, id };
}

// -----------------------------
// PROGRESS / SUMMARY FUNCTIONS
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
// THEME (same as before)
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

// -----------------------------
// INIT
const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);
render();
console.log('app.js caricato e funzionante — ora puoi cliccare la thumbnail per aprire l\'immagine; la checkbox salva il progresso e aggiorna i badge.');