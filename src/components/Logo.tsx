import Image from 'next/image'
import React from 'react'

function Logo({  width=30 , height=30}) {
  return (
    <div>
        <Image src='/images/Vector.png'  alt='logo' width={width} height={height}/>
    </div>
  )
}

export default Logo