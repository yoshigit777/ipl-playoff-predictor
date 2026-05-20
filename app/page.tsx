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
    qualify: '62%',
    top2: '1%',
  },

  PBKS: {
    qualify: '24%',
    top2: '0%',
  },

  KKR: {
    qualify: '7%',
    top2: '0%',
  },

  CSK: {
    qualify: '7%',
    top2: '0%',
  },

  DC: {
    qualify: '0.02%',
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
      'RCB finish Top 2 if they beat SRH',
      'CSK beating GT also guarantees RCB Top 2',
    ],

    top2: [
      'RCB currently have 99.7% Top 2 odds',
      'Only massive NRR swings can deny them',
      'SRH must beat RCB heavily and GT must thrash CSK',
    ],

    elimination: [
      'RCB cannot be eliminated',
      'Playoff berth already secured',
    ],
  },

  GT: {
    fixtures: ['CSK (H)'],

    qualification: [
      'GT officially qualified 🎉',
      'GT beat CSK = likely Qualifier 1',
      'GT can still finish 1st if RCB lose',
    ],

    top2: [
      'GT currently have 58% Top 2 odds',
      'GT vs SRH NRR battle possible',
      'Big win over CSK boosts GT massively',
    ],

    elimination: [
      'GT cannot be eliminated',
      'Playoff spot already sealed',
    ],
  },

  SRH: {
    fixtures: ['RCB (H)'],

    qualification: [
      'SRH officially qualified 🎉',
      'SRH beat RCB = strong Top 2 chance',
      'SRH can still finish league stage 1st',
    ],

    top2: [
      'SRH currently at 41% for Top 2',
      'Need strong win margin over RCB',
      'NRR battle with GT and RCB possible',
    ],

    elimination: [
      'SRH cannot be eliminated',
      'Playoff berth already secured',
    ],
  },

  RR: {
    fixtures: ['MI (A)'],

    qualification: [
      'RR beat MI = qualify on 16 points',
      'Qualification fully in RR hands',
      'RR can still qualify on 14 in some cases',
    ],

    top2: [
      'RR still have a tiny Top 2 chance',
      'Need GT and SRH to lose heavily',
      'Need huge win margin vs MI',
    ],

    elimination: [
      'RR lose to MI and qualification becomes risky',
      'PBKS and KKR can still overtake RR',
    ],
  },

  PBKS: {
    fixtures: ['LSG (A)'],

    qualification: [
      'PBKS must beat LSG',
      'KKR should lose one match',
      'RR losing to MI helps PBKS massively',
    ],

    top2: [
      'Top 2 mathematically impossible',
      'Maximum possible points = 15',
    ],

    elimination: [
      'PBKS lose to LSG = likely eliminated',
      'NRR battle with KKR possible',
    ],
  },

  KKR: {
    fixtures: ['MI (H)', 'DC (H)'],

    qualification: [
      'KKR ideally need to win both games',
      'PBKS losing to LSG helps massively',
      'RR losing to MI keeps KKR alive',
    ],

    top2: [
      'Top 2 mathematically impossible',
      '15-point ceiling hurts KKR badly',
    ],

    elimination: [
      'Lose either match and KKR likely eliminated',
      'NRR may decide race with PBKS',
    ],
  },

  CSK: {
    fixtures: ['GT (A)'],

    qualification: [
      'CSK must beat GT',
      'RR must lose to MI',
      'PBKS must lose to LSG',
      'KKR must split their two matches',
    ],

    top2: [
      'Mathematically Impossible',
    ],

    elimination: [
      'CSK lose to GT = eliminated',
      'Even victory may not be enough',
    ],
  },

  DC: {
    fixtures: ['KKR (A)'],

    qualification: [
      'DC must beat KKR',
      'RR must lose to MI',
      'PBKS must lose to LSG',
      'CSK must lose to GT',
    ],

    top2: [
      'Top 2 mathematically impossible',
    ],

    elimination: [
      'NRR of -0.971 is catastrophic',
      'Qualification now almost impossible',
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
              AS OF MATCH 64 • RR vs LSG
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6">
              IPL 2026
              <br />
              Playoff Predictor
            </h1>

            <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mb-6">
              Explore every qualification
              scenario, Top 2 pathway
              and elimination risk.
            </p>

            <div className="mb-10 space-y-2 text-yellow-300 font-semibold text-center">
              <p>
                RCB, GT and SRH have officially
                qualified for the playoffs 🎉
              </p>

              <p>
                RR now control their own destiny 🏏
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
