import { FC, useEffect, useRef, useState } from 'react'
import { Movie } from '../../interfaces/interfaces'
import { requests } from '../../requests'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { Loading, MoviePoster } from '../../components'
import images from "../../assets"
import "./Carousel.css"
import axios from 'axios'

interface CarouselProps {
    content: string
}

const Carousel: FC<CarouselProps> = (props) => {

    const [shows, setShows] = useState<Movie[]>([])
    const [showLeftArrow, setShowLeftArrow] = useState<boolean>(false);
    const content = props.content

    const containerRef = useRef<HTMLDivElement>(null);

    const handleLeftClick = () => {
        containerRef.current?.scrollBy({
            left: -400,
            behavior: "smooth",
        });
    };

    const handleRightClick = () => {
        containerRef.current?.scrollBy({
            left: 400,
            behavior: "smooth",
        });
    }

    useEffect(() => {
        switch (content) {
            case "movies":
                axios.get(requests.popularMoviesRequest).then((response) => {
                    setShows(response.data.results);
                })

                break;
            case "series":
                axios.get(requests.popularSeriesRequest).then((response) => {
                    setShows(response.data.results);
                })
                break;
        }
    }, [])

    if (!shows) {
        return (
            <div className='w-full h-screen flex flex-col justify-center items-center'>
                <Loading />
            </div>
        )
    }

    return (
        <div className='pl-10 sm:max-4xl:pr-10'>
            <img className='absolute -z-10 top-[25rem] -left-60 opacity-40 rounded-2xl' src={images.gradient} />
            {content === "movies" && (
                <div className='slide-in-fwd-center flex flex-col gap-4 s:max-md:gap-8 md:max-4xl:gap-16'>
                    <div className='w-max'>
                        <h1 className='w-max font-bold text-2xl xs:max-sm:text-3xl sm:max-4xl:text-4xl pb-4 text-text-color'>Movies</h1>
                        <div className='w-full h-1 bg-gradient' />
                    </div>
                    <div className="relative flex items-center justify-start overflow-x-auto">
                        <div className="flex flex-col items-start">
                            <div ref={containerRef} className="carousel flex overflow-x-visible gap-4 sm:max-4xl:gap-12 pb-10">
                                {shows.map((show) => (
                                    <MoviePoster key={show.id} movie={show} />
                                ))}
                            </div>
                        </div>
                        <button
                            className="px-2 py-1"
                            onClick={handleRightClick}
                        >
                            <ChevronRightIcon className="hidden sm:max-4xl:block w-8 h-8" />
                        </button>
                    </div>
                </div>
            )}
            {content === "series" && (
                <div className='flex flex-col gap-4 s:max-md:gap-8 md:max-4xl:gap-16'>
                    <div className='w-max'>
                        <h1 className='w-max font-bold text-2xl xs:max-sm:text-3xl sm:max-4xl:text-4xl pb-4 text-text-color'>Series</h1>
                        <div className='w-full h-1 bg-gradient' />
                    </div>
                    <div className="relative flex items-center justify-start overflow-x-auto">
                        <div className="flex items-start">
                            <div ref={containerRef} className="carousel flex overflow-x-visible gap-4 sm:max-4xl:gap-12 pb-10 scroll-snap-x-mandatory snap-center">
                                {shows.map((show) => (
                                    <MoviePoster key={show.id} movie={show} />
                                ))}
                            </div>
                        </div>
                        <button
                            className="px-2 py-1"
                            onClick={handleRightClick}
                        >
                            <ChevronRightIcon className="hidden sm:max-4xl:block w-8 h-8" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export { Carousel };