<template>
  <!-- Beim Kommentieren wird der komplette Beitrag als Detailansicht geoeffnet. -->
  <div v-if="post" class="overlay" @click.self="emit('close')">
    <section class="dialog" role="dialog" aria-modal="true">
      <header>
        <div>
          <p>Beitrag geöffnet</p>
          <h2>{{ post.title }}</h2>
        </div>
        <button type="button" aria-label="Beitrag schliessen" @click="emit('close')">
          X
        </button>
      </header>

      <article class="opened-post">
        <div class="vote-column" aria-label="Stimmen">
          <div class="vote-lamp">
            <span class="vote-icon up" aria-hidden="true">👍</span>
            <strong>{{ post.votes }}</strong>
            <span class="vote-icon down" aria-hidden="true">👎</span>
          </div>
        </div>

        <div class="post-content" :class="categoryTone(post.category)">
          <div class="post-head">
            <div class="post-meta">
              <span class="category" :class="categoryTone(post.category)">{{ post.category }}</span>
              <span>{{ post.author }}</span>
              <span>{{ post.createdAt }}</span>
            </div>

            <div class="rating-badge" aria-label="Bewertung">
              <strong>{{ post.rating.toFixed(1) }}</strong>
            </div>
          </div>

          <h3>{{ post.title }}</h3>
          <p>{{ post.body }}</p>

          <footer>
            <span>{{ post.comments.length }} Kommentare</span>
            <span>{{ normalizedStudyProgram(post.studyProgram) }}</span>
            <span>{{ post.semester }}. Semester</span>
          </footer>
        </div>
      </article>

      <section class="comments-area" aria-label="Kommentare zum Beitrag">
        <div class="comments-head">
          <p>Kommentare</p>
          <strong>{{ post.comments.length }}</strong>
        </div>

        <form class="comment-form" :class="{ locked: !props.isLoggedIn }" @submit.prevent="submitComment">
          <div v-if="!props.isLoggedIn" class="login-required" role="alert">
            <div>
              <strong>Anmeldung erforderlich</strong>
              <p>Du kannst Kommentare erst schreiben, wenn du angemeldet bist.</p>
            </div>
            <RouterLink to="/anmelden">Anmelden</RouterLink>
          </div>

          <div class="comment-fields">
            <div class="comment-author">
              <div class="comment-author-name">
                <span>Kommentieren als</span>
                <strong>{{ form.isAnonymous ? 'Anonym' : accountName }}</strong>
              </div>

              <label class="switch-row">
                <input v-model="form.isAnonymous" :disabled="!props.isLoggedIn" type="checkbox" />
                <span aria-hidden="true"></span>
                Anonym kommentieren
              </label>
            </div>

            <label>
              Kommentar
              <textarea
                v-model.trim="form.body"
                :disabled="!props.isLoggedIn"
                rows="3"
                placeholder="Schreibe deinen Kommentar..."
              ></textarea>
            </label>
          </div>

          <div class="comment-actions">
            <p v-if="error" class="error">{{ error }}</p>
            <button type="submit" :disabled="!props.isLoggedIn">Kommentar senden</button>
          </div>
        </form>

        <article v-for="comment in post.comments" :key="comment.id" class="comment">
          <div class="comment-meta">
            <strong>{{ comment.author }}</strong>
            <span>{{ comment.createdAt }}</span>
          </div>
          <p>{{ comment.body }}</p>
        </article>
      </section>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'

// Das Popup bekommt den ausgewaehlten Beitrag von App.vue
const props = defineProps({
  accountName: {
    type: String,
    required: true,
  },
  isLoggedIn: {
    type: Boolean,
    required: true,
  },
  post: {
    type: Object,
    default: null,
  },
})

// Schliessen wird an App.vue gemeldet
const emit = defineEmits(['addComment', 'close'])

const form = reactive({
  isAnonymous: false,
  body: '',
})

const error = ref('')

// Neuer Kommentar wird an HomeView gemeldet und dort im Beitrag gespeichert.
const submitComment = () => {
  error.value = ''
  if (!props.post) return

  if (!props.isLoggedIn) {
    error.value = 'Bitte melde dich an, um einen Kommentar zu schreiben.'
    return
  }

  if (!form.body) {
    error.value = 'Bitte Kommentar eingeben.'
    return
  }

  emit('addComment', {
    postId: props.post.id,
    author: form.isAnonymous ? 'Anonym' : props.accountName,
    body: form.body,
  })

  form.body = ''
}

const normalizedStudyProgram = (studyProgram) => {
  return studyProgram.replace(/\s+/g, '')
}

const categoryTone = (category) => {
  const normalizedCategory = category
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  if (normalizedCategory.includes('vorlesung')) return 'module'
  if (normalizedCategory.includes('ubung')) return 'rooms'
  if (normalizedCategory.includes('praktikum')) return 'campus'
  return 'module'
}
</script>

<style scoped>
/* Dunkler Hintergrund hinter der Detailansicht */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(22, 23, 25, 0.5);
  backdrop-filter: blur(3px);
}

/* Sichtbares Fenster mit Beitrag und Kommentaren */
.dialog {
  width: min(760px, 100%);
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  border-radius: 8px;
  background: var(--surface);
  padding: 24px;
  box-shadow: 0 18px 44px rgba(31, 42, 55, 0.18);
}

header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

header p,
.comments-head p {
  margin: 0 0 4px;
  color: var(--red);
  font-weight: 800;
}

header h2 {
  margin: 0;
  font-size: 30px;
  line-height: 1.18;
}

