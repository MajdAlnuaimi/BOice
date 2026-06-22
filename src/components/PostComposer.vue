<template>
  <!-- Formular zum Erstellen eines neuen Beitrags -->
  <form class="composer" :class="{ locked: !props.isLoggedIn }" @submit.prevent="submitPost">
    <div class="composer-head">
      <span class="composer-avatar">{{ accountInitials }}</span>
      <div>
        <h2>Was möchtest du teilen?</h2>
        <p>{{ form.isAnonymous ? 'Anonym posten' : 'Mit Account posten' }}</p>
      </div>
    </div>

    <div v-if="!props.isLoggedIn" class="login-required" role="alert">
      <div>
        <strong>Anmeldung erforderlich</strong>
        <p>Du kannst erst einen Beitrag erstellen, wenn du angemeldet bist.</p>
      </div>
      <RouterLink to="/anmelden">Anmelden</RouterLink>
    </div>

    <label>
      <span class="sr-only">Titel</span>
      <input
        v-model="form.title"
        :disabled="!props.isLoggedIn"
        type="text"
        placeholder="Kurzer Titel, z. B. Java Übung 4"
      />
    </label>

    <label>
      <span class="sr-only">Beitrag</span>
      <textarea
        v-model="form.body"
        :disabled="!props.isLoggedIn"
        rows="4"
        placeholder="Was ist passiert? Was sollte besser werden?"
      ></textarea>
    </label>

    <div class="category-options" role="group" aria-label="Kategorie">
      <button
        v-for="category in categories"
        :key="category"
        type="button"
        :class="{ active: form.category === category }"
        :disabled="!props.isLoggedIn"
        @click="form.category = category"
      >
        {{ category }}
      </button>
    </div>

    <section class="rating-input" aria-label="Bewertung auswählen">
      <div>
        <span>Bewertung</span>
        <strong>{{ visibleRatingText }}</strong>
      </div>

      <div class="stars" role="radiogroup" aria-label="Sternebewertung">
        <button
          v-for="star in ratingSteps"
          :key="star"
          type="button"
          :class="{ active: star <= visibleRating }"
          :aria-checked="form.rating === star"
          :aria-label="`${star} von 5 Sternen`"
          :disabled="!props.isLoggedIn"
          role="radio"
          @click="form.rating = star"
          @mouseenter="hoverRating = star"
          @mouseleave="hoverRating = 0"
        >
          ★
        </button>
      </div>
    </section>

    <div class="composer-actions">
      <label class="switch-row">
        <input v-model="form.isAnonymous" :disabled="!props.isLoggedIn" type="checkbox" />
        <span aria-hidden="true"></span>
        Anonym posten
      </label>

      <button type="submit" :disabled="!props.isLoggedIn">Post erstellen</button>
    </div>
    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  accountName: {
    type: String,
    required: true,
  },
  isLoggedIn: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['createPost'])

const categories = ['Vorlesungen', 'Übungen', 'Praktikum']
const ratingSteps = [1, 2, 3, 4, 5]

const form = reactive({
  title: '',
  category: 'Vorlesungen',
  body: '',
  rating: 0,
  isAnonymous: false,
})

const hoverRating = ref(0)
const visibleRating = computed(() => hoverRating.value || form.rating)
const visibleRatingText = computed(() => {
  return visibleRating.value ? `${visibleRating.value},0 von 5` : 'Noch keine Bewertung'
})

const accountInitials = computed(() => {
  if (!props.isLoggedIn) return 'BO'

  const nameParts = props.accountName.trim().split(/\s+/).filter(Boolean)
  const firstName = nameParts[0] ?? ''
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()

  return initials || 'BO'
})

const error = ref('')

