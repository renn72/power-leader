import type { GetCompetitionById } from '~/lib/types'

const Competition = ({competition} : {competition: GetCompetitionById}) => {
    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
                <div className='font-bold text-destructive'>Loading...</div>
            </div>
        </div>
    )
}

export default Competition
