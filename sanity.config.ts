'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { visionTool } from '@sanity/vision'
import { apiVersion, dataset, projectId, studioUrl } from './sanity/env'
import { schemaTypes } from './sanity/schemaTypes'
import { structure } from './sanity/structure'
import { resolve } from './sanity/presentation'
import { loadContentTool } from './sanity/load-content-tool'

export default defineConfig({
  name: 'journey-to-advent',
  title: 'Journey to Advent',
  basePath: studioUrl,
  projectId: projectId || 'missing',
  dataset,
  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev,
      {
        id: 'week-in-season',
        title: 'Week in season',
        schemaType: 'week',
        parameters: [{ name: 'seasonId', type: 'string' }],
        value: ({ seasonId }: { seasonId: string }) => ({ season: { _type: 'reference', _ref: seasonId } }),
      },
    ],
  },
  plugins: [
    structureTool({ structure }),
    presentationTool({
      resolve,
      previewUrl: { previewMode: { enable: '/api/draft-mode/enable', disable: '/api/draft-mode/disable' } },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  tools: (prev) => [...prev, loadContentTool],
})
