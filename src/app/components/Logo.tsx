import Image from 'next/image'

const Logo = () => {
  return (
    <div className='flex-center gap-2'>
        <Image src={'/logo.svg'} alt='Logo' height={40} width={40} />
        <h3>
            PrepWise
        </h3>
    </div>
  )
}

export default Logo