'use client'

import { useMemo, useState } from 'react'

const standingsBase: Record<string, number> = {
  RCB: 16,
  GT: 16,
  SRH: 14,
  PBKS: 13,
  RR: 12,
  CSK: 12,
  KKR: 11,
  DC: 10,
}

const playoffProbabilities: Record<
  string,
  {
    qualify: number
    top2: number
    first: number
    eliminated: number
  }
> = {
  RCB: {
    qualify: 99.4,
    top2: 88,
    first: 52,
    eliminated: 0.6,
  },

  GT: {
    qualify: 97,
    top2: 82,
    first: 31,
    eliminated: 3,
  },

  SRH: {
    qualify: 77,
    top2: 42,
    first: 12,
    eliminated: 23,
  },

  PBKS: {
    qualify: 48,
    top2: 21,
    first: 4,
    eliminated: 52,
  },

  RR: {
    qualify: 47,
    top2: 18,
    first: 3,
    eliminated: 53,
  },

  CSK: {
    qualify: 25,
    top2: 6,
    first: 0.5,
    eliminated: 75,
  },

  KKR: {
    qualify: 5,
    top2: 0.4,
    first: 0,
    eliminated: 95,
  },

  DC: {
    qualify: 0.5,
    top2: 0,
    first: 0,
    eliminated: 99.5,
  },
}

const matches = [
  ['PBKS', 'RCB'],
  ['DC', 'RR'],
  ['CSK', 'SRH'],
  ['RR', 'LSG'],
  ['KKR', 'MI'],
  ['GT', 'CSK'],
  ['SRH', 'RCB'],
  ['LSG', 'PBKS'],
  ['MI', 'RR'],
  ['KKR', 'DC'],
]

const teamBackgrounds: Record<string, string> = {
  RCB: '/rcb.jpg',
  GT: '/gt.jpg',
  SRH: '/srh.jpg',
  PBKS: '/pbks.jpg',
  RR: '/rr.jpg',
  CSK: '/csk.jpg',
  KKR: '/kkr.jpg',
  DC: '/dc.jpg',
}

type Scenario = {
  results: string[]
  table: [string, number][]
}

function getScenarioExplanation(
  selectedTeam: string,
  title: string
) {
  const scenarios: Record<
    string,
    Record<string, string[]>
  > = {
    RCB: {
      QUALIFY: [
        'RCB win at least 1 match',
        'PBKS or RR lose at least 1 game',
        'Avoid major NRR collapse',
      ],

      'TOP 2': [
        'RCB beat PBKS',
        'RCB beat SRH',
        'GT lose at least 1 match',
      ],

      'BEST CASE': [
        'RCB win both matches',
        'GT lose to CSK',
        'PBKS lose at least 1 match',
      ],

      ELIMINATION: [
        'RCB lose both matches',
        'PBKS win both matches',
        'RR win both matches',
        'CSK win both matches',
      ],
    },

    GT: {
      QUALIFY: [
        'GT beat CSK',
        'RR or PBKS drop points',
      ],

      'TOP 2': [
        'GT beat CSK',
        'RCB lose at least 1 game',
      ],

      'BEST CASE': [
        'GT beat CSK',
        'RCB lose both matches',
      ],

      ELIMINATION: [
        'GT lose to CSK',
        'RR win both matches',
        'CSK win both matches',
      ],
    },

    SRH: {
      QUALIFY: [
        'SRH beat CSK',
        'SRH beat RCB',
      ],

      'TOP 2': [
        'SRH win both matches',
        'GT lose to CSK',
        'PBKS lose at least 1 match',
      ],

      'BEST CASE': [
        'SRH win both matches',
        'RCB lose both matches',
        'GT lose to CSK',
      ],

      ELIMINATION: [
        'SRH lose both matches',
        'CSK win both matches',
      ],
    },

    PBKS: {
      QUALIFY: [
        'PBKS beat RCB',
        'PBKS beat LSG',
      ],

      'TOP 2': [
        'PBKS win both matches',
        'RCB lose to SRH',
        'GT lose to CSK',
      ],

      'BEST CASE': [
        'PBKS win both matches',
        'RCB lose both matches',
        'GT lose to CSK',
      ],

      ELIMINATION: [
        'PBKS lose both matches',
        'RR win both matches',
        'CSK win both matches',
      ],
    },

    RR: {
      QUALIFY: [
        'RR beat DC',
        'RR beat MI',
      ],

      'TOP 2': [
        'RR win both matches',
        'GT lose to CSK',
        'PBKS lose at least 1 match',
      ],

      'BEST CASE': [
        'RR win both matches',
        'RCB lose both matches',
      ],

      ELIMINATION: [
        'RR lose both matches',
        'CSK win both matches',
      ],
    },

    CSK: {
      QUALIFY: [
        'CSK beat SRH',
        'CSK beat GT',
        'RR lose at least 1 game',
      ],

      'TOP 2': [
        'CSK win both matches big',
        'GT lose to CSK',
        'RCB lose both matches',
      ],

      'BEST CASE': [
        'CSK win both matches',
        'RR lose both matches',
        'PBKS lose both matches',
      ],

      ELIMINATION: [
        'CSK lose either match',
      ],
    },

    KKR: {
      QUALIFY: [
        'KKR beat MI',
        'KKR beat DC',
        'CSK lose at least 1 game',
        'RR lose both matches',
      ],

      'TOP 2': [
        'KKR win both matches big',
        'GT lose to CSK',
        'RCB lose both matches',
      ],

      'BEST CASE': [
        'KKR win both matches',
        'CSK lose both matches',
        'RR lose both matches',
      ],

      ELIMINATION: [
        'KKR lose either match',
      ],
    },

    DC: {
      QUALIFY: [
        'DC beat RR',
        'RR lose to MI',
        'CSK lose both matches',
      ],

      'TOP 2': [
        'Mathematically almost impossible',
      ],

      'BEST CASE': [
        'Absolute cricket chaos',
      ],

      ELIMINATION: [
        'DC lose to RR',
      ],
    },
  }

  return (
    scenarios[selectedTeam]?.[title] || []
  )
}

