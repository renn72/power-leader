'use client'
import { api } from '~/trpc/react'

import { CSVLink, CSVDownload } from 'react-csv'

const Page = () => {
  const { data } = api.competition.getMyCompetitions.useQuery()
  const comp = data?.[0]
  if (!comp) return null
  console.log(comp)

  const formatedComp = {
    federation: 'WRPF',
    data: '2024-12-07',
    meetCoutnry: 'Australia',
    meetState: 'TAS',
    meetTown: 'Kingston',
    meetName: 'Atlas Classic 2',
    formula: 'Wikls',
    entries: comp.entries.map((e) => {
      const squat1 = e.lift.find(
        (l) => l.lift === 'squat' && l.liftNumber === 1,
      )
      const squat2 = e.lift.find(
        (l) => l.lift === 'squat' && l.liftNumber === 2,
      )
      const squat3 = e.lift.find(
        (l) => l.lift === 'squat' && l.liftNumber === 3,
      )
      const squat4 = e.lift.find(
        (l) => l.lift === 'squat' && l.liftNumber === 4,
      )

      const bench1 = e.lift.find(
        (l) => l.lift === 'bench' && l.liftNumber === 1,
      )
      const bench2 = e.lift.find(
        (l) => l.lift === 'bench' && l.liftNumber === 2,
      )
      const bench3 = e.lift.find(
        (l) => l.lift === 'bench' && l.liftNumber === 3,
      )
      const bench4 = e.lift.find(
        (l) => l.lift === 'bench' && l.liftNumber === 4,
      )

      const deadlift1 = e.lift.find(
        (l) => l.lift === 'deadlift' && l.liftNumber === 1,
      )
      const deadlift2 = e.lift.find(
        (l) => l.lift === 'deadlift' && l.liftNumber === 2,
      )
      const deadlift3 = e.lift.find(
        (l) => l.lift === 'deadlift' && l.liftNumber === 3,
      )
      const deadlift4 = e.lift.find(
        (l) => l.lift === 'deadlift' && l.liftNumber === 4,
      )

      let s1Weight =
        Number(squat1?.weight) *
        (squat1?.isGoodOne && squat1?.isGoodTwo
          ? 1
          : squat1?.isGoodOne && squat1?.isGoodThree
            ? 1
            : squat1?.isGoodThree && squat1?.isGoodTwo
              ? 1
              : -1)
      let s2Weight =
        Number(squat2?.weight) *
        (squat2?.isGoodOne && squat2?.isGoodTwo
          ? 1
          : squat2?.isGoodOne && squat2?.isGoodThree
            ? 1
            : squat2?.isGoodThree && squat2?.isGoodTwo
              ? 1
              : -1)
      let s3Weight =
        Number(squat3?.weight) *
        (squat3?.isGoodOne && squat3?.isGoodTwo
          ? 1
          : squat3?.isGoodOne && squat3?.isGoodThree
            ? 1
            : squat3?.isGoodThree && squat3?.isGoodTwo
              ? 1
              : -1)
      let s4Weight =
        Number(squat4?.weight) *
        (squat4?.isGoodOne && squat4?.isGoodTwo
          ? 1
          : squat4?.isGoodOne && squat4?.isGoodThree
            ? 1
            : squat4?.isGoodThree && squat4?.isGoodTwo
              ? 1
              : -1)

      let b1Weight =
        Number(bench1?.weight) *
        (bench1?.isGoodOne && bench1?.isGoodTwo
          ? 1
          : bench1?.isGoodOne && bench1?.isGoodThree
            ? 1
            : bench1?.isGoodThree && bench1?.isGoodTwo
              ? 1
              : -1)
      let b2Weight =
        Number(bench2?.weight) *
        (bench2?.isGoodOne && bench2?.isGoodTwo
          ? 1
          : bench2?.isGoodOne && bench2?.isGoodThree
            ? 1
            : bench2?.isGoodThree && bench2?.isGoodTwo
              ? 1
              : -1)
      let b3Weight =
        Number(bench3?.weight) *
        (bench3?.isGoodOne && bench3?.isGoodTwo
          ? 1
          : bench3?.isGoodOne && bench3?.isGoodThree
            ? 1
            : bench3?.isGoodThree && bench3?.isGoodTwo
              ? 1
              : -1)
      let b4Weight =
        Number(bench4?.weight) *
        (bench4?.isGoodOne && bench4?.isGoodTwo
          ? 1
          : bench4?.isGoodOne && bench4?.isGoodThree
            ? 1
            : bench4?.isGoodThree && bench4?.isGoodTwo
              ? 1
              : -1)

      let d1Weight =
        Number(deadlift1?.weight) *
        (deadlift1?.isGoodOne && deadlift1?.isGoodTwo
          ? 1
          : deadlift1?.isGoodOne && deadlift1?.isGoodThree
            ? 1
            : deadlift1?.isGoodThree && deadlift1?.isGoodTwo
              ? 1
              : -1)
      let d2Weight =
        Number(deadlift2?.weight) *
        (deadlift2?.isGoodOne && deadlift2?.isGoodTwo
          ? 1
          : deadlift2?.isGoodOne && deadlift2?.isGoodThree
            ? 1
            : deadlift2?.isGoodThree && deadlift2?.isGoodTwo
              ? 1
              : -1)
      let d3Weight =
        Number(deadlift3?.weight) *
        (deadlift3?.isGoodOne && deadlift3?.isGoodTwo
          ? 1
          : deadlift3?.isGoodOne && deadlift3?.isGoodThree
            ? 1
            : deadlift3?.isGoodThree && deadlift3?.isGoodTwo
              ? 1
              : -1)
      let d4Weight =
        Number(deadlift4?.weight) *
        (deadlift4?.isGoodOne && deadlift4?.isGoodTwo
          ? 1
          : deadlift4?.isGoodOne && deadlift4?.isGoodThree
            ? 1
            : deadlift4?.isGoodThree && deadlift4?.isGoodTwo
              ? 1
              : -1)

      s1Weight = s1Weight ? s1Weight : 0
      s2Weight = s2Weight ? s2Weight : 0
      s3Weight = s3Weight ? s3Weight : 0
      s4Weight = s4Weight ? s4Weight : 0
      b1Weight = b1Weight ? b1Weight : 0
      b2Weight = b2Weight ? b2Weight : 0
      b3Weight = b3Weight ? b3Weight : 0
      b4Weight = b4Weight ? b4Weight : 0
      d1Weight = d1Weight ? d1Weight : 0
      d2Weight = d2Weight ? d2Weight : 0
      d3Weight = d3Weight ? d3Weight : 0
      d4Weight = d4Weight ? d4Weight : 0
      const bestSquat = Math.max(s1Weight, s2Weight, s3Weight, s4Weight)
      const bestBench = Math.max(b1Weight, b2Weight, b3Weight, b4Weight)
      const bestDeadlift = Math.max(d1Weight, d2Weight, d3Weight, d4Weight)

      const total = bestSquat + bestBench + bestDeadlift

      return {
        Place: '',
        Name: e.user?.name,
        Sex: e.user?.gender === 'male' ? 'M' : 'F',
        Age: e.user?.birthDate
          ? new Date().getFullYear() - e.user?.birthDate.getFullYear()
          : null,
        Equipment: e.equipment,
        Division: e.compEntryToDivisions?.[0]?.division?.name,
        BodyWeightKg: e.weight,
        WeightClassKg: e.wc?.split('-')[0],
        Squat1Kg: s1Weight == 0 ? null : s1Weight,
        Squat2Kg: s2Weight == 0 ? null : s2Weight,
        Squat3Kg: s3Weight == 0 ? null : s3Weight,
        Squat4Kg: s4Weight == 0 ? null : s4Weight,
        Best3SquatKg: bestSquat,
        Bench1Kg: b1Weight == 0 ? null : b1Weight,
        Bench2Kg: b2Weight == 0 ? null : b2Weight,
        Bench3Kg: b3Weight == 0 ? null : b3Weight,
        Bench4Kg: b4Weight == 0 ? null : b4Weight,
        Best3BenchKg: bestBench,
        Deadlift1Kg: d1Weight == 0 ? null : d1Weight,
        Deadlift2Kg: d2Weight == 0 ? null : d2Weight,
        Deadlift3Kg: d3Weight == 0 ? null : d3Weight,
        Deadlift4Kg: d4Weight == 0 ? null : d4Weight,
        Best3DeadliftKg: bestDeadlift,
        TotalKg: total,
      }
    }),
  }

  console.log('formated', formatedComp)

  return (
    <div>
      <CSVDownload
        data={formatedComp.entries}
        target='_blank'
      >
        Download CSV
      </CSVDownload>
      <CSVLink
        data={formatedComp.entries}
      >
        Download me
      </CSVLink>
    </div>
  )
}

export default Page
