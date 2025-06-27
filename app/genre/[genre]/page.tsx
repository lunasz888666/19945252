// app/genre/[genre]/page.tsx

import { movies } from '@/lib/data'

// ✅ 定义组件的参数类型
interface Props {
  params: {
    genre: string
  }
}

// ✅ generateStaticParams：生成静态路径参数
export function generateStaticParams() {
  const genres = Array.from(new Set(movies.map((m) => m.genre)))
  return genres.map((genre) => ({ genre }))
}

// ✅ Page组件必须是同步函数，不要 async！
export default function Page({ params }: Props) {
  const genreMovies = movies.filter((m) => m.genre === params.genre)

  return (
    <main className="p-4">
      <h1 className="text-2xl mb-4">分类：{params.genre}</h1>
      <ul className="space-y-2">
        {genreMovies.map((m) => (
          <li key={m.slug}>
            <a href={`/movies/${m.slug}`} className="underline">
              {m.title}
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}
