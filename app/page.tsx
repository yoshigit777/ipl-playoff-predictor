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
    qualify: 98,
    top2: 76,
    first: 24,
    eliminated: 2,
  },

  SRH: {
    qualify: 74,
    top2: 39,
    first: 11,
    eliminated: 26,
  },

  PBKS: {
    qualify: 23,
    top2: 8,
    first: 1,
    eliminated: 77,
  },

  RR: {
    qualify: 58,
    top2: 21,
    first: 4,
    eliminated: 42,
  },

  CSK: {
    qualify: 33,
    top2: 9,
    first: 1,
    eliminated: 67,
  },

  KKR: {
    qualify: 10,
    top2: 1,
    first: 0,
    eliminated: 90,
  },

  DC: {
    qualify: 5,
    top2: 0,
    first: 0,
    eliminated: 95,
  },
}

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

function getScenarioExplanation(
  selectedTeam: string,
  title: string
) {
  const scenarios: Record<
    string,
    Record<string, string[]>
  > = {
    GT: {
      QUALIFY: ['GT beat CSK'],
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
        'RR win all matches',
      ],
    },

    SRH: {
      QUALIFY: [
        'SRH beat CSK',
        'SRH beat RCB',
      ],
      'TOP 2': [
        'SRH win both matches',
      ],
      'BEST CASE': [
        'SRH win both matches',
        'GT lose to CSK',
      ],
      ELIMINATION: [
        'SRH lose both matches',
      ],
    },

    PBKS: {
      QUALIFY: [
        'PBKS beat LSG',
      ],
      'TOP 2': [
        'PBKS beat LSG big',
      ],
      'BEST CASE': [
        'PBKS beat LSG',
        'GT lose to CSK',
      ],
      ELIMINATION: [
        'PBKS lose to LSG',
      ],
    },

    RR: {
      QUALIFY: [
        'RR win all matches',
      ],
      'TOP 2': [
        'RR win all matches',
        'GT lose to CSK',
      ],
      'BEST CASE': [
        'RR win all matches',
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
        'CSK win both matches',
      ],
      'BEST CASE': [
        'CSK win both matches',
      ],
      ELIMINATION: [
        'CSK lose either match',
      ],
    },

    KKR: {
      QUALIFY: [
        'KKR beat MI',
        'KKR beat DC',
      ],
      'TOP 2': [
        'KKR win both matches',
      ],
      'BEST CASE': [
        'KKR win both matches',
      ],
      ELIMINATION: [
        'KKR lose either match',
      ],
    },

    DC: {
      QUALIFY: [
        'DC beat RR',
        'DC beat KKR',
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
      className={`rounded-3xl border p-5 md:p-6 ${color} backdrop-blur-xl w-[340px]`}
    >
      <div className="mb-5 text-center">
        <h2 className="text-2xl font-extrabold mb-3">
          {title}
        </h2>

        <div className="text-4xl md:text-5xl font-black">
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

      <div className="mb-6 text-center">
        <div className="text-sm uppercase tracking-widest text-zinc-400 mb-3">
          Remaining Matches
        </div>

        <div className="space-y-2 flex flex-col items-center">
          {remainingMatches[selectedTeam]?.map(
            (match: string, i: number) => (
              <div
                key={i}
                className="bg-white/10 p-3 rounded-xl font-semibold w-full text-center"
              >
                {match}
              </div>
            )
          )}
        </div>
      </div>

      <div className="mb-6 text-center">
        <div className="text-sm uppercase tracking-widest text-zinc-400 mb-3">
          What Needs To Happen
        </div>

        <div className="space-y-2 flex flex-col items-center">
          {explanations.map(
            (item: string, i: number) => (
              <div
                key={i}
                className="bg-black/30 p-3 rounded-xl w-full text-center"
              >
                • {item}
              </div>
            )
          )}
        </div>
      </div>

      <div className="mb-6 text-center">
        <div className="text-sm uppercase tracking-widest text-zinc-400 mb-3">
          Final Points Table
        </div>

        <div className="space-y-2 flex flex-col items-center">
          {scenario.table.map(
            ([team, pts]: any, i: number) => (
              <div
                key={team}
                className={`flex justify-between rounded-xl p-3 w-full ${
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

export default function Home() {
  const [selectedTeam, setSelectedTeam] =
    useState('')

  const currentBackground =
    selectedTeam
      ? teamBackgrounds[selectedTeam]
      : '/captains.png'

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
              Explore every qualification
              scenario, top-2 possibility and
              elimination route.
            </p>

            <div className="w-full max-w-xl">
              <h2 className="text-3xl font-bold mb-5">
                Which Team Would You Like To
                Predict?
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

      {selectedTeam && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-20">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-full text-sm tracking-wider">
              AS OF RCB vs PBKS
            </div>

            <h2 className="text-5xl font-black mb-12">
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
                  Bengaluru are officially
                  through to the IPL 2026
                  playoffs after defeating
                  PBKS.
                </p>
              </div>

              <div className="flex flex-wrap justify-center items-start gap-8 max-w-7xl mx-auto">
                <ScenarioCard
                  selectedTeam={selectedTeam}
                  title="BEST CASE"
                  probability={58}
                  color="bg-green-500/10 border-green-400"
                  scenario={{
                    results: [
                      'RCB beat SRH',
                      'CSK beat GT',
                    ],

                    table: [
                      ['RCB', 20],
                      ['CSK', 16],
                      ['GT', 16],
                      ['SRH', 14],
                      ['PBKS', 13],
                      ['RR', 12],
                      ['KKR', 11],
                      ['DC', 10],
                    ],
                  }}
                />

                <ScenarioCard
                  selectedTeam={selectedTeam}
                  title="TOP 2"
                  probability={92}
                  color="bg-yellow-500/10 border-yellow-400"
                  scenario={{
                    results: [
                      'RCB beat SRH',
                      'GT lose to CSK',
                    ],

                    table: [
                      ['RCB', 20],
                      ['CSK', 16],
                      ['GT', 16],
                      ['SRH', 14],
                      ['PBKS', 13],
                      ['RR', 12],
                      ['KKR', 11],
                      ['DC', 10],
                    ],
                  }}
                />

                <ScenarioCard
                  selectedTeam={selectedTeam}
                  title="WORST CASE"
                  probability={8}
                  color="bg-red-500/10 border-red-400"
                  scenario={{
                    results: [
                      'SRH beat RCB',
                      'GT beat CSK',
                    ],

                    table: [
                      ['GT', 18],
                      ['RCB', 18],
                      ['SRH', 16],
                      ['PBKS', 13],
                      ['RR', 12],
                      ['CSK', 12],
                      ['KKR', 11],
                      ['DC', 10],
                    ],
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center items-start gap-8 max-w-7xl mx-auto">
              <ScenarioCard
                selectedTeam={selectedTeam}
                title="BEST CASE"
                probability={
                  playoffProbabilities[
                    selectedTeam
                  ]?.first || 0
                }
                color="bg-green-500/10 border-green-400"
                scenario={{
                  results: ['Best possible results'],
                  table: [
                    [selectedTeam, 20],
                  ],
                }}
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
                scenario={{
                  results: ['Top 2 route'],
                  table: [
                    [selectedTeam, 18],
                  ],
                }}
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
                scenario={{
                  results: [
                    'Qualification route',
                  ],
                  table: [
                    [selectedTeam, 16],
                  ],
                }}
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
                scenario={{
                  results: ['Elimination route'],
                  table: [
                    [selectedTeam, 12],
                  ],
                }}
              />
            </div>
          )}
        </div>
      )}

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
