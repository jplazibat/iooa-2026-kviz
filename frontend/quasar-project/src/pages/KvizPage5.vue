<template>
  <div class="relative fixed-center">
    <!-- BODOVI -->
    <div class="q-pa-md">
      <div class="text-h6">Bodovi: {{ state.bodovi }}</div>
    </div>

    <!-- PITANJE -->
    <div class="q-pa-md q-gutter-sm">
      <q-banner inline-actions rounded class="bg-positive text-white">
        <div class="text-h5 full-width">
          <span>{{ state.questionNumber }}. </span>

          <span>
            {{ state.trueFalseMode ? state.trueFalsePitanje : state.pitanje }}
            <strong v-if="state.praznina.aktivan"> ________ ?</strong>
          </span>

          <span class="tezina"> (Težina: {{ state.tezina }}) </span>
        </div>
      </q-banner>

      <q-img width="700px" height="350px" :src="state.image" :ratio="16 / 9" />
    </div>

    <!-- ODGOVORI -->
    <div class="q-pa-md odgovori">
      <!-- Postojeći radio odgovori (MCQ i True/False) -->
      <template v-if="!state.praznina.aktivan">
        <q-radio
          v-for="odgovor in state.odgovori"
          :key="odgovor.id"
          v-model.number="state.odabraniOdgovor"
          :val="odgovor.id"
          :label="getLabel(odgovor)"
          color="teal"
        />
      </template>

      <!-- Novi tip: popunjavanje praznine -->
      <template v-else>
        <q-input
          v-model="state.praznina.uneseniOdgovor"
          outlined
          label="Unesite odgovor"
          :disable="state.praznina.odgovorPotvrden"
          @keyup.enter="checkAnswer"
          style="max-width: 400px"
        />
      </template>
    </div>

    <!-- BUTTONS -->
    <div class="q-pa-md q-gutter-sm">
      <q-btn
        color="white"
        text-color="black"
        label="Prihvati odgovor"
        @click="checkAnswer"
      />

      <q-btn
        color="white"
        text-color="black"
        label="Završi"
        @click="state.zavrsniPopup = true"
      />

      <q-btn
        color="white"
        text-color="black"
        label="Restart"
        @click="restartQuiz"
      />
    </div>

    <!-- ALERT -->
    <q-dialog v-model="state.alert" persistent>
      <q-card>
        <!-- ONLY ONE RESULT (NO DUPLICATES) -->
        <q-card-section class="q-pt-none">
          <!-- TRUE / FALSE -->
          <div v-if="state.trueFalseMode">
            <div v-if="state.lastCorrect">TOČNO</div>

            <div v-else>
              NETOČNO
              <div class="q-mt-sm">
                Biljka sa slike je:
                <b>{{ state.plant.croatian_name }}</b>
              </div>
            </div>
          </div>

          <!-- MCQ -->
          <div v-else-if="!state.praznina.aktivan">
            <div v-if="state.lastCorrect">TOČNO</div>

            <div v-else>
              NETOČNO
              <div class="q-mt-sm">
                Točan odgovor je:
                <b>{{ state.tocanOdgovor.latin_name }}</b>
              </div>
            </div>
          </div>

          <!-- PRAZNINA -->
          <div v-else>
            <div v-if="state.lastCorrect">TOČNO</div>
            <div v-else>
              NETOČNO
              <div class="q-mt-sm">
                Točan odgovor je: <b>{{ state.praznina.tocniOdgovor }}</b>
              </div>
            </div>
          </div>
        </q-card-section>

        <!-- ACTION -->
        <q-card-actions align="right">
          <q-btn
            flat
            label="OK"
            color="primary"
            @click="nextQuestion"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- END -->
    <q-dialog v-model="state.zavrsniPopup" persistent>
      <q-card>
        <q-card-section class="text-center">
          <div class="text-h6">Kraj kviza</div>
        </q-card-section>

        <q-card-section class="text-center">
          <div>Točno: {{ state.brojTocnih }}</div>
          <div>Netočno: {{ state.brojNetocnih }}</div>
          <div>Bodovi: {{ state.bodovi }}</div>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn flat label="Početna" color="primary" href="/" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { onMounted, reactive } from "vue";
import axios from "axios";

