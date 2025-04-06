import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { dummyInterviews } from '../../constants'
import InterviewCard from '../components/InterviewCard'
import Link from 'next/link'

const Page = () => {
  return (
    <main className='flex flex-col gap-8 max-md:gap-4'>
    <section className='card-cta flex mt-8 gap-5 items-center justify-between'>
      <div className='flex sm:w-[50%] flex-col gap-5 max-md:gap-2 justify-between'>
        <h2 className='md:text-4xl'>
        Get Interview-Ready with AI- Powered Practice & Feedback
        </h2>
        <p className='md:text-2xl'>
        Practice real interview questions & get instant feedback.
        </p>
        <Link href={'/interview'}>
        <Button className={'btn text-xl max-md:w-full w-fit btn-primary '}>
         Start an Interview
        </Button>
        </Link>
      </div>
      <div className='max-sm:hidden'>
        <Image src={'/robot.png'} className='object-cover pointer-events-none' width={400} height={400} alt={'robot'} />
      </div>

    </section>

    <section className='flex flex-col gap-4 max-md:gap-2'>
      <h2 className='max-sm:text-xl'>Your Past Interview</h2>
      <div className="interviews-section">
        {
          dummyInterviews.map((item ) => {
            return <InterviewCard key={item.userId} {...item} />
          })
        }
      </div>
    </section>

    <section className='flex flex-col gap-4 max-md:gap-2'>
      <h2 className='max-sm:text-xl'>Pick Your Interview</h2>
      <div  className="interviews-section">
        {
          dummyInterviews.map((item ) => {
            return <InterviewCard key={item.userId} {...item} />
          })
        }
        {/* <p>You have not take any interview yet to pick.</p> */}
      </div>
    </section>
    </main>
  )
}

export default Page