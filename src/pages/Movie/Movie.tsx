import { FC, useEffect, useState } from 'react'
import { Movie } from '../../interfaces/interfaces';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { key } from '../../requests';
import { MovieHeader } from '../../containers';

interface MovieProps {

}

const Movie: FC<MovieProps> = () => {

    const [movie, setMovie] = useState<Movie>();
    const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);

    const movieId = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const mediaType = searchParams.get("mediatype");
    const id = movieId.id;

    useEffect(() => {
        async function fetchData() {
            try {
                const movieResponse = await axios.get(
                    `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${key}&append_to_response=watch/providers,reviews`
                );
                setMovie(movieResponse.data);
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [id])


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
        </>
    )
}

export { Movie };