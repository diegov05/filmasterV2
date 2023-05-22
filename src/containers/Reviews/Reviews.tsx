import { FC, useEffect, useRef, useState } from 'react'
import { Movie } from '../../interfaces/interfaces';
import { Review } from '../../components';
import { db } from '../../firebase';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { StarIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

interface ReviewsProps {
    movie: Movie
}

type review = {
    reviewId: string
    userId: string
    userName: string | null
    date: string
    movieId: string
    mediaType: string
    reviewContent: string;
    reviewRating: number;
}

const Reviews: FC<ReviewsProps> = (props) => {

    let currentDate = new Date().toJSON().slice(0, 10);
    const { movie } = props
    const mediaType = movie.title ? "movie" : "tv"
    const navigate = useNavigate()

    const [isReviewing, setIsReviewing] = useState<boolean>(false)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [user, setUser] = useState<User | null>(null);
    const [rating, setRating] = useState(0);
    const [localReviews, setLocalReviews] = useState<review[] | null | undefined>(null);
    const [currentUserReview, setCurrentUserReview] = useState<review | null>(null);

    const [review, setReview] = useState<review>(
        {
            reviewId: "",
            userId: user ? user.uid : "",
            userName: user ? user.email : "",
            date: currentDate,
            movieId: movie.id.toString(),
            mediaType: mediaType,
            reviewContent: "",
            reviewRating: 0
        }
    )

    const userRef = useRef<HTMLDivElement>(null);
    const editRef = useRef<HTMLDivElement>(null);
    const reviewsCollectionRef = collection(db, 'reviews')

    const handleToggleReviewing = () => {
        if (!isReviewing) {
            userRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            })
        }
        setIsReviewing(prevIsReviewing => !prevIsReviewing);
    }

    const handleToggleEditing = () => {
        if (isEditing) {
            setIsEditing(false)
        } else {
            setRating(currentUserReview ? currentUserReview.reviewRating : 0)
            setReview(currentUserReview ? currentUserReview : {
                reviewId: "",
                userId: user ? user.uid : "",
                userName: user ? user.email : "",
                date: currentDate,
                movieId: movie.id.toString(),
                mediaType: mediaType,
                reviewContent: "",
                reviewRating: 0
            })
            editRef.current?.scrollIntoView({
                behavior: "smooth"
            })
            setIsEditing(true)
        }
    }

    const handleStarClick = (selectedRating: number) => {
        setRating(selectedRating);
    };


    const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const reviewContent = form.reviewContent.value;
        const reviewRating = rating

        const newReview = {
            reviewId: doc(reviewsCollectionRef).id,
            userId: user ? user.uid : "",
            userName: user ? user.email : "",
            date: review.date,
            movieId: review.movieId,
            mediaType: review.mediaType,
            reviewContent,
            reviewRating,
        };

        try {
            await setDoc(doc(reviewsCollectionRef, newReview.reviewId), newReview);
            console.log('Review added to Firestore successfully!');
            setRating(0);
            window.location.reload();
        } catch (error) {
            console.error('Error adding review to Firestore:', error);
        }

        form.reviewContent.value = '';
        form.reviewRating.value = '';
    };

    const handleReviewEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const reviewContent = form.reviewContent.value;
        const reviewRating = rating;

        const updatedReview = {
            ...review,
            reviewContent,
            reviewRating,
        };

        try {
            await setDoc(doc(reviewsCollectionRef, updatedReview.reviewId), updatedReview);
            console.log('Review updated in Firestore successfully!');
            setRating(0);
            setIsEditing(false);
            window.location.reload();
        } catch (error) {
            console.error('Error updating review in Firestore:', error);
        }

        form.reviewContent.value = '';
        form.reviewRating.value = '';
    };


    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userRef.current && !userRef.current.contains(event.target as Node)) {
                setIsReviewing(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                const fetchReviewsData = async () => {
                    try {
                        const querySnapshot = await getDocs(reviewsCollectionRef);
                        const fetchedReviews: review[] = [];

                        querySnapshot.forEach((doc) => {
                            const reviewData = doc.data() as review;
                            fetchedReviews.push(reviewData);
                        });


                        const filteredReviews = fetchedReviews.filter(
                            (review) =>
                                review.movieId === movie.id.toString() &&
                                review.mediaType === mediaType
                        );

                        const sortedReviews = filteredReviews.sort(
                            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                        );

                        setLocalReviews(sortedReviews);

                        const currentUserReview = sortedReviews.find(
                            (review) => review.userId === user.uid
                        );
                        setCurrentUserReview(currentUserReview || null);
                    } catch (error) {
                        console.error("Error fetching reviews data:", error);
                    }
                };

                fetchReviewsData();
            } else {
                setUser(null);
                const fetchReviewsData = async () => {
                    try {
                        const querySnapshot = await getDocs(reviewsCollectionRef);
                        const fetchedReviews: review[] = [];


                        querySnapshot.forEach((doc) => {
                            const reviewData = doc.data() as review;
                            fetchedReviews.push(reviewData);
                        });
                        const filteredReviews = fetchedReviews.filter(
                            (review) =>
                                review.movieId === movie.id.toString() &&
                                review.mediaType === mediaType
                        );
                        const sortedReviews = filteredReviews.sort(
                            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                        );
                        setLocalReviews(sortedReviews);
                    } catch (error) {
                        console.error("Error fetching reviews data:", error);
                    }
                }
                fetchReviewsData()
            }
        });
        return () => unsubscribe();
    }, [movie]);

    return (
        <div className='relative pr-10 flex flex-col gap-8'>
            <div className='w-max'>
                <h1 className='w-max font-bold text-2xl xs:max-sm:text-3xl sm:max-4xl:text-4xl pb-4 text-text-color'>Reviews</h1>
                <div className='w-full h-1 bg-gradient' />
            </div>
            {isReviewing && (
                <div ref={userRef} className='slide-in-fwd-center shadow-xl z-50 flex flex-col justify-center items-center gap-8 shadow-black/40 absolute rounded-2xl bottom-16 bg-bg-color p-6 xs:max-4xl:p-10'>
                    <div className='slide-in-fwd-center w-max'>
                        <h1 className='w-max font-bold text-2xl xs:max-sm:text-3xl sm:max-4xl:text-4xl pb-4 text-text-color'>Post a Review</h1>
                        <div className='slide-in-fwd-center w-full h-1 bg-gradient' />
                    </div>
                    <form onSubmit={handleReviewSubmit} className='flex flex-col gap-4' action="">
                        <div className='flex flex-row flex-wrap items-center justify-center max-w-full w-44 xs:w-52 md:max-4xl:w-full'>
                            {[...Array(10)].map((_, index) => (
                                <StarIcon
                                    key={index}
                                    className={`cursor-pointer transition-all  ${index < rating ? 'text-amber-400 fill-amber-400' : ''
                                        } w-8`}
                                    onClick={() => handleStarClick(index + 1)}
                                />
                            ))}
                        </div>
                        <textarea style={{ resize: 'none' }} className='max-w-full w-44 xs:w-52 md:max-4xl:w-full px-5 py-3 rounded-2xl' placeholder='Type a review...' name="reviewContent" id="reviewContent" cols={20} rows={10}>
                        </textarea>
                        <button type='submit' className='bg-gradient cursor-pointer transition-all duration-300 hover:opacity-80 py-3 sm:max-4xl:py-2 pw-16 rounded-2xl font-bold sm:max-4xl:text-sm text-bg-color'>Post Review
                        </button>
                    </form>
                </div>
            )}
            {isEditing && (
                <div ref={userRef} className='slide-in-fwd-center shadow-xl z-50 flex flex-col justify-center items-center gap-8 shadow-black/40 absolute rounded-2xl bottom-96 bg-bg-color p-6 xs:max-4xl:p-10'>
                    <div ref={editRef} className='slide-in-fwd-center w-max'>
                        <h1 className='w-max font-bold text-2xl xs:max-sm:text-3xl sm:max-4xl:text-4xl pb-4 text-text-color'>Edit Review</h1>
                        <div className='slide-in-fwd-center w-full h-1 bg-gradient' />
                    </div>
                    <form onSubmit={handleReviewEdit} className='flex flex-col gap-4' action="">
                        <div className='flex flex-row flex-wrap items-center justify-center max-w-full w-44 xs:w-52 md:max-4xl:w-full'>
                            {[...Array(10)].map((_, index) => (
                                <StarIcon
                                    key={index}
                                    className={`cursor-pointer transition-all ${index < rating ? 'text-amber-400 fill-amber-400' : ''
                                        } w-8`}
                                    onClick={() => handleStarClick(index + 1)}
                                />
                            ))}
                        </div>
                        <textarea style={{ resize: 'none' }} className='max-w-full w-44 xs:w-52 md:max-4xl:w-full px-5 py-3 rounded-2xl' placeholder={currentUserReview?.reviewContent} name="reviewContent" id="reviewContent" cols={20} rows={10}>
                        </textarea>
                        <button type='submit' className='bg-gradient cursor-pointer transition-all duration-300 hover:opacity-80 py-3 sm:max-4xl:py-2 pw-16 rounded-2xl font-bold sm:max-4xl:text-sm text-bg-color'>Post Review
                        </button>
                    </form>
                </div>
            )}
            {isReviewing && (
                <div ref={userRef} className='slide-in-fwd-center shadow-xl z-50 flex flex-col justify-center items-center gap-8 shadow-black/40 absolute rounded-2xl bottom-16 bg-bg-color p-6 xs:max-4xl:p-10'>
                    <div className='slide-in-fwd-center w-max'>
                        <h1 className='w-max font-bold text-2xl xs:max-sm:text-3xl sm:max-4xl:text-4xl pb-4 text-text-color'>Post a Review</h1>
                        <div className='slide-in-fwd-center w-full h-1 bg-gradient' />
                    </div>
                    <form onSubmit={handleReviewSubmit} className='flex flex-col gap-4' action="">
                        <div className='flex flex-row flex-wrap items-center justify-center max-w-full w-44 xs:w-52 md:max-4xl:w-full'>
                            {[...Array(10)].map((_, index) => (
                                <StarIcon
                                    key={index}
                                    className={`cursor-pointer transition-all ${index < rating ? 'text-amber-400 fill-amber-400' : ''
                                        } w-8`}
                                    onClick={() => handleStarClick(index + 1)}
                                />
                            ))}
                        </div>
                        <textarea style={{ resize: 'none' }} className='max-w-full w-44 xs:w-52 md:max-4xl:w-full px-5 py-3 rounded-2xl' placeholder='Type a review...' name="reviewContent" id="reviewContent" cols={20} rows={10}>
                        </textarea>
                        <button type='submit' className='bg-gradient cursor-pointer transition-all duration-300 hover:opacity-80 py-3 sm:max-4xl:py-2 pw-16 rounded-2xl font-bold sm:max-4xl:text-sm text-bg-color'>Post Review
                        </button>
                    </form>
                </div>
            )}
            <div className='flex flex-col pt-6 gap-12 justify-start items-start'>
                {localReviews?.map((review) => (
                    <Review key={review.reviewId} review={review} isEditable={review.reviewId === currentUserReview?.reviewId ? true : false} handleToggleEditing={handleToggleEditing} />
                ))}
                {movie.reviews?.results.map((review) => (
                    <Review key={review.id} review={review} />
                ))}
            </div>
            {!currentUserReview && <button onClick={user ? handleToggleReviewing : () => navigate('/login')} className='w-max flex flex-row gap-2 justify-center items-center px-5 py-3 bg-button-primary-color text-bg-color rounded-2xl font-bold text-xs sm:max-4xl:text-lg transition-all hover:bg-accent-color hover:text-text-color'>
                + Review
            </button>}
        </div>
    )
}

export { Reviews };