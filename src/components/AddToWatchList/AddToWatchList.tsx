import { FC } from 'react'
import { BookmarkIcon } from '@heroicons/react/24/outline'

interface AddToWatchListProps {

}

const AddToWatchList: FC<AddToWatchListProps> = () => {
    return (
        <div>
            <button className='flex flex-row gap-2 justify-center items-center px-5 py-3 bg-bg-color text-text-color rounded-2xl font-bold text-xs sm:max-4xl:text-lg transition-all hover:bg-text-color hover:text-bg-color'>
                Add to Watch List
                <BookmarkIcon className='sm:max-4xl:w-6 sm:max-4xl:h-6 w-4 h-4' />
            </button>
        </div>
    )
}

export { AddToWatchList };