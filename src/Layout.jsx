import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import { useThemeMoodContext } from './hooks/useThemeMoodContext'

const Layout = ({ children }) => {
    const { mood } = useThemeMoodContext();

    return (
        <main className={`${mood === 'MOON'? 'bg-black':'bg-white'} pb-24 max-[1180px]:mb-[18em] max-[767px]:mb-24 overflow-hidden w-full min-h-screen`}>
            <Navbar/>
                { children }
            <Footer/>
        </main>
    )
}

export default Layout