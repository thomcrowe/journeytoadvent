// Season lineup for Advent 2026 (build plan §12). Used by the seed script and as
// the site's fallback content before Sanity is connected.
//
// Hymn metadata is a starting point: verify every text, author, and tune against
// Hymnary.org before publishing. Stanza texts are left for the author except
// where noted, so nothing copyrighted slips in.

export type CopyrightStatus = 'public-domain-worldwide' | 'public-domain-us-only' | 'licensed'

export interface LineupHymn {
  title: string
  textAuthor?: string
  translator?: string
  textYear?: string
  tune?: string
  meter?: string
  copyright?: CopyrightStatus
  copyrightNotes?: string
}

export interface LineupDay {
  day: number
  date: string // YYYY-MM-DD
  hymn: string // hymn title (key into HYMNS)
  label?: string
  antiphon?: { latin: string; english: string; emmanuelStanza: number }
}

export interface LineupWeek {
  number: 1 | 2 | 3 | 4
  title: string
  candleColor: 'blue' | 'violet' | 'rose'
  collect: { text: string; source: string }
}

export const SEASON_2026 = {
  year: 2026,
  title: 'Journey to Advent 2026',
  startDate: '2026-11-29',
  endDate: '2026-12-24',
  bonusDate: '2026-12-25',
}

