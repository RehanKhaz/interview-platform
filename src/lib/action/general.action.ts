'use server'
import { feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
export const getInterviewByUserId = async (userId: string): Promise<Interview[] | null> => {

    const interviews = await db.collection('interviews').where('userId', '==', userId).orderBy('createdAt', 'desc').get();
    return (interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Interview[])
}
export const getLatestInterview = async (params: GetLatestInterviewsParams): Promise<Interview[] | null> => {
    const { userId, limit = 20 } = params;
    const interviews = await db.collection('interviews').where('finalized', '==', true).where('userId', '!=', userId).orderBy('createdAt', 'desc').limit(limit).get();
    return (interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Interview[])
}

export const getInterviewById = async (id: string): Promise<Interview | null> => {
    const interview = await db.collection('interviews').doc(id).get()
    return interview.data() as Interview | null;
}

export const createFeedback = async (params: CreateFeedbackParams) => {
    const { interviewId, userId, transcript } = params;
    console.log("Create Feedback function is working .")
    console.log(createFeedback, 'CreateFeedback is working')
    console.log(userId, 'CreateFeedback is working')
    console.log(transcript, 'CreateFeedback is working')
    try {
        const formattedTranscript = transcript.map((sentence: { role: string, content: string }) => `${sentence.role} : ${sentence.content}\n`).join('');
        const { object } = await generateObject({
            model: google('gemini-2.0-flash-001', {
                structuredOutputs: false
            }),
            schema: feedbackSchema,
            prompt: `
            You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
            Transcript:
            ${formattedTranscript}
    
            Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
            - **Communication Skills**: Clarity, articulation, structured responses.
            - **Technical Knowledge**: Understanding of key concepts for the role.
            - **Problem-Solving**: Ability to analyze problems and propose solutions.
            - **Cultural & Role Fit**: Alignment with company values and job role.
            - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
            `,
            system:
                "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
        })

        console.log('Areas for IMporvement', object.areasForImprovement)
        console.log('user Id', userId)
        console.log('interview Id', interviewId)
        console.log('total score', object.totalScore)
        console.log('category scores', object.categoryScores)
        console.log('strengths', object.strengths)
        console.log('Final Assesment', object.finalAssessment)

        const feedback = {
            interviewId: interviewId,
            userId: userId,
            areasForImprovement: object.areasForImprovement,
            categoryScores: object.categoryScores,
            totalScore: object.totalScore,
            finalAssessment: object.finalAssessment,
            strengths: object.strengths,
            createdAt: new Date().toISOString()
        }

        const addFeedback = await db.collection('feedback').add(feedback)
        return {
            success: true,
            id: addFeedback.id
        }
    } catch (error) {
        console.log('Errror', error)
        return {
            success: false,
        }
    }
}

export const getFeedbackByInterviewId = async (params: GetFeedbackByInterviewIdParams): Promise<Feedback | null> => {
    const { userId, interviewId } = params;
    const feedback = await db.collection('feedback').where('interviewId', '==', interviewId).where('userId', '==', userId).limit(1).get();
    if (feedback.empty) return null;
    const feedbackDocs = feedback.docs[0]
    return { id: feedbackDocs.id, ...feedbackDocs.data() } as Feedback
}

