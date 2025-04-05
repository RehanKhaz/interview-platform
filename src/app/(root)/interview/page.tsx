import Agent from "@/app/components/Agent";
const Page = () => {
    return (
        <>
        <h2 className=" my-10">Interview Generation</h2>
       <Agent userName='Rehan khan' userId={'user1'} type={'generate'} />
        </>
    )

}

export default Page;