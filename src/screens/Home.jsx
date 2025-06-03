import React from 'react'

export default function Home({argbToHex, isDarkMode, md3Colors}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    > 
    <h1
      style={{
        color: argbToHex(md3Colors.primary),
      }}
    >Start searching and keep Vibing</h1>
    </div>
  )
}