'use client'

import { useState } from 'react'

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

const scenarios: any = {
  RCB: {
    qualified: true,

    cards: {
      'BEST CASE': {
        probability: 58,
        points: 20,

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
      },

      'TOP 2': {
        probability: 92,
        points: 20,

        results: [
          'RCB beat SRH',
        ],

        table: [
          ['RCB', 20],
          ['GT', 18],
          ['SRH', 14],
          ['PBKS', 13],
          ['RR', 12],
          ['CSK', 12],
          ['KKR', 11],
          ['DC', 10],
        ],
      },

      'WORST CASE': {
        probability: 8,
        points: 18,

        results: [
          'SRH beat RCB',
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
      },
    },
  },

  GT: {
    cards: {
      'BEST CASE': {
        probability: 24,
        points: 18,

        results: [
          'GT beat CSK',
          'RCB lose to SRH',
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
      },

      'TOP 2': {
        probability: 76,
        points: 18,

        results: [
          'GT beat CSK',
        ],

        table: [
          ['RCB', 18],
          ['GT', 18],
          ['SRH', 14],
          ['PBKS', 13],
          ['RR', 12],
          ['CSK', 12],
          ['KKR', 11],
          ['DC', 10],
        ],
      },

      QUALIFY: {
        probability: 98,
        points: 18,

        results: [
          'GT beat CSK',
        ],

        table: [
          ['RCB', 18],
          ['GT', 18],
          ['SRH', 14],
          ['PBKS', 13],
          ['RR', 12],
          ['CSK', 12],
          ['KKR', 11],
          ['DC', 10],
        ],
      },

      ELIMINATION: {
        probability: 2,
        points: 16,

        results: [
          'GT lose to CSK',
          'RR win all matches',
        ],

        table: [
          ['RR', 18],
          ['RCB', 18],
          ['CSK', 16],
          ['GT', 16],
          ['SRH', 14],
          ['PBKS', 13],
          ['KKR', 11],
          ['DC', 10],
        ],
      },
    },
  },

  SRH: {
    cards: {
      'BEST CASE': {
        probability: 11,
        points: 18,

        results: [
          'SRH beat CSK',
          'SRH beat RCB',
        ],

        table: [
          ['SRH', 18],
          ['RCB', 18],
          ['GT', 16],
          ['PBKS', 13],
          ['RR', 12],
          ['CSK', 12],
          ['KKR', 11],
          ['DC', 10],
        ],
      },

      'TOP 2': {
        probability: 39,
        points: 18,

        results: [
          'SRH win both matches',
        ],

        table: [
          ['RCB', 18],
          ['SRH', 18],
          ['GT', 16],
          ['PBKS', 13],
          ['RR', 12],
          ['CSK', 12],
          ['KKR', 11],
          ['DC', 10],
        ],
      },

      QUALIFY: {
        probability: 74,
        points: 16,

        results: [
          'SRH beat CSK',
        ],

        table: [
          ['RCB', 18],
          ['GT', 16],
          ['SRH', 16],
          ['PBKS', 13],
          ['RR', 12],
          ['CSK', 12],
          ['KKR', 11],
          ['DC', 10],
        ],
      },

      ELIMINATION: {
        probability: 26,
        points: 14,

        results: [
          'SRH lose both matches',
        ],

        table: [
          ['RCB', 20],
          ['GT', 18],
          ['PBKS', 13],
          ['RR', 12],
          ['CSK', 12],
          ['SRH', 14],
          ['KKR', 11],
          ['DC', 10],
        ],
      },
    },
  },

  PBKS: {
    cards: {
      'BEST CASE': {
        probability: 1,
        points: 15,

        results: [
          'PBKS beat LSG',
          'GT lose to CSK',
        ],

        table: [
          ['RCB', 18],
          ['CSK', 16],
          ['GT', 16],
          ['PBKS', 15],
          ['SRH', 14],
          ['RR', 12],
          ['KKR', 11],
          ['DC', 10],
        ],
      },

      'TOP 2': {
        probability: 8,
        points: 15,

        results: [
          'PBKS beat LSG big',
        ],

        table: [
          ['RCB', 18],
          ['GT', 16],
          ['PBKS', 15],
          ['SRH', 14],
          ['RR', 12],
          ['CSK', 12],
          ['KKR', 11],
          ['DC', 10],
        ],
      },

      QUALIFY: {
        probability: 23,
        points: 15,

        results: [
          'PBKS beat LSG',
        ],

        table: [
          ['RCB', 18],
          ['GT', 16],
          ['SRH', 14],
          ['PBKS', 15],
          ['RR', 12],
          ['CSK', 12],
          ['KKR', 11],
          ['DC', 10],
        ],
      },

      ELIMINATION: {
        probability: 77,
        points: 13,

        results: [
          'PBKS lose to LSG',
        ],

        table: [
          ['RCB', 18],
          ['GT', 16],
          ['SRH', 14],
          ['RR', 12],
          ['CSK', 12],
          ['PBKS', 13],
          ['KKR', 11],
          ['DC', 10],
        ],
      },
    },
  },

  RR: {
    cards: {
      'BEST CASE': {
        probability: 4,
        points: 18,

        results: [
          'RR win all matches',
        ],

        table: [
          ['RCB', 18],
          ['RR', 18],
          ['GT', 16],
          ['SRH', 14],
          ['PBKS', 13],
          ['CSK', 12],
          ['KKR', 11],
          ['DC', 10],
        ],
      },

      'TOP 2': {
        probability: 21,
        points: 18,

        results: [
          'RR win all matches',
          'GT lose to CSK',
        ],

        table: [
          ['RR', 18],
          ['RCB', 18],
          ['CSK', 16],
          ['GT', 16],
          ['SRH', 14],
          ['PBKS', 13],
          ['KKR', 11],
          ['DC', 10],
        ],
      },

      QUALIFY: {
        probability: 58,
        points: 18,

        results: [
          'RR beat DC',
          'RR beat LSG',
          'RR beat MI',
        ],

        table: [
          ['RCB', 18],
          ['RR', 18],
          ['GT', 16],
          ['SRH', 14],
          ['PBKS', 13],
          ['CSK', 12],
          ['KKR', 11],
          ['DC', 10],
        ],
      },

      ELIMINATION: {
        probability: 42,
        points: 14,

        results: [
          'RR lose 2 matches',
        ],

        table: [
          ['RCB', 18],
          ['GT', 16],
          ['SRH', 14],
          ['PBKS', 13],
          ['CSK', 12],
          ['RR', 14],
          ['KKR', 11],
          ['DC', 10],
        ],
      },
    },
  },

  CSK: {
    cards: {
      'BEST CASE': {
        probability: 1,
        points: 16,

        results: [
          'CSK beat SRH',
          'CSK beat GT',
        ],

        table: [
          ['RCB', 18],
          ['CSK', 16],
          ['GT', 16],
          ['PBKS', 13],
          ['SRH', 14],
          ['RR', 12],
          ['KKR', 11],
          ['DC', 10],
        ],
      },

      'TOP 2': {
        probability: 9,
        points: 16,

        results: [
          'CSK win both matches',
        ],

        table: [
          ['RCB', 18],
          ['CSK', 16],
          ['GT', 16],
          ['SRH', 14],
          ['PBKS', 13],
          ['RR', 12],
          ['KKR', 11],
          ['DC', 10],
        ],
      },

      QUALIFY: {
        probability: 33,
        points: 16,

        results: [
          'CSK win both matches',
        ],

        table: [
          ['RCB', 18],
          ['CSK', 16],
          ['GT', 16],
          ['SRH', 14],
          ['PBKS', 13],
          ['RR', 12],
          ['KKR', 11],
          ['DC', 10],
        ],
      },

      ELIMINATION: {
        probability: 67,
        points: 12,

        results: [
          'CSK lose either match',
        ],

        table: [
          ['RCB', 18],
          ['GT', 18],
          ['SRH', 16],
          ['PBKS', 13],
          ['RR', 12],
          ['CSK', 12],
          ['KKR', 11],
          ['DC', 10],
        ],
      },
    },
  },
KKR: {
  cards: {
    'BEST CASE': {
      probability: 0,
      points: 15,

      results: [
        'KKR beat MI',
        'KKR beat DC',
        'CSK lose both matches',
      ],

      table: [
        ['RCB', 18],
        ['GT', 18],
        ['SRH', 16],
        ['KKR', 15],
        ['PBKS', 13],
        ['RR', 12],
        ['CSK', 12],
        ['DC', 10],
      ],
    },

    'TOP 2': {
      probability: 1,
      points: 15,

      results: [
        'KKR win both matches big',
        'GT lose to CSK',
      ],

      table: [
        ['RCB', 18],
        ['CSK', 16],
        ['KKR', 15],
        ['GT', 16],
        ['SRH', 14],
        ['PBKS', 13],
        ['RR', 12],
        ['DC', 10],
      ],
    },

    QUALIFY: {
      probability: 10,
      points: 15,

      results: [
        'KKR beat MI',
        'KKR beat DC',
        'CSK lose both',
      ],

      table: [
        ['RCB', 18],
        ['GT', 16],
        ['SRH', 14],
        ['KKR', 15],
        ['PBKS', 13],
        ['RR', 12],
        ['CSK', 12],
        ['DC', 10],
      ],
    },

    ELIMINATION: {
      probability: 90,
      points: 11,

      results: [
        'KKR lose either match',
      ],

      table: [
        ['RCB', 18],
        ['GT', 16],
        ['SRH', 14],
        ['PBKS', 13],
        ['RR', 12],
        ['CSK', 12],
        ['KKR', 11],
        ['DC', 10],
      ],
    },
  },
},

DC: {
  cards: {
    'BEST CASE': {
      probability: 0,
      points: 14,

      results: [
        'DC beat RR',
        'DC beat KKR',
        'CSK lose both matches',
      ],

      table: [
        ['RCB', 18],
        ['GT', 16],
        ['SRH', 14],
        ['DC', 14],
        ['PBKS', 13],
        ['RR', 12],
        ['CSK', 12],
        ['KKR', 11],
      ],
    },

    'TOP 2': {
      probability: 0,
      points: 14,

      results: [
        'Mathematically near impossible',
      ],

      table: [
        ['RCB', 18],
        ['GT', 16],
        ['SRH', 14],
        ['DC', 14],
        ['PBKS', 13],
        ['RR', 12],
        ['CSK', 12],
        ['KKR', 11],
      ],
    },

    QUALIFY: {
      probability: 5,
      points: 14,

      results: [
        'DC win both matches',
        'CSK lose both matches',
      ],

      table: [
        ['RCB', 18],
        ['GT', 16],
        ['SRH', 14],
        ['DC', 14],
        ['PBKS', 13],
        ['RR', 12],
        ['CSK', 12],
        ['KKR', 11],
      ],
    },

    ELIMINATION: {
      probability: 95,
      points: 10,

      results: [
        'DC lose either match',
      ],

      table: [
        ['RCB', 18],
        ['GT', 16],
        ['SRH', 14],
        ['PBKS', 13],
        ['RR', 12],
        ['CSK', 12],
        ['KKR', 11],
        ['DC', 10],
      ],
    },
  },
},
}

function ScenarioCard({
  title,
  color,
  data,
}: any) {
  return (
    <div
      className={`rounded-3xl border p-5 md:p-6 ${color} backdrop-blur-xl w-[340px]`}
    >
      <div className="mb-5 text-center">
        <h2 className="text-2xl font-extrabold mb-3">
          {title}
        </h2>

        <div className="text-5xl font-black">
          {data.probability}%
        </div>
      </div>

      <div className="w-full bg-black/30 rounded-full h-4 overflow-hidden mb-6">
        <div
          className="bg-white h-full"
          style={{
            width: `${data.probability}%`,
          }}
        />
      </div>

      <div className="mb-6 text-center">
        <div className="text-sm uppercase tracking-widest text-zinc-400 mb-3">
          Required Results
        </div>

        <div className="space-y-2">
          {data.results.map(
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

      <div className="mb-6 text-center">
        <div className="text-sm uppercase tracking-widest text-zinc-400 mb-3">
          Final Points Table
        </div>

        <div className="space-y-2">
          {data.table.map(
            ([team, pts]: any, i: number) => (
              <div
                key={team}
                className={`flex justify-between rounded-xl p-3 ${
                  i < 4
                    ? 'bg-blue-500/20'
                    : 'bg-red-500/20'
                }`}
              >
                <span className="font-bold">
                  {i + 1}. {team}
                </span>

                <span className="font-bold">
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
        className="relative min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${currentBackground})`,
        }}
      >
        <div className="absolute inset-0 bg-black/70">
          <div className="flex flex-col items-center justify-center text-center px-4 min-h-screen">
            <div className="mb-5 bg-yellow-400/20 border border-yellow-400 text-yellow-300 px-5 py-2 rounded-full text-sm font-bold tracking-widest">
              AS OF RCB vs PBKS
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6">
              IPL 2026
              <br />
              Playoff Predictor
            </h1>

            <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mb-10">
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
                className="w-full bg-zinc-900/90 border border-zinc-700 p-5 rounded-2xl text-xl"
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
              </select>
            </div>
          </div>
        </div>
      </div>

      {selectedTeam && (
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black">
              {selectedTeam} Playoff
              Universes
            </h2>
          </div>

          {scenarios[selectedTeam]
            ?.qualified && (
            <div className="bg-green-500/20 border border-green-400 rounded-3xl p-10 text-center mb-10">
              <div className="text-6xl mb-4">
                🎉🏏🥳
              </div>

              <h2 className="text-5xl font-black text-green-300 mb-4">
                {selectedTeam} HAVE QUALIFIED
              </h2>
            </div>
          )}

          <div className="flex flex-wrap justify-center items-start gap-8">
            {Object.entries(
              scenarios[selectedTeam].cards
            ).map(([title, data]) => (
              <ScenarioCard
                key={title}
                title={title}
                data={data}
                color={
                  title === 'BEST CASE'
                    ? 'bg-green-500/10 border-green-400'
                    : title === 'TOP 2'
                    ? 'bg-yellow-500/10 border-yellow-400'
                    : title === 'QUALIFY'
                    ? 'bg-blue-500/10 border-blue-400'
                    : 'bg-red-500/10 border-red-400'
                }
              />
            ))}
          </div>
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
