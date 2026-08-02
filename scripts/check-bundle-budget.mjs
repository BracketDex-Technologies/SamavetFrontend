import { readdir, readFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'

const assetsDirectory = new URL('../dist/assets/', import.meta.url)
const files = await readdir(assetsDirectory)
const assets = await Promise.all(
  files
    .filter((file) => file.endsWith('.js') || file.endsWith('.css'))
    .map(async (file) => {
      const body = await readFile(new URL(file, assetsDirectory))
      return { file, gzipBytes: gzipSync(body).byteLength, rawBytes: body.byteLength }
    }),
)

const totals = assets.reduce(
  (result, asset) => {
    const type = asset.file.endsWith('.css') ? 'css' : 'js'
    result[type] += asset.gzipBytes
    return result
  },
  { css: 0, js: 0 },
)
const budgets = { css: 35 * 1024, js: 140 * 1024 }
const failures = Object.entries(budgets).filter(([type, limit]) => totals[type] > limit)

for (const asset of assets.sort((left, right) => right.gzipBytes - left.gzipBytes)) {
  console.log(`${asset.file}: ${(asset.rawBytes / 1024).toFixed(1)} KB raw, ${(asset.gzipBytes / 1024).toFixed(1)} KB gzip`)
}
console.log(`Bundle totals: ${(totals.js / 1024).toFixed(1)} KB JS gzip, ${(totals.css / 1024).toFixed(1)} KB CSS gzip`)

if (failures.length > 0) {
  throw new Error(
    `Bundle budget exceeded: ${failures.map(([type, limit]) => `${type.toUpperCase()} > ${limit / 1024} KB gzip`).join(', ')}`,
  )
}
