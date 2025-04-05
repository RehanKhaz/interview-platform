import { cn, getTechLogos } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'
const TechIcons = async ({ techStack }: TechIconProps) => {
    const techLogos = await getTechLogos(techStack)
    return (
        <div className='flex '>
            {
                techLogos.slice(0, 3).map(({url ,tech}, index) => {
                    return <div
                        key={tech}
                        className={cn(
                            "relative group bg-dark-300 rounded-full p-2 flex flex-center",
                            index >= 1 && "-ml-3"
                        )}
                    >
                        <span className='tech-tooltip'>
                            {tech}
                        </span>
                    <Image src={url} width={30} height={32} alt={tech} />
                    </div>
                })
            }

        </div>

    )
}

export default TechIcons