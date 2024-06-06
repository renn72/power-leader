'use client'

const JoinCompPage = ({ params } : { params: { comp: string } }) => {
    const { comp } = params
    return (
        <section className='mt-8 flex h-full grow flex-col'>
            <div>
                <h1>Join Competition</h1>
                <h2>{comp}</h2>
            </div>
        </section>
    )
}

export default JoinCompPage
