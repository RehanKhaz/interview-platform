'use client'
import { interviewer } from '@/constants';
import { createFeedback } from '@/lib/action/general.action';
import { cn } from '@/lib/utils';
import { vapi } from '@/lib/vapi.sdk'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
enum CallStatus {
    INACTIVE = 'INACTIVE',
    ACTIVE = 'ACTIVE',
    CONNECTING = 'CONNECTING',
    FINISHED = 'FINISHED'
}


interface SavedMessage {
    role: 'user' | 'system' | 'assistant';
    content: string;
}
const Agent = ({ userName, userId, interviewId, type, questions }: AgentProps) => {

    if (!process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID) {
        throw new Error('Vapi WorkFlow API is Not Present there.')
    }

    const router = useRouter()
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE)
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false)
    const [messages, setMessages] = useState<SavedMessage[]>([])
    const latestMessage = messages[messages.length - 1]?.content

    const handleDisconnect = async() => {
        setCallStatus(CallStatus.FINISHED)
         await vapi.stop()
    }

    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE)
        const onCallEnd = () => setCallStatus(CallStatus.FINISHED)

        const onMessage = (message: Message) => {
            if (message.type === 'transcript' && message.transcriptType === 'final') { }
            const newMessage = {
                role: message.role,
                content: message.transcript
            }
            setMessages((prev) => [...prev, newMessage])
        }
        const onSpeechStart = () => setIsSpeaking(true)
        const onSpeechEnd = () => setIsSpeaking(false)

        const onError = (error: Error) => console.log('Error', error)

        vapi.on('call-start', onCallStart)
        vapi.on('call-end', onCallEnd)
        vapi.on('speech-start', onSpeechStart)
        vapi.on('speech-end', onSpeechEnd)
        vapi.on('message', onMessage)
        vapi.on('error', onError)
        return () => {
            vapi.off('call-start', onCallStart)
            vapi.off('call-end', onCallEnd)
            vapi.off('speech-start', onSpeechStart)
            vapi.off('speech-end', onSpeechEnd)
            vapi.off('message', onMessage)
            vapi.off('error', onError)
        }

    }, [])
    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
        console.log('Generate Interview dfslfasdkfasdfjdlfjk Feedback')
        console.log(interviewId)
        console.log(userId)
        const result = await createFeedback({
            interviewId: interviewId!,
            userId: userId!,
            transcript: messages,
        })
        console.log('Success & id', result.success, result.id)
        if (result.success && result.id) {
            router.push(`/interview/${interviewId}/feedback`)
        } else {
            router.push('/')
            toast.error('Error Occured. Try again but later.')
        }
    }

    useEffect(() => {
        if (callStatus === CallStatus.FINISHED) {
            if (type == 'generate') {
                router.push('/')
            }
            else {
                handleGenerateFeedback(messages)
            }
        }
    }, [messages, callStatus, userId, type])

    const handleCallStart = async () => {
        setCallStatus(CallStatus.CONNECTING)
        if (type === 'generate') {
            await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
                variableValues: {
                    username: userName,
                    userid: userId
                }
            })
        } else {
            let formatedQuestions = ''
            if (questions) {
                formatedQuestions = questions.map((question) => `- ${question}`).join('/n')
                console.log(formatedQuestions)
                vapi.start(interviewer, {
                    variableValues: {
                        questions: formatedQuestions,
                        username: userName

                    }
                })
            }
        }
    }

    return (
        <>
            <div className='call-view'>
                <div className="card-interviewer">
                    <div className="avatar">
                        <Image src='/ai-avatar.png' alt='vapi' width={65} height={54}
                            className='object-cover' />
                        {
                            isSpeaking &&
                            <span className="animate-speak" />
                        }
                    </div>
                </div>
                <div className='card-border'>
                    <div className='card-content'>
                        <Image src='/cartoon.png' alt='user avatart' width={640} height={640}
                            className='object-cover size-[10em] rounded-full' />

                        <h3>
                            {userName}
                        </h3>
                    </div>
                </div>
            </div>
            <div className='w-full mt-5 flex justify-center'>
                {
                    callStatus !== 'ACTIVE' ? (
                        <button onClick={handleCallStart} className='btn-call relative'>
                            <span className={cn('absolute animate-ping opacity-75 rounded-full', callStatus !== 'CONNECTING' && 'hidden')} />
                            <span  >
                                {callStatus === 'INACTIVE' || callStatus === 'FINISHED' ? 'Call' : '. . .'}
                            </span>
                        </button>
                    ) : (
                        <button onClick={handleDisconnect} className='btn-disconnect'>
                            End
                        </button>
                    )
                }
            </div>
            {
                messages.length > 0 &&
                <div className="transcript-border mt-4">
                    <div className="transcript">
                        <p key={latestMessage} className={cn('transition-opacity  duration-0 opacity-0', 'animate-fadeIn opacity-100')}>
                            {latestMessage}
                        </p>

                    </div>
                </div>
            }
        </>
    )
}

export default Agent