import { load } from "cheerio"
import { mkdir, writeFile } from "node:fs/promises"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const URL = "https://ufla.br/cursos"

interface ScrapedCourse {
  id: string
  name: string
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

async function main() {
  console.log(`Fetching ${URL}...`)
  const res = await fetch(URL)

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`)
  }

  const html = await res.text()
  const $ = load(html)

  const courses: ScrapedCourse[] = []
  const seen = new Set<string>()

  $("li.course-item").each((_, el) => {
    const h3 = $(el).find("h3")
    const name = h3.text().trim()
    if (!name) return
    if (name.includes("Paraíso")) return

    const id = slugify(name)
    if (seen.has(id)) return
    seen.add(id)

    courses.push({ id, name })
  })

  console.log(`Found ${courses.length} courses`)

  const scriptDir = dirname(fileURLToPath(import.meta.url))
  const dataDir = join(scriptDir, "..", "data")
  await mkdir(dataDir, { recursive: true })

  const outPath = join(dataDir, "courses.json")
  await writeFile(outPath, JSON.stringify(courses, null, 2), "utf-8")

  console.log(`Written to ${outPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
