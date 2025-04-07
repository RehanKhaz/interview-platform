import Image from 'next/image'
import React from 'react'
import dayjs from 'dayjs'
import TechIcons from './TechIcons'
import Link from 'next/link'
import { getFeedbackByInterviewId } from '@/lib/action/general.action'

const InterviewCard = async({ role , userId, type, id, coverImage , techStack, createdAt }: InterviewCardProps) => {
  console.log(userId , 'userId')
  console.log(id , 'Id')
  const feedback = (userId && id) && await getFeedbackByInterviewId({
    interviewId:id,
    userId 
  })  
  console.log(feedback , "feedback in Interview Card")
  const formatedDate = dayjs(createdAt || Date.now()).format('MMM D , YYYY')

  return (
    <div className='border-[#4B4D4F] dark-gradient px-4 py-2 overflow-hidden w-full sm:w-[360px] min-h-[10em] border-[1.2px] rounded-xl relative'>
      {/* Type */}
      <div className='absolute capitalize bg-[#6870A6] text-lg font-medium top-0 right-0 px-3 py-2 rounded-bl-lg'>
        {type}
      </div>
      <div className='flex flex-col mt-8 gap-2 '>
        <div>
          <Image src={coverImage} width={80} height={80} alt='Company image' />
        </div>
        <h3 className='capitalize '>{role} Interview</h3>
        <div className='flex items-center gap-7'>

          <div className='flex-center gap-2'>
            <Image src={'/calendar.svg'} className='fill-primary-200' width={20} height={20} alt='Calender' />
            <p className='fill-primary-200 text-[1.1em]'>
              {formatedDate}
            </p>
          </div>
          <div className='flex-center gap-2'>
            <Image src={'/star.svg'} className='fill-primary-200' width={20} height={20} alt='Star' />
            <p className='fill-primary-200 text-[1.2em]'>
              {feedback?.totalScore}/100
            </p>
          </div>
        </div>
        <p className='font-normal text-ellipsis line-clamp-2 text-[1.15em]'>
          {feedback?.finalAssessment || "You've not take the Interview yet. Please take it to make yourself interview ready."}
        </p>

        <div className='mt-4 flex items-center justify-between'>
          <div>
              <TechIcons techStack={techStack} />
          </div>
          <Link href={`/interview/${id}`}>
          <button  className=' btn btn-primary'>
            View Interview
          </button>
          </Link>
        </div>
      </div>


    </div>
  )
}

export default InterviewCard