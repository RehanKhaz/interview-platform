import Agent from "@/app/components/Agent";
import { getCurrentUser } from "@/lib/action/auth.action";
const Page = async() => {
    const user = await getCurrentUser()
    return (
        <>
        <h2 className=" my-10">Interview Generation</h2>
       <Agent userName={user?.name} userId={user?.id} type={'generate'} />
        </>
    )

}

export default Page;