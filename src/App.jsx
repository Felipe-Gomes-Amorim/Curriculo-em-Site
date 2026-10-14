import Home from './pages/Home'
import BootIntro from './components/BootIntro'
import PixelTrail from './components/PixelTrail'

export default function App() {
  return (
    <>
      <BootIntro>
        <Home />
      </BootIntro>
      <PixelTrail style={{ zIndex: 3 }} />
    </>
  )
}
