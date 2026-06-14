<template>
  <section class="route-page">
    <p class="label">Meine Beiträge</p>
    <h1>Eigene Campus-Beiträge</h1>
    <p>
      In der späteren Version würden hier alle Beiträge stehen, die der
      angemeldete Student erstellt hat.
    </p>
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
  box-shadow: var(--shadow-soft);
}

.label {
  margin: 0 0 8px;
  color: var(--red);
  font-weight: 900;
}

h1 {
  margin: 0 0 14px;
  font-size: clamp(34px, 6vw, 54px);
}

p {
  max-width: 680px;
  color: var(--muted);
  font-size: 18px;
  line-height: 1.6;
}
</style>
