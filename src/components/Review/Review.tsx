import { FC, useState } from 'react'
import { Review } from '../../interfaces/interfaces';
import { HandThumbDownIcon, HandThumbUpIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';


interface ReviewProps {
    review: Review
    isEditable?: boolean
    handleToggleEditing?: (review: Review) => void
}

const Review: FC<ReviewProps> = (props) => {

    const [isLikeSelected, setIsLikeSelected] = useState<boolean>()
    const [isDislikeSelected, setIsDislikeSelected] = useState<boolean>()
    const { review, isEditable, handleToggleEditing } = props

    const handleLikeOrDislike = (index: number) => {
        switch (index) {
            case 0:
                if (isLikeSelected) {
                    setIsLikeSelected(false)
                } else {
                    setIsLikeSelected(true)
                    setIsDislikeSelected(false)
                }
                break;
            case 1:
                if (isDislikeSelected) {
                    setIsDislikeSelected(false)
                } else {
                    setIsDislikeSelected(true)
                    setIsLikeSelected(false)
                }
                break;
        }
    }

    const handleDeleteReview = async () => {
        try {
            const reviewsCollectionRef = collection(db, 'reviews');
            await deleteDoc(doc(reviewsCollectionRef, review.reviewId));
            console.log('Review deleted from Firestore successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Error deleting review from Firestore:', error);
        }
    };

    return (
        <div className='flex flex-col gap-4 justify-start items-start'>
            <div className='flex flex-row gap-2 justify-start items-center'>
                <div className='w-4 h-4 rounded-full bg-[#e0e0e0]' />
                <p className='font-bold'>{review.author ? review.author : review.userName}</p>
                <span className="text-gradient">
                    <svg xmlns="http://www.w3.org/2000/svg" fill='none' viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 sm:max-4xl:w-6 sm:max-4xl:h-6">
                        <linearGradient id="gradient">
                            <stop className="main-stop" offset="0%" />
                            <stop className="alt-stop" offset="100%" />
                        </linearGradient>
                        <path stroke='url(#gradient)' strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                </span>
                <p className='font-bold text-xs sm:max-4xl:text-base text-text-color/50'>
                    {review.author_details ? review.author_details.rating : review.reviewRating}
                </p>
            </div>
            <div>
                <p className='text-xs md:max-4xl:text-base md:max-4xl:w-[80ch]'>{review.content ? review.content.slice(0, 200) : review.reviewContent}{review.content?.length! > 200 ? "..." : ""}{review.reviewContent?.length! > 200 ? "..." : ""}</p>
            </div>
            <div className='flex flex-row gap-2 flex-wrap'>
                <button onClick={() => handleLikeOrDislike(0)} className={`shadow-sm shadow-zinc-500 flex flex-row gap-2 justify-center items-center px-5 py-1 sm:max-4xl:py-2 bg-button-primary-color text-bg-color rounded-2xl font-bold text-[10px] sm:max-4xl:text-sm transition-all ${isLikeSelected ? "bg-green-500" : "hover:bg-accent-color hover:text-text-color"}`}>
                    <HandThumbUpIcon className='w-3 h-3 sm:max-4xl:w-4 sm:max-4xl:h-4' />
                </button>
                <button onClick={() => handleLikeOrDislike(1)} className={`shadow-sm shadow-zinc-500 flex flex-row gap-2 justify-center items-center px-5 py-1 sm:max-4xl:py-2 bg-white text-text-color rounded-2xl font-bold text-[10px] sm:max-4xl:text-sm transition-all ${isDislikeSelected ? "bg-red-500" : "hover:bg-accent-color hover:text-text-color"}`}>
                    <HandThumbDownIcon className='w-3 h-3 sm:max-4xl:w-4 sm:max-4xl:h-4' />
                </button>
                {!isEditable && <button className=' flex flex-row gap-2 justify-center items-center px-5 py-1 sm:max-4xl:py-2 bg-accent-color text-text-color rounded-2xl font-bold text-[10px] sm:max-4xl:text-sm transition-all hover:bg-white hover:shadow-sm hover:shadow-zinc-500 hover:text-text-color'>
                    Reply
                </button>}
                {isEditable &&
                    <>
                        <button onClick={() => handleToggleEditing ? handleToggleEditing(review) : ""} className={`shadow-sm shadow-zinc-500 flex flex-row gap-2 justify-center items-center px-5 py-1 sm:max-4xl:py-2 bg-white text-text-color rounded-2xl font-bold text-[10px] sm:max-4xl:text-sm transition-all`}>
                            Edit
                            <PencilSquareIcon className='w-3 h-3 sm:max-4xl:w-4 sm:max-4xl:h-4' />
                        </button>
                        <button onClick={handleDeleteReview} className={`shadow-sm shadow-zinc-500 flex flex-row gap-2 justify-center items-center px-5 py-1 sm:max-4xl:py-2 bg-red-500 text-bg-color rounded-2xl font-bold text-[10px] sm:max-4xl:text-sm transition-all`}>
                            <TrashIcon className='w-3 h-3 sm:max-4xl:w-4 sm:max-4xl:h-4' />
                        </button>
                    </>}

            </div>
        </div>
    )
}

export { Review };