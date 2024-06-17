'use client'
import { Badge } from '~/components/ui/badge'

import { GetCompetitionByUuid } from '~/lib/types'
const WeightClasses = ({
    competition,
}: {
    competition: GetCompetitionByUuid
}) => {
    return (
        <div className='flex flex-col gap-2'>
            {competition.wc_male && (
                <div className='flex gap-4 items-center'>
                    <div className='text-lg font-bold w-24'>Male</div>
                    {competition.wc_male?.split('/').map((item) => (
                        <Badge
                            key={item}
                            className='w-16 flex justify-center items-center'
                        >
                            {item}
                            kg
                        </Badge>
                    ))}
                </div>
            )}
            {competition.wc_female && (
                <div className='flex gap-4 items-center'>
                    <div className='text-lg font-bold w-24'>Female</div>
                    {competition.wc_female?.split('/').map((item) => (
                        <Badge
                            key={item}
                            className='w-16 flex justify-center items-center'
                        >
                            {item}
                            kg
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    )
}

export default WeightClasses
