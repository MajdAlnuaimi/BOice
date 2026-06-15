<template>
  <div class="page-layout">
    <main class="main-column">
      <section id="start" class="for-you-card">
        <div class="for-you-head">
          <div>
            <h1>BOice Campus Feed</h1>
          </div>

          <div class="feed-mode" aria-label="Feed Ansicht">
            <button
              type="button"
              :aria-pressed="feedMode === 'new'"
              :class="{ active: feedMode === 'new' }"
              @click="feedMode = 'new'"
            >
              Neu
            </button>
            <button
              type="button"
              :aria-pressed="feedMode === 'top'"
              :class="{ active: feedMode === 'top' }"
              @click="feedMode = 'top'"
            >
              Top
            </button>
          </div>
        </div>

        <label class="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            v-model="search"
            type="search"
            placeholder="Suchen nach Übung, Vorlesung, Praktikum..."
          />
        </label>

        <div class="category-tabs" role="group" aria-label="Kategorie auswählen">
          <button
            type="button"
            :class="{ active: activeCategory === 'Alle' }"
            @click="setCategory('Alle')"
          >
            Alle
          </button>
          <button
            v-for="category in categories"
            :key="category"
            type="button"
            :class="{ active: activeCategory === category }"
            @click="setCategory(category)"
          >
            {{ category }}
          </button>
        </div>
      </section>

      <PostComposer
        :account-name="currentStudent.name"
        :is-logged-in="isLoggedIn"
        @create-post="createPost"
      />

      <PostFeed
        :active-category="activeCategory"
        :posts="visiblePosts"
        :user-votes="userVotes"
        @open-comments="openComments"
        @vote-post="votePost"
      />
    </main>

    <aside id="info" class="right-rail">
      <section class="rail-card trends-card" aria-label="Top Trends">
        <div class="rail-head">
          <h2>Top Trends</h2>
          <span>Top</span>
        </div>

        <article v-for="(post, index) in topTrends" :key="post.id" class="trend-item">
          <strong>{{ index + 1 }}</strong>
          <div>
            <h3>{{ post.title }}</h3>
            <p>{{ post.category }} · {{ post.votes }} Stimmen</p>
          </div>
        </article>
      </section>

      <section class="rail-card pulse-card" aria-label="Statistik">
        <div class="rail-head">
          <h2>Statistik</h2>
        </div>

        <div class="pulse-grid">
          <div>
            <strong>{{ posts.length }}</strong>
            <span>Beiträge</span>
          </div>
          <div>
            <strong>{{ totalVotes }}</strong>
            <span>Votes</span>
          </div>
          <div>
            <strong>{{ totalComments }}</strong>
            <span>Kommentare</span>
          </div>
          <div>
            <strong>{{ categories.length }}</strong>
            <span>Kategorien</span>
          </div>
        </div>
      </section>

      <section class="rail-card rating-card" aria-label="Campus Bewertung">
        <div class="rail-head">
          <h2>Campus Bewertung</h2>
          <span>{{ averageRating }}</span>
        </div>

        <p>{{ averageHelpful }}% hilfreich bewertet</p>

        <div class="rating-bars">
          <div v-for="rating in categoryRatings" :key="rating.category">
            <span>{{ rating.category }}</span>
            <strong>{{ rating.average }}</strong>
            <i :style="{ '--value': `${rating.percent}%` }"></i>
          </div>
        </div>
      </section>
    </aside>
  </div>

  <CommentDialog
    :account-name="currentStudent.name"
    :is-logged-in="isLoggedIn"
    :post="selectedPost"
    @add-comment="addComment"
    @close="selectedPost = null"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PostComposer from '../components/PostComposer.vue'
import PostFeed from '../components/PostFeed.vue'
import CommentDialog from '../components/CommentDialog.vue'
import { initialPosts, type Post } from '../data/posts'

type VoteDirection = 'up' | 'down'
type FeedMode = 'new' | 'top'
type StudentAccount = {
  name: string
  studyProgram: string
  semester: number
}

const route = useRoute()
const router = useRouter()
const accountId = 'test-account'
const accountStorageKey = 'boice:account'
const loginStorageKey = 'boice:isLoggedIn'
const userVotesStorageKey = `boice:votes:${accountId}`

const fallbackStudent: StudentAccount = {
  name: 'Test',
  studyProgram: 'Wirtschaftsinformatik',
  semester: 3,
}

const normalizeAccountName = (name?: string) => {
  const oldFallbackName = ['Studierende', 'Person'].join(' ')
  return name && name !== oldFallbackName ? name : fallbackStudent.name
}

