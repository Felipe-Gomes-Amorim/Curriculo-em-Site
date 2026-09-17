import Header from '../components/Header'
import Carousel from '../components/Carousel'
import { projects } from '../data/projects'

export default function Home() {
  return (
    <>
      <Header />
      <Carousel projects={projects} />
    </>
  )
}
