import type { GetCompetitionById } from '~/lib/types'

const Competition = ({competition} : {competition: GetCompetitionById}) => {
    console.log(competition)
    const men = competition.entries.filter((entry) => entry.gender?.toLowerCase() == 'male')
    const women = competition.entries.filter((entry) => entry.gender?.toLowerCase() == 'female')

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex justify-around'>
                <div className='flex flex-col gap-2'>
                    {men.map((entry) => (
                        <div key={entry.id}>
                            {entry.user?.name} - {entry.wc}
                        </div>
                    ))}
                </div>
                <div className='flex flex-col gap-2'>
                    {women.map((entry) => (
                        <div key={entry.id}>
                            {entry.user?.name} - {entry.wc}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Competition