const loadCurrentStudent = () => {
  try {
    const storedAccount = JSON.parse(localStorage.getItem(accountStorageKey) ?? 'null') as Partial<StudentAccount> | null

    return {
      name: normalizeAccountName(storedAccount?.name),
      studyProgram: storedAccount?.studyProgram || fallbackStudent.studyProgram,
      semester: storedAccount?.semester || fallbackStudent.semester,
    }
  } catch {
    return fallbackStudent
  }
}

const currentStudent = ref<StudentAccount>(loadCurrentStudent())
const isLoggedIn = ref(localStorage.getItem(loginStorageKey) === 'true')

// Aktualisiert den Login-Zustand, wenn Anmeldung oder Abmeldung passiert.
const refreshAuthState = () => {
  isLoggedIn.value = localStorage.getItem(loginStorageKey) === 'true'
  currentStudent.value = loadCurrentStudent()
}

const loadUserVotes = () => {
  try {
    return JSON.parse(localStorage.getItem(userVotesStorageKey) ?? '{}') as Record<number, VoteDirection>
  } catch {
    return {}
  }
}

const saveUserVotes = (votes: Record<number, VoteDirection>) => {
  localStorage.setItem(userVotesStorageKey, JSON.stringify(votes))
}

const storedUserVotes = loadUserVotes()

const posts = ref<Post[]>(
  initialPosts.map((post) => ({
    ...post,
    votes: post.votes + (storedUserVotes[post.id] === 'up' ? 1 : storedUserVotes[post.id] === 'down' ? -1 : 0),
  })),
)

const userVotes = ref<Record<number, VoteDirection>>(storedUserVotes)
const selectedPost = ref<Post | null>(null)
const search = ref('')
const activeCategory = ref('Alle')
const feedMode = ref<FeedMode>('new')

const categories = computed(() => {
  return [...new Set(posts.value.map((post) => post.category))]
})

const routeCategory = () => {
  const category = Array.isArray(route.query.category) ? route.query.category[0] : route.query.category
  return typeof category === 'string' && categories.value.includes(category) ? category : 'Alle'
}

const setCategory = (category: string) => {
  activeCategory.value = category
  void router.push({
    path: '/beitraege',
    query: category === 'Alle' ? {} : { category },
  })
}

watch(
  () => route.query.category,
  () => {
    activeCategory.value = routeCategory()
  },
  { immediate: true },
)

const visiblePosts = computed(() => {
  const term = search.value.trim().toLowerCase()

  const filteredPosts = posts.value
    .filter((post) => activeCategory.value === 'Alle' || post.category === activeCategory.value)
    .filter((post) => {
      if (!term) return true

      return [
        post.title,
        post.body,
        post.category,
        post.author,
        post.studyProgram,
        `${post.semester}. Semester`,
      ]
        .join(' ')
        .toLowerCase()
        .includes(term)
    })

  if (feedMode.value === 'top') {
    return [...filteredPosts].sort((firstPost, secondPost) => {
      return secondPost.votes - firstPost.votes || secondPost.id - firstPost.id
    })
  }

  return filteredPosts
})

const totalVotes = computed(() => {
  return posts.value.reduce((sum, post) => sum + post.votes, 0)
})

const totalComments = computed(() => {
  return posts.value.reduce((sum, post) => sum + post.comments.length, 0)
})

const averageRating = computed(() => {
  const value = posts.value.reduce((sum, post) => sum + post.rating, 0) / posts.value.length
  return value.toFixed(1)
})

const averageHelpful = computed(() => {
  const value = posts.value.reduce((sum, post) => sum + post.helpfulPercent, 0) / posts.value.length
  return Math.round(value)
})

const topTrends = computed(() => {
  return [...posts.value].sort((a, b) => b.votes - a.votes).slice(0, 3)
})

const categoryRatings = computed(() => {
  return categories.value.map((category) => {
    const categoryPosts = posts.value.filter((post) => post.category === category)
    const value = categoryPosts.reduce((sum, post) => sum + post.rating, 0) / categoryPosts.length

    return {
      category,
      average: value.toFixed(1),
      percent: Math.round((value / 5) * 100),
    }
  })
})

const createPost = (payload: {
  title: string
  category: string
  body: string
  rating: number
  isAnonymous: boolean
}) => {
  if (!isLoggedIn.value) {
    void router.push('/anmelden')
    return
  }

  const student = currentStudent.value
  const newPost: Post = {
    id: Date.now(),
    title: payload.title,
    category: payload.category,
    author: payload.isAnonymous ? 'Anonym' : student.name,
    studyProgram: student.studyProgram,
    semester: student.semester,
    body: payload.body,
    createdAt: 'gerade eben',
    rating: payload.rating,
    helpfulPercent: 80,
    votes: 0,
    comments: [],
  }

  posts.value.unshift(newPost)
}

