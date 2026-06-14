<template>
  <!-- Bereich fuer alle sichtbaren Campus-Beitraege -->
  <section id="beitraege" class="feed">
    <div class="feed-head">
      <strong>{{ posts.length }} Beiträge</strong>
      <span>Alle Kategorien</span>
    </div>

    <p v-if="posts.length === 0" class="empty">
      Keine Beiträge gefunden. Ändere die Suche oder wähle eine andere Kategorie.
    </p>

    <article v-for="post in posts" :key="post.id" class="post-card">
      <div class="vote-column">
        <div class="vote-lamp" :class="props.userVotes[post.id]">
          <button
            type="button"
            :aria-pressed="props.userVotes[post.id] === 'up'"
            aria-label="Beitrag liken"
            class="vote-button up-vote"
            :class="{ active: props.userVotes[post.id] === 'up' }"
            :title="voteTitle(post.id, 'up')"
            @click="vote(post.id, 'up')"
          >
            <span aria-hidden="true">👍</span>
          </button>
          <strong>{{ post.votes }}</strong>
          <button
            type="button"
            :aria-pressed="props.userVotes[post.id] === 'down'"
            aria-label="Beitrag disliken"
            class="vote-button down-vote"
            :class="{ active: props.userVotes[post.id] === 'down' }"
            :title="voteTitle(post.id, 'down')"
            @click="vote(post.id, 'down')"
          >
            <span aria-hidden="true">👎</span>
          </button>
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
          <button type="button" @click="emit('openComments', post)">
            {{ post.comments.length }} Kommentare
          </button>
          <span>{{ normalizedStudyProgram(post.studyProgram) }}</span>
          <span class="helpful">{{ post.helpfulPercent }}% hilfreich</span>
        </footer>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import type { Post } from '../data/posts'

const props = defineProps<{
  posts: Post[]
  userVotes: Record<number, 'up' | 'down'>
}>()

const emit = defineEmits<{
  openComments: [post: Post]
  votePost: [payload: { id: number; direction: 'up' | 'down' }]
}>()

const vote = (id: number, direction: 'up' | 'down') => {
  emit('votePost', { id, direction })
}

const voteTitle = (id: number, direction: 'up' | 'down') => {
  const currentVote = props.userVotes[id]
  if (!currentVote) return direction === 'up' ? 'Beitrag liken' : 'Beitrag disliken'
  if (currentVote === direction) return 'Stimme entfernen'
  return 'Stimme ändern'
}

const normalizedStudyProgram = (studyProgram: string) => {
  return studyProgram.replace(/\s+/g, '')
}

const categoryTone = (category: string) => {
  if (category.toLowerCase().includes('raum') || category.toLowerCase().includes('räume')) return 'rooms'
  if (category.toLowerCase().includes('campus')) return 'campus'
  return 'module'
}
</script>

<style scoped>
.feed {
  min-width: 0;
  margin: 0 0 48px;
}

.feed-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: -2px 0 10px;
  color: var(--muted);
  font-size: 13px;
  font-weight: 900;
}

.empty {
  border: 1px dashed var(--line);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.76);
  color: var(--muted);
  padding: 18px;
  font-weight: 800;
}

.post-card {
  min-width: 0;
  display: grid;
  grid-template-columns: 52px 1fr;
  margin-bottom: 14px;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  box-shadow: var(--shadow-soft);
  transition:
    border-color 160ms ease,
    transform 160ms ease,
    box-shadow 160ms ease;
}

.post-card:hover {
  border-color: rgba(227, 6, 19, 0.2);
  box-shadow: var(--shadow);
  transform: translateY(-1px);
}

.vote-column {
  border-right: 1px solid var(--line);
  background: var(--surface-soft);
}

.vote-lamp {
  width: 100%;
  height: 100%;
  min-height: 126px;
  display: grid;
  grid-template-rows: minmax(40px, 1fr) 32px minmax(40px, 1fr);
}

.vote-lamp strong {
  display: grid;
  place-items: center;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background: white;
  color: var(--ink);
  font-size: 14px;
  font-weight: 900;
}

.vote-button {
  width: 100%;
  height: 100%;
  border: 0;
  background: transparent;
  display: grid;
  place-items: center;
  font-size: 16px;
}

.up-vote {
  color: #0f9f8f;
  background: #e6f7f4;
}

.down-vote {
  color: var(--red);
  background: #fff0f1;
}

.up-vote:hover,
.up-vote.active {
  background: #b7e4dc;
  color: #08776c;
}

.up-vote.active {
  background: #0f9f8f;
  color: white;
}

.down-vote:hover,
.down-vote.active {
  background: #f6c9cd;
  color: var(--red-dark);
}

.down-vote.active {
  background: var(--red);
  color: white;
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
  background: #fff0f1;
  color: var(--red);
  display: inline-flex;
  padding: 5px 9px;
  font-weight: 900;
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
  padding: 6px;
  text-align: center;
}

.rating-badge strong {
  display: block;
  font-size: 15px;
  line-height: 1;
}

.rating-badge strong::after {
  content: "★";
  margin-left: 2px;
  font-size: 10px;
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

footer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 900;
}

footer button {
  border: 0;
  background: transparent;
  color: var(--blue);
  padding: 0;
  font-weight: 900;
}

footer button:hover {
  color: var(--red);
}

.helpful {
  border-radius: 999px;
  background: #e6f7f4;
  color: #08776c;
  padding: 4px 8px;
}

@media (max-width: 520px) {
  .post-card {
    grid-template-columns: 44px minmax(0, 1fr);
  }

  .post-content {
    padding: 14px;
  }

  .post-head {
    flex-direction: column;
  }
}
</style>
