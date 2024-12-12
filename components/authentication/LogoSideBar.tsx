import Image from 'next/image'
import Leisure_and_Cultural_Services_Department from "@/public/Leisure_and_Cultural_Services_Department.png"

const LogoSideBar = () => {
  return (
    <div className='hidden md:flex bg-cyan-50 w-1/3 h-auto min-h-screen items-center overflow-hidden relative'>
      <Image 
        src={Leisure_and_Cultural_Services_Department}
        width={700}
        alt="logo"
        className='relative -left-[35%] top-[40%] scale-150 opacity-25'
      />
      <p className='absolute text-5xl font-extralight left-10'>
        LCSD Cultural Programmes Portal
      </p>
    </div>
  )
}

export default LogoSideBar