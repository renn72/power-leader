import { Card, CardContent, CardHeader } from '~/components/ui/card'

const LifterInfo = ({
  lifter,
  round,
  currentLift,
  lift,
}: {
  lifter: any
  round: string
  currentLift: any
  lift: string
}) => {
  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent>
        <div>{lifter && lifter.user && lifter.user.name}</div>
        <div>Round {round}</div>
        <div className='capitalize'>{lift}</div>
        <div>{currentLift?.weight}kg</div>
      </CardContent>
    </Card>
  )
}

export default LifterInfo