const submitPost = () => {
  error.value = ''

  if (!props.isLoggedIn) {
    error.value = 'Bitte melde dich an, um einen Beitrag zu erstellen.'
    return
  }

  if (!form.title.trim() || !form.body.trim()) {
    error.value = 'Bitte Titel und Text eingeben.'
    return
  }

  if (!form.rating) {
    error.value = 'Bitte eine Bewertung auswählen.'
    return
  }

  emit('createPost', {
    title: form.title,
    category: form.category,
    body: form.body,
    rating: form.rating,
    isAnonymous: form.isAnonymous,
  })

  form.title = ''
  form.category = 'Vorlesungen'
  form.body = ''
  form.rating = 0
  form.isAnonymous = false
}
</script>

<style scoped>
.composer {
  min-width: 0;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  box-shadow: var(--shadow-soft);
}

.composer.locked {
  background: #fbfcff;
}

.composer-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.composer-avatar {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  background: var(--red);
  color: white;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 900;
}

.composer-head h2,
.composer-head p {
  margin: 0;
}

.composer-head h2 {
  font-size: 16px;
}

.composer-head p {
  margin-top: 3px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 900;
}

.login-required {
  border: 1px solid #f6c9cd;
  border-radius: 8px;
  background: #fff0f1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
  padding: 12px;
}

.login-required strong,
.login-required p {
  margin: 0;
}

.login-required strong {
  color: var(--red-dark);
}

.login-required p {
  margin-top: 3px;
  color: var(--muted);
  font-size: 13px;
  font-weight: 800;
}

.login-required a {
  border-radius: 8px;
  background: var(--red);
  color: white;
  padding: 10px 12px;
  text-decoration: none;
  font-weight: 900;
  white-space: nowrap;
}

label {
  min-width: 0;
  display: block;
  margin-bottom: 10px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

input,
textarea {
  width: 100%;
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 13px 14px;
  color: var(--ink);
  background: var(--surface-soft);
  outline: 0;
  font-weight: 800;
}

input:focus,
textarea:focus {
  border-color: rgba(49, 95, 217, 0.5);
  box-shadow: 0 0 0 4px rgba(49, 95, 217, 0.1);
}

input:disabled,
textarea:disabled,
button:disabled {
  cursor: not-allowed;
  opacity: 0.62;
}

textarea {
  resize: vertical;
}

.category-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 2px;
}

.category-options button {
  min-height: 34px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: white;
  color: var(--muted);
  padding: 0 12px;
  font-size: 13px;
  font-weight: 900;
}

.category-options button.active {
  border-color: rgba(227, 6, 19, 0.28);
  background: #fff0f1;
  color: var(--red);
}

.rating-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: 12px;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface-soft);
}

.rating-input span,
.rating-input strong {
  display: block;
}

.rating-input span {
  color: var(--muted);
  font-size: 12px;
  font-weight: 900;
}

.rating-input strong {
  margin-top: 2px;
  color: var(--ink);
  font-size: 13px;
}

.stars {
  display: inline-flex;
  gap: 2px;
}

.stars button {
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: #c8d0da;
  font-size: 21px;
  line-height: 1;
}

.stars button:hover,
.stars button.active {
  color: var(--gold);
  background: #fff8e6;
}

.composer-actions {
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 14px;
}

.switch-row {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  font-weight: 900;
}

.switch-row input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.switch-row span {
  width: 34px;
  height: 20px;
  border-radius: 999px;
  background: #c8d0da;
  position: relative;
}

.switch-row span::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: white;
  transition: transform 160ms ease;
}

.switch-row input:checked + span {
  background: var(--red);
}

.switch-row input:checked + span::after {
  transform: translateX(14px);
}

.composer-actions > button {
  border: 0;
  border-radius: 8px;
  background: var(--red);
  color: white;
  padding: 12px 16px;
  font-weight: 900;
  box-shadow: 0 10px 20px rgba(231, 53, 53, 0.2);
}

.composer-actions > button:hover {
  background: var(--red-dark);
}

.error {
  margin: 12px 0 0;
  color: var(--red-dark);
  font-weight: 800;
}

@media (max-width: 620px) {
  .composer-actions,
  .rating-input {
    align-items: stretch;
    flex-direction: column;
  }

  .composer-actions > button {
    width: 100%;
  }
}
</style>
