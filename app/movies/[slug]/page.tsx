import { notFound } from "next/navigation"
import Image from "next/image"
import HLSPlayer from '@/components/Player'

const API_BASE = process.env.API_BASE || "http://localhost:7899"

type Movie = {
  id: number
  slug: string
  title: string
  description: string
  poster: string
  director: string
  releaseDate: string

  moviesnames: string
  movecoverstupian: string
  msuburl: string
  startpingfen: any
  shangyingDate: string
  daoyan: string
  zhuyan: string
  types: string
  juqingdesc: string
}

async function fetchMovie(slugName: string): Promise<Movie | null> {
  const res = await fetch(`${API_BASE}/movies-slug?slug=${slugName}`, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) return null

  const data = await res.json()
  return Array.isArray(data) ? data[0] : data
}

export async function generateStaticParams() {
  const res = await fetch(`${API_BASE}/movies-all`, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) return []

  const movies: Movie[] = await res.json()
  return movies.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const movie = await fetchMovie(params.slug)

  if (!movie) return {}

  return {
    title: `${movie.title} - 免费公共领域电影`,
    description: movie.description,
    openGraph: {
      title: movie.title,
      description: movie.description,
      images: [movie.poster],
    },
  }
}
const StarRating = ({ score }: { score: number }) => {
  const maxStars = 5;

  const fullStars = Math.max(0, Math.floor(score / 2)); // 防止负值
  const hasHalfStar = score % 2 >= 1;
  const emptyStars = Math.max(0, maxStars - fullStars - (hasHalfStar ? 1 : 0)); // 防止负值

  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {/* 完整星星 */}
      {"★".repeat(fullStars).split("").map((_, i) => (
        <span key={`full-${i}`} style={{ color: "#f99b01", fontSize: "18px" }}>★</span>
      ))}
      {/* 半星 */}
      {hasHalfStar && <span style={{ color: "#f99b01", fontSize: "18px" }}>☆</span>}
      {/* 空星 */}
      {"☆".repeat(emptyStars).split("").map((_, i) => (
        <span key={`empty-${i}`} style={{ color: "#f99b01", fontSize: "18px" }}>☆</span>
      ))}
    </div>
  );
}

export default async function Page({ params }: { params: { slug: string } }) {
  const movie = await fetchMovie(params.slug)

  if (!movie) return notFound()

  return (
    <main className="max-w-7xl mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-extrabold text-gray-900">{movie.title}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* 左侧海报和详情 */}
        <div className="md:w-1/3 flex flex-col items-center">
          <Image
            src={movie.movecoverstupian}
            alt={movie.moviesnames}
            width={400}
            height={600}
            className="rounded-lg shadow-lg"
          />
          <div className="mt-4 text-center space-y-2 text-gray-700">
            <div className="movie-description-container__starts">
              <StarRating score={parseFloat(movie.startpingfen || 0)} />
              <div style={{ marginLeft: "4px" }}>{
                movie.startpingfen == '0.0' ?
                  "暂无评分"
                  :
                  movie.startpingfen
              }</div>
            </div>
            <p><span className="font-semibold">片名：</span>{movie.moviesnames}</p>
            <p><span className="font-semibold">导演：</span>{movie.daoyan}</p>
            <p><span className="font-semibold">演员：</span>{movie.zhuyan}</p>
            <p><span className="font-semibold">类型</span>{movie.types.replace(/,/g, " / ")}</p>
            <p><span className="font-semibold">上映时间：</span>{movie.shangyingDate?.split("T")[0]}</p>
            <p><span className="font-semibold">简介</span>{movie.juqingdesc}</p>
          </div>
        </div>

        {/* 右侧播放器和简介 */}
        <div className="md:w-2/3 flex flex-col space-y-6">
          <div className="w-full rounded-lg overflow-hidden shadow-lg">
            <HLSPlayer src={`${movie.msuburl}/index.m3u8`} />
          </div>
          <p className="text-gray-800 leading-relaxed">{movie.description}</p>
        </div>
      </div>

      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Movie",
            name: movie.moviesnames,
            datePublished: movie.releaseDate,
            director: {
              "@type": "Person",
              name: movie.director,
            },
            description: movie.description,
            image: movie.poster,
          }),
        }}
      />
    </main>
  )
}