header button {
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 8px;
  background: var(--bg);
  font-weight: 800;
}

header button:hover {
  background: #eef3ff;
  color: var(--blue);
}

.opened-post {
  min-width: 0;
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  box-shadow: var(--shadow-soft);
}

.vote-column {
  border-right: 1px solid var(--line);
  background: var(--surface-soft);
}

.vote-lamp {
  width: 100%;
  height: 100%;
  min-height: 142px;
  display: grid;
  grid-template-rows: minmax(42px, 1fr) 34px minmax(42px, 1fr);
}

.vote-lamp strong {
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background: white;
  color: var(--ink);
  display: grid;
  place-items: center;
  font-size: 14px;
  font-weight: 900;
}

.vote-icon {
  display: grid;
  place-items: center;
  font-size: 16px;
}

.vote-icon.up {
  background: #e6f7f4;
  color: #08776c;
}

.vote-icon.down {
  background: #fff0f1;
  color: var(--red-dark);
}

.post-content {
  min-width: 0;
  border-left: 4px solid var(--red);
  padding: 16px 16px 14px;
}

.post-content.rooms {
  border-left-color: var(--teal);
}

.post-content.campus {
  border-left-color: var(--gold);
}

.post-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.post-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  color: var(--soft-muted);
  font-size: 12px;
  font-weight: 900;
}

.category {
  border-radius: 999px;
  display: inline-flex;
  padding: 5px 9px;
  font-weight: 900;
}

.category {
  background: #fff0f1;
  color: var(--red);
}

.category.rooms {
  background: #e6f7f4;
  color: #08776c;
}

.category.campus {
  background: #fff8e6;
  color: #9a6500;
}

.rating-badge {
  min-width: 48px;
  border: 1px solid #f6d88a;
  border-radius: 8px;
  background: #fff8e6;
  color: var(--gold);
  display: grid;
  place-items: center;
  padding: 6px;
  text-align: center;
}

.rating-badge strong {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: 15px;
  line-height: 1;
}

.rating-badge strong::after {
  content: "★";
  font-size: 10px;
  line-height: 1;
}

.post-content h3 {
  margin: 10px 0 6px;
  color: var(--ink);
  font-size: 21px;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.post-content p {
  margin: 0;
  color: var(--muted);
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.opened-post footer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 900;
}

.comments-area {
  margin-top: 22px;
}

.comments-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.comments-head strong {
  border-radius: 999px;
  background: #fff0f1;
  color: var(--red-dark);
  padding: 6px 10px;
}

.comment-form {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  padding: 14px;
  margin-bottom: 14px;
}

.comment-form.locked {
  background: #fbfcff;
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

.comment-fields {
  display: grid;
  gap: 12px;
}

.comment-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-weight: 800;
}

.comment-form textarea {
  width: 100%;
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface-soft);
  color: var(--ink);
  font: inherit;
  outline: 0;
  padding: 11px 12px;
}

.comment-form textarea:focus {
  border-color: rgba(49, 95, 217, 0.5);
  box-shadow: 0 0 0 4px rgba(49, 95, 217, 0.1);
}

.comment-form input:disabled,
.comment-form textarea:disabled,
.comment-form button:disabled {
  cursor: not-allowed;
  opacity: 0.62;
}

.comment-author {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface-soft);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  font-size: 13px;
  font-weight: 900;
  padding: 11px 12px;
}

.comment-author-name {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  white-space: nowrap;
}

.comment-author-name span {
  color: var(--muted);
  font-size: inherit;
  font-weight: inherit;
  line-height: 1;
}

.comment-author-name strong {
  color: var(--ink);
  font-size: inherit;
  font-weight: inherit;
  line-height: 1;
}

.comment-form .switch-row {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin: 0;
  color: var(--muted);
  font-size: inherit;
  font-weight: inherit;
  line-height: 1;
  white-space: nowrap;
}

.comment-form .switch-row input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.comment-form .switch-row span {
  width: 34px;
  height: 20px;
  border-radius: 999px;
  background: #c8d0da;
  position: relative;
}

.comment-form .switch-row span::after {
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

.comment-form .switch-row input:checked + span {
  background: var(--red);
}

.comment-form .switch-row input:checked + span::after {
  transform: translateX(14px);
}

.comment-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
}

.comment-actions button {
  border: 0;
  border-radius: 8px;
  background: var(--red);
  color: white;
  padding: 11px 14px;
  font-weight: 900;
}

.comment-actions button:hover {
  background: var(--red-dark);
}

.error {
  margin: 0;
  color: var(--red-dark);
  font-weight: 800;
}

.comment {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface-soft);
  padding: 14px;
  margin-top: 12px;
}

.comment-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: var(--muted);
}

.comment p {
  margin-bottom: 0;
  color: var(--ink);
  line-height: 1.6;
}

@media (max-width: 520px) {
  .overlay {
    padding: 12px;
  }

  .dialog {
    padding: 18px;
  }

  header h2 {
    font-size: 22px;
  }

  .opened-post {
    grid-template-columns: 44px minmax(0, 1fr);
  }

  .post-content {
    padding: 14px;
  }

  .post-head {
    align-items: flex-start;
    flex-direction: column;
  }

  .comment-meta {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .comment-author {
    gap: 8px;
    font-size: 12px;
    padding: 10px;
  }

  .comment-author-name {
    gap: 8px;
  }

  .comment-form .switch-row {
    gap: 7px;
  }

  .comment-actions {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
