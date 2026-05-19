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
    top2: '96%',
    status: 'QUALIFIED 🎉',
  },

  GT: {
    qualify: '100%',
    top2: '72%',
    status: 'QUALIFIED 🎉',
  },

  SRH: {
    qualify: '100%',
    top2: '44%',
    status: 'QUALIFIED 🎉',
  },

  PBKS: {
    qualify: '28%',
    top2: '0%',
  },

  CSK: {
    qualify: '18%',
    top2: '4%',
  },

  RR: {
    qualify: '46%',
    top2: '11%',
  },

  KKR: {
    qualify: '15%',
    top2: '1%',
  },

  DC: {
    qualify: '8%',
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
      'RCB confirm Top 2 if they beat SRH',
      'RCB also confirm Top 2 if CSK beat GT',
    ],

    top2: [
      'RCB finish 1st if they beat SRH',
      'Only an extreme NRR swing can deny Top 2',
      'GT and SRH both need massive NRR wins',
    ],

    elimination: [
      'RCB cannot be eliminated',
      'Playoff berth already sealed',
    ],
  },

  GT: {
    fixtures: ['CSK (H)'],

    qualification: [
      'GT already qualified after SRH beat CSK 🎉',
      'GT beat CSK = strong chance of Top 2',
      'GT can still finish 1st if RCB lose',
    ],

    top2: [
      'GT Top 2 confirmed if SRH lose to RCB',
      '18-point tie with RCB/SRH may depend on NRR',
      'GT need a strong win margin vs CSK',
    ],

    elimination: [
      'GT cannot be eliminated',
      'Playoff berth already sealed',
    ],
  },

  SRH: {
    fixtures: ['RCB (H)'],

    qualification: [
      'SRH already qualified after beating CSK 🎉',
      'Beating RCB guarantees strong Top 2 chance',
      'SRH can still finish 1st via NRR',
    ],

    top2: [
      'SRH Top 2 possible if they beat RCB',
      'NRR battle with GT and RCB may decide positions',
      'Large-margin win improves SRH chances heavily',
    ],

    elimination: [
      'SRH cannot be eliminated',
      'Playoff berth already sealed',
    ],
  },

  PBKS: {
    fixtures: ['LSG (A)'],

    qualification: [
      'PBKS must beat LSG',
      'RR must lose at least one game',
      'KKR must lose one OR PBKS stay ahead on NRR',
    ],

    top2: [
      'Top 2 chances practically impossible',
      'PBKS maximum possible points = 15',
    ],

    elimination: [
      'PBKS lose to LSG = almost certainly eliminated',
      'RR and KKR results heavily affect PBKS',
    ],
  },

  CSK: {
    fixtures: ['GT (A)'],

    qualification: [
      'CSK must beat GT',
      'RR must lose both matches',
      'LSG must beat PBKS',
      'KKR must beat DC but lose to MI',
    ],

    top2: [
      'Top 2 chances are extremely slim',
      'Would require massive NRR swing',
    ],

    elimination: [
      'CSK loss to GT = eliminated',
      'Even with a win, CSK depend on many results',
    ],
  },

  RR: {
    fixtures: ['LSG (H)', 'MI (A)'],

    qualification: [
      'RR qualify if they win both matches',
      '16 points guarantees qualification',
      'RR can still qualify with 14 in certain scenarios',
    ],

    top2: [
      'RR Top 2 possible if they win both big',
      'GT or SRH dropping games helps RR massively',
    ],

    elimination: [
      'RR lose both = eliminated',
      'One loss creates heavy NRR dependence',
    ],
  },

  KKR: {
    fixtures: ['MI (H)', 'DC (H)'],

    qualification: [
      'KKR likely need to win both matches',
      'RR must lose one match',
      'PBKS losing to LSG helps KKR greatly',
    ],

    top2: [
      'Top 2 mathematically tiny',
      '15-point ceiling hurts KKR badly',
    ],

    elimination: [
      'KKR losing either game puts qualification at major risk',
      'NRR battle with PBKS possible',
    ],
  },

  DC: {
    fixtures: ['KKR (A)'],

    qualification: [
      'DC must beat KKR',
      'LSG must beat PBKS',
      'RR must lose both matches',
      'GT must beat CSK',
    ],

    top2: [
      'Top 2 mathematically impossible',
    ],

    elimination: [
      'Poor NRR (-0.871) is DC’s biggest issue',
      'Any tie on points likely eliminates DC',
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
              AS OF SRH vs CSK
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
                SRH and GT have officially
                qualified for the playoffs 🎉
              </p>

              <p>
                RCB can seal Top 2 if:
                <span className="text-green-400">
                  {' '}
                  CSK beat GT OR RCB beat SRH
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
