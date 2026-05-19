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
    top2: '99.7%',
    status: 'QUALIFIED 🎉',
  },

  GT: {
    qualify: '✔️',
    top2: '58%',
    status: 'QUALIFIED 🎉',
  },

  SRH: {
    qualify: '✔️',
    top2: '41%',
    status: 'QUALIFIED 🎉',
  },

  RR: {
    qualify: '38%',
    top2: '1%',
  },

  PBKS: {
    qualify: '37%',
    top2: '0%',
  },

  KKR: {
    qualify: '11%',
    top2: '0%',
  },

  CSK: {
    qualify: '11%',
    top2: '0%',
  },

  DC: {
    qualify: '4%',
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
      'RCB seal Top 2 with a win over SRH',
      'CSK beating GT also confirms RCB Top 2',
    ],

    top2: [
      'RCB are overwhelming favourites for Top 2',
      '99.7% chance after Match 63',
      'Only a massive NRR swing can deny them',
    ],

    elimination: [
      'RCB cannot be eliminated',
      'Playoff spot already confirmed',
    ],
  },

  GT: {
    fixtures: ['CSK (H)'],

    qualification: [
      'GT officially qualified 🎉',
      'GT beat CSK = strong Top 2 chance',
      'GT can still finish 1st if RCB lose',
    ],

    top2: [
      'GT Top 2 chances currently at 58%',
      'GT need a strong result vs CSK',
      'NRR battle with SRH and RCB possible',
    ],

    elimination: [
      'GT cannot be eliminated',
      'Playoff berth already secured',
    ],
  },

  SRH: {
    fixtures: ['RCB (H)'],

    qualification: [
      'SRH officially qualified 🎉',
      'SRH beat RCB = massive Top 2 boost',
      'SRH can still finish 1st via NRR',
    ],

    top2: [
      'Top 2 odds jumped to 41%',
      'Beating RCB becomes the key game',
      'Large-margin win improves NRR significantly',
    ],

    elimination: [
      'SRH cannot be eliminated',
      'Playoff berth already secured',
    ],
  },

  RR: {
    fixtures: ['LSG (H)', 'MI (A)'],

    qualification: [
      'RR likely need to win both remaining matches',
      '16 points almost guarantees qualification',
      'RR can still qualify on 14 in some scenarios',
    ],

    top2: [
      'RR have a tiny 1% Top 2 chance',
      'Need massive results and NRR swing',
    ],

    elimination: [
      'RR lose both = eliminated',
      'One loss creates huge pressure',
    ],
  },

  PBKS: {
    fixtures: ['LSG (A)'],

    qualification: [
      'PBKS must beat LSG',
      'RR should lose at least one match',
      'KKR losing helps PBKS massively',
    ],

    top2: [
      'Top 2 now mathematically almost impossible',
      'PBKS max possible points = 15',
    ],

    elimination: [
      'PBKS lose to LSG = likely eliminated',
      'NRR battle with KKR possible',
    ],
  },

  KKR: {
    fixtures: ['MI (H)', 'DC (H)'],

    qualification: [
      'KKR likely need to win both games',
      'RR should lose one match',
      'PBKS losing helps KKR greatly',
    ],

    top2: [
      'Top 2 mathematically near impossible',
      '15-point ceiling hurts KKR badly',
    ],

    elimination: [
      'Lose either match and qualification gets difficult',
      'NRR could become decisive',
    ],
  },

  CSK: {
    fixtures: ['GT (A)'],

    qualification: [
      'CSK must beat GT',
      'Need RR to lose both matches',
      'Need LSG to beat PBKS',
      'Need KKR to split their two games',
    ],

    top2: [
      'Mathematically Impossible',
    ],

    elimination: [
      'CSK lose to GT = eliminated',
      'Even winning may not be enough',
    ],
  },

  DC: {
    fixtures: ['KKR (A)'],

    qualification: [
      'DC must beat KKR',
      'Need RR to lose both',
      'Need GT to beat CSK',
      'Need LSG to beat PBKS',
    ],

    top2: [
      'Top 2 mathematically impossible',
    ],

    elimination: [
      'Poor NRR severely hurts DC',
      'Any tie on points likely eliminates them',
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
              AS OF MATCH 63 • CSK vs SRH
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
                RCB, GT and SRH have officially
                qualified for the playoffs 🎉
              </p>

              <p>
                RCB are now overwhelming favourites
                for a Top 2 finish 🏏
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
