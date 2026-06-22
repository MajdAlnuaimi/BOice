<template>
  <!-- Feste Sidebar wie im Referenzdesign -->
  <aside class="sidebar" :class="{ 'without-categories': !isFeedRoute }">
    <RouterLink class="brand" to="/" aria-label="BOice Startseite">
      <img src="/boice-logo.png" alt="BOice" />
    </RouterLink>

    <nav class="side-links" aria-label="Hauptnavigation">
      <RouterLink :class="{ 'feed-nav-active': isFeedRoute }" to="/" data-mobile-label="Start">
        <span class="nav-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M4 11.5 12 5l8 6.5" />
            <path d="M6.5 10.5V20h11v-9.5" />
            <path d="M10 20v-5h4v5" />
          </svg>
        </span>
        <span class="nav-label">Startseite</span>
      </RouterLink>
      <RouterLink v-if="isLoggedIn" to="/meine-beitraege" data-mobile-label="Meine">
        <span class="nav-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M7 4h10l2 2v14H5V4h2Z" />
            <path d="M9 10h6" />
            <path d="M9 14h6" />
            <path d="M9 18h4" />
          </svg>
        </span>
        <span class="nav-label">Meine Beiträge</span>
      </RouterLink>
      <RouterLink v-if="isLoggedIn" to="/benachrichtigungen" data-mobile-label="Hinweise">
        <span class="nav-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M18 10a6 6 0 0 0-12 0c0 5-2 6-2 6h16s-2-1-2-6Z" />
            <path d="M10 19a2 2 0 0 0 4 0" />
          </svg>
        </span>
        <span class="nav-label">Hinweise</span>
      </RouterLink>
    </nav>

    <section v-if="isFeedRoute" class="side-categories" aria-label="Kategorien">
      <div class="side-section-head">
        <span>Kategorien</span>
        <RouterLink :class="{ active: currentCategory === 'Alle' }" :to="{ path: '/beitraege' }">
          Alle
        </RouterLink>
      </div>

      <RouterLink
        :class="{ active: currentCategory === 'Vorlesungen' }"
        :to="{ path: '/beitraege', query: { category: 'Vorlesungen' } }"
      >
        <i class="dot module"></i>
        <span class="category-label">Vorlesungen</span>
      </RouterLink>
      <RouterLink
        :class="{ active: currentCategory === 'Übungen' }"
        :to="{ path: '/beitraege', query: { category: 'Übungen' } }"
      >
        <i class="dot rooms"></i>
        <span class="category-label">Übungen</span>
      </RouterLink>
      <RouterLink
        :class="{ active: currentCategory === 'Praktikum' }"
        :to="{ path: '/beitraege', query: { category: 'Praktikum' } }"
      >
        <i class="dot campus"></i>
        <span class="category-label">Praktikum</span>
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

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const accountStorageKey = 'boice:account'
const loginStorageKey = 'boice:isLoggedIn'
const route = useRoute()

const isLoggedIn = ref(false)
const fallbackAccountName = 'Test'
const accountName = ref(fallbackAccountName)

const normalizeAccountName = (name) => {
  const oldFallbackName = ['Studierende', 'Person'].join(' ')
  return name && name !== oldFallbackName ? name : fallbackAccountName
}

