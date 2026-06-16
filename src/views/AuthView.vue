<template>
  <section class="auth-page">
    <div class="auth-copy">
      <h1>{{ pageTitle }}</h1>
      <p>
        Studierende können sich später anmelden, Beiträge schreiben,
        Kommentare verfolgen und ihr Profil automatisch mit Studiengang und
        Semester verbinden.
      </p>

      <div class="benefits" aria-label="Vorteile eines BOice-Kontos">
        <article>
          <span>01</span>
          <strong>Profil nutzen</strong>
          <p>Studiengang und Semester werden bei neuen Beiträgen übernommen.</p>
        </article>
        <article>
          <span>02</span>
          <strong>Beiträge verwalten</strong>
          <p>Eigene Beiträge bleiben im Konto übersichtlich erreichbar.</p>
        </article>
        <article>
          <span>03</span>
          <strong>Aktivität sehen</strong>
          <p>Hinweise informieren über neue Kommentare und Bewertungen.</p>
        </article>
      </div>
    </div>

    <form class="auth-form" @submit.prevent="submitForm">
      <div class="form-head">
        <div>
          <p class="label">{{ isRegisterMode ? 'Registrieren' : 'Anmelden' }}</p>
          <h2>{{ formTitle }}</h2>
        </div>
      </div>

      <nav class="auth-mode-switch" aria-label="Kontoaktion wählen">
        <RouterLink to="/anmelden" :class="{ active: !isRegisterMode }">Anmelden</RouterLink>
        <RouterLink to="/registrieren" :class="{ active: isRegisterMode }">Registrieren</RouterLink>
      </nav>

      <label v-if="isRegisterMode">
        Vollständiger Name
        <input
          v-model.trim="form.name"
          type="text"
          autocomplete="name"
          placeholder="z. B. Lina Becker"
        />
      </label>

      <div v-if="isRegisterMode" class="field-grid">
        <label>
          Studiengang
          <select v-model="form.studyProgram">
            <option v-for="program in studyPrograms" :key="program">
              {{ program }}
            </option>
          </select>
        </label>

        <label>
          Semester
          <input v-model.number="form.semester" type="number" min="1" max="12" />
        </label>
      </div>

      <label>
        Hochschul-E-Mail
        <input
          v-model.trim="form.email"
          type="email"
          autocomplete="email"
          placeholder="name@hs-bochum.de"
        />
      </label>

      <label>
        Passwort
        <div class="password-row">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            :autocomplete="isRegisterMode ? 'new-password' : 'current-password'"
            placeholder="Mindestens 8 Zeichen"
          />
          <button type="button" @click="showPassword = !showPassword">
            {{ showPassword ? 'Verbergen' : 'Zeigen' }}
          </button>
        </div>
      </label>

      <label v-if="isRegisterMode">
        Passwort wiederholen
        <input
          v-model="form.passwordRepeat"
          type="password"
          autocomplete="new-password"
          placeholder="Passwort erneut eingeben"
        />
      </label>

      <label v-if="isRegisterMode" class="check-row">
        <input v-model="form.acceptRules" type="checkbox" />
        Ich akzeptiere die BOice-Regeln für respektvolle Beiträge.
      </label>

      <div v-if="errors.length" class="message error" role="alert">
        <strong>Bitte prüfen:</strong>
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </div>

      <p v-if="successMessage" class="message success" role="status">
        {{ successMessage }}
      </p>

      <button class="submit-button" type="submit">
        {{ isRegisterMode ? 'Konto erstellen' : 'Anmelden' }}
      </button>

      <div class="switch-link">
        <span>{{ switchText }}</span>
        <RouterLink :to="switchTarget">{{ switchLinkText }}</RouterLink>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

type AuthMode = 'login' | 'register'
type Account = {
  name: string
  studyProgram: string
  semester: number
  email: string
  password: string
}

// Die Route entscheidet, ob das Formular Anmeldung oder Registrierung zeigt.
const props = defineProps<{
  mode: AuthMode
}>()

const router = useRouter()

// Formularwerte bleiben lokal, solange noch kein Server angeschlossen ist.
const form = reactive({
  name: '',
  studyProgram: 'Wirtschaftsinformatik',
  semester: 3,
  email: 'student@hs-bochum.de',
  password: 'boice1234',
  passwordRepeat: '',
  acceptRules: false,
})

const studyPrograms = [
  'Wirtschaftsinformatik',
  'Informatik',
  'Architektur',
  'Bauingenieurwesen',
  'Mechatronik',
]

