import React from 'react'

const Banner = () => {
  return (
    <div className='w-full relative h-[80vh] overflow-hidden'>
      <video src='https://booksy-public.s3.amazonaws.com/horizontal_.webm'
      className='w-full h-full object-cover'
       muted
       autoPlay
        loop 
        playsInline
        autoFocus
        />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="textPart absolute flex flex-col items-center justify-center inset-0 text-white z-20 
        space-y-3 px-5">
            <h1 className="text-5xl font-bold">Be your self</h1>
            <p className='text-slate-400 text-2xl text-center font-semibold'>Discover and Book Beauty & wellness near you</p>

            <div className="relative mt-8">
                <input 
                    type="text" 
                    placeholder="Search salon services..." 
                    className='bg-white rounded-full py-4 w-[18rem] md:w-[35rem]
                    outline-none text-black px-8 shadow-2xl text-lg'
                />
                {/* You can add a Search Icon here later */}
            </div>
        </div>
    </div>
  )
}

export default Banner