export default function Home() {
  const [selectedTeam, setSelectedTeam] = useState('')

  const currentBackground =
    selectedTeam
      ? teamBackgrounds[selectedTeam]
      : '/captains.png'

  const scenarios = useMemo(() => {
    const all: Scenario[] = []

    function simulate(
      index: number,
      table: Record<string, number>,
      results: string[]
    ) {
      if (index === matches.length) {
        const ordered = Object.entries(table).sort((a, b) => {
          if (b[1] !== a[1]) {
            return b[1] - a[1]
          }

          return Math.random() - 0.5
        })

        all.push({
          results,
          table: ordered,
        })

        return
      }

      const [home, away] = matches[index]

      const tableA = { ...table }

      if (tableA[home] !== undefined) {
        tableA[home] += 2
      }

      simulate(index + 1, tableA, [
        ...results,
        `${home} beat ${away}`,
      ])

      const tableB = { ...table }

      if (tableB[away] !== undefined) {
        tableB[away] += 2
      }

      simulate(index + 1, tableB, [
        ...results,
        `${away} beat ${home}`,
      ])
    }

    simulate(0, standingsBase, [])

    return all
  }, [])

  const data = useMemo(() => {
    if (!selectedTeam) return null

    const qualify = scenarios.filter((s) =>
      s.table
        .slice(0, 4)
        .some(([team]) => team === selectedTeam)
    )

    const top2 = scenarios.filter((s) =>
      s.table
        .slice(0, 2)
        .some(([team]) => team === selectedTeam)
    )

    const first = scenarios.filter(
      (s) => s.table[0][0] === selectedTeam
    )

    const eliminated = scenarios.filter(
      (s) =>
        !s.table
          .slice(0, 4)
          .some(([team]) => team === selectedTeam)
    )

    return {
      total: scenarios.length,
      qualify,
      top2,
      first,
      eliminated,
    }
  }, [selectedTeam, scenarios])

  function ScenarioCard({
    title,
    probability,
    color,
    scenario,
  }: any) {
    if (!scenario) return null

    const explanations =
      getScenarioExplanation(
        selectedTeam,
        title
      )

    return (
      <div
        className={`rounded-3xl border p-6 ${color} backdrop-blur-xl`}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-extrabold">
            {title}
          </h2>

          <div className="text-4xl font-black">
            {Number(probability).toFixed(1)}%
          </div>
        </div>

        <div className="w-full bg-black/30 rounded-full h-4 overflow-hidden mb-6">
          <div
            className="bg-white h-full"
            style={{
              width: `${probability}%`,
            }}
          />
        </div>

        <div className="mb-6">
          <div className="text-sm uppercase tracking-widest text-zinc-400 mb-3">
            What Needs To Happen
          </div>

          <div className="space-y-2">
            {explanations.map(
              (item: string, i: number) => (
                <div
                  key={i}
                  className="bg-black/30 p-3 rounded-xl"
                >
                  • {item}
                </div>
              )
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="text-sm uppercase tracking-widest text-zinc-400 mb-3">
            Match Results
          </div>

          <div className="space-y-2">
            {scenario.results
              .slice(0, 5)
              .map((r: string, i: number) => (
                <div
                  key={i}
                  className="bg-black/30 p-3 rounded-xl"
                >
                  {r}
                </div>
              ))}
          </div>
        </div>

        <div>
          <div className="text-sm uppercase tracking-widest text-zinc-400 mb-3">
            Final Points Table
          </div>

          <div className="space-y-2">
            {scenario.table.map(
              ([team, pts]: any, i: number) => (
                <div
                  key={team}
                  className={`flex justify-between rounded-xl p-3 ${
                    i === 0
                      ? 'bg-green-500/30'
                      : i < 4
                      ? 'bg-blue-500/20'
                      : 'bg-red-500/20'
                  }`}
                >
                  <span className="font-bold">
                    {i + 1}. {team}
                  </span>

                  <span className="font-bold text-lg">
                    {pts} pts
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div
        className="relative min-h-screen bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url(${currentBackground})`,
        }}
      >
        <div className="absolute inset-0 bg-black/70">
          <div className="flex flex-col items-center justify-center text-center px-6 min-h-screen">
            <div className="mb-5 bg-yellow-400/20 border border-yellow-400 text-yellow-300 px-5 py-2 rounded-full text-sm font-bold tracking-widest">
              AS OF GT vs KKR
            </div>

            <h1 className="text-6xl md:text-7xl font-black mb-6">
              IPL 2026
              <br />
              Playoff Predictor
            </h1>

            <p className="text-xl text-zinc-300 max-w-3xl mb-10">
              Explore every qualification scenario,
              top-2 possibility and elimination route.
            </p>

            <div className="w-full max-w-xl">
              <h2 className="text-3xl font-bold mb-5">
                Which Team Would You Like To Predict?
              </h2>

              <select
                value={selectedTeam}
                onChange={(e) =>
                  setSelectedTeam(e.target.value)
                }
                className="w-full bg-zinc-900/90 border border-zinc-700 p-5 rounded-2xl text-xl backdrop-blur-xl"
              >
                <option value="">Select Team</option>

                <option value="RCB">RCB</option>
                <option value="GT">GT</option>
                <option value="SRH">SRH</option>
                <option value="PBKS">PBKS</option>
                <option value="RR">RR</option>
                <option value="CSK">CSK</option>
                <option value="KKR">KKR</option>
                <option value="DC">DC</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        {data && (
          <>
            <div className="text-center mb-12">
              <div className="inline-block mb-4 bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-full text-sm tracking-wider">
                AS OF GT vs KKR
              </div>

              <h2 className="text-5xl font-black">
                {selectedTeam} Playoff Universes
              </h2>

              <p className="text-zinc-400 mt-4 text-lg">
                Simulating every mathematically possible IPL outcome.
              </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
              <ScenarioCard
                title="BEST CASE"
                probability={
                  playoffProbabilities[selectedTeam]
                    ?.first || 0
                }
                color="bg-green-500/10 border-green-400"
                scenario={data.first[0]}
              />

              <ScenarioCard
                title="TOP 2"
                probability={
                  playoffProbabilities[selectedTeam]
                    ?.top2 || 0
                }
                color="bg-yellow-500/10 border-yellow-400"
                scenario={data.top2[0]}
              />

              <ScenarioCard
                title="QUALIFY"
                probability={
                  playoffProbabilities[selectedTeam]
                    ?.qualify || 0
                }
                color="bg-blue-500/10 border-blue-400"
                scenario={data.qualify[0]}
              />

              <ScenarioCard
                title="ELIMINATION"
                probability={
                  playoffProbabilities[selectedTeam]
                    ?.eliminated || 0
                }
                color="bg-red-500/10 border-red-400"
                scenario={data.eliminated[0]}
              />
            </div>
          </>
        )}
      </div>
    </main>
  )
}