const accountStorageKey = 'boice:account'
const loginStorageKey = 'boice:isLoggedIn'
const fallbackAccount: Account = {
  name: 'Test',
  studyProgram: 'Wirtschaftsinformatik',
  semester: 3,
  email: 'student@hs-bochum.de',
  password: 'boice1234',
}
const showPassword = ref(false)
const errors = ref<string[]>([])
const successMessage = ref('')

const isRegisterMode = computed(() => props.mode === 'register')
const pageTitle = computed(() => (isRegisterMode.value ? 'Bei BOice registrieren' : 'Bei BOice anmelden'))
const formTitle = computed(() => (isRegisterMode.value ? 'Neues Konto' : 'Zurück in den Campus Feed'))
const switchTarget = computed(() => (isRegisterMode.value ? '/anmelden' : '/registrieren'))
const switchText = computed(() => (isRegisterMode.value ? 'Du hast schon ein Konto?' : 'Noch kein Konto?'))
const switchLinkText = computed(() => (isRegisterMode.value ? 'Jetzt anmelden' : 'Jetzt registrieren'))

// Beim Wechsel zwischen Anmeldung und Registrierung werden Meldungen zurückgesetzt.
watch(
  () => props.mode,
  () => {
    errors.value = []
    successMessage.value = ''
    showPassword.value = false
  },
)

const hasValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Prüft die Eingaben und zeigt bewusst nur eine Frontend-Erfolgsmeldung.
const loadStoredAccount = () => {
  try {
    return JSON.parse(localStorage.getItem(accountStorageKey) ?? 'null') as Partial<Account> | null
  } catch {
    return null
  }
}

const normalizeAccountName = (name?: string) => {
  const oldFallbackName = ['Studierende', 'Person'].join(' ')
  return name && name !== oldFallbackName ? name : fallbackAccount.name
}

const getLoginAccount = (): Account => {
  const storedAccount = loadStoredAccount()

  return {
    name: normalizeAccountName(storedAccount?.name),
    studyProgram: storedAccount?.studyProgram || fallbackAccount.studyProgram,
    semester: storedAccount?.semester || fallbackAccount.semester,
    email: storedAccount?.email || fallbackAccount.email,
    password: storedAccount?.password || fallbackAccount.password,
  }
}

// Speichert den Account, damit Feed und Kommentare den Namen uebernehmen.
const saveAccount = (account: Account) => {
  localStorage.setItem(accountStorageKey, JSON.stringify(account))
}

const setLoggedIn = (account: Account) => {
  saveAccount(account)
  localStorage.setItem(loginStorageKey, 'true')
  window.dispatchEvent(new Event('boice-auth-changed'))
}

const submitForm = () => {
  errors.value = []
  successMessage.value = ''

  if (isRegisterMode.value && !form.name.trim()) {
    errors.value.push('Bitte gib deinen Namen ein.')
  }

  if (!hasValidEmail(form.email)) {
    errors.value.push('Bitte gib eine gültige E-Mail-Adresse ein.')
  }

  if (form.password.length < 8) {
    errors.value.push('Das Passwort muss mindestens 8 Zeichen lang sein.')
  }

  if (isRegisterMode.value && form.password !== form.passwordRepeat) {
    errors.value.push('Die Passwörter stimmen nicht überein.')
  }

  if (isRegisterMode.value && !form.acceptRules) {
    errors.value.push('Bitte bestätige die BOice-Regeln.')
  }

  if (errors.value.length) return
  if (!isRegisterMode.value) {
    const account = getLoginAccount()

    // Einfache If-Abfrage im Frontend: Stimmen E-Mail und Passwort?
    if (form.email !== account.email || form.password !== account.password) {
      errors.value.push('E-Mail oder Passwort ist falsch.')
      return
    }

    setLoggedIn(account)
    successMessage.value = 'Du bist angemeldet. Deine Kommentare laufen jetzt ueber deinen Account.'
    void router.push('/')
    return
  }

  setLoggedIn({
    name: form.name.trim(),
    studyProgram: form.studyProgram,
    semester: form.semester,
    email: form.email,
    password: form.password,
  })

  successMessage.value = 'Das Konto wurde im Frontend gespeichert. Du bist jetzt angemeldet.'
  void router.push('/')
}
</script>

<style scoped>
.auth-page {
  max-width: 1120px;
  min-width: 0;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(340px, 430px);
  align-items: start;
  gap: 28px;
}

.label {
  margin: 0 0 6px;
  color: var(--red);
  font-weight: 900;
}

.auth-copy h1 {
  margin: 0 0 16px;
  font-size: clamp(30px, 4.5vw, 44px);
  line-height: 1.12;
}