const refreshAuthState = () => {
  isLoggedIn.value = localStorage.getItem(loginStorageKey) === 'true'

  try {
    const storedAccount = JSON.parse(localStorage.getItem(accountStorageKey) ?? 'null')
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

const isFeedRoute = computed(() => route.path === '/' || route.path === '/beitraege')

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
.side-links a.router-link-active,
.side-links a.feed-nav-active {
  background: #eef3ff;
  color: var(--blue);
}

.side-links a:hover .nav-icon,
.side-links a.router-link-active .nav-icon,
.side-links a.feed-nav-active .nav-icon {
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
  flex: 0 0 auto;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.04);
}

.category-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

@media (max-width: 1180px) {
  .sidebar {
    position: sticky;
    top: 0;
    width: 100%;
    min-height: auto;
    border-right: 0;
    border-bottom: 1px solid var(--line);
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas:
      "brand account"
      "categories categories";
    gap: 10px;
    padding: 10px 0;
    background: rgba(246, 248, 251, 0.96);
  }

  .sidebar.without-categories {
    grid-template-areas: "brand account";
  }

  .brand {
    grid-area: brand;
    align-self: center;
  }

  .brand img {
    width: 98px;
  }

  .side-links {
    position: fixed;
    z-index: 40;
    right: 12px;
    bottom: 12px;
    left: 12px;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(0, 1fr);
    gap: 8px;
    margin-top: 0;
    border: 1px solid rgba(204, 213, 225, 0.9);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.98);
    padding: 7px;
    box-shadow: 0 18px 38px rgba(31, 42, 55, 0.18);
    backdrop-filter: blur(14px);
  }

  .side-links a {
    min-width: 0;
    min-height: 56px;
    border: 1px solid transparent;
    border-radius: 9px;
    background: transparent;
    color: var(--muted);
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    padding: 6px 4px;
    font-size: 0;
    text-align: center;
  }

  .side-links a::after {
    content: attr(data-mobile-label);
    display: block;
    max-width: 100%;
    overflow: hidden;
    color: currentColor;
    font-size: 11px;
    font-weight: 900;
    line-height: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .side-links a:hover,
  .side-links a.router-link-active,
  .side-links a.feed-nav-active {
    border-color: rgba(49, 95, 217, 0.18);
    background: #eef3ff;
    color: var(--blue);
  }

  .side-links .nav-icon {
    width: 28px;
    height: 28px;
    border-radius: 8px;
  }

  .side-links .nav-icon svg {
    width: 16px;
    height: 16px;
  }

  .side-categories {
    grid-area: categories;
    display: grid;
    grid-template-columns:
      minmax(64px, 0.7fr)
      minmax(132px, 1.45fr)
      minmax(92px, 1fr)
      minmax(104px, 1.05fr);
    gap: 6px;
    margin-top: 0;
  }

  .side-section-head {
    display: contents;
  }

  .side-section-head > span {
    display: none;
  }

  .side-section-head a,
  .side-categories > a {
    min-width: 0;
    min-height: 36px;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 0 8px;
    font-size: 12px;
    text-align: center;
  }

  .side-section-head a.active,
  .side-categories > a.active {
    border-color: rgba(227, 6, 19, 0.3);
    background: #fff0f1;
    color: var(--red);
  }

  .side-categories .dot {
    width: 7px;
    height: 7px;
    box-shadow: none;
  }

  .sidebar-bottom {
    grid-area: account;
    justify-self: end;
    min-width: 0;
    margin-top: 0;
  }

  .side-auth {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .side-auth a {
    min-height: 34px;
    padding: 0 9px;
    font-size: 12px;
    box-shadow: none;
    white-space: nowrap;
  }

  .side-account {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .account-card {
    padding: 6px;
  }

  .account-card > span {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }

  .account-card small {
    display: none;
  }

  .side-account strong {
    max-width: 72px;
    font-size: 13px;
  }

  .logout-button {
    width: auto;
    min-height: 34px;
    padding: 0 9px;
    font-size: 12px;
    white-space: nowrap;
  }
}

@media (max-width: 420px) {
  .brand img {
    width: 86px;
  }

  .side-categories {
    grid-template-columns:
      minmax(52px, 0.58fr)
      minmax(106px, 1.4fr)
      minmax(78px, 0.95fr)
      minmax(84px, 1.05fr);
    gap: 5px;
  }

  .side-section-head a,
  .side-categories > a {
    min-height: 34px;
    padding: 0 6px;
    font-size: 11px;
  }

  .side-links {
    right: 10px;
    bottom: 10px;
    left: 10px;
    gap: 6px;
    padding: 6px;
  }

  .side-links a {
    min-height: 52px;
  }

  .side-links .nav-icon {
    width: 26px;
    height: 26px;
  }
}
</style>
