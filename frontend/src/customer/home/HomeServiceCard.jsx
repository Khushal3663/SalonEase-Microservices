import React from 'react'

const HomeServiceCard = ({item}) => {
  return (
    <div className='flex jsutify-center items-center flex-col gap-4 rounded-lg p-5
    bg-slate-100 w-32 h-48'>
      <img src={item.img}
      className='w-20 h-20 rounded-full' alt="" />
      <h1 className='text-center'>{item.name}</h1>
    </div>
  )
}

export default HomeServiceCard