.auth-copy > p {
  max-width: 680px;
  color: var(--muted);
  font-size: 18px;
  line-height: 1.6;
}

.benefits {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 28px;
}

.benefits article {
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  padding: 16px;
  box-shadow: var(--shadow-soft);
}

.benefits span {
  color: var(--red);
  font-weight: 900;
}

.benefits strong {
  display: block;
  margin-top: 8px;
  color: var(--ink);
}

.benefits p {
  margin: 8px 0 0;
  color: var(--muted);
  line-height: 1.5;
}

.auth-form {
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  padding: 24px;
  box-shadow: var(--shadow);
}

.form-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.form-head h2 {
  margin: 0;
  font-size: 25px;
}

.auth-mode-switch {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface-soft);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
  margin-bottom: 16px;
  padding: 6px;
}

.auth-mode-switch a {
  min-height: 42px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: white;
  color: var(--muted);
  display: grid;
  place-items: center;
  cursor: pointer;
  text-decoration: none;
  font-weight: 900;
  transition:
    background 160ms ease,
    border-color 160ms ease,
    color 160ms ease,
    transform 160ms ease;
}

.auth-mode-switch a:hover {
  border-color: rgba(227, 6, 19, 0.25);
  background: #fff0f1;
  color: var(--red);
  transform: translateY(-1px);
}

.auth-mode-switch a.active {
  background: var(--red);
  color: white;
  box-shadow: 0 10px 18px rgba(227, 6, 19, 0.18);
}

.field-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(110px, 0.6fr);
  gap: 14px;
}

label {
  min-width: 0;
  display: grid;
  gap: 6px;
  margin-bottom: 14px;
  color: var(--muted);
  font-weight: 800;
}

input,
select {
  width: 100%;
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface-soft);
  color: var(--ink);
  outline: 0;
  padding: 12px;
}

input:focus,
select:focus {
  border-color: rgba(49, 95, 217, 0.5);
  box-shadow: 0 0 0 4px rgba(49, 95, 217, 0.1);
}

.password-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
}

.password-row button {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  color: var(--blue);
  padding: 0 12px;
  font-weight: 900;
}

.check-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  line-height: 1.45;
}

.check-row input {
  width: auto;
  margin-top: 3px;
}

.message {
  border-radius: 8px;
  padding: 12px;
  font-weight: 800;
}

.message ul {
  margin: 8px 0 0;
  padding-left: 18px;
}

.message li + li {
  margin-top: 4px;
}

.error {
  border: 1px solid #f6c9cd;
  background: #fff0f1;
  color: var(--red-dark);
}

.success {
  border: 1px solid #b7e4dc;
  background: #e6f7f4;
  color: #08776c;
}

.submit-button {
  width: 100%;
  min-height: 46px;
  border: 0;
  border-radius: 8px;
  background: var(--red);
  color: white;
  cursor: pointer;
  font-weight: 900;
  box-shadow: 0 10px 20px rgba(231, 53, 53, 0.2);
  transition:
    background 160ms ease,
    transform 160ms ease,
    box-shadow 160ms ease;
}

.submit-button:hover {
  background: var(--red-dark);
  box-shadow: 0 14px 24px rgba(231, 53, 53, 0.24);
  transform: translateY(-1px);
}

.switch-link {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface-soft);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin: 18px 0 0;
  padding: 10px;
  color: var(--muted);
  font-weight: 800;
}

.switch-link a {
  min-height: 36px;
  border: 1px solid #f6c9cd;
  border-radius: 8px;
  background: white;
  color: var(--red);
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  padding: 0 12px;
  text-decoration: none;
  font-weight: 900;
  box-shadow: 0 8px 16px rgba(227, 6, 19, 0.08);
  transition:
    background 160ms ease,
    border-color 160ms ease,
    color 160ms ease,
    transform 160ms ease;
}

.switch-link a:hover {
  border-color: rgba(227, 6, 19, 0.3);
  background: #fff0f1;
  color: var(--red-dark);
  transform: translateY(-1px);
}

@media (max-width: 980px) {
  .auth-page {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .benefits,
  .field-grid {
    grid-template-columns: 1fr;
  }

  .auth-form {
    padding: 20px;
  }
}

@media (max-width: 460px) {
  .auth-copy h1 {
    font-size: 30px;
  }

  .form-head {
    flex-direction: column;
  }

  .password-row {
    grid-template-columns: 1fr;
  }

  .password-row button {
    min-height: 42px;
  }
}
</style>
