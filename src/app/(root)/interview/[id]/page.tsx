import Agent from "@/app/components/Agent";
import TechIcons from "@/app/components/TechIcons";
import { getCurrentUser } from "@/lib/action/auth.action";
import { getInterviewById } from "@/lib/action/general.action";
import Image from "next/image";
import { redirect } from "next/navigation";

const Page = async ({ params }: RouteParams) => {
    const { id } = await params;
    const interview = await getInterviewById(id)
    console.log(interview)
    const user = await getCurrentUser()

    if (!interview) redirect('/')
    return (
        <>
            <div className="flex flex-row justify-between gap-4 ">
                <div className="flex flex-row mt-4 max-sm:flex-col  justify-between gap-4">
                    <div className="flex flex-row  gap-5 items-center ">
                        <Image src={interview.coverImage} className="object-cover rounded-full size-[60px]" width={60} alt={interview.role} height={60} />
                        <h3 className="capitalize text-4xl">
                            {interview.role}
                        </h3>
                    </div>
                    <TechIcons techStack={interview.techStack} />
                </div>
                <p className="bg-dark-200 px-4 py-2 text-xl h-fit capitalize rounded-lg">{interview.type}</p>
            </div>
            <br />
            <Agent userName={user?.name!}  interviewId={id} questions={interview.questions} type="interview" userId={user?.id!} />
        </>
    )
}

export default Page