<template>
  <section class="account-page">
    <header class="page-title">
      <div>
        <p>Mein Bereich</p>
        <h1>Meine Beiträge</h1>
      </div>
      <span>{{ ownPosts.length }} Beiträge</span>
    </header>

    <section class="summary-row" aria-label="Übersicht">
      <article>
        <span>Stimmen</span>
        <strong>24</strong>
      </article>
      <article>
        <span>Kommentare</span>
        <strong>7</strong>
      </article>
      <article>
        <span>Hilfreich</span>
        <strong>86%</strong>
      </article>
    </section>

    <section class="post-list" aria-label="Eigene Beiträge">
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

          <h2>{{ post.title }}</h2>
          <p>{{ post.body }}</p>

          <footer>
            <span>{{ post.comments }} Kommentare</span>
            <span class="helpful">{{ post.helpful }}% hilfreich</span>
            <span>{{ post.status }}</span>
          </footer>
        </div>
      </article>
    </section>
  </section>
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
  helpful: number
  rating: string
  status: string
}

const ownPosts: OwnPost[] = [
  {
    id: 1,
    title: 'Java Übungen brauchen mehr Beispiele',
    category: 'Module',
    tone: 'module',
    body: 'Bei den Aufgaben wäre ein kurzer Lösungsansatz hilfreich. Dann kann man besser einschätzen, ob man auf dem richtigen Weg ist.',
    createdAt: 'heute',
    visibility: 'Test',
    votes: 11,
    comments: 3,
    helpful: 88,
    rating: '3.8',
    status: 'veröffentlicht',
  },
  {
    id: 2,
    title: 'Mehr Steckdosen in Lernräumen',
    category: 'Räume',
    tone: 'rooms',
    body: 'Viele Arbeitsplätze sind gut, aber ohne Steckdose wird es bei langen Lerntagen schwierig.',
    createdAt: 'gestern',
    visibility: 'anonym',
    votes: 8,
    comments: 2,
    helpful: 91,
    rating: '4.1',
    status: 'veröffentlicht',
  },
  {
    id: 3,
    title: 'WLAN im Gebäude C ist instabil',
    category: 'Campus',
    tone: 'campus',
    body: 'In mehreren Vorlesungen ist die Verbindung abgebrochen. Für digitale Unterlagen ist das störend.',
    createdAt: 'vor 3 Tagen',
    visibility: 'Test',
    votes: 5,
    comments: 2,
    helpful: 79,
    rating: '3.5',
    status: 'beobachtet',
  },
]
</script>

<style scoped>
.account-page {
  width: 100%;
  max-width: 820px;
  margin: 0 auto 48px;
  display: grid;
  gap: 14px;
}

.page-title {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

.page-title p {
  margin: 0 0 4px;
  color: var(--red);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.page-title h1 {
  margin: 0;
  font-size: 34px;
  line-height: 1;
}

.page-title > span {
  color: var(--muted);
  font-size: 13px;
  font-weight: 900;
  white-space: nowrap;
}

.summary-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.summary-row article {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  padding: 12px 14px;
  box-shadow: var(--shadow-soft);
}

.summary-row span,
.summary-row strong {
  display: block;
}

.summary-row span {
  color: var(--muted);
  font-size: 12px;
  font-weight: 900;
}

.summary-row strong {
  margin-top: 5px;
  font-size: 24px;
  line-height: 1;
}

.post-list {
  display: grid;
  gap: 14px;
}

.post-card {
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
  min-height: 126px;
  display: grid;
  grid-template-rows: minmax(40px, 1fr) 32px minmax(40px, 1fr);
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

.category,
.helpful {
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

.post-card h2 {
  margin: 10px 0 6px;
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

.helpful {
  background: #e6f7f4;
  color: #08776c;
}

@media (max-width: 720px) {
  .page-title {
    align-items: flex-start;
    flex-direction: column;
  }

  .summary-row {
    grid-template-columns: 1fr;
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
