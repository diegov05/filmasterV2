import { FC, useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext';
import { Header, Footer, Carousel } from '../../containers';


interface MainPageProps {

}

const MainPage: FC<MainPageProps> = () => {

    const user = useContext(AuthContext)

    return (
        <>
            <Header />
            <Carousel />
            <Carousel />
            <Carousel />
            <Carousel />
            <Footer />
        </>
    )
}

export { MainPage };