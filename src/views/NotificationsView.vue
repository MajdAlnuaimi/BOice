<template>
  <div class="page-layout account-layout">
    <main class="main-column">
      <section class="for-you-card">
        <div class="for-you-head">
          <div>
            <h1>Hinweise</h1>
          </div>
        </div>
      </section>

      <section class="notification-list" aria-label="Hinweisliste">
        <div class="feed-head">
          <strong>Aktuelle Hinweise</strong>
          <span>{{ notifications.length }} Meldungen</span>
        </div>

        <article
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-card"
          :class="notification.tone"
        >
          <div class="notification-icon" :class="notification.tone" aria-hidden="true">
            {{ notification.icon }}
          </div>

          <div class="notification-content">
            <div class="notification-meta">
              <span class="type-label" :class="notification.tone">{{ notification.type }}</span>
              <span>{{ notification.time }}</span>
            </div>

            <h3>{{ notification.title }}</h3>
            <p>{{ notification.body }}</p>

            <footer>
              <span>{{ notification.postTitle }}</span>
            </footer>
          </div>
        </article>
      </section>
    </main>

  </div>
</template>

<script setup lang="ts">
type NotificationTone = 'upvote' | 'downvote' | 'comment'

type StaticNotification = {
  id: number
  type: string
  title: string
  body: string
  postTitle: string
  time: string
  icon: string
  tone: NotificationTone
}

const notifications: StaticNotification[] = [
  {
    id: 1,
    type: 'Positive Bewertung',
    title: 'Dein Beitrag wurde positiv bewertet',
    body: 'Eine studierende Person findet deinen Hinweis zur Java-Übung hilfreich.',
    postTitle: 'Java Übungen brauchen mehr Beispiele',
    time: 'gerade eben',
    icon: '+',
    tone: 'upvote',
  },
  {
    id: 2,
    type: 'Kommentar',
    title: 'Mina hat deinen Beitrag kommentiert',
    body: 'Mehr Beispiele wären wirklich hilfreich, besonders vor der Klausur.',
    postTitle: 'Java Übungen brauchen mehr Beispiele',
    time: 'vor 8 Minuten',
    icon: 'K',
    tone: 'comment',
  },
  {
    id: 3,
    type: 'Negative Bewertung',
    title: 'Dein Beitrag wurde negativ bewertet',
    body: 'Eine studierende Person bewertet deinen Vorschlag zur Vorlesung kritisch.',
    postTitle: 'Vorlesung Datenbanken braucht mehr Wiederholung',
    time: 'vor 18 Minuten',
    icon: '-',
    tone: 'downvote',
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

.for-you-card,
.notification-card {
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

.notification-list {
  min-width: 0;
  margin: 0 0 48px;
}

.notification-card {
  min-width: 0;
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  gap: 0;
  margin-bottom: 14px;
  overflow: hidden;
  transition:
    border-color 160ms ease,
    transform 160ms ease,
    box-shadow 160ms ease;
}

.notification-card:hover {
  border-color: rgba(227, 6, 19, 0.2);
  box-shadow: var(--shadow);
  transform: translateY(-1px);
}

.notification-icon {
  min-height: 126px;
  border-right: 1px solid var(--line);
  background: var(--surface-soft);
  color: white;
  display: grid;
  place-items: center;
  font-weight: 900;
}

.notification-icon.upvote {
  background: var(--teal);
}

.notification-icon.downvote {
  background: var(--red);
}

.notification-icon.comment {
  background: var(--blue);
}

.notification-content {
  min-width: 0;
  border-left: 4px solid var(--red);
  padding: 16px 16px 14px;
}

.notification-content {
  border-left-color: var(--blue);
}

.notification-card.upvote .notification-content {
  border-left-color: var(--teal);
}

.notification-card.downvote .notification-content {
  border-left-color: var(--red);
}

.notification-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
  color: var(--soft-muted);
  font-size: 12px;
  font-weight: 900;
}

.type-label {
  border-radius: 999px;
  display: inline-flex;
  padding: 5px 9px;
  font-weight: 900;
}

.type-label.upvote {
  background: #e6f7f4;
  color: #08776c;
}

.type-label.downvote {
  background: #fff0f1;
  color: var(--red);
}

.type-label.comment {
  background: #eef3ff;
  color: var(--blue);
}

.notification-card h3 {
  margin: 10px 0 6px;
  color: var(--ink);
  font-size: 21px;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.notification-card p {
  margin: 0;
  color: var(--muted);
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.notification-card footer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
  color: var(--blue);
  font-size: 12px;
  font-weight: 900;
}

.notification-card footer strong {
  border-radius: 999px;
  background: #fff0f1;
  color: var(--red);
  padding: 4px 8px;
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
  .notification-card {
    grid-template-columns: 44px minmax(0, 1fr);
  }

  .notification-content {
    padding: 14px;
  }

  .notification-meta {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
