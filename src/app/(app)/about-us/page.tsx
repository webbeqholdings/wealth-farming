import HeroAboutUs from '@/components/page-about-us/Hero'

const IndexPage = () => {
  return (
    <div className="container relative">
      <HeroAboutUs />
      <div className="md:grids-col-2 grid md:gap-4 lg:grid-cols-10 mb-4"></div>
    </div>
  )
}
export default IndexPage
