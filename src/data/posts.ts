// Typen fuer die Beitragsdaten im Frontend
export type Comment = {
  id: number
  author: string
  body: string
  createdAt: string
}

// Ein Beitrag enthaelt Text, Kategorie, Stimmen und Kommentare
export type Post = {
  id: number
  title: string
  category: string
  author: string
  studyProgram: string
  semester: number
  body: string
  createdAt: string
  rating: number
  helpfulPercent: number
  votes: number
  comments: Comment[]
}

// Beispieldaten fuer das Frontend, solange noch keine API angeschlossen ist
export const initialPosts: Post[] = [
  {
    id: 1,
    title: 'Java Übungen',
    category: 'Module',
    author: 'Anonym',
    studyProgram: 'Wirtschaftsinformatik',
    semester: 3,
    body: 'Die Übungen könnten besser erklärt werden. Ein kurzer Überblick vor jeder Aufgabe würde vielen helfen.',
    createdAt: 'vor 3 Minuten',
    rating: 3.7,
    helpfulPercent: 82,
    votes: 5,
    comments: [
      {
        id: 1,
        author: 'Mina',
        body: 'Sehe ich auch so.',
        createdAt: 'vor 4 Minuten',
      },
      {
        id: 2,
        author: 'Omar',
        body: 'Mehr Beispiele wären hilfreich.',
        createdAt: 'vor 2 Minuten',
      },
    ],
  },
  {
    id: 2,
    title: 'Raum 3.12',
    category: 'Räume',
    author: 'Lina',
    studyProgram: 'Informatik',
    semester: 2,
    body: 'Der Raum ist oft zu voll und schlecht belüftet. Für lange Vorlesungen ist das echt anstrengend.',
    createdAt: 'vor 12 Minuten',
    rating: 3.2,
    helpfulPercent: 76,
    votes: 3,
    comments: [
      {
        id: 1,
        author: 'Anonym',
        body: 'Stimmt, besonders morgens.',
        createdAt: 'vor 10 Minuten',
      },
    ],
  },
  {
    id: 3,
    title: 'Mehr Lernplätze in der Bibliothek',
    category: 'Campus',
    author: 'Samir',
    studyProgram: 'Architektur',
    semester: 5,
    body: 'In der Prüfungsphase sind die Plätze schnell voll. Eine Anzeige für freie Lernplätze wäre praktisch.',
    createdAt: 'vor 25 Minuten',
    rating: 4.5,
    helpfulPercent: 91,
    votes: 8,
    comments: [
      {
        id: 1,
        author: 'Nora',
        body: 'Eine Reservierung für Gruppenräume wäre auch gut.',
        createdAt: 'vor 15 Minuten',
      },
      {
        id: 2,
        author: 'Anonym',
        body: 'Vor allem nachmittags findet man kaum noch Platz.',
        createdAt: 'vor 9 Minuten',
      },
    ],
  },
]
