<template>
  <!-- Feste Sidebar wie im Referenzdesign -->
  <aside class="sidebar">
    <RouterLink class="brand" to="/" aria-label="BOice Startseite">
      <span class="brand-mark">B</span>
      <span>
        <strong>BOice</strong>
        <small>Your voice at Hochschule Bochum</small>
      </span>
    </RouterLink>

    <nav class="side-links" aria-label="Hauptnavigation">
      <RouterLink to="/">
        <span aria-hidden="true">⌂</span>
        Startseite
      </RouterLink>
      <RouterLink to="/beitraege">
        <span aria-hidden="true">+</span>
        Neue Beiträge
      </RouterLink>
      <RouterLink to="/profil">
        <span aria-hidden="true">@</span>
        Eingeloggt
      </RouterLink>
    </nav>

    <section class="side-categories" aria-label="Kategorien">
      <div class="side-section-head">
        <span>Kategorien</span>
        <strong>Alle</strong>
      </div>
      <p><i class="dot module"></i>Module</p>
      <p><i class="dot rooms"></i>Räume</p>
      <p><i class="dot campus"></i>Campus</p>
    </section>

    <div class="sidebar-bottom">
      <span class="online-state"><i></i> Online</span>

      <div v-if="isLoggedIn" class="side-account" aria-label="Angemeldeter Account">
        <span>{{ accountInitials }}</span>
        <div>
          <strong>{{ accountName }}</strong>
          <button type="button" @click="logout">Abmelden</button>
        </div>
      </div>

      <div v-else class="side-auth" aria-label="Kontoaktionen">
        <RouterLink to="/anmelden">Anmelden</RouterLink>
        <RouterLink to="/registrieren">Registrieren</RouterLink>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

type Account = {
  name?: string
}

const accountStorageKey = 'boice:account'
const loginStorageKey = 'boice:isLoggedIn'

const isLoggedIn = ref(false)
const fallbackAccountName = 'Test'
const accountName = ref(fallbackAccountName)

const normalizeAccountName = (name?: string) => {
  const oldFallbackName = ['Studierende', 'Person'].join(' ')
  return name && name !== oldFallbackName ? name : fallbackAccountName
}

const refreshAuthState = () => {
  isLoggedIn.value = localStorage.getItem(loginStorageKey) === 'true'

  try {
    const storedAccount = JSON.parse(localStorage.getItem(accountStorageKey) ?? 'null') as Account | null
    accountName.value = normalizeAccountName(storedAccount?.name)
  } catch {
    accountName.value = fallbackAccountName
  }
}

const accountInitials = computed(() => {
  return accountName.value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'BO'
})

const logout = () => {
  localStorage.setItem(loginStorageKey, 'false')
  window.dispatchEvent(new Event('boice-auth-changed'))
}

onMounted(() => {
  refreshAuthState()
  window.addEventListener('storage', refreshAuthState)
  window.addEventListener('boice-auth-changed', refreshAuthState)
})

onUnmounted(() => {
  window.removeEventListener('storage', refreshAuthState)
  window.removeEventListener('boice-auth-changed', refreshAuthState)
})
</script>

<style scoped>
.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 10;
  width: 224px;
  border-right: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.96);
  display: flex;
  flex-direction: column;
  padding: 24px 18px 18px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--ink);
  text-decoration: none;
}

.brand-mark,
.side-account > span {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  background: var(--ink);
  color: white;
  display: grid;
  place-items: center;
  font-size: 22px;
  font-weight: 900;
}

.brand strong,
.side-account strong {
  display: block;
  font-size: 20px;
  line-height: 1;
}

.brand small {
  display: block;
  max-width: 128px;
  margin-top: 4px;
  color: var(--muted);
  font-size: 11px;
  font-weight: 800;
  line-height: 1.25;
}

.side-links {
  display: grid;
  gap: 12px;
  margin-top: 34px;
}

.side-links a {
  min-height: 42px;
  border-radius: 8px;
  color: var(--ink);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
  text-decoration: none;
  font-weight: 900;
}

.side-links a span {
  width: 24px;
  height: 24px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: white;
  display: grid;
  place-items: center;
  color: var(--muted);
  font-size: 13px;
}

.side-links a:hover,
.side-links a.router-link-active {
  background: #eef3ff;
  color: var(--blue);
}

.side-categories {
  display: grid;
  gap: 16px;
  margin-top: 36px;
}

.side-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--soft-muted);
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.side-section-head strong {
  color: var(--red);
}

.side-categories p {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  color: var(--ink);
  font-weight: 900;
}

.dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.04);
}

.module {
  background: var(--red);
}

.rooms {
  background: var(--teal);
}

.campus {
  background: var(--gold);
}

.sidebar-bottom {
  display: grid;
  gap: 12px;
  margin-top: auto;
}

.online-state {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 13px;
  font-weight: 900;
}

.online-state i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--gold);
}

.side-account,
.side-auth {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: white;
  padding: 9px;
}

.side-account {
  display: flex;
  align-items: center;
  gap: 10px;
}

.side-account > span {
  width: 32px;
  height: 32px;
  background: var(--red);
  font-size: 13px;
}

.side-account strong {
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
}

.side-account button {
  border: 0;
  background: transparent;
  color: var(--red);
  padding: 0;
  font-size: 12px;
  font-weight: 900;
}

.side-auth {
  display: grid;
  gap: 6px;
}

.side-auth a {
  min-height: 36px;
  border-radius: 7px;
  color: var(--ink);
  display: flex;
  align-items: center;
  padding: 0 10px;
  text-decoration: none;
  font-weight: 900;
}

.side-auth a:first-child {
  background: var(--red);
  color: white;
}

@media (max-width: 900px) {
  .sidebar {
    position: static;
    width: 100%;
    min-height: auto;
    border-right: 0;
    border-bottom: 1px solid var(--line);
    padding: 14px 16px;
  }

  .side-links,
  .side-categories {
    display: none;
  }

  .sidebar-bottom {
    margin-top: 12px;
  }
}
</style>
