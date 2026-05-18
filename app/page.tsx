'use client'

import { useState } from 'react'

const teamBackgrounds: Record<string, string> = {
  RCB: '/rcb.jpg',
  GT: '/gt.jpg',
  SRH: '/srh.jpg',
  PBKS: '/pbks.jpg',
  CSK: '/csk.jpg',
  RR: '/rr.jpg',
  KKR: '/kkr.jpg',
  DC: '/dc.jpg',
}

const probabilities: Record<
  string,
  {
    qualify: string
    top2: string
    status?: string
  }
> = {
  RCB: {
    qualify: '100%',
    top2: '100%',
    status: 'QUALIFIED 🎉',
  },

  GT: {
    qualify: '99.2%',
    top2: '74%',
  },

  SRH: {
    qualify: '75%',
    top2: '41%',
  },

  PBKS: {
    qualify: '31.1%',
    top2: '0%',
  },

  CSK: {
    qualify: '35.5%',
    top2: '12%',
  },

  RR: {
    qualify: '34.8%',
    top2: '8%',
  },

  KKR: {
    qualify: '13.9%',
    top2: '1%',
  },

  DC: {
    qualify: '10.6%',
    top2: '0%',
  },
}

const scenarios: Record<
  string,
  {
    fixtures: string[]
    qualification: string[]
    top2: string[]
    elimination: string[]
  }
> = {
  RCB: {
    fixtures: ['SRH (A)'],

    qualification: [
      'Already qualified for playoffs 🎉',
      'RCB confirm Top 2 if CSK beat SRH OR CSK beat GT',
      'RCB beat SRH = finish 1st with 20 points',
    ],

    top2: [
      'RCB are overwhelming favourites for Top 2',
      'Only an extreme NRR swing can push them down',
      'SRH and GT both need to overtake RCB on NRR',
    ],

    elimination: [
      'RCB cannot be eliminated',
      'Playoff spot already secured',
    ],
  },

  GT: {
    fixtures: ['CSK (H)'],

    qualification: [
      'GT qualify if SRH beat CSK',
      'GT also qualify if LSG beat RR',
      'GT beat CSK = almost certain Top 2',
    ],

    top2: [
      'GT Top 2 confirmed if SRH lose one game and GT beat CSK',
      'GT can finish 1st if RCB lose to SRH',
      '18-point tie may depend on NRR',
    ],

    elimination: [
      'GT elimination requires a very specific 4-way tie',
      'CSK beat SRH and GT',
      'RR beat LSG and MI',
      'SRH beat RCB',
    ],
  },

  SRH: {
    fixtures: ['CSK (A)', 'RCB (H)'],

    qualification: [
      'SRH beat CSK = SRH and GT qualify',
      'SRH can qualify with one win too',
      'SRH can even sneak through on 14 points',
    ],

    top2: [
      'Win both games and SRH become Top 2 favourites',
      '18-point tie with RCB and GT may go to NRR',
      'SRH beating RCB becomes massive for Top 2',
    ],

    elimination: [
      'Lose both games and SRH become vulnerable',
      '16-point tie scenarios could eliminate SRH on NRR',
    ],
  },

  PBKS: {
    fixtures: ['LSG (A)'],

    qualification: [
      'PBKS need to beat LSG',
      'Only one of SRH, CSK or RR should reach 16',
      'KKR must lose OR PBKS stay ahead on NRR',
    ],

    top2: [
      'Top 2 chances almost impossible',
      'PBKS max out at 15 points',
    ],

    elimination: [
      'PBKS can still qualify with 13 points',
      'Need RR to lose both matches',
      'Need SRH and GT to beat CSK',
    ],
  },

  CSK: {
    fixtures: ['SRH (H)', 'GT (A)'],

    qualification: [
      'CSK qualify with 16 points if they win both',
      'RCB beating SRH helps CSK massively',
      'RR dropping one game also helps',
    ],

    top2: [
      'CSK Top 2 possible with two wins',
      '16-point ties may go to NRR',
      'Beating SRH is the key fixture',
    ],

    elimination: [
      'Lose both games and CSK are eliminated',
      'One loss creates dependence on several results',
    ],
  },

  RR: {
    fixtures: ['LSG (H)', 'MI (A)'],

    qualification: [
      'RR likely need to win both remaining games',
      'Only one of SRH or CSK should get to 16',
      'RR can still qualify on 14 in rare cases',
    ],

    top2: [
      'RR Top 2 possible if they win both and GT lose',
      'NRR may become decisive',
    ],

    elimination: [
      'RR lose both and qualification becomes extremely unlikely',
      'One loss puts RR under major pressure',
    ],
  },

  KKR: {
    fixtures: ['MI (H)', 'DC (H)'],

    qualification: [
      'KKR likely need to win both matches',
      'Only one of SRH, CSK or RR should hit 16',
      'PBKS must lose OR trail KKR on NRR',
    ],

    top2: [
      'Top 2 chances are extremely tiny',
      '15-point ceiling hurts KKR heavily',
    ],

    elimination: [
      'KKR can still qualify with 13 points',
      'Need RR to lose both',
      'Need SRH and GT to beat CSK',
    ],
  },

  DC: {
    fixtures: ['KKR (A)'],

    qualification: [
      'DC must beat KKR',
      'Need LSG to beat PBKS',
      'Need LSG and MI to beat RR',
      'Need SRH and GT to beat CSK',
    ],

    top2: [
      'Top 2 mathematically impossible',
    ],

    elimination: [
      'NRR of -0.871 is a huge problem',
      'Any multi-team tie likely eliminates DC',
    ],
  },
}

