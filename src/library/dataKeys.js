export const KEYS = {
  TeamNum: "Team #",
  MatchNum: "Match #",
  AllianceColor: "Alliance",
  DefenseBot: "Defense Bot",
  DidFoul: "Did Foul",
  ScouterName: "Scout Name",
  Comments: "Comments",
  Rating: {
    Driver: "Driver Rating",
    Defense: "Defense Rating",
  },
  Auto: {
    HighCone: "Auto Top Cone",
    MidCone: "Auto Mid Cone",
    LowCone: "Auto Low Cone",
    HighCube: "Auto Top Cube",
    MidCube: "Auto Mid Cube",
    LowCube: "Auto Low Cube",
    Mobility: "Left Community",
    ChargingStation: {
      Docked: "Auto Dock",
      Engaged: "Auto Dock & Engage",
      FailedBalance: "Auto Failed Balance",
    },
  },
  Teleop: {
    HighCone: "Teleop Top Cone",
    MidCone: "Teleop Mid Cone",
    LowCone: "Teleop Low Cone",
    HighCube: "Teleop Top Cube",
    MidCube: "Teleop Mid Cube",
    LowCube: "Teleop Low Cube",
    overChargeStation: "Pass Driver Station",
  },
  Endgame: {
    ChargingStation: {
      Docked: "Teleop Dock",
      Engaged: "Teleop Dock & Engage",
      FailedBalance: "Teleop Failed Balance",
    },
    Parked: "Parked",
  },
  Pit: {
    Timestamp: "Timestamp",
    EmailAddress: "Email Address",
    TeamNum: "Team Number",
    Dimensions: "What are the dimensions of your robot?",
    Autos: "What are your auto routes?(Ask them about starting position, cubes scored, cones scored, dock and/or engage?)",
    Intaking: "What level can your robot intake at? (don’t ask for drivetrain bots)",
    Weight: "What's the weight of the robot(>than 100 lbs excluding bumper and battery)",
    Drivetrain: "Drivetrain type",
    Clearance: "What’s the ground clearance of robot?",
    Help: "Do they need help with their robot (ex mechanical, electrical, programming)?",
    Style: "What is your robot's preferred playing style?",
    Extra: "Is there anything cool about your robot that you want to tell us?",
    Picture: "Take a picture of the robot",
  }
};

export const SCALER = {
  Auto: {
    High: 6,
    Mid: 4,
    Low: 3,
    Mobility: 3,
    ChargingStation: {
      Docked: 8,
      Engaged: 12,
    },
  },
  Teleop: {
    High: 5,
    Mid: 3,
    Low: 2,
  },
  Endgame: {
    ChargingStation: {
      Docked: 6,
      Engaged: 10,
    },
    Parked: 2,
  },
};
