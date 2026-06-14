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
        <div class="post-topline">
          <div class="post-meta">
            <span class="category">{{ post.category }}</span>
            <span>{{ post.createdAt }}</span>
            <span>von {{ post.author }}</span>
          </div>

          <div class="rating-badge" aria-label="Bewertung">
            <strong>{{ post.rating.toFixed(1) }}</strong>
            <span>Bewertung</span>
          </div>
        </div>

        <p class="post-body">{{ post.body }}</p>

        <footer>
          <div class="study-tags" aria-label="Studieninformationen">
            <span>#{{ normalizedStudyProgram(post.studyProgram) }}</span>
            <span>#{{ post.semester }}Semester</span>
          </div>
          <span class="helpful">{{ post.helpfulPercent }}% hilfreich</span>
          <span>{{ post.votes }} Stimmen</span>
        </footer>
      </article>

      <section class="comments-area" aria-label="Kommentare zum Beitrag">
        <div class="comments-head">
          <p>Kommentare</p>
          <strong>{{ post.comments.length }}</strong>
        </div>

        <form class="comment-form" @submit.prevent="submitComment">
          <div class="comment-fields">
            <fieldset class="author-choice">
              <legend>Kommentieren als</legend>
              <div class="author-options">
                <label :class="{ active: form.authorMode === 'account' }">
                  <input v-model="form.authorMode" type="radio" value="account" />
                  <span>{{ accountName }}</span>
                </label>

                <label :class="{ active: form.authorMode === 'anonymous' }">
                  <input v-model="form.authorMode" type="radio" value="anonymous" />
                  <span>Anonym</span>
                </label>
              </div>
            </fieldset>

            <label>
              Kommentar
              <textarea
                v-model.trim="form.body"
                rows="3"
                placeholder="Schreibe deinen Kommentar..."
              ></textarea>
            </label>
          </div>

          <div class="comment-actions">
            <p v-if="error" class="error">{{ error }}</p>
            <button type="submit">Kommentar senden</button>
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

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Post } from '../data/posts'

// Das Popup bekommt den ausgewaehlten Beitrag von App.vue
const props = defineProps<{
  accountName: string
  post: Post | null
}>()

// Schliessen wird an App.vue gemeldet
const emit = defineEmits<{
  addComment: [payload: { postId: number; author: string; body: string }]
  close: []
}>()

const form = reactive({
  authorMode: 'account',
  body: '',
})

const error = ref('')

// Neuer Kommentar wird an HomeView gemeldet und dort im Beitrag gespeichert.
const submitComment = () => {
  error.value = ''
  if (!props.post) return

  if (!form.body) {
    error.value = 'Bitte Kommentar eingeben.'
    return
  }

  emit('addComment', {
    postId: props.post.id,
    author: form.authorMode === 'anonymous' ? 'Anonym' : props.accountName,
    body: form.body,
  })

  form.body = ''
}

const normalizedStudyProgram = (studyProgram: string) => {
  return studyProgram.replace(/\s+/g, '')
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
  border: 1px solid var(--line);
  border-left: 5px solid var(--red);
  border-radius: 8px;
  background: var(--surface-soft);
  padding: 18px;
}

.post-topline {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.post-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  color: var(--soft-muted);
  font-size: 14px;
  font-weight: 800;
}

.category,
.helpful,
.study-tags span {
  border-radius: 999px;
  display: inline-flex;
  padding: 5px 9px;
  font-weight: 900;
}

.category {
  background: #fff0f1;
  color: var(--red-dark);
}

.rating-badge {
  min-width: 76px;
  border: 1px solid #f6d88a;
  border-radius: 8px;
  background: #fff8e6;
  color: #9a6500;
  padding: 8px;
  text-align: center;
}

.rating-badge strong,
.rating-badge span {
  display: block;
}

.rating-badge strong {
  color: var(--gold);
  font-size: 23px;
  line-height: 1;
}

.rating-badge strong::after {
  content: "★";
  margin-left: 2px;
  font-size: 13px;
}

.rating-badge span {
  margin-top: 3px;
  font-size: 11px;
  font-weight: 900;
}

.post-body {
  margin: 18px 0;
  color: var(--ink);
  font-size: 17px;
  line-height: 1.65;
}

footer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  color: var(--muted);
  font-weight: 800;
}

.helpful {
  background: #e6f7f4;
  color: #08776c;
}

.study-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.study-tags span {
  background: #eef3ff;
  color: var(--blue);
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

.author-choice {
  min-width: 0;
  border: 0;
  margin: 0;
  padding: 0;
}

.author-choice legend {
  margin-bottom: 8px;
  color: var(--muted);
  font-weight: 800;
}

.author-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.author-options label {
  min-height: 42px;
  border: 1px solid var(--line);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 0;
  background: var(--surface-soft);
  color: var(--ink);
  padding: 0 12px;
  font-weight: 900;
}

.author-options label.active {
  border-color: rgba(15, 159, 143, 0.35);
  background: #e6f7f4;
  color: #08776c;
}

.author-options input {
  width: auto;
  accent-color: #0f9f8f;
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

  header,
  .post-topline {
    align-items: flex-start;
  }

  header h2 {
    font-size: 22px;
  }

  .post-topline {
    flex-direction: column;
  }

  .comment-meta {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .comment-actions {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
