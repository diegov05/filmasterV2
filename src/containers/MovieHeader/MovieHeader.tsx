import { FC, useContext, useEffect, useState } from 'react'
import { Movie } from '../../interfaces/interfaces';
import { AddToWatchList, Loading, NavBar, SearchBar } from '../../components';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/20/solid'
import { useNavigate } from 'react-router-dom';
import images from "../../assets"
import { AuthContext } from '../../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { VideoCameraIcon } from '@heroicons/react/24/outline';

interface MovieHeaderProps {
    movie: Movie
    handleMenuToggle: () => void
}

const MovieHeader: FC<MovieHeaderProps> = (props) => {

    const { movie, handleMenuToggle } = props
    const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
    const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
    const [isSearchToggled, setIsSearchToggled] = useState<boolean>(false);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const user = useContext(AuthContext)
    const navigate = useNavigate()

    const handleToggleMenu = () => {
        if (isMenuVisible) {
            setIsMenuToggled(false)
            handleMenuToggle()
            setTimeout(() => {
                setIsMenuVisible(false)
            }, 500)
            return
        }
        handleMenuToggle()
        setIsMenuToggled(true)
        setIsMenuVisible(true)
    }

    const handleToggleSearch = () => {
        if (isSearching) {
            setIsSearchToggled(false)
            setTimeout(() => {
                setIsSearching(false)
            }, 500)
            return
        }
        setIsSearchToggled(true)
        setIsSearching(true)
    }

    if (!movie) {
        return (
            <div className='w-full h-screen flex flex-col justify-center items-center'>
                <Loading />
            </div>
        )
    }

    return (
        <div className='slide-in-fwd-center'>
            <div className='absolute s:max-4xl:backdrop-blur-md bg-gradient-to-tr from-black flex flex-col justify-between w-full h-full p-10' />
            {isMenuVisible &&
                <div className={`sm:max-4xl:hidden slide-in-top ${!isMenuToggled ? "slide-out-top" : ""} absolute z-50 w-screen h-screen bg-zinc-800 flex flex-col gap-20 p-10`}>
                    <img className='absolute -z-10 -top-36 -left-48' src={images.gradient} alt="" />
                    <div className='flex flex-row justify-between items-center'>
                        <div className='w-max'>
                            <h1 className='w-max font-bold text-2xl pb-4 text-bg-color'>Menu</h1>
                            <div className='w-20 h-1 bg-gradient' />
                        </div>
                        <button onClick={handleToggleMenu} className='sm:max-4xl:hidden bg-bg-color p-2 h-min rounded-xl flex flex-col justify-center items-center'>
                            <XMarkIcon className='w-4 h-4 text-text-color' />
                        </button>
                    </div>
                    <div className='flex flex-col justify-center items-start gap-10'>
                        <button onClick={handleToggleSearch} className='w-full'>
                            <h1 className='w-max font-bold text-xl pb-4 text-bg-color'>Search</h1>
                            <div className='h-0.5 bg-zinc-700' />
                        </button>
                        {user && (
                            <>
                                <button onClick={() => {
                                    signOut(auth)
                                    navigate('/login')
                                }} className='w-full'>
                                    <h1 className='w-max font-bold text-xl pb-4 text-bg-color'>Sign Out</h1>
                                    <div className='h-0.5 bg-zinc-700' />
                                </button>
                                <div className='w-max'>
                                    <h1 className='w-[25ch] xs:max-4xl:w-max font-light text-base pb-4 text-zinc-500'>Logged In As: {user.email}</h1>
                                    <div className='h-0.5 bg-zinc-700' />
                                </div>
                            </>
                        )}
                        {!user &&
                            <>
                                <button onClick={() => navigate('/login')} className='w-full'>
                                    <h1 className='w-max font-bold text-xl pb-4 text-bg-color'>Sign In</h1>
                                    <div className='h-0.5 bg-zinc-700' />
                                </button>
                                <button onClick={() => { navigate('/register') }} className='w-full'>
                                    <h1 className='w-max font-bold text-xl pb-4 text-bg-color'>Register</h1>
                                    <div className='h-0.5 bg-zinc-700' />
                                </button>
                            </>
                        }
                        <img onClick={() => navigate('/')} className='cursor-pointer w-24' src={images.logoWhite} alt="" />
                    </div>
                </div>
            }
            {isSearching && (
                <div className={`sm:max-4xl:hidden slide-in-bottom ${!isSearchToggled ? "slide-out-bottom" : ""} absolute z-50 w-screen h-screen bg-bg-color flex flex-col gap-20 p-10`}>
                    <img className='absolute -z-10 -top-36 -left-48' src={images.gradient} alt="" />
                    <div className='flex flex-row justify-between items-center'>
                        <div className='w-max'>
                            <h1 className='w-max font-bold text-2xl pb-4 text-text-color'>Search</h1>
                            <div className='w-20 h-1 bg-gradient' />
                        </div>
                        <button onClick={handleToggleSearch} className='sm:max-4xl:hidden bg-bg-color p-2 h-min rounded-xl flex flex-col justify-center items-center'>
                            <XMarkIcon className='w-4 h-4 text-text-color' />
                        </button>
                    </div>
                    <SearchBar handleToggleMenu={handleToggleMenu} handleToggleSearch={handleToggleSearch} />
                </div>
            )}
            <div className='absolute flex flex-col justify-between w-full h-full p-10'>
                <div className='flex flew-row w-full justify-between'>
                    <NavBar />
                    <button onClick={handleToggleMenu} className='sm:max-4xl:hidden bg-bg-color p-2 rounded-xl flex flex-col justify-center items-center'>
                        <Bars3Icon className='w-4 h-4 text-text-color' />
                    </button>
                </div>
                <div className='flex flex-row gap-4 justify-start items-start s:max-4xl:items-end'>

                    <img className="hidden s:max-4xl:block w-36 rounded-2xl" src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt="" />

                    <div className='flex flex-col gap-6'>
                        <div>
                            <h1 className='font-black text-2xl xs:max-sm:text-3xl sm:max-4xl:text-5xl text-bg-color'>{movie.title ? movie.title : movie.name}</h1>
                        </div>
                        <div className='flex-col items-start flex xs:max-4xl:flex-row gap-4 justify-start xs:max-4xl:items-center'>
                            {/* <button className='flex flex-row gap-2 justify-center items-center px-5 py-3 bg-button-primary-color text-bg-color rounded-2xl font-bold text-xs sm:max-4xl:text-lg transition-all hover:bg-accent-color hover:text-text-color'>
                                Watch
                                <VideoCameraIcon className='sm:max-4xl:w-6 sm:max-4xl:h-6 w-4 h-4' />
                            </button> */}
                            <AddToWatchList movie={movie} type='button' />
                        </div>
                    </div>
                </div>
            </div>
            <img className='w-full h-[70vh] object-cover' src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} alt={movie.title} />
        </div>
    )
}

export { MovieHeader };