export default {
  setup() {
    const state = reactive({
      plant: {},
      pitanje: "",
      trueFalsePitanje: "",
      trueFalseMode: false,

      questionNumber: 1,

      odgovori: [],
      odabraniOdgovor: null,

      tocanOdgovor: {},
      trueFalseCorrect: 0,

      brojTocnih: 0,
      brojNetocnih: 0,
      bodovi: 0,

      image: "",
      alert: false,
      zavrsniPopup: false,
      tezina: 1,

      lastCorrect: false,

      praznina: {
        aktivan: false,
        uneseniOdgovor: "",
        tocniOdgovor: "",
        odgovorPotvrden: false,
      },
    });

    onMounted(async () => {
      await loadQuestion();
    });

    // ================= QUESTION =================
    async function loadQuestion() {
      const json = await axios.get("http://localhost:3000/plant_species/");

      state.plant =
        json.data.data[Math.floor(Math.random() * json.data.data.length)];

      state.tezina = Math.floor(Math.random() * 5) + 1;
      state.trueFalseMode = Math.random() < 0.35;

// Nasumično aktiviraj tip praznine (~33% šansa, samo ako nije true/false)
state.praznina.aktivan = !state.trueFalseMode && Math.random() < 0.33;
state.praznina.uneseniOdgovor = "";
state.praznina.odgovorPotvrden = false;

if (state.praznina.aktivan) {
  const obrnuto = Math.random() < 0.5;

  if (obrnuto) {
    state.pitanje = "Hrvatski naziv za " + state.plant.latin_name + " je";
    state.praznina.tocniOdgovor = state.plant.croatian_name;
  } else {
    state.pitanje = "Latinski naziv za " + state.plant.croatian_name + " je";
    state.praznina.tocniOdgovor = state.plant.latin_name;
  }
} else {
  state.pitanje =
    "Koji je latinski naziv za " + state.plant.croatian_name + "?";
}

      await setupTrueFalse();
      await loadAnswers();
      await loadImage();
    }

    // ================= TRUE/FALSE =================
    async function setupTrueFalse() {
      if (!state.trueFalseMode) return;

      const json = await axios.get("http://localhost:3000/plant_species/");
      const all = json.data.data;

      const showCorrect = Math.random() > 0.5;

      if (showCorrect) {
        state.trueFalseCorrect = 1;

        state.trueFalsePitanje =
          "Biljka sa slike je: " + state.plant.croatian_name;
      } else {
        let wrong;

        do {
          wrong = all[Math.floor(Math.random() * all.length)];
        } while (wrong.id === state.plant.id);

        state.trueFalseCorrect = 0;

        state.trueFalsePitanje = "Biljka sa slike je: " + wrong.croatian_name;
      }
    }

    // ================= ANSWERS =================
    async function loadAnswers() {
      if (state.trueFalseMode) {
        state.odgovori = [
          { id: 1, croatian_name: "Točno" },
          { id: 0, croatian_name: "Netočno" },
        ];

        state.odabraniOdgovor = null;
      } else {
        const json = await axios.get("http://localhost:3000/botanical_family");
        const families = json.data.data;

        const correct = await axios.get(
          `http://localhost:3000/plant_species/${state.plant.id}`
        );

        state.tocanOdgovor = correct.data.data;

        let list = [
          {
            id: state.tocanOdgovor.id,
            latin_name: state.tocanOdgovor.latin_name,
            isCorrect: true,
          },
        ];

        while (list.length < 4) {
          let obj = families[Math.floor(Math.random() * families.length)];

          if (!list.some((x) => x.id === obj.id)) {
            list.push({
              id: obj.id,
              latin_name: obj.latin_name,
              isCorrect: false,
            });
          }
        }

        state.odgovori = list
          .map((v) => ({ value: v, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value);

        state.odabraniOdgovor = null;
      }
    }

    // ================= IMAGE =================
    async function loadImage() {
      const json = await axios.get(
        `http://localhost:3000/image/${state.plant.id}`
      );

      state.image = json.data.data?.image_url || "";
    }

    // ================= LABEL =================
    function getLabel(o) {
      return state.trueFalseMode ? o.croatian_name : o.latin_name;
    }

    // ================= CHECK =================
    function checkAnswer() {
      // Provjera za tip praznine
      if (state.praznina.aktivan) {
        const uneseno = state.praznina.uneseniOdgovor.trim().toLowerCase();
        const tocno = state.praznina.tocniOdgovor.trim().toLowerCase();
        state.lastCorrect = uneseno === tocno;
        state.praznina.odgovorPotvrden = true;

        if (state.lastCorrect) {
          state.brojTocnih++;
          state.bodovi += state.tezina;
        } else {
          state.brojNetocnih++;
        }

        state.alert = true;
        return;
      }

      if (state.odabraniOdgovor === null) return;

      let isCorrect = false;

      if (state.trueFalseMode) {
        isCorrect = state.odabraniOdgovor === state.trueFalseCorrect;
      } else {
        const selected = state.odgovori.find(
          (o) => o.id === state.odabraniOdgovor
        );

        isCorrect = selected?.isCorrect === true;
      }

      state.lastCorrect = isCorrect;

      if (isCorrect) {
        state.brojTocnih++;
        state.bodovi += state.tezina;
      } else {
        state.brojNetocnih++;
      }

      state.alert = true;
    }

    // ================= NEXT =================
    async function nextQuestion() {
      state.questionNumber++;
      await loadQuestion();
    }

    // ================= RESTART =================
    function restartQuiz() {
      window.location.reload();
    }

    return {
      state,
      checkAnswer,
      nextQuestion,
      restartQuiz,
      getLabel,
    };
  },
};
</script>

<style>
.tezina {
  font-size: 20px;
  color: white;
  margin-left: 10px;
}

.odgovori {
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  width: 700px;
}
</style>
