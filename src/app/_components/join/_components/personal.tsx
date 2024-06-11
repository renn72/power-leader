import Phone from './phone'
import BirthDate from './birth-date'
import Gender from './gender'
import Instagram from './instagram'
import Openlifter from './openlifter'
import Address from './address'

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

const Personal = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Personal</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-2'>
                <Address />
                <div className='flex w-full items-end justify-between gap-4'>
                    <Phone />
                    <BirthDate />
                </div>
                <div className='flex w-full items-end justify-between gap-4'>
                    <Gender />
                    <Instagram />
                </div>
                <Openlifter />
            </CardContent>
        </Card>
    )
}

export default Personal
