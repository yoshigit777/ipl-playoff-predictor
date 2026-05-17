<div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
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
