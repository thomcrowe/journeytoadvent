/**
 * Seeds Sanity with the 2026 season: the season, four weeks, every hymn in the
 * lineup, and all 26 daily entries (empty, ready for the author to fill in).
 * Then applies the written weeks in content/seed (e.g. week-1.ts) on top.
 *
 *   npm run seed                 # write to Sanity
 *   npm run seed -- --dry-run    # print what would be written
 *   npm run seed -- --bonus      # also create Day 27 (Christmas Day)
 *
 * Re-runnable: IDs are deterministic. Calendar documents are only created if
 * missing, so edits made in the Studio are never overwritten. Markdown content
 * does overwrite the fields it contains (reflection, quote, question, scripture).
 * The Studio's "Load content" tool runs the same plan but only fills empty fields.
 */
import { createClient } from '@sanity/client'
import { buildSeedPlan } from '../lib/seed-plan'

const args = new Set(process.argv.slice(2))
const dryRun = args.has('--dry-run')
const bonus = args.has('--bonus')

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!dryRun && (!projectId || !token)) {
  console.error('Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN (e.g. in .env.local), or pass --dry-run.')
  process.exit(1)
}

const { creates, patches, log } = buildSeedPlan({ bonus })
for (const line of log) console.log(line)

async function main() {
  console.log(`\n${creates.length} calendar documents, ${patches.length} content patches${dryRun ? ' (dry run)' : ''}`)
  if (dryRun) return
  const client = createClient({ projectId, dataset, token, apiVersion: '2026-10-01', useCdn: false })
  const tx = client.transaction()
  for (const doc of creates) tx.createIfNotExists(doc)
  for (const p of patches) {
    tx.patch(p.id, (patch) => {
      let q = patch
      if (p.setIfMissing) q = q.setIfMissing(p.setIfMissing)
      if (p.set && Object.keys(p.set).length) q = q.set(p.set)
      return q
    })
  }
  const res = await tx.commit({ visibility: 'sync' })
  console.log(`Done. Transaction ${res.transactionId}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
