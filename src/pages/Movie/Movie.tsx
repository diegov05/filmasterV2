import { FC, useEffect, useState } from 'react'
import { Movie } from '../../interfaces/interfaces';
import { useLocation, useParams } from 'react-router-dom';
import { key } from '../../requests';
import { MovieHeader, Footer, MovieDetails, Trailer, Overview, Reviews, Cast } from '../../containers';
import images from "../../assets"
import axios from 'axios';

interface MovieProps {

}

const Movie: FC<MovieProps> = () => {

    const [movie, setMovie] = useState<Movie>();
    const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
    const [trailerKey, setTrailerKey] = useState<string | null>(null);

    const movieId = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const mediaType = searchParams.get("mediatype");
    const id = movieId.id;

    useEffect(() => {
        async function fetchData() {
            try {
                const movieResponse = await axios.get(
                    `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${key}&append_to_response=watch/providers,reviews,credits`
                );
                setMovie(movieResponse.data);

                await axios
                    .get(
                        `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${key}&language=en-US`
                    )
                    .then((response) => {
                        const videos = response.data.results.filter(
                            (video: any) => video.type === "Trailer"
                        );
                        if (videos.length > 0) {
                            setTrailerKey(videos[0].key);
                        } else {
                            setTrailerKey(null)
                        }
                    })
                    .catch((error) => console.error(error));
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [id, trailerKey, movieId, mediaType])

    const handleMenuToggle = () => {
        setIsMenuToggled(!isMenuToggled)
    }

    if (!movie) {
        return <div></div>
    }

    if (!mediaType) {
        return <div></div>
    }

    return (
        <>
            <MovieHeader movie={movie} handleMenuToggle={handleMenuToggle} />
            {!isMenuToggled && (
                <div>
                    <img className='absolute -z-10 top-[24rem] -left-36 opacity-100 rounded-2xl' src={images.gradient} />
                    <div className='p-10 pr-0 flex flex-col gap-12'>
                        <MovieDetails movie={movie} />
                        {trailerKey && <Trailer trailerKey={trailerKey} />}
                        {movie.overview && <Overview movie={movie} />}
                        {movie.credits && <Cast movie={movie} />}
                        {movie.reviews?.results.length! > 0 ? <Reviews movie={movie} /> : ''}
                    </div>
                    <Footer />
                </div >
            )}
        </>
    )
}

export { Movie };