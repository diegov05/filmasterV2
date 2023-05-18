import { FC, useContext, useState } from 'react'
import images from "../../assets"
import { SearchBar } from '../SearchBar/SearchBar'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { UserIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'

interface NavBarProps {

}

const NavBar: FC<NavBarProps> = () => {

    const navigate = useNavigate()
    const user = useContext(AuthContext)
    const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
    const [isToggled, setIsToggled] = useState<boolean>(false);

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

    return (
        <div className='flex flex-row w-full justify-between items-center'>
            <div>
                <img className='w-28 md:max-4xl:w-36' src={images.logoWhite} alt="logo" />
            </div>
            <div className='hidden sm:max-4xl:flex flex-row justify-end items-center gap-4'>
                <SearchBar />
                {!user &&
                    <>
                        <button onClick={() => navigate('/login')} className='sm:max-4xl:px-5 sm:max-4xl:py-3 text-xs font-bold bg-button-primary-color text-bg-color rounded-2xl transition-all hover:bg-accent-color hover:text-text-color'>Sign In</button>
                        <button onClick={() => navigate('/register')} className='sm:max-4xl:px-5 sm:max-4xl:py-3 text-xs font-bold bg-bg-color text-text-color rounded-2xl transition-all hover:bg-accent-color'>Register</button>
                    </>}
                {user && (
                    <>
                        <div className='relative'>
                            {isMenuVisible &&
                                <div className={`slide-in-fwd-center ${!isToggled ? "slide-out-bck-center" : ""} absolute w-28 top-14 right-0 rounded-2xl bg-bg-color flex flex-col justify-center items-center`}>
                                    <div className='w-full px-4 py-4 border-b flex justify-center items-center font-medium cursor-pointer transition-all hover:bg-accent-color rounded-t-2xl'>Watch List</div>
                                    <div onClick={() => {
                                        signOut(auth)
                                        navigate('/login')
                                    }} className='w-full px-4 py-4 flex justify-center items-center font-medium cursor-pointer transition-all hover:bg-accent-color rounded-b-2xl'>Sign Out</div>
                                </div>
                            }
                            <button onClick={handleToggleMenu} className='px-5 py-3 bg-bg-color rounded-2xl flex flex-row justify-between items-center text-text-color transition-all hover:bg-accent-color gap-3'>
                                <UserIcon className='w-4 h-4' />
                                <ChevronDownIcon className='w-4 h-4' />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div >
    )
}

export { NavBar };