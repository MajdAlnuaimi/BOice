<template>
  <div class="page-layout account-layout">
    <main class="main-column">
      <section class="for-you-card">
        <div class="for-you-head">
          <div>
            <h1>Meine Beiträge</h1>
          </div>

          <span class="status-pill">{{ ownPosts.length }} Beiträge</span>
        </div>
      </section>

      <section class="post-list" aria-label="Eigene Beiträge">
        <div class="feed-head">
          <strong>Eigene Beiträge</strong>
          <span>Test</span>
        </div>

        <article v-for="post in ownPosts" :key="post.id" class="post-card">
          <div class="vote-column">
            <div class="vote-lamp">
              <span class="vote-icon up" aria-hidden="true">👍</span>
              <strong>{{ post.votes }}</strong>
              <span class="vote-icon down" aria-hidden="true">👎</span>
            </div>
          </div>

          <div class="post-content" :class="post.tone">
            <div class="post-head">
              <div class="post-meta">
                <span class="category" :class="post.tone">{{ post.category }}</span>
                <span>{{ post.visibility }}</span>
                <span>{{ post.createdAt }}</span>
              </div>

              <div class="rating-badge" aria-label="Bewertung">
                <strong>{{ post.rating }}</strong>
              </div>
            </div>

            <h3>{{ post.title }}</h3>
            <p>{{ post.body }}</p>

            <footer>
              <span>{{ post.comments }} Kommentare</span>
            </footer>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
type OwnPost = {
  id: number
  title: string
  category: string
  tone: 'module' | 'rooms' | 'campus'
  body: string
  createdAt: string
  visibility: string
  votes: number
  comments: number
  rating: string
}

const ownPosts: OwnPost[] = [
  {
    id: 2,
    title: 'Vorlesung Datenbanken braucht mehr Wiederholung',
    category: 'Vorlesungen',
    tone: 'module',
    body: 'Die Inhalte bauen stark aufeinander auf. Eine kurze Wiederholung vor neuen Themen würde das Mitkommen leichter machen.',
    createdAt: 'gestern',
    visibility: 'anonym',
    votes: 8,
    comments: 2,
    rating: '4.1',
  },
  {
    id: 1,
    title: 'Java Übungen brauchen mehr Beispiele',
    category: 'Übungen',
    tone: 'rooms',
    body: 'Bei den Aufgaben wäre ein kurzer Lösungsansatz hilfreich. Dann kann man besser einschätzen, ob man auf dem richtigen Weg ist.',
    createdAt: 'heute',
    visibility: 'Test',
    votes: 11,
    comments: 3,
    rating: '3.8',
  },
  {
    id: 3,
    title: 'Praktikum Software-Engineering klarer strukturieren',
    category: 'Praktikum',
    tone: 'campus',
    body: 'Die Abgaben im Software-Engineering funktionieren besser, wenn Anforderungen, Bewertung und Beispielausgabe direkt in einer Checkliste stehen.',
    createdAt: 'vor 3 Tagen',
    visibility: 'Test',
    votes: 5,
    comments: 2,
    rating: '3.5',
  },
]

</script>

<style scoped>
.page-layout {
  width: min(740px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: start;
  gap: 18px;
}

.main-column {
  min-width: 0;
  display: grid;
  gap: 18px;
}

.for-you-card {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  box-shadow: var(--shadow-soft);
}

.for-you-card {
  padding: 18px;
}

.for-you-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.for-you-card h1 {
  margin: 0;
  font-size: clamp(30px, 4vw, 42px);
  line-height: 1;
}

.status-pill {
  border-radius: 8px;
  background: var(--red);
  color: white;
  padding: 8px 10px;
  font-size: 13px;
  font-weight: 900;
  white-space: nowrap;
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

.post-list {
  min-width: 0;
  margin: 0 0 48px;
}

.post-card {
  min-width: 0;
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
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

.category.module {
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

.post-card h3 {
  margin: 10px 0 6px;
  color: var(--ink);
  font-size: 21px;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.post-card p {
  margin: 0;
  color: var(--muted);
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.post-card footer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 900;
}

@media (max-width: 1180px) {
  .page-layout {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 760px) {
  .page-layout {
    grid-template-columns: 1fr;
  }

  .for-you-head {
    flex-direction: column;
  }
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
