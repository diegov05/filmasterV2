import React, { FC, useState } from 'react'
import { Movie } from '../../interfaces/interfaces';

interface MoviePosterProps {
    movie: Movie
}

const MoviePoster: FC<MoviePosterProps> = (props) => {

    const movie = props.movie

    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isShowing, setIsShowing] = useState<boolean>(false);

    const handleToggleOverlay = () => {
        if (isShowing) {
            setIsFocused(false)
            setTimeout(() => {
                setIsShowing(false)
            }, 500)
            return
        }
        setIsFocused(true)
        setIsShowing(true)
    }


    return (
        <div onMouseEnter={handleToggleOverlay} onMouseLeave={handleToggleOverlay} className='cursor-pointer w-48 md:max-4xl:w-64 h-full'>
            {isShowing && <div className={`flex flex-col justify-start items-start p-4 absolute slide-in-fwd-center ${!isFocused ? "slide-out-bck-center" : ""} w-48 md:max-4xl:w-64 bg-gradient-to-b from-black/40 h-72 md:max-4xl:h-96 rounded-2xl gap-2 `}>
                <span className="text-gradient">
                    <svg xmlns="http://www.w3.org/2000/svg" fill='none' viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                        <linearGradient id="gradient">
                            <stop className="main-stop" offset="0%" />
                            <stop className="alt-stop" offset="100%" />
                        </linearGradient>
                        <path stroke='url(#gradient)' strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                </span>
            </div>}
            <img className='transition-all duration-500 w-48 md:max-4xl:w-64 rounded-2xl shadow-lg shadow-zinc-600' src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt="" />
        </div>
    )
}

export { MoviePoster };