export function slugify(title: string) {
  return title
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export const EMMANUEL = 'O Come, O Come, Emmanuel'

export const HYMNS: LineupHymn[] = [
  { title: 'Lo! He Comes with Clouds Descending', textAuthor: 'John Cennick; altered by Charles Wesley', textYear: '1752, 1758', tune: 'Helmsley', meter: '8.7.8.7.4.7' },
  { title: 'Wake, Awake, for Night Is Flying', textAuthor: 'Philipp Nicolai', translator: 'Catherine Winkworth', textYear: '1599; tr. 1858', tune: 'Wachet auf', meter: 'Irregular' },
  { title: 'People, Look East', textAuthor: 'Eleanor Farjeon', textYear: '1928', tune: 'Besançon', meter: '8.7.9.8.8.7', copyright: 'public-domain-us-only', copyrightNotes: 'Public domain in the US only (published 1928). Quote one stanza at most.' },
  { title: 'Crown Him with Many Crowns', textAuthor: 'Matthew Bridges; Godfrey Thring', textYear: '1851, 1874', tune: 'Diademata', meter: 'S.M.D.' },
  { title: 'It Came Upon the Midnight Clear', textAuthor: 'Edmund Hamilton Sears', textYear: '1849', tune: 'Carol', meter: 'C.M.D.' },
  { title: 'The King Shall Come When Morning Dawns', textAuthor: 'Greek hymn', translator: 'John Brownlie', textYear: 'tr. 1907', tune: 'Consolation', meter: 'C.M.' },
  { title: 'Joy to the World', textAuthor: 'Isaac Watts', textYear: '1719', tune: 'Antioch', meter: 'C.M. with repeats' },
  { title: 'Come, Thou Long-Expected Jesus', textAuthor: 'Charles Wesley', textYear: '1744', tune: 'Stuttgart', meter: '8.7.8.7' },
  { title: "On Jordan's Bank the Baptist's Cry", textAuthor: 'Charles Coffin', translator: 'John Chandler', textYear: '1736; tr. 1837', tune: 'Winchester New', meter: 'L.M.' },
  { title: 'Comfort, Comfort Ye My People', textAuthor: 'Johann Olearius', translator: 'Catherine Winkworth', textYear: '1671; tr. 1863', tune: 'Psalm 42', meter: '8.7.8.7.7.7.8.8' },
  { title: 'Lift Up Your Heads, Ye Mighty Gates', textAuthor: 'Georg Weissel', translator: 'Catherine Winkworth', textYear: '1642; tr. 1855', tune: 'Truro', meter: 'L.M.' },
  { title: 'Hark! the Herald Angels Sing', textAuthor: 'Charles Wesley; altered by George Whitefield', textYear: '1739, 1753', tune: 'Mendelssohn', meter: '7.7.7.7 D with refrain' },
  { title: 'Savior of the Nations, Come', textAuthor: 'Ambrose of Milan; German by Martin Luther', translator: 'William M. Reynolds', textYear: '4th c.; tr. 1851', tune: 'Nun komm, der Heiden Heiland', meter: '7.7.7.7' },
  { title: 'O Holy Night', textAuthor: 'Placide Cappeau', translator: 'John Sullivan Dwight', textYear: '1847; tr. 1855', tune: 'Cantique de Noël', meter: 'Irregular' },
  { title: 'Rejoice, the Lord Is King', textAuthor: 'Charles Wesley', textYear: '1744', tune: "Darwall's 148th", meter: '6.6.6.6.8.8' },
  { title: 'Love Divine, All Loves Excelling', textAuthor: 'Charles Wesley', textYear: '1747', tune: 'Hyfrydol', meter: '8.7.8.7 D' },
  { title: 'O Little Town of Bethlehem', textAuthor: 'Phillips Brooks', textYear: '1868', tune: 'St. Louis', meter: '8.6.8.6.7.6.8.6' },
  { title: 'In the Bleak Midwinter', textAuthor: 'Christina Rossetti', textYear: '1872', tune: 'Cranham', meter: 'Irregular' },
  { title: "Of the Father's Love Begotten", textAuthor: 'Aurelius Clemens Prudentius', translator: 'John Mason Neale and Henry W. Baker', textYear: '4th c.; tr. 1854, 1859', tune: 'Divinum mysterium', meter: '8.7.8.7.8.7.7' },
  { title: 'What Child Is This', textAuthor: 'William Chatterton Dix', textYear: '1865', tune: 'Greensleeves', meter: '8.7.8.7 with refrain' },
  { title: "Lo, How a Rose E'er Blooming", textAuthor: 'German, 15th century', translator: 'Theodore Baker', textYear: 'tr. 1894', tune: 'Es ist ein Ros', meter: '7.6.7.6.6.7.6' },
  { title: 'God Rest Ye Merry, Gentlemen', textAuthor: 'English traditional carol', textYear: '18th c.', tune: 'God Rest You Merry', meter: '8.6.8.6.8.6 with refrain' },
  { title: 'Silent Night', textAuthor: 'Joseph Mohr', translator: 'John Freeman Young', textYear: '1818; tr. 1859', tune: 'Stille Nacht', meter: 'Irregular' },
  { title: 'O Come, All Ye Faithful', textAuthor: 'John Francis Wade', translator: 'Frederick Oakeley', textYear: '1743; tr. 1841', tune: 'Adeste fideles', meter: 'Irregular with refrain' },
  { title: "Once in Royal David's City", textAuthor: 'Cecil Frances Alexander', textYear: '1848', tune: 'Irby', meter: '8.7.8.7.7.7' },
  { title: 'Let All Mortal Flesh Keep Silence', textAuthor: 'Liturgy of St. James', translator: 'Gerard Moultrie', textYear: 'tr. 1864', tune: 'Picardy', meter: '8.7.8.7.8.7' },
  { title: 'Angels We Have Heard on High', textAuthor: 'French carol', translator: 'James Chadwick', textYear: 'tr. 1862', tune: 'Gloria', meter: '7.7.7.7 with refrain' },
  { title: EMMANUEL, textAuthor: 'Latin, 12th century', translator: 'John Mason Neale', textYear: 'tr. 1851', tune: 'Veni, veni, Emmanuel', meter: '8.8.8.8.8.8' },
]

export const WEEKS: LineupWeek[] = [
  {
    number: 1,
    title: 'Keep Awake',
    candleColor: 'blue',
    collect: {
      text: 'Almighty God, give us grace to cast away the works of darkness, and put on the armor of light, now in the time of this mortal life in which your Son Jesus Christ came to visit us in great humility; that in the last day, when he shall come again in his glorious majesty to judge both the living and the dead, we may rise to the life immortal; through him who lives and reigns with you and the Holy Spirit, one God, now and for ever.',
      source: 'Collect for the First Sunday of Advent, BCP 1979',
    },
  },
  {
    number: 2,
    title: 'Prepare the Way',
    candleColor: 'blue',
    collect: {
      text: 'Merciful God, who sent your messengers the prophets to preach repentance and prepare the way for our salvation: Give us grace to heed their warnings and forsake our sins, that we may greet with joy the coming of Jesus Christ our Redeemer; who lives and reigns with you and the Holy Spirit, one God, now and for ever.',
      source: 'Collect for the Second Sunday of Advent, BCP 1979',
    },
  },
  {
    number: 3,
    title: 'Rejoice',
    candleColor: 'rose',
    collect: {
      text: 'Stir up your power, O Lord, and with great might come among us; and, because we are sorely hindered by our sins, let your bountiful grace and mercy speedily help and deliver us; through Jesus Christ our Lord, to whom, with you and the Holy Spirit, be honor and glory, now and for ever.',
      source: 'Collect for the Third Sunday of Advent, BCP 1979',
    },
  },
  {
    number: 4,
    title: 'God With Us',
    candleColor: 'blue',
    collect: {
      text: 'Purify our conscience, Almighty God, by your daily visitation, that your Son Jesus Christ, at his coming, may find in us a mansion prepared for himself; who lives and reigns with you, in the unity of the Holy Spirit, one God, now and for ever.',
      source: 'Collect for the Fourth Sunday of Advent, BCP 1979',
    },
  },
]

// Stanza numbers for O Come, O Come, Emmanuel follow The Hymnal 1982 order
// (1 Emmanuel, 2 Wisdom, 3 Adonai, 4 Root of Jesse, 5 Key of David, 6 Dayspring,
// 7 King of nations). Adjust if your text orders them differently.
export const DAYS: LineupDay[] = [
  { day: 1, date: '2026-11-29', hymn: 'Lo! He Comes with Clouds Descending', label: 'The First Sunday of Advent' },
  { day: 2, date: '2026-11-30', hymn: 'Wake, Awake, for Night Is Flying', label: 'Saint Andrew' },
  { day: 3, date: '2026-12-01', hymn: 'People, Look East' },
  { day: 4, date: '2026-12-02', hymn: 'Crown Him with Many Crowns' },
  { day: 5, date: '2026-12-03', hymn: 'It Came Upon the Midnight Clear' },
  { day: 6, date: '2026-12-04', hymn: 'The King Shall Come When Morning Dawns' },
  { day: 7, date: '2026-12-05', hymn: 'Joy to the World' },
  { day: 8, date: '2026-12-06', hymn: 'Come, Thou Long-Expected Jesus', label: 'The Second Sunday of Advent' },
  { day: 9, date: '2026-12-07', hymn: "On Jordan's Bank the Baptist's Cry" },
  { day: 10, date: '2026-12-08', hymn: 'Comfort, Comfort Ye My People' },
  { day: 11, date: '2026-12-09', hymn: 'Lift Up Your Heads, Ye Mighty Gates' },
  { day: 12, date: '2026-12-10', hymn: 'Hark! the Herald Angels Sing' },
  { day: 13, date: '2026-12-11', hymn: 'Savior of the Nations, Come' },
  { day: 14, date: '2026-12-12', hymn: 'O Holy Night' },
  { day: 15, date: '2026-12-13', hymn: 'Rejoice, the Lord Is King', label: 'The Third Sunday of Advent · Gaudete' },
  { day: 16, date: '2026-12-14', hymn: 'Love Divine, All Loves Excelling' },
  { day: 17, date: '2026-12-15', hymn: 'O Little Town of Bethlehem' },
  { day: 18, date: '2026-12-16', hymn: 'In the Bleak Midwinter' },
  {
    day: 19, date: '2026-12-17', hymn: "Of the Father's Love Begotten", label: 'O Sapientia',
    antiphon: {
      latin: 'O Sapientia, quae ex ore Altissimi prodiisti, attingens a fine usque ad finem, fortiter suaviterque disponens omnia: veni ad docendum nos viam prudentiae.',
      english: 'O Wisdom, who came forth from the mouth of the Most High, reaching from one end to the other, mightily and sweetly ordering all things: come and teach us the way of prudence.',
      emmanuelStanza: 2,
    },
  },
  {
    day: 20, date: '2026-12-18', hymn: 'What Child Is This', label: 'O Adonai',
    antiphon: {
      latin: 'O Adonai, et Dux domus Israel, qui Moysi in igne flammae rubi apparuisti, et ei in Sina legem dedisti: veni ad redimendum nos in brachio extento.',
      english: 'O Adonai, and leader of the house of Israel, who appeared to Moses in the fire of the burning bush and gave him the law on Sinai: come and redeem us with an outstretched arm.',
      emmanuelStanza: 3,
    },
  },
  {
    day: 21, date: '2026-12-19', hymn: "Lo, How a Rose E'er Blooming", label: 'O Radix Jesse',
    antiphon: {
      latin: 'O Radix Jesse, qui stas in signum populorum, super quem continebunt reges os suum, quem Gentes deprecabuntur: veni ad liberandum nos, jam noli tardare.',
      english: 'O Root of Jesse, standing as a sign among the peoples, before whom kings shall keep silence and to whom the nations shall make their prayer: come and deliver us, and delay no longer.',
      emmanuelStanza: 4,
    },
  },
  {
    day: 22, date: '2026-12-20', hymn: 'God Rest Ye Merry, Gentlemen', label: 'The Fourth Sunday of Advent · O Clavis David',
    antiphon: {
      latin: 'O Clavis David, et sceptrum domus Israel; qui aperis, et nemo claudit; claudis, et nemo aperit: veni, et educ vinctum de domo carceris, sedentem in tenebris, et umbra mortis.',
      english: 'O Key of David, and scepter of the house of Israel, who opens and no one shuts, who shuts and no one opens: come and lead the prisoner from the prison house, those who sit in darkness and the shadow of death.',
      emmanuelStanza: 5,
    },
  },
  {
    day: 23, date: '2026-12-21', hymn: 'Silent Night', label: 'O Oriens',
    antiphon: {
      latin: 'O Oriens, splendor lucis aeternae, et sol justitiae: veni, et illumina sedentes in tenebris, et umbra mortis.',
      english: 'O Dayspring, splendor of light everlasting and sun of righteousness: come and enlighten those who sit in darkness and the shadow of death.',
      emmanuelStanza: 6,
    },
  },
  {
    day: 24, date: '2026-12-22', hymn: 'O Come, All Ye Faithful', label: 'O Rex Gentium',
    antiphon: {
      latin: 'O Rex Gentium, et desideratus earum, lapisque angularis, qui facis utraque unum: veni, et salva hominem, quem de limo formasti.',
      english: 'O King of the nations and their desire, the cornerstone who makes both one: come and save the human race, which you fashioned from clay.',
      emmanuelStanza: 7,
    },
  },
  {
    day: 25, date: '2026-12-23', hymn: "Once in Royal David's City", label: 'O Emmanuel',
    antiphon: {
      latin: 'O Emmanuel, Rex et legifer noster, exspectatio Gentium, et Salvator earum: veni ad salvandum nos, Domine, Deus noster.',
      english: 'O Emmanuel, our King and our lawgiver, the hope of the nations and their Savior: come and save us, O Lord our God.',
      emmanuelStanza: 1,
    },
  },
  { day: 26, date: '2026-12-24', hymn: 'Let All Mortal Flesh Keep Silence', label: 'Christmas Eve' },
]

export const BONUS_DAY: LineupDay = { day: 27, date: '2026-12-25', hymn: 'Angels We Have Heard on High', label: 'Christmas Day' }

export function weekForDay(day: number): 1 | 2 | 3 | 4 {
  if (day <= 7) return 1
  if (day <= 14) return 2
  if (day <= 21) return 3
  return 4
}

export const ids = {
  season: (year: number) => `season-${year}`,
  week: (year: number, n: number) => `week-${year}-${n}`,
  entry: (year: number, day: number) => `entry-${year}-day-${day}`,
  hymn: (title: string) => `hymn-${slugify(title)}`,
}
