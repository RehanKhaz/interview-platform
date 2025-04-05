import { NextResponse } from "next/server";
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export function GET() {
    return NextResponse.json({
        success: true,
        message: 'Working Perfectly.'
    }, {
        status: 200
    })
}

export async function POST(request: Request) {
    const { userid, amount, techStack, type, role, level } = await request.json();
    try {
        const { text: questions } = await generateText({
            model: google('gemini-2.0-flash-001'),
            prompt: `
             Prepare interview questions for a job.
             The job role is ${role}.
             The focus between behavioral & technical questions should lean towards : ${type}.
             The amount of questions should be ${amount}.
             The level of job interview is ${level}.
             The tech stack for the interview questions is ${techStack}.
             Please return only questions without any additional text.
             The Format of questions should be like the following :
             ["Question 1" , "Question 2", "Question 3" ] and on to the amount of question provided.
             Please avoid using characters that interrupt AI agents to speak because these questions are going to be read by Voice agent. Don't use any special character.
             Thanks For Your Help.
             `
        })

        console.log(questions)

        const interview = {
            type, role, level, amount,
            userId: userid,
            questions: JSON.parse(questions),
            createdAt: new Date().toISOString(),
            techStack: techStack.split(','),
            finalized: true,
            coverImage: getRandomInterviewCover()
        }

        await db.collection('interviews').add(interview);
        return NextResponse.json({
            success: true,
        }, {
            status: 200
        })

    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: 'Error Occured.'
        }, {
            status: 500
        })
    }
}