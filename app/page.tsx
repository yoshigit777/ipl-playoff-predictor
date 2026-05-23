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
    qualify: '✔️',
    top2: '✔️',
    status: 'QUALIFIER 1 🎉',
  },

  GT: {
    qualify: '✔️',
    top2: '✔️',
    status: 'QUALIFIER 1 🎉',
  },

  SRH: {
    qualify: '✔️',
    top2: '❌',
    status: 'ELIMINATOR 🎯',
  },

  RR: {
    qualify: '58%',
    top2: '❌',
  },

  PBKS: {
    qualify: 'PLAYOFF POSITION',
    top2: '15 PTS',
    status: 'CURRENTLY 4TH 🟢',
  },

  KKR: {
    qualify: '14%',
    top2: '❌',
  },

  CSK: {
    qualify: '0%',
    top2: '❌',
    status: 'ELIMINATED ❌',
  },

  DC: {
    qualify: '0.02%',
    top2: '❌',
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
    fixtures: ['GT (Qualifier 1)'],

    qualification: [
      'RCB officially qualified for Qualifier 1 🎉',
      'RCB will face GT in Qualifier 1',
      'Top 2 officially secured',
    ],

    top2: [
      'RCB locked into Top 2',
      'NRR battle successfully survived 😭',
    ],

    elimination: [
      'RCB cannot be eliminated',
      'One win away from IPL Final',
    ],
  },

  GT: {
    fixtures: ['RCB (Qualifier 1)'],

    qualification: [
      'GT officially qualified for Qualifier 1 🎉',
      'GT finished Top 2 successfully',
      'Will face RCB in Qualifier 1',
    ],

    top2: [
      'GT Top 2 officially confirmed',
      'Finished ahead of SRH comfortably',
    ],

    elimination: [
      'GT cannot be eliminated',
      'Two chances to reach final',
    ],
  },

  SRH: {
    fixtures: ['Eliminator vs 4th Place'],

    qualification: [
      'SRH officially qualified 🎉',
      'SRH locked into Eliminator',
      'Will face the eventual 4th placed team',
    ],

    top2: [
      'Top 2 officially impossible',
      'NRR equations against RCB were too massive',
    ],

    elimination: [
      'Lose Eliminator = knocked out',
      'Must win two straight playoff games for Final',
    ],
  },

  RR: {
    fixtures: ['MI (A)'],

    qualification: [
      'RR beat MI = qualify directly on 16 points',
      'Qualification completely in RR hands',
      'Highest odds among remaining contenders',
    ],

    top2: [
      'Top 2 officially impossible',
    ],

    elimination: [
      'RR lose and PBKS/KKR can overtake',
      'NRR may become important in 14-point ties',
    ],
  },

  PBKS: {
    fixtures: ['League Stage Completed'],

    qualification: [
      'PBKS are provisionally 4th after beating LSG 🎉',
      'If RR beat MI, PBKS are eliminated',
      'If MI beat RR and KKR fail massive NRR swing, PBKS qualify',
    ],

    top2: [
      'Top 2 officially impossible',
      'Finished league stage on 15 points',
    ],

    elimination: [
      'If MI beat RR, KKR can still overtake PBKS on NRR',
      'KKR need a 77-run win if scoring 200',
      'If chasing 180, KKR must finish in roughly 12 to 12.4 overs',
    ],
  },

  KKR: {
    fixtures: ['DC (H)'],

    qualification: [
      'KKR must beat DC',
      'MI must beat RR',
      'KKR must complete huge NRR swing over PBKS',
    ],

    top2: [
      'Top 2 officially impossible',
      'KKR can only finish on 15 points',
    ],

    elimination: [
      'If RR beat MI, KKR are eliminated',
      'If RR lose, KKR need historic NRR jump',
      '77-run win or ultra-fast chase required',
    ],
  },

  CSK: {
    fixtures: ['League Stage Completed'],

    qualification: [
      'CSK officially eliminated ❌',
      'Third straight group-stage exit',
    ],

    top2: [
      'Top 2 impossible',
    ],

    elimination: [
      'GT defeat officially ended campaign',
      'Finished on 12 points',
    ],
  },

  DC: {
    fixtures: ['KKR (A)'],

    qualification: [
      'DC must beat KKR',
      'RR must lose to MI',
      'PBKS must lose to LSG',
    ],

    top2: [
      'Top 2 mathematically impossible',
    ],

    elimination: [
      'NRR of -0.871 remains catastrophic',
      'Qualification odds effectively microscopic',
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
              AS OF PBKS vs LSG
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6">
              IPL 2026
              <br />
              Playoff Predictor
            </h1>

            <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mb-6">
              Explore every qualification
              scenario, playoff bracket
              and elimination risk.
            </p>

            <div className="mb-10 space-y-2 text-yellow-300 font-semibold text-center">
              <p>
                🏆 RCB vs GT Qualifier 1 confirmed
              </p>

              <p>
                ⚔️ SRH will play the 4th placed team
                in the Eliminator
              </p>

              <p>
                🔥 PBKS currently hold the final playoff spot
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
                Status:{' '}
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
              title="PLAYOFF POSITION"
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
