'use client'

import { useMemo, useState } from 'react'

const standingsBase: Record<string, number> = {
  RCB: 18,
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
    qualify: 100,
    top2: 92,
    first: 58,
    eliminated: 0,
  },

  GT: {
    qualify: 96,
    top2: 74,
    first: 24,
    eliminated: 4,
  },

  SRH: {
    qualify: 79,
    top2: 41,
    first: 11,
    eliminated: 21,
  },

  PBKS: {
    qualify: 38,
    top2: 12,
    first: 2,
    eliminated: 62,
  },

  RR: {
    qualify: 51,
    top2: 19,
    first: 4,
    eliminated: 49,
  },

  CSK: {
    qualify: 29,
    top2: 7,
    first: 1,
    eliminated: 71,
  },

  KKR: {
    qualify: 6,
    top2: 0.5,
    first: 0,
    eliminated: 94,
  },

  DC: {
    qualify: 0.2,
    top2: 0,
    first: 0,
    eliminated: 99.8,
  },
}

const matches = [
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

const remainingMatches: Record<
  string,
  string[]
> = {
  RCB: ['vs SRH'],

  GT: ['vs CSK'],

  SRH: ['vs CSK', 'vs RCB'],

  PBKS: ['vs LSG'],

  RR: ['vs DC', 'vs LSG', 'vs MI'],

  CSK: ['vs SRH', 'vs GT'],

  KKR: ['vs MI', 'vs DC'],

  DC: ['vs RR', 'vs KKR'],
}

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
      'TOP 2': [
        'RCB beat SRH',
        'GT lose to CSK',
      ],

      'BEST CASE': [
        'RCB beat SRH',
        'GT lose to CSK',
        'SRH lose to CSK',
      ],
    },

    GT: {
      QUALIFY: [
        'GT beat CSK',
      ],

      'TOP 2': [
        'GT beat CSK',
        'RCB lose to SRH',
      ],

      'BEST CASE': [
        'GT beat CSK',
        'RCB lose to SRH',
      ],

      ELIMINATION: [
        'GT lose to CSK',
        'CSK win both matches',
        'RR win all remaining matches',
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
      ],

      'BEST CASE': [
        'SRH win both matches',
        'RCB lose to SRH',
        'GT lose to CSK',
      ],

      ELIMINATION: [
        'SRH lose both matches',
      ],
    },

    PBKS: {
      QUALIFY: [
        'PBKS beat LSG',
        'CSK lose at least 1 match',
      ],

      'TOP 2': [
        'PBKS beat LSG big',
        'GT lose to CSK',
      ],

      'BEST CASE': [
        'PBKS beat LSG',
        'GT lose to CSK',
        'SRH lose both matches',
      ],

      ELIMINATION: [
        'PBKS lose to LSG',
      ],
    },

    RR: {
      QUALIFY: [
        'RR beat DC',
        'RR beat LSG',
        'RR beat MI',
      ],

      'TOP 2': [
        'RR win all matches',
        'GT lose to CSK',
      ],

      'BEST CASE': [
        'RR win all matches',
        'RCB lose to SRH',
      ],

      ELIMINATION: [
        'RR lose 2 matches',
      ],
    },

    CSK: {
      QUALIFY: [
        'CSK beat SRH',
        'CSK beat GT',
      ],

      'TOP 2': [
        'CSK win both matches big',
      ],

      'BEST CASE': [
        'CSK win both matches',
        'RR lose at least 1 match',
      ],

      ELIMINATION: [
        'CSK lose either match',
      ],
    },

    KKR: {
      QUALIFY: [
        'KKR beat MI',
        'KKR beat DC',
        'CSK lose both matches',
      ],

      'TOP 2': [
        'KKR win both matches big',
      ],

      'BEST CASE': [
        'KKR win both matches',
        'RR lose all matches',
      ],

      ELIMINATION: [
        'KKR lose either match',
      ],
    },

    DC: {
      QUALIFY: [
        'DC beat RR',
        'DC beat KKR',
        'CSK lose both matches',
      ],

      'TOP 2': [
        'Almost impossible',
      ],

      'BEST CASE': [
        'Absolute cricket madness',
      ],

      ELIMINATION: [
        'DC lose either match',
      ],
    },
  }

  return (
    scenarios[selectedTeam]?.[title] || []
  )
}

