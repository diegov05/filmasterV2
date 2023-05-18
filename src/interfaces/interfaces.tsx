export interface Movie {
    adult: boolean;
    backdrop_path: string | null;
    belongs_to_collection: {
        id: number;
        name: string;
        poster_path: string;
        backdrop_path: string;
    } | null;
    budget: number;
    genres: {
        id: number;
        name: string;
    }[];
    homepage: string | null;
    id: number;
    imdb_id: string | null;
    original_language: string;
    original_title: string;
    name: string;
    overview: string | null;
    popularity: number;
    poster_path: string | null;
    production_companies: {
        id: number;
        logo_path: string | null;
        name: string;
        origin_country: string;
    }[];
    production_countries: {
        iso_3166_1: string;
        name: string;
    }[];
    release_date: string;
    last_air_date: string;
    first_air_date: string;
    media_type: string;
    revenue: number;
    runtime: number | null;
    spoken_languages: {
        iso_639_1: string;
        name: string;
    }[];
    status: string;
    tagline: string | null;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    watchProviders: {
        [countryCode: string]: {
            link: string;
            flatrate: Provider[];
            rent: Provider[];
            buy: Provider[];
        };
    };
    reviews?: ReviewResults
}

export interface MovieDetails {
    id: number;
    title: string;
    poster_path: string;
    genres: { id: number; name: string }[];
    credits: {
        crew: { id: number; name: string; department: string }[];
        cast: CastMember[];
    };
}

export interface Person {
    id: number;
    name: string;
}


export interface Provider {
    provider_id: number;
    provider_name: string;
    logo_path: string;
    display_priority: number;
}

export interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

export interface ReviewResults {
    results: Review[]
}
export interface Review {
    author: string;
    author_details: {
        avatar_path: string;
        name: string;
        rating?: number;
        username: string;
    }
    created_at: string;
    content: string;
    updated_at: string;
    url: string;
    id: string;
}

export interface LocationState {
    mediaType: string;
}

export interface RatingMovieData {
    ratings: Rating[]
}

export interface Rating {
    source: string;
    value: number;
    score: number;
    votes: number;
}

export interface UserFavorites {
    favorites: string[];
}