function InfoCard({
  title,
  items,
  color,
}: {
  title: string
  items: string[]
  color: string
}) {
  return (
    <div
      className={`rounded-3xl border p-6 backdrop-blur-xl w-[360px] ${color}`}
    >
      <h2 className="text-3xl font-black mb-6 text-center">
        {title}
      </h2>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-black/30 rounded-2xl p-4"
          >
            • {item}
          </div>
        ))}
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
        <div className="absolute inset-0 bg-black/75">
          <div className="flex flex-col items-center justify-center text-center px-4 min-h-screen">
            <div className="mb-5 bg-yellow-400/20 border border-yellow-400 text-yellow-300 px-5 py-2 rounded-full text-sm font-bold tracking-widest">
              AS OF DC vs RR
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6">
              IPL 2026
              <br />
              Playoff Predictor
            </h1>

            <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mb-6">
              Explore every qualification
              scenario, top-two possibility
              and elimination pathway.
            </p>

            <div className="mb-10 space-y-2 text-yellow-300 font-semibold text-center">
              <p>
                If SRH beat CSK:
                <span className="text-green-400">
                  {' '}
                  SRH & GT qualify into playoffs
                </span>
              </p>

              <p>
                If CSK beat SRH:
                <span className="text-blue-400">
                  {' '}
                  RCB confirm Qualifier 1
                </span>
              </p>
            </div>

            <div className="w-full max-w-xl">
              <h2 className="text-3xl font-bold mb-5">
                Which Team Would You Like To Predict?
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

                <option value="CSK">CSK</option>
                <option value="DC">DC</option>
                <option value="GT">GT</option>
                <option value="KKR">KKR</option>
                <option value="PBKS">
                  PBKS
                </option>
                <option value="RCB">RCB</option>
                <option value="RR">RR</option>
                <option value="SRH">SRH</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {selectedTeam && (
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-14">
            <h2 className="text-5xl font-black mb-4">
              {selectedTeam} Scenario Centre
            </h2>

            <div className="flex justify-center gap-4 flex-wrap">
              <div className="bg-blue-500/20 border border-blue-400 px-5 py-3 rounded-2xl text-lg font-bold">
                Playoff Odds:{' '}
                {
                  probabilities[selectedTeam]
                    .qualify
                }
              </div>

              <div className="bg-yellow-500/20 border border-yellow-400 px-5 py-3 rounded-2xl text-lg font-bold">
                Top 2 Odds:{' '}
                {
                  probabilities[selectedTeam]
                    .top2
                }
              </div>

              {probabilities[selectedTeam]
                .status && (
                <div className="bg-green-500/20 border border-green-400 px-5 py-3 rounded-2xl text-lg font-bold">
                  {
                    probabilities[selectedTeam]
                      .status
                  }
                </div>
              )}
            </div>

            <div className="mt-8">
              <div className="text-zinc-400 uppercase tracking-widest text-sm mb-3">
                Remaining Fixtures
              </div>

              <div className="flex justify-center gap-3 flex-wrap">
                {scenarios[
                  selectedTeam
                ].fixtures.map(
                  (fixture, index) => (
                    <div
                      key={index}
                      className="bg-zinc-800/80 px-5 py-3 rounded-2xl font-semibold"
                    >
                      {fixture}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-8 items-start">
            <InfoCard
              title="QUALIFICATION ROUTE"
              items={
                scenarios[selectedTeam]
                  .qualification
              }
              color="bg-blue-500/10 border-blue-400"
            />

            <InfoCard
              title="TOP 2 ROUTE"
              items={
                scenarios[selectedTeam].top2
              }
              color="bg-yellow-500/10 border-yellow-400"
            />

            <InfoCard
              title="ELIMINATION RISK"
              items={
                scenarios[selectedTeam]
                  .elimination
              }
              color="bg-red-500/10 border-red-400"
            />
          </div>
        </div>
      )}

      <footer className="text-center text-zinc-500 py-10 text-sm border-t border-zinc-800 mt-16">
        Made by{' '}
        <span className="font-bold text-white">
          Yash Joshi
        </span>{' '}
        🏏
      </footer>
    </main>
  )
}