export default function Home() {
  const [selectedTeam, setSelectedTeam] =
    useState('')

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
        const ordered = Object.entries(table).sort(
          (a, b) => b[1] - a[1]
        )

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
    selectedTeam,
  }: any) {
    if (!scenario) return null

    const explanations =
      getScenarioExplanation(
        selectedTeam,
        title
      )

    return (
      <div
        className={`rounded-3xl border p-4 md:p-6 ${color} backdrop-blur-xl`}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-extrabold">
            {title}
          </h2>

          <div className="text-3xl md:text-4xl font-black">
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
            Remaining Matches
          </div>

          <div className="space-y-2">
            {remainingMatches[selectedTeam]?.map(
              (match: string, i: number) => (
                <div
                  key={i}
                  className="bg-white/10 p-3 rounded-xl font-semibold"
                >
                  {match}
                </div>
              )
            )}
          </div>
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
          <div className="flex flex-col items-center justify-center text-center px-4 md:px-6 min-h-screen">
            <div className="mb-5 bg-yellow-400/20 border border-yellow-400 text-yellow-300 px-5 py-2 rounded-full text-sm font-bold tracking-widest">
              AS OF RCB vs PBKS
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black mb-6">
              IPL 2026
              <br />
              Playoff Predictor
            </h1>

            <p className="text-base md:text-xl text-zinc-300 max-w-3xl mb-10">
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
                <option value="">
                  Select Team
                </option>

                <option value="RCB">RCB</option>
                <option value="GT">GT</option>
                <option value="SRH">SRH</option>
                <option value="PBKS">
                  PBKS
                </option>
                <option value="RR">RR</option>
                <option value="CSK">CSK</option>
                <option value="KKR">KKR</option>
                <option value="DC">DC</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-20">
        {data && (
          <>
            <div className="text-center mb-12">
              <div className="inline-block mb-4 bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-full text-sm tracking-wider">
                AS OF RCB vs PBKS
              </div>

              <h2 className="text-5xl font-black">
                {selectedTeam} Playoff Universes
              </h2>
            </div>

            {selectedTeam === 'RCB' ? (
              <div className="space-y-8">
                <div className="bg-green-500/20 border border-green-400 rounded-3xl p-10 text-center">
                  <div className="text-6xl mb-4">
                    🎉🏏🥳
                  </div>

                  <h2 className="text-5xl font-black text-green-300 mb-4">
                    RCB HAVE QUALIFIED
                  </h2>

                  <p className="text-xl text-zinc-200">
                    Bengaluru are officially through
                    to the IPL 2026 playoffs after
                    defeating PBKS.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <ScenarioCard
                    selectedTeam={selectedTeam}
                    title="TOP 2"
                    probability={
                      playoffProbabilities[
                        selectedTeam
                      ]?.top2 || 0
                    }
                    color="bg-yellow-500/10 border-yellow-400"
                    scenario={data.top2[0]}
                  />

                  <ScenarioCard
                    selectedTeam={selectedTeam}
                    title="BEST CASE"
                    probability={
                      playoffProbabilities[
                        selectedTeam
                      ]?.first || 0
                    }
                    color="bg-green-500/10 border-green-400"
                    scenario={data.first[0]}
                  />
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
                <ScenarioCard
                  selectedTeam={selectedTeam}
                  title="BEST CASE"
                  probability={
                    playoffProbabilities[
                      selectedTeam
                    ]?.first || 0
                  }
                  color="bg-green-500/10 border-green-400"
                  scenario={data.first[0]}
                />

                <ScenarioCard
                  selectedTeam={selectedTeam}
                  title="TOP 2"
                  probability={
                    playoffProbabilities[
                      selectedTeam
                    ]?.top2 || 0
                  }
                  color="bg-yellow-500/10 border-yellow-400"
                  scenario={data.top2[0]}
                />

                <ScenarioCard
                  selectedTeam={selectedTeam}
                  title="QUALIFY"
                  probability={
                    playoffProbabilities[
                      selectedTeam
                    ]?.qualify || 0
                  }
                  color="bg-blue-500/10 border-blue-400"
                  scenario={data.qualify[0]}
                />

                <ScenarioCard
                  selectedTeam={selectedTeam}
                  title="ELIMINATION"
                  probability={
                    playoffProbabilities[
                      selectedTeam
                    ]?.eliminated || 0
                  }
                  color="bg-red-500/10 border-red-400"
                  scenario={data.eliminated[0]}
                />
              </div>
            )}
          </>
        )}
      </div>

      <footer className="text-center text-zinc-500 py-10 text-sm border-t border-zinc-800">
        Made by{' '}
        <span className="font-bold text-white">
          Yash Joshi
        </span>{' '}
        🏏
      </footer>
    </main>
  )
}
