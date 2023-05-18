import { FC, useContext, useEffect, useState } from 'react'
import { Movie } from '../../interfaces/interfaces';
import { key } from '../../requests';
import axios from "axios"
import { Loading, NavBar } from '../../components';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/20/solid'
import { useNavigate } from 'react-router-dom';
import images from "../../assets"
import { AuthContext } from '../../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
interface HeaderProps {

}

const Header: FC<HeaderProps> = () => {

    const [movie, setMovie] = useState<Movie | null>(null);
    const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
    const [isToggled, setIsToggled] = useState<boolean>(false);
    const user = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/discover/movie?api_key=${key}&without_genres=27,14`
                );
                const data = response.data

                const randomIndex = Math.floor(Math.random() * data.results.length);
                const randomMovieId = data.results[randomIndex].id;

                const movieResponse = await axios.get(
                    `https://api.themoviedb.org/3/movie/${randomMovieId}?api_key=${key}`
                );
                const movieData = movieResponse.data
                setMovie(movieData)
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);

    const handleToggleMenu = () => {
        if (isMenuVisible) {
            setIsToggled(false)
            setTimeout(() => {
                setIsMenuVisible(false)
            }, 500)
            return
        }
        setIsToggled(true)
        setIsMenuVisible(true)
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
            <div className='absolute bg-gradient-to-tr from-black flex flex-col justify-between w-full h-full p-10' />
            {isMenuVisible &&
                <div className={`sm:max-4xl:hidden slide-in-top ${!isToggled ? "slide-out-top" : ""} absolute z-50 w-screen h-screen bg-zinc-800 flex flex-col gap-20 p-10`}>
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
                        <button onClick={() => { }} className='w-full'>
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
                        <img className='w-24' src={images.logoWhite} alt="" />
                    </div>
                </div>
            }
            <div className='absolute flex flex-col justify-between w-full h-full p-10'>
                <div className='flex flew-row w-full justify-between'>
                    <NavBar />
                    <button onClick={handleToggleMenu} className='sm:max-4xl:hidden bg-bg-color p-2 rounded-xl flex flex-col justify-center items-center'>
                        <Bars3Icon className='w-4 h-4 text-text-color' />
                    </button>
                </div>

            </div>
            <img className='w-full h-[70vh] object-cover' src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} alt={movie.title} />
        </div>
    )
}

export { Header };