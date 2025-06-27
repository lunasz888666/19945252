'use client'

import Link from 'next/link'
import { Input } from 'antd'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import '@/style/Navbar.css'

const Navbar = () => {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')

  const enterSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      const keyword = searchValue.trim()
      if (keyword) {
        router.push(`/?search=${encodeURIComponent(keyword)}`)
      }
    }
  }

  return (
    <nav className="navbar shadow-md">
      <div className="navbar-container flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="logo text-2xl font-bold text-blue-600">
          蛋蛋影视
        </Link>
        <ul className="nav-links flex gap-6 items-center">
          <li>
            <Link href="/" className="hover:text-blue-500">电影</Link>
          </li>
          <li>
            <Input
              placeholder="搜索电影..."
              style={{ width: 200 }}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={enterSearch}
            />
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
