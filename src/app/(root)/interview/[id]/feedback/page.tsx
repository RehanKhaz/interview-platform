import { getCurrentUser } from "@/lib/action/auth.action";
import { getFeedbackByInterviewId, getInterviewById } from "@/lib/action/general.action";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async ({ params }: RouteParams) => {
  const { id } = await params
  const user = await getCurrentUser()
  const interview = await getInterviewById(id)
  if (!interview) redirect('/')
  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!
  })

  const formatedDate  = dayjs(feedback?.createdAt || Date.now()).format('MMM D , YYYY h:mm A')
  console.log('Feedback ', feedback)
  return (
    <div className="min-h-screen w-dvw flex-center ">

      <div className="flex flex-col w-[80%] max-md:w-full gap-6 mt-4 items-center justify-between">
        <h1 className="text-5xl h-fit overflow-hidden max-md:text-3xl capitalize max-sm:text-xl font-bold tracking-wider">
          Feedback on the Interview - <br /> {interview.role} Role Interview
        </h1>
        <div className="flex-center gap-4">
          <div className="flex items-center gap-2">
            <Image width={30} height={30} className="object-cover" src={'/star.svg'} alt="Star SVG" />
            <p className="!text-lg">Overall Impressions : {feedback?.totalScore} / 100</p>
          </div>
          <div className="flex items-center gap-2">
            <Image width={30} height={30} className="object-cover" src={'/calendar.svg'} alt="Calender" />
            <p className="!text-lg">Date: {formatedDate} </p>
          </div>
        </div>
        <hr className="fill-white h-[1.4px] w-full" />
        <p className="!text-[1.3em] ">
          {feedback?.finalAssessment}
        </p>

        <h2 className="!text-4xl text-left w-full  overflow-hidden"> Breakdown of the Interview</h2>
        <div className="flex flex-col gap-4 w-full">
          {
            feedback?.categoryScores?.map((category , index) => {
              return <div className="flex flex-col gap-2">
                <h3>{index + 1} : {category.name}    ({category.score}/100) </h3>
                 <p className="!text-xl">
                  {category.comment}
                 </p>
              </div>
            })
          }
        </div>
        <ul className="flex flex-col gap-3 w-full">
          <h2 className="overflow-hidden">Areas For Improvement</h2>
          {
            feedback?.areasForImprovement?.map((area , index) => {
              return <p className="!text-lg tracking-wide">
              <li key={index}>
                {area}
              </li>
              </p>
            })
          }
        </ul>
        {
    feedback?.strengths &&
          <ul className="flex flex-col gap-3 w-full">
          <h2 className="overflow-hidden">Strength</h2>
          {
            feedback?.strengths?.map((strength , index) => {
              return <p className="!text-lg tracking-wide">
              <li key={index}>
                {strength}
              </li>
              </p>
            })
          }
        </ul>
          }
        <div className="flex-center gap-4 w-full max-md:flex-col flex-row">
          <Link href={'/'} >
          <button className="px-[2em] cursor-pointer rounded-2xl py-3 bg-[#27282F] text-lg ">
            <p>
            Back To Dashboard
            </p>
          </button>
          </Link>
          <Link href={`/interview/${id}`} >
          <button className="px-[2em] cursor-pointer rounded-2xl py-3 bg-primary-200 text-lg text-[#27282F]  ">
            Retake Interview
          </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Page