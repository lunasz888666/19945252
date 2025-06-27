export type Movie = {
  slug: string
  title: string
  description: string
  releaseDate: string
  director: string
  genre: string
  poster: string
}

export const movies: Movie[] = [
  {
    slug: "citizen-kane-1941",
    title: "Citizen Kane",
    description: "A newspaper tycoon's rise and fall.",
    releaseDate: "1941-05-01",
    director: "Orson Welles",
    genre: "drama",
    poster: "/citizen-kane.jpg",
  },
  // 更多假数据...
]
