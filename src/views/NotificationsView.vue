<template>
  <section class="account-page">
    <header class="page-title">
      <div>
        <p>Mein Bereich</p>
        <h1>Benachrichtigungen</h1>
      </div>
      <span>{{ unreadCount }} neu</span>
    </header>

    <section class="summary-row" aria-label="Übersicht">
      <article>
        <span>Neu</span>
        <strong>{{ unreadCount }}</strong>
      </article>
      <article>
        <span>Kommentare</span>
        <strong>2</strong>
      </article>
      <article>
        <span>Reaktionen</span>
        <strong>2</strong>
      </article>
    </section>

    <section class="notification-list" aria-label="Benachrichtigungsliste">
      <article
        v-for="notification in notifications"
        :key="notification.id"
        class="notification-card"
        :class="{ unread: notification.isUnread }"
      >
        <div class="notification-icon" :class="notification.tone" aria-hidden="true">
          {{ notification.icon }}
        </div>

        <div class="notification-content">
          <div class="notification-meta">
            <span class="type-label" :class="notification.tone">{{ notification.type }}</span>
            <span>{{ notification.time }}</span>
          </div>

          <h2>{{ notification.title }}</h2>
          <p>{{ notification.body }}</p>

          <footer>
            <span>{{ notification.postTitle }}</span>
            <strong v-if="notification.isUnread">neu</strong>
          </footer>
        </div>
      </article>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type NotificationTone = 'comment' | 'vote' | 'info'

type StaticNotification = {
  id: number
  type: string
  title: string
  body: string
  postTitle: string
  time: string
  icon: string
  tone: NotificationTone
  isUnread: boolean
}

const notifications: StaticNotification[] = [
  {
    id: 1,
    type: 'Kommentar',
    title: 'Mina hat deinen Beitrag kommentiert',
    body: 'Mehr Beispiele wären wirklich hilfreich, besonders vor der Klausur.',
    postTitle: 'Java Übungen brauchen mehr Beispiele',
    time: 'gerade eben',
    icon: 'K',
    tone: 'comment',
    isUnread: true,
  },
  {
    id: 2,
    type: 'Hilfreich',
    title: 'Dein Beitrag wurde hilfreich bewertet',
    body: 'Drei Studierende fanden deinen Hinweis zu den Lernräumen hilfreich.',
    postTitle: 'Mehr Steckdosen in Lernräumen',
    time: 'vor 18 Minuten',
    icon: '+',
    tone: 'vote',
    isUnread: true,
  },
  {
    id: 3,
    type: 'Campus',
    title: 'Neue Reaktion im Campus-Bereich',
    body: 'Zum WLAN im Gebäude C gibt es weitere Erfahrungen von anderen Studierenden.',
    postTitle: 'WLAN im Gebäude C ist instabil',
    time: 'vor 1 Stunde',
    icon: '!',
    tone: 'info',
    isUnread: false,
  },
  {
    id: 4,
    type: 'Kommentar',
    title: 'Omar hat einen Vorschlag ergänzt',
    body: 'Vielleicht könnte man die Übungsblätter mit kurzen Musterlösungen veröffentlichen.',
    postTitle: 'Java Übungen brauchen mehr Beispiele',
    time: 'gestern',
    icon: 'K',
    tone: 'comment',
    isUnread: false,
  },
]

const unreadCount = computed(() => {
  return notifications.filter((notification) => notification.isUnread).length
})
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
  border-radius: 999px;
  background: #fff0f1;
  color: var(--red);
  padding: 7px 10px;
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

.notification-list {
  display: grid;
  gap: 12px;
}

.notification-card {
  min-width: 0;
  border: 1px solid var(--line);
  border-left: 4px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  gap: 14px;
  padding: 14px;
  box-shadow: var(--shadow-soft);
}

.notification-card.unread {
  border-left-color: var(--red);
  background: linear-gradient(90deg, #fff8f8 0, var(--surface) 42%);
}

.notification-icon {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  color: white;
  display: grid;
  place-items: center;
  font-weight: 900;
}

.notification-icon.comment {
  background: var(--red);
}

.notification-icon.vote {
  background: var(--teal);
}

.notification-icon.info {
  background: var(--gold);
}

.notification-content {
  min-width: 0;
}

.notification-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
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

.type-label.comment {
  background: #fff0f1;
  color: var(--red);
}

.type-label.vote {
  background: #e6f7f4;
  color: #08776c;
}

.type-label.info {
  background: #fff8e6;
  color: #9a6500;
}

.notification-card h2 {
  margin: 10px 0 6px;
  font-size: 20px;
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
  margin-top: 10px;
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
  .notification-card {
    grid-template-columns: 1fr;
  }

  .notification-meta {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
