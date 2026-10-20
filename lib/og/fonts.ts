import 'server-only'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export async function ogFonts() {
  const [medium, italic] = await Promise.all([
    readFile(join(process.cwd(), 'assets/fonts/EBGaramond-Medium.ttf')),
    readFile(join(process.cwd(), 'assets/fonts/EBGaramond-Italic.ttf')),
  ])
  return [
    { name: 'EB Garamond', data: medium, style: 'normal' as const, weight: 500 as const },
    { name: 'EB Garamond', data: italic, style: 'italic' as const, weight: 400 as const },
  ]
}
