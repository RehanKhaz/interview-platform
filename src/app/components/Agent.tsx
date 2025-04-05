import { cn } from '@/lib/utils';
import Image from 'next/image'
import React from 'react'

enum CallStatus {
    INACTIVE = 'INACTIVE',
    ACTIVE = 'ACTIVE',
    CONNECTING = 'CONNECTING',
    FINISHED = 'FINISHED'
}

const Agent = ({ userName, userId, type }: AgentProps) => {
    const callStatus = CallStatus.INACTIVE;
    const isSpeaking = true;
    const messages = [
        'Hi ! How are you ?',
        'Bye Nice to Meet you.'
    ]

    const lastMessage = messages[messages.length - 1]
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
                        <Image src='/user-avatar.png' alt='user avatart' width={640} height={640}
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
                        <button className='btn-call relative'>
                            <span className={cn('absolute animate-ping opacity-75 rounded-full', callStatus !== 'CONNECTING' && 'hidden')} />
                            <span>
                                {callStatus === 'INACTIVE' || callStatus === 'FINISHED' ? 'Call' : '. . .'}
                            </span>
                        </button>
                    ) : (
                        <button className='btn-disconnect'>CALL
                        </button>
                    )
                }
            </div>
            {
                messages.length > 0 &&
                <div className="transcript-border mt-4">
                    <div className="transcript">
                        <p key={lastMessage} className={cn('transition-opacity  duration-0 opacity-0', 'animate-fadeIn opacity-100')}>
                            {lastMessage}
                        </p>

                    </div>
                </div>
            }
        </>
    )
}

export default Agent