import { FC } from 'react'
import { Movie } from '../../interfaces/interfaces';
import { Review } from '../../components';

interface ReviewsProps {
    movie: Movie
}

const Reviews: FC<ReviewsProps> = (props) => {

    const { movie } = props

    return (
        <div className='pr-10 flex flex-col gap-8'>
            <div className='w-max'>
                <h1 className='w-max font-bold text-2xl xs:max-sm:text-3xl sm:max-4xl:text-4xl pb-4 text-text-color'>Reviews</h1>
                <div className='w-full h-1 bg-gradient' />
            </div>
            <div className='flex flex-col pt-6 gap-12 justify-start items-start'>
                {movie.reviews?.results.map((review) => (
                    <Review key={review.id} review={review} />
                ))}
            </div>
        </div>
    )
}

export { Reviews };