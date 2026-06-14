<template>
  <!-- Feste Sidebar wie im Referenzdesign -->
  <aside class="sidebar">
    <RouterLink class="brand" to="/" aria-label="BOice Startseite">
      <img src="/boice-logo.png" alt="BOice" />
    </RouterLink>

    <nav class="side-links" aria-label="Hauptnavigation">
      <RouterLink to="/">
        <span class="nav-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M4 11.5 12 5l8 6.5" />
            <path d="M6.5 10.5V20h11v-9.5" />
            <path d="M10 20v-5h4v5" />
          </svg>
        </span>
        Startseite
      </RouterLink>
      <RouterLink v-if="isLoggedIn" to="/meine-beitraege">
        <span class="nav-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M7 4h10l2 2v14H5V4h2Z" />
            <path d="M9 10h6" />
            <path d="M9 14h6" />
            <path d="M9 18h4" />
          </svg>
        </span>
        Meine Beiträge
      </RouterLink>
      <RouterLink v-if="isLoggedIn" to="/benachrichtigungen">
        <span class="nav-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M18 10a6 6 0 0 0-12 0c0 5-2 6-2 6h16s-2-1-2-6Z" />
            <path d="M10 19a2 2 0 0 0 4 0" />
          </svg>
        </span>
        Benachrichtigungen
      </RouterLink>
    </nav>

    <section class="side-categories" aria-label="Kategorien">
      <div class="side-section-head">
        <span>Kategorien</span>
        <RouterLink :class="{ active: currentCategory === 'Alle' }" :to="{ path: '/beitraege' }">
          Alle
        </RouterLink>
      </div>

      <RouterLink
        :class="{ active: currentCategory === 'Module' }"
        :to="{ path: '/beitraege', query: { category: 'Module' } }"
      >
        <i class="dot module"></i>
        Module
      </RouterLink>
      <RouterLink
        :class="{ active: currentCategory === 'Räume' }"
        :to="{ path: '/beitraege', query: { category: 'Räume' } }"
      >
        <i class="dot rooms"></i>
        Räume
      </RouterLink>
      <RouterLink
        :class="{ active: currentCategory === 'Campus' }"
        :to="{ path: '/beitraege', query: { category: 'Campus' } }"
      >
        <i class="dot campus"></i>
        Campus
      </RouterLink>
    </section>

    <div class="sidebar-bottom">
      <div v-if="isLoggedIn" class="side-account" aria-label="Angemeldeter Account">
        <div class="account-card">
          <span>{{ accountInitials }}</span>
          <div>
            <small>Angemeldet als</small>
            <strong>{{ accountName }}</strong>
          </div>
        </div>
        <button class="logout-button" type="button" @click="logout">Abmelden</button>
      </div>

      <div v-else class="side-auth" aria-label="Kontoaktionen">
        <RouterLink class="auth-primary" to="/anmelden">Anmelden</RouterLink>
        <RouterLink class="auth-secondary" to="/registrieren">Registrieren</RouterLink>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

type Account = {
  name?: string
}

const accountStorageKey = 'boice:account'
const loginStorageKey = 'boice:isLoggedIn'
const route = useRoute()

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

const currentCategory = computed(() => {
  const category = Array.isArray(route.query.category) ? route.query.category[0] : route.query.category
  return typeof category === 'string' ? category : 'Alle'
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
  display: block;
  text-decoration: none;
}

.brand img {
  display: block;
  width: min(170px, 100%);
  height: auto;
  object-fit: contain;
}

.account-card > span {
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

.side-account strong {
  display: block;
  font-size: 20px;
  line-height: 1;
}

.side-links {
  display: grid;
  gap: 12px;
  margin-top: 34px;
}

.side-links a {
  min-width: 0;
  min-height: 42px;
  border-radius: 8px;
  color: var(--ink);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 900;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.side-links .nav-icon {
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: white;
  display: grid;
  place-items: center;
  color: var(--muted);
}

.side-links .nav-icon svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.side-links a:hover,
.side-links a.router-link-active {
  background: #eef3ff;
  color: var(--blue);
}

.side-links a:hover .nav-icon,
.side-links a.router-link-active .nav-icon {
  border-color: rgba(49, 95, 217, 0.24);
  background: white;
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

.side-section-head a {
  color: var(--red);
  text-decoration: none;
}

.side-section-head a:hover {
  color: var(--red-dark);
}

.side-categories > a {
  min-height: 28px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--ink);
  font-weight: 900;
  text-decoration: none;
}

.side-categories > a:hover,
.side-categories > a.active {
  color: var(--blue);
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

.side-account,
.side-auth {
  display: grid;
  gap: 9px;
}

.account-card {
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: white;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
}

.account-card > span {
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  background: var(--red);
  font-size: 13px;
}

.account-card div {
  min-width: 0;
}

.account-card small {
  display: block;
  color: var(--muted);
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
}

.side-account strong {
  display: block;
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
  line-height: 1.15;
}

.logout-button {
  width: 100%;
  min-height: 38px;
  border: 1px solid #f6c9cd;
  border-radius: 8px;
  background: #fff0f1;
  color: var(--red);
  padding: 0 12px;
  font-size: 13px;
  font-weight: 900;
  text-align: left;
}

.logout-button:hover {
  background: var(--red);
  color: white;
}

.side-auth a {
  min-height: 42px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: white;
  color: var(--ink);
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 12px;
  text-decoration: none;
  font-weight: 900;
  box-shadow: 0 6px 12px rgba(31, 42, 55, 0.05);
  transition:
    background 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease,
    color 160ms ease,
    transform 160ms ease;
}

.side-auth a:hover {
  border-color: rgba(227, 6, 19, 0.28);
  box-shadow: 0 10px 18px rgba(227, 6, 19, 0.12);
  transform: translateY(-1px);
}

.side-auth a.router-link-active {
  border-color: rgba(227, 6, 19, 0.35);
  box-shadow: 0 8px 16px rgba(227, 6, 19, 0.12);
}

.side-auth .auth-primary {
  background: var(--red);
  border-color: var(--red);
  color: white;
}

.side-auth .auth-primary:hover,
.side-auth .auth-primary.router-link-active {
  background: var(--red-dark);
  border-color: var(--red-dark);
}

.side-auth .auth-secondary {
  color: var(--red);
}

.side-auth .auth-secondary:hover,
.side-auth .auth-secondary.router-link-active {
  background: #fff0f1;
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
