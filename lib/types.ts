import type { PortableTextBlock } from '@portabletext/react'

export type Blocks = PortableTextBlock[]

export interface Stanza { number: number; lines: string; refrain?: boolean }
export interface Recording { youtubeId?: string; label?: string; durationSeconds?: number }
export interface Collect { text?: string; source?: string }

export interface HymnRef {
  _id: string
  title: string
  slug: string
  textAuthor?: string
  translator?: string
  textYear?: string
  tune?: string
  meter?: string
  stanzas?: Stanza[]
  defaultRecording?: Recording
}

export interface Hymn extends HymnRef {
  copyright?: { status?: string; notes?: string }
  background?: Blocks
  hymnaryUrl?: string
}

export interface Week {
  _id: string
  number: number
  title?: string
  summary?: Blocks
  collect?: Collect
  candleColor?: 'blue' | 'violet' | 'rose'
}

export interface Season {
  _id: string
  year: number
  title?: string
  startDate: string
  endDate: string
  intro?: Blocks
  seo?: { title?: string; description?: string; ogImageUrl?: string }
}

export interface EntrySummary {
  _id: string
  year: number
  date: string
  dayNumber: number
  liturgicalLabel?: string
  hymnTitle: string
  hymnSlug: string
  weekNumber: number
}

export interface Entry {
  _id: string
  year: number
  date: string
  dayNumber: number
  liturgicalLabel?: string
  hymn: HymnRef
  featuredStanzas?: number[]
  secondaryHymn?: HymnRef
  secondaryStanzas?: number[]
  antiphon?: { latin?: string; english?: string }
  scriptureRef?: string
  scriptureText?: string
  reflection?: Blocks
  traditionQuote?: { text?: string; author?: string; source?: string }
  question?: string
  collectOverride?: Collect
  recordingOverride?: Recording
  shareImageUrl?: string
  status?: 'draft' | 'ready'
  week: Week
}

export interface HymnWithEntries extends Hymn {
  entries: EntrySummary[]
}
