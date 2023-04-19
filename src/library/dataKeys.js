export const KEYS = {
  TeamNum: "Team Num",
  MatchNum: "Match Num",
  AllianceColor: "Alliance",
  DefenseBot: "Defense Bot",
  DidFoul: "Did Foul",
  ScouterName: "Scouter Name",
  Comments: "Comments",
  Rating: {
    Driver: "Driver Rating",
    Defense: "Defense Rating",
  },
  Auto: {
    HighCone: "A-T-Cone",
    MidCone: "A-M-Cone",
    LowCone: "A-B-Cone",
    HighCube: "A-T-Cube",
    MidCube: "A-M-Cube",
    LowCube: "A-B-Cube",
    Mobility: "Left Community",
    ChargingStation: {
      Docked: "A-Dock",
      Engaged: "A-Dock-E",
    },
  },
  Teleop: {
    HighCone: "T-T-Cone",
    MidCone: "T-M-Cone",
    LowCone: "T-B-Cone",
    HighCube: "T-T-Cube",
    MidCube: "T-M-Cube",
    LowCube: "T-B-Cube",
    overChargeStation: "Pass Station",
  },
  Endgame: {
    ChargingStation: {
      Docked: "T-Dock",
      Engaged: "T-Dock-E",
    },
    Parked: "Parked",
  },
};

export const SCALER = {
  Auto: {
    High: 6,
    Mid: 5,
    Low: 4,
    Mobility: 3,
    ChargingStation: {
      Docked: 8,
      Engaged: 12,
    },
  },
  Teleop: {
    High: 5,
    Mid: 4,
    Low: 3,
  },
  Endgame: {
    ChargingStation: {
      Docked: 6,
      Engaged: 10,
    },
    Parked: 2,
  },
};