const openComments = (post: Post) => {
  selectedPost.value = post
}

const addComment = (payload: { postId: number; author: string; body: string }) => {
  if (!isLoggedIn.value) {
    void router.push('/anmelden')
    return
  }

  const post = posts.value.find((item) => item.id === payload.postId)
  if (!post) return

  post.comments.unshift({
    id: Date.now(),
    author: payload.author,
    body: payload.body,
    createdAt: 'gerade eben',
  })
}

const votePost = (payload: { id: number; direction: 'up' | 'down' }) => {
  const previousVote = userVotes.value[payload.id]
  const post = posts.value.find((item) => item.id === payload.id)
  if (!post) return

  if (previousVote === payload.direction) {
    post.votes += payload.direction === 'up' ? -1 : 1
    const { [payload.id]: _removedVote, ...remainingVotes } = userVotes.value
    userVotes.value = remainingVotes
    saveUserVotes(userVotes.value)
    return
  }

  if (!previousVote) {
    post.votes += payload.direction === 'up' ? 1 : -1
  } else {
    post.votes += payload.direction === 'up' ? 2 : -2
  }

  userVotes.value = {
    ...userVotes.value,
    [payload.id]: payload.direction,
  }
  saveUserVotes(userVotes.value)
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
.page-layout {
  width: min(1060px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 740px) 280px;
  align-items: start;
  gap: 20px;
}

.main-column,
.right-rail {
  min-width: 0;
  display: grid;
  gap: 18px;
}

.right-rail {
  position: sticky;
  top: 18px;
}

.for-you-card,
.rail-card {
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

.feed-mode {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface-soft);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
}

.feed-mode button {
  min-width: 54px;
  min-height: 30px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--muted);
  font-weight: 900;
}

.feed-mode button.active {
  background: var(--ink);
  color: white;
  box-shadow: 0 5px 14px rgba(22, 23, 25, 0.16);
}

.search-box {
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface-soft);
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  align-items: center;
  margin-top: 16px;
  overflow: hidden;
}

.search-box span {
  color: var(--blue);
  display: grid;
  place-items: center;
  font-weight: 900;
}

.search-box input {
  width: 100%;
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--ink);
  outline: 0;
  padding: 14px 12px 14px 0;
  font-weight: 800;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.category-tabs button {
  min-height: 34px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: white;
  color: var(--muted);
  padding: 0 13px;
  font-size: 13px;
  font-weight: 900;
}

.category-tabs button:hover,
.category-tabs button.active {
  border-color: rgba(227, 6, 19, 0.3);
  background: #fff0f1;
  color: var(--red);
}

.rail-card {
  padding: 16px;
}

.rail-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.rail-head h2 {
  margin: 0;
  font-size: 17px;
}

.rail-head span {
  border-radius: 8px;
  background: var(--red);
  color: white;
  padding: 8px 10px;
  font-weight: 900;
}

.trend-item {
  display: grid;
  grid-template-columns: 30px 1fr;
  gap: 10px;
  align-items: start;
}

.trend-item + .trend-item {
  margin-top: 14px;
}

.trend-item > strong {
  width: 30px;
  height: 30px;
  border-radius: 7px;
  background: #eef3ff;
  color: var(--blue);
  display: grid;
  place-items: center;
  font-weight: 900;
}

.trend-item h3,
.trend-item p {
  margin: 0;
}

.trend-item h3 {
  font-size: 15px;
}

.trend-item p,
.rating-card p {
  color: var(--muted);
  font-size: 12px;
  font-weight: 900;
}

.pulse-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.pulse-grid div {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface-soft);
  padding: 12px;
}

.pulse-grid strong,
.pulse-grid span {
  display: block;
}

.pulse-grid strong {
  font-size: 22px;
}

.pulse-grid span {
  margin-top: 4px;
  color: var(--muted);
  font-size: 11px;
  font-weight: 900;
}

.rating-card .rail-head span {
  background: #fff8e6;
  color: var(--gold);
}

.rating-bars {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.rating-bars div {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 7px 10px;
  color: var(--muted);
  font-weight: 900;
}

.rating-bars i {
  grid-column: 1 / -1;
  height: 8px;
  border-radius: 999px;
  background:
    linear-gradient(90deg, var(--teal) var(--value), #e7edf5 var(--value));
}

@media (max-width: 1180px) {
  .page-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .right-rail {
    position: static;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .page-layout,
  .right-rail {
    grid-template-columns: 1fr;
  }

  .for-you-head {
    flex-direction: column;
  }

  .feed-mode {
    width: 100%;
  }

  .feed-mode button {
    flex: 1;
  }
}
</style>
