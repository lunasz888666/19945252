'use client'
import React, { useState, useEffect } from "react"
import styles from './page.module.css'
import axios from "axios"
import { useRouter } from "next/navigation"

const MovieList = () => {
  const [itemsPerRow, setItemsPerRow] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)
  const [movies, setMovies] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState("")

  const itemsPerPage = itemsPerRow * 2

  const router = useRouter()
  useEffect(() => {
    // 只在客户端运行，获取 search 参数
    const params = new URLSearchParams(window.location.search)
    const search = params.get("search") || ""
    setSearchKeyword(search)
  }, [])

  useEffect(() => {
    const updateItemsPerRow = () => {
      const width = window.innerWidth
      if (width < 500) setItemsPerRow(1)
      else if (width < 768) setItemsPerRow(2)
      else if (width < 1024) setItemsPerRow(3)
      else if (width < 1280) setItemsPerRow(4)
      else setItemsPerRow(5)
    }

    updateItemsPerRow()
    window.addEventListener("resize", updateItemsPerRow)
    return () => window.removeEventListener("resize", updateItemsPerRow)
  }, [])

  const handleMovieClick = (movie: any) => {
    router.push(`/movies/${movie.slug}`)
  }

  const fetchMovies = async (pageNum: number) => {
    try {
      const params: any = {
        page: pageNum,
      }
      if (searchKeyword) {
        params.moviesnames = searchKeyword
      }

      const query = new URLSearchParams(params).toString()
      const response = await axios.get(`http://192.168.1.2:7899/movies?${query}`)

      setMovies(response.data.data)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error("获取电影数据失败：", error)
    }
  }

  useEffect(() => {
    fetchMovies(currentPage)
  }, [currentPage]) // 注意：searchKeyword 变化时也要重新拉取数据
  useEffect(() => {
    setCurrentPage(1)
    fetchMovies(currentPage)
  }, [searchKeyword])
  function removeDuplicateCategories(categoryStr: string) {
    let categories = categoryStr.split(",")
    categories.sort((a, b) => a.length - b.length)

    let uniqueCategories: string[] = []
    for (let cat of categories) {
      if (!uniqueCategories.some(existing => cat.includes(existing))) {
        uniqueCategories.push(cat)
      }
    }
    return uniqueCategories.join(",")
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.grid}
        style={{ gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)` }}
      >
        {movies.map((movie: any) => (
          <div key={movie.id} className={styles.item} onClick={() => handleMovieClick(movie)}>
            <div className={styles.poster}>
              <img src={movie.movecoverstupian} alt={movie.moviesnames} />
            </div>
            <div className={styles.desc}>
              <div className={styles.type}>评分：{movie.startpingfen}</div>
              <div className={styles.type}>{removeDuplicateCategories(movie.types)}</div>
              <p>{movie.moviesnames}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          上一页
        </button>
        <span>{currentPage} / {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
          下一页
        </button>
      </div>
    </div>
  )
}

export default MovieList
