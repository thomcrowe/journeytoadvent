import { defineQuery } from 'next-sanity'

const hymnRef = /* groq */ `{
  _id, title, "slug": slug.current, textAuthor, translator, textYear, tune, meter,
  stanzas[]{number, lines, refrain}, defaultRecording
}`

const summary = /* groq */ `{
  _id, "year": season->year, date, dayNumber, liturgicalLabel,
  "hymnTitle": hymn->title, "hymnSlug": hymn->slug.current, "weekNumber": week->number
}`

const entryFull = /* groq */ `{
  _id, "year": season->year, date, dayNumber, liturgicalLabel,
  "hymn": hymn->${hymnRef},
  featuredStanzas,
  "secondaryHymn": secondaryHymn->${hymnRef},
  secondaryStanzas, antiphon, scriptureRef, scriptureText, reflection, traditionQuote, question,
  collectOverride, recordingOverride, "shareImageUrl": shareImage.asset->url, status,
  "week": week->{_id, number, title, summary, collect, candleColor}
}`

export const seasons = defineQuery(`*[_type == "season" && defined(year)] | order(year desc){
  _id, year, title, startDate, endDate, intro, "seo": seo{title, description, "ogImageUrl": ogImage.asset->url}
}`)

export const seasonByYear = defineQuery(`*[_type == "season" && year == $year][0]{
  _id, year, title, startDate, endDate, intro, "seo": seo{title, description, "ogImageUrl": ogImage.asset->url},
  "weeks": *[_type == "week" && references(^._id)] | order(number asc){_id, number, title, summary, collect, candleColor}
}`)

export const entrySummaries = defineQuery(`*[_type == "entry" && season->year == $year && defined(date)] | order(date asc)${summary}`)

export const entryByDay = defineQuery(`*[_type == "entry" && season->year == $year && dayNumber == $day][0]${entryFull}`)

export const entryByDate = defineQuery(`*[_type == "entry" && date == $date][0]${entryFull}`)

export const entriesFull = defineQuery(`*[_type == "entry" && season->year == $year && defined(date)] | order(date asc)${entryFull}`)

const hymnFull = /* groq */ `{
  _id, title, "slug": slug.current, textAuthor, translator, textYear, tune, meter,
  stanzas[]{number, lines, refrain}, copyright, background, hymnaryUrl, defaultRecording,
  "entries": *[_type == "entry" && (hymn._ref == ^._id || secondaryHymn._ref == ^._id)] | order(date asc)${summary}
}`

export const hymnsWithEntries = defineQuery(`*[_type == "hymn" && defined(slug.current)] | order(title asc)${hymnFull}`)

export const hymnBySlug = defineQuery(`*[_type == "hymn" && slug.current == $slug][0]${hymnFull}`)
