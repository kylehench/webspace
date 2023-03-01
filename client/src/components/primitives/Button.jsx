import React from 'react'

const Button = ({ color, onClick, children }) => {
  // see tailwind.config.js for color set
  const colorVariants = {
    blue: 'bg-blue4 text-blue11 hover:bg-blue5 focus:shadow-blue7',
    gray: 'bg-gray4 text-gray11 hover:bg-gray5 focus:shadow-gray7',
    green: 'bg-green4 text-green11 hover:bg-green5 focus:shadow-green7',
    red: 'bg-red4 text-red11 hover:bg-red5 focus:shadow-red7',
  }
  
  return (
    <button className={`inline-flex items-center justify-center rounded px-[15px] text-[15px] leading-none font-medium h-[35px] focus:shadow-[0_0_0_2px] outline-none cursor-default ${colorVariants[color || 'green']}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button