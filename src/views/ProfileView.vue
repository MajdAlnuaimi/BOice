<template>
  <section class="route-page">
    <p class="label">Profil</p>
    <h1>Wirtschaftsinformatik</h1>
    <p>
      Diese Seite zeigt, welche Profildaten später nach der Anmeldung
      automatisch bei Beiträgen verwendet werden.
    </p>

    <div class="profile-grid">
      <article>
        <span>Studiengang</span>
        <strong>Wirtschaftsinformatik</strong>
      </article>
      <article>
        <span>Semester</span>
        <strong>3. Semester</strong>
      </article>
      <article>
        <span>Status</span>
        <strong>Profil</strong>
      </article>
    </div>
  </section>
</template>

<style scoped>
.route-page {
  max-width: 900px;
  margin: 0 auto;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  padding: clamp(24px, 5vw, 42px);
  text-align: center;
  box-shadow: var(--shadow-soft);
}

.label {
  margin: 0 0 8px;
  color: var(--red);
  font-weight: 900;
}

h1 {
  margin: 0 0 14px;
  font-size: clamp(22px, 7vw, 54px);
  line-height: 1.12;
  overflow-wrap: normal;
  word-break: normal;
}

p {
  max-width: 680px;
  margin: 0 auto;
  color: var(--muted);
  font-size: 18px;
  line-height: 1.6;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 28px;
}

article {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface-soft);
  padding: 18px;
  text-align: center;
}

article span,
article strong {
  display: block;
}

article span {
  color: var(--muted);
  font-weight: 800;
}

article strong {
  margin-top: 6px;
  color: var(--ink);
  font-size: clamp(18px, 5vw, 20px);
  overflow-wrap: normal;
  word-break: normal;
}

@media (max-width: 760px) {
  .route-page {
    padding-inline: 18px;
  }

  .profile-grid {
    grid-template-columns: 1fr;
  }
}
</style>
