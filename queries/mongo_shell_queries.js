// ============================================================
//  MongoDB Project – Event Collection
//  Student  : Abdul Samad Khan
//  Database : Event_db   |   Collection : Event
//  Stage 2  : Simple Queries  (Q1 – Q35)
//  Stage 3  : Aggregation Framework Pipelines (A1 – A15)
// ============================================================
//
//  QUERY SELECTOR COVERAGE CHECKLIST  (for project report)
//  ──────────────────────────────────────────────────────────
//  $eq          Q1, Q3, Q6, Q13, Q28, Q33
//  $ne          Q34
//  $gt          Q1, Q2, Q3, Q6, Q8, Q9, Q11, Q16, Q20, Q23,
//               Q28, Q29, Q33, Q35
//  $gte         Q8, Q19, Q23
//  $lt / $lte   Q8  (between: $gte + $lte)
//  $in          Q4, Q5, Q11, Q12, Q21, Q23, Q27, Q31
//  $nin         Q17, Q22, Q27
//  $and         Q10 (explicit)
//  $or          Q35 (explicit)
//  $all         Q12, Q14  (array contains all values)
//  $size        Q26, Q32  (array size)
//  $regex       Q15  (technician name pattern)
//  dot notation Q2, Q5, Q7, Q9, Q10, Q11, Q14, Q16, Q18,
//               Q19, Q21, Q23, Q24, Q26, Q29, Q34
//               (Sports_Hall.* and Technician.*)
//  Exact array  Q13  (Refreshments == ["Tea"] only)
//  ──────────────────────────────────────────────────────────
//  Aggregation stages used across A1–A15:
//  $match  $group  $sort  $project  $unwind  $addFields
//  $bucket  $facet  $limit  $cond  $round  $multiply
//  $divide  $sum  $avg  $max  $min  $add
// ============================================================
// SETUP COMMANDS (run once in Mongo Shell)
// use Event_db
// ─────────────────────────────────────────────────────────────
// Show first document in pretty format (scene-setting)
// ─────────────────────────────────────────────────────────────
db.Event.findOne({}, {}).pretty()

// Count total documents
db.Event.countDocuments()

// ============================================================
//  STAGE 2 – SIMPLE QUERIES
// ============================================================

// ─────────────────────────────────────────────────────────────
// Q1  ($eq, $gt, projection)
// Question:
//   List the _id, Event_Type, Event_Year, Ticket_Price and
//   Atmosphere for all Concert events held in 2024 that had an
//   Excellent atmosphere AND a Ticket_Price above €90.
// Expected: 5 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Type   : "Concert",
    Event_Year   : 2024,
    Atmosphere   : "Excellent",
    Ticket_Price : { $gt: 90 }
  },
  {
    _id          : 1,
    Event_Type   : 1,
    Event_Year   : 1,
    Ticket_Price : 1,
    Atmosphere   : 1
  }
)

db.Event.countDocuments(
  {
    Event_Type   : "Concert",
    Event_Year   : 2024,
    Atmosphere   : "Excellent",
    Ticket_Price : { $gt: 90 }
  }
)

// ─────────────────────────────────────────────────────────────
// Q2  (dot notation on embedded doc, $gt)
// Question:
//   List the _id, Event_Type, Atmosphere, Sports_Hall Name,
//   and Sports_Hall Cost for all Drama events held at a Sports
//   Hall that cost MORE than €4,000,000 to build, where the
//   event Atmosphere was rated as Fair.
// Expected: 6 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Type           : "Drama",
    "Sports_Hall.Cost"   : { $gt: 4000000 },
    Atmosphere           : "Fair"
  },
  {
    _id                  : 1,
    Event_Type           : 1,
    Atmosphere           : 1,
    "Sports_Hall.Name"   : 1,
    "Sports_Hall.Cost"   : 1
  }
)

db.Event.countDocuments(
  {
    Event_Type           : "Drama",
    "Sports_Hall.Cost"   : { $gt: 4000000 },
    Atmosphere           : "Fair"
  }
)

// ─────────────────────────────────────────────────────────────
// Q3  ($eq, $gt, multiple criteria)
// Question:
//   List the _id, Event_Type, Sponsor_Type, Security_Cost,
//   and Event_Year for all Meeting events in 2023 where the
//   Sponsor_Type was Technology AND Security_Cost exceeded €5,000.
// Expected: 6 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Type    : "Meeting",
    Sponsor_Type  : "Technology",
    Security_Cost : { $gt: 5000 },
    Event_Year    : 2023
  },
  {
    _id           : 1,
    Event_Type    : 1,
    Sponsor_Type  : 1,
    Security_Cost : 1,
    Event_Year    : 1
  }
)

db.Event.countDocuments(
  {
    Event_Type    : "Meeting",
    Sponsor_Type  : "Technology",
    Security_Cost : { $gt: 5000 },
    Event_Year    : 2023
  }
)

// ─────────────────────────────────────────────────────────────
// Q4  ($in for year, $gt for duration)
// Question:
//   List the _id, Event_Type, Event_Year, Atmosphere and
//   Duration for all Quiz events held in 2019 OR 2020 that had
//   a Poor atmosphere AND lasted MORE than 220 minutes.
// Expected: 5 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Type  : "Quiz",
    Event_Year  : { $in: [2019, 2020] },
    Atmosphere  : "Poor",
    Duration    : { $gt: 220 }
  },
  {
    _id         : 1,
    Event_Type  : 1,
    Event_Year  : 1,
    Atmosphere  : 1,
    Duration    : 1
  }
)

db.Event.countDocuments(
  {
    Event_Type  : "Quiz",
    Event_Year  : { $in: [2019, 2020] },
    Atmosphere  : "Poor",
    Duration    : { $gt: 220 }
  }
)

// ─────────────────────────────────────────────────────────────
// Q5  ($in for year, dot notation, multiple criteria)
// Question:
//   List the _id, Event_Type, Event_Year, Sports_Hall Floor_Type
//   and Sports_Hall Acoustics for all Sport events held between
//   2021 and 2023 (inclusive) at a venue with a Maple floor and
//   Good acoustics.
// Expected: 7 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Type                   : "Sport",
    Event_Year                   : { $in: [2021, 2022, 2023] },
    "Sports_Hall.Floor_Type"     : "Maple",
    "Sports_Hall.Acoustics"      : "Good"
  },
  {
    _id                          : 1,
    Event_Type                   : 1,
    Event_Year                   : 1,
    "Sports_Hall.Floor_Type"     : 1,
    "Sports_Hall.Acoustics"      : 1
  }
)

db.Event.countDocuments(
  {
    Event_Type                   : "Sport",
    Event_Year                   : { $in: [2021, 2022, 2023] },
    "Sports_Hall.Floor_Type"     : "Maple",
    "Sports_Hall.Acoustics"      : "Good"
  }
)

// ─────────────────────────────────────────────────────────────
// Q6  ($gt, multiple dot-notation fields)
// Question:
//   List the _id, Event_Type, Event_Year, Sponsorship_Value
//   and Atmosphere for all Conference events in 2021 where the
//   Sponsorship_Value was MORE than €40,000 and the Atmosphere
//   was rated Good.
// Expected: 4 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Type         : "Conference",
    Event_Year         : 2021,
    Sponsorship_Value  : { $gt: 40000 },
    Atmosphere         : "Good"
  },
  {
    _id                : 1,
    Event_Type         : 1,
    Event_Year         : 1,
    Sponsorship_Value  : 1,
    Atmosphere         : 1
  }
)

db.Event.countDocuments(
  {
    Event_Type         : "Conference",
    Event_Year         : 2021,
    Sponsorship_Value  : { $gt: 40000 },
    Atmosphere         : "Good"
  }
)

// ─────────────────────────────────────────────────────────────
// Q7  (dot notation, embedded doc, year)
// Question:
//   List the _id, Event_Type, Event_Year, Sports_Hall Name,
//   City and Seating for all Exhibition events held in 2022 at
//   a Dublin Sports Hall with Retractable seating.
// Expected: 4 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Type               : "Exhibition",
    Event_Year               : 2022,
    "Sports_Hall.County"     : "Dublin",
    "Sports_Hall.Seating"    : "Retractable"
  },
  {
    _id                      : 1,
    Event_Type               : 1,
    Event_Year               : 1,
    "Sports_Hall.Name"       : 1,
    "Sports_Hall.City"       : 1,
    "Sports_Hall.Seating"    : 1
  }
)

db.Event.countDocuments(
  {
    Event_Type               : "Exhibition",
    Event_Year               : 2022,
    "Sports_Hall.County"     : "Dublin",
    "Sports_Hall.Seating"    : "Retractable"
  }
)

// ─────────────────────────────────────────────────────────────
// Q8  ($gte, $lte – equivalent of SQL BETWEEN)
// Question:
//   List the _id, Event_Year, Atmosphere and Ticket_Price for
//   all events held in 2023 with an Excellent atmosphere where
//   the Ticket_Price was BETWEEN €80 and €100 (inclusive).
// Expected: 7 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Year   : 2023,
    Atmosphere   : "Excellent",
    Ticket_Price : { $gte: 80, $lte: 100 }
  },
  {
    _id          : 1,
    Event_Year   : 1,
    Atmosphere   : 1,
    Ticket_Price : 1,
    Event_Type   : 1
  }
)

db.Event.countDocuments(
  {
    Event_Year   : 2023,
    Atmosphere   : "Excellent",
    Ticket_Price : { $gte: 80, $lte: 100 }
  }
)

// ─────────────────────────────────────────────────────────────
// Q9  (dot notation, $gt on Food_Sales)
// Question:
//   List the _id, Event_Type, Event_Year, Food_Sales and
//   Sports_Hall County for all events held in 2021 at a Cork
//   Sports Hall where Food_Sales exceeded €17,000.
// Expected: 6 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Year             : 2021,
    "Sports_Hall.County"   : "Cork",
    Food_Sales             : { $gt: 17000 }
  },
  {
    _id                    : 1,
    Event_Type             : 1,
    Event_Year             : 1,
    Food_Sales             : 1,
    "Sports_Hall.County"   : 1,
    "Sports_Hall.Name"     : 1
  }
)

db.Event.countDocuments(
  {
    Event_Year             : 2021,
    "Sports_Hall.County"   : "Cork",
    Food_Sales             : { $gt: 17000 }
  }
)

// ─────────────────────────────────────────────────────────────
// Q10  ($and explicit, dot notation)
// Question:
//   List the _id, Event_Type, Event_Year, Sports_Hall
//   Energy_Source and Lighting_Type for all events in 2021
//   where the Sports Hall used Solar energy AND Natural
//   lighting AND the Atmosphere was rated Poor.
// Expected: 4 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    $and: [
      { "Sports_Hall.Energy_Source"  : "Solar"   },
      { "Sports_Hall.Lighting_Type"  : "Natural" },
      { Event_Year                   : 2021       },
      { Atmosphere                   : "Poor"     }
    ]
  },
  {
    _id                              : 1,
    Event_Type                       : 1,
    Event_Year                       : 1,
    Atmosphere                       : 1,
    "Sports_Hall.Energy_Source"      : 1,
    "Sports_Hall.Lighting_Type"      : 1
  }
)

db.Event.countDocuments(
  {
    $and: [
      { "Sports_Hall.Energy_Source"  : "Solar"   },
      { "Sports_Hall.Lighting_Type"  : "Natural" },
      { Event_Year                   : 2021       },
      { Atmosphere                   : "Poor"     }
    ]
  }
)

// ─────────────────────────────────────────────────────────────
// Q11  (dot notation into Technician embedded doc, $gt, $in)
// Question:
//   List the _id, Event_Type, Event_Year and Technician Name,
//   Hourly_Fee and Total_Hours for all events in 2022 or 2023
//   where the assigned Technician holds a Degree qualification,
//   charges more than €75 per hour AND worked more than 12 hours.
// Expected: 6 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Year                      : { $in: [2022, 2023] },
    "Technician.Qualification"      : "Degree",
    "Technician.Hourly_Fee"         : { $gt: 75 },
    "Technician.Total_Hours"        : { $gt: 12 }
  },
  {
    _id                             : 1,
    Event_Type                      : 1,
    Event_Year                      : 1,
    "Technician.Name"               : 1,
    "Technician.Qualification"      : 1,
    "Technician.Hourly_Fee"         : 1,
    "Technician.Total_Hours"        : 1
  }
)

db.Event.countDocuments(
  {
    Event_Year                      : { $in: [2022, 2023] },
    "Technician.Qualification"      : "Degree",
    "Technician.Hourly_Fee"         : { $gt: 75 },
    "Technician.Total_Hours"        : { $gt: 12 }
  }
)

// ─────────────────────────────────────────────────────────────
// Q12  ($all on Sponsors array, $in for year)
// Question:
//   List the _id, Event_Type, Event_Year, Atmosphere and
//   Sponsors for all events held in 2019 or 2020 with a Good
//   atmosphere where BOTH Tesco AND Lidl appear in the
//   Sponsors array.
// Expected: 4 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Sponsors    : { $all: ["Tesco", "Lidl"] },
    Event_Year  : { $in: [2019, 2020] },
    Atmosphere  : "Good"
  },
  {
    _id         : 1,
    Event_Type  : 1,
    Event_Year  : 1,
    Atmosphere  : 1,
    Sponsors    : 1
  }
)

db.Event.countDocuments(
  {
    Sponsors    : { $all: ["Tesco", "Lidl"] },
    Event_Year  : { $in: [2019, 2020] },
    Atmosphere  : "Good"
  }
)

// ─────────────────────────────────────────────────────────────
// Q13  (exact array match – only Tea in Refreshments, $eq year)
// Question:
//   List the _id, Event_Type, Event_Year and Refreshments for
//   all events in 2023 where Tea was the ONLY item in the
//   Refreshments array (i.e. no other refreshment was served).
// Expected: 7 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Refreshments : ["Tea"],
    Event_Year   : 2023
  },
  {
    _id          : 1,
    Event_Type   : 1,
    Event_Year   : 1,
    Refreshments : 1,
    Atmosphere   : 1
  }
)

db.Event.countDocuments(
  {
    Refreshments : ["Tea"],
    Event_Year   : 2023
  }
)

// ─────────────────────────────────────────────────────────────
// Q14  ($all on Sports_Hall.Sport nested array)
// Question:
//   List the _id, Event_Type, Event_Month, Atmosphere and
//   Sports_Hall Sport array for all events held in June with an
//   Excellent atmosphere at a Sports Hall that supports BOTH
//   Basketball AND Boxing.
// Expected: 4 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    "Sports_Hall.Sport" : { $all: ["Basketball", "Boxing"] },
    Event_Month         : "Jun",
    Atmosphere          : "Excellent"
  },
  {
    _id                 : 1,
    Event_Type          : 1,
    Event_Month         : 1,
    Atmosphere          : 1,
    "Sports_Hall.Sport" : 1,
    "Sports_Hall.Name"  : 1
  }
)

db.Event.countDocuments(
  {
    "Sports_Hall.Sport" : { $all: ["Basketball", "Boxing"] },
    Event_Month         : "Jun",
    Atmosphere          : "Excellent"
  }
)

// ─────────────────────────────────────────────────────────────
// Q15  ($regex on Technician.Name)
// Question:
//   List the _id, Event_Type, Event_Year and Technician Name
//   for all events in 2022 where the Technician's first name
//   begins with the letter "D" (case-insensitive).
// Expected: 5 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    "Technician.Name" : { $regex: /^Dan/i },
    Event_Year        : 2022
  },
  {
    _id               : 1,
    Event_Type        : 1,
    Event_Year        : 1,
    Atmosphere        : 1,
    "Technician.Name" : 1
  }
)

db.Event.countDocuments(
  {
    "Technician.Name" : { $regex: /^Dan/i },
    Event_Year        : 2022
  }
)

// ─────────────────────────────────────────────────────────────
// Q16  (dot notation $gt on Capacity, $eq on Event_Type and Year)
// Question:
//   List the _id, Event_Type, Event_Year, Sports_Hall Name and
//   Capacity for all Concert events in 2022 held at a Sports
//   Hall with a seating capacity GREATER than 50,000.
// Expected: 4 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Type                : "Concert",
    Event_Year                : 2022,
    "Sports_Hall.Capacity"    : { $gt: 50000 }
  },
  {
    _id                       : 1,
    Event_Type                : 1,
    Event_Year                : 1,
    "Sports_Hall.Name"        : 1,
    "Sports_Hall.Capacity"    : 1,
    Atmosphere                : 1
  }
)

db.Event.countDocuments(
  {
    Event_Type                : "Concert",
    Event_Year                : 2022,
    "Sports_Hall.Capacity"    : { $gt: 50000 }
  }
)

// ─────────────────────────────────────────────────────────────
// Q17  ($nin on array – Refreshments does NOT include Coffee)
// Question:
//   List the _id, Event_Type, Event_Year and Refreshments for
//   all Meeting events in 2021 where Coffee was NOT included in
//   the Refreshments served at the event.
// Expected: 7 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Type   : "Meeting",
    Event_Year   : 2021,
    Refreshments : { $nin: ["Coffee"] }
  },
  {
    _id          : 1,
    Event_Type   : 1,
    Event_Year   : 1,
    Refreshments : 1,
    Atmosphere   : 1
  }
)

db.Event.countDocuments(
  {
    Event_Type   : "Meeting",
    Event_Year   : 2021,
    Refreshments : { $nin: ["Coffee"] }
  }
)

// ─────────────────────────────────────────────────────────────
// Q18  ($and implicit, dot notation into Technician)
// Question:
//   List the _id, Event_Year, Sponsor_Type, Atmosphere and
//   Technician Qualification for all events in 2020 where the
//   Sponsor_Type was Alcohol, the Technician held a Degree
//   qualification AND the Atmosphere was rated Excellent.
// Expected: 7 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Year                 : 2020,
    Sponsor_Type               : "Alcohol",
    "Technician.Qualification" : "Degree",
    Atmosphere                 : "Excellent"
  },
  {
    _id                        : 1,
    Event_Year                 : 1,
    Sponsor_Type               : 1,
    Atmosphere                 : 1,
    "Technician.Qualification" : 1,
    "Technician.Name"          : 1
  }
)

db.Event.countDocuments(
  {
    Event_Year                 : 2020,
    Sponsor_Type               : "Alcohol",
    "Technician.Qualification" : "Degree",
    Atmosphere                 : "Excellent"
  }
)

// ─────────────────────────────────────────────────────────────
// Q19  ($gte on year, dot notation for Seating)
// Question:
//   List the _id, Event_Type, Event_Year, Atmosphere and
//   Sports_Hall Seating for all Exhibition events from 2022
//   onwards where the Sports Hall has NO seating (Seating = None)
//   AND the Atmosphere was rated Poor.
// Expected: 7 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Type             : "Exhibition",
    Event_Year             : { $gte: 2022 },
    "Sports_Hall.Seating"  : "None",
    Atmosphere             : "Poor"
  },
  {
    _id                    : 1,
    Event_Type             : 1,
    Event_Year             : 1,
    Atmosphere             : 1,
    "Sports_Hall.Seating"  : 1,
    "Sports_Hall.Name"     : 1
  }
)

db.Event.countDocuments(
  {
    Event_Type             : "Exhibition",
    Event_Year             : { $gte: 2022 },
    "Sports_Hall.Seating"  : "None",
    Atmosphere             : "Poor"
  }
)

// ─────────────────────────────────────────────────────────────
// Q20  ($gt on two numeric fields, year)
// Question:
//   List the _id, Event_Type, Event_Year, Food_Sales and
//   Merchandise_Sales for all events in 2022 where Food_Sales
//   exceeded €22,000 AND Merchandise_Sales exceeded €10,000.
// Expected: 4 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Year         : 2022,
    Food_Sales         : { $gt: 22000 },
    Merchandise_Sales  : { $gt: 10000 }
  },
  {
    _id                : 1,
    Event_Type         : 1,
    Event_Year         : 1,
    Food_Sales         : 1,
    Merchandise_Sales  : 1,
    Atmosphere         : 1
  }
)

db.Event.countDocuments(
  {
    Event_Year         : 2022,
    Food_Sales         : { $gt: 22000 },
    Merchandise_Sales  : { $gt: 10000 }
  }
)

// ─────────────────────────────────────────────────────────────
// Q21  ($in on county array for Sports_Hall.County)
// Question:
//   List the _id, Event_Type, Atmosphere, Sports_Hall County
//   and Energy_Source for all events at a Galway OR Limerick
//   Sports Hall that used Solar energy AND had an Excellent
//   atmosphere.
// Expected: 5 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    "Sports_Hall.County"        : { $in: ["Galway", "Limerick"] },
    "Sports_Hall.Energy_Source" : "Solar",
    Atmosphere                  : "Excellent"
  },
  {
    _id                         : 1,
    Event_Type                  : 1,
    Atmosphere                  : 1,
    "Sports_Hall.County"        : 1,
    "Sports_Hall.Energy_Source" : 1,
    "Sports_Hall.Name"          : 1
  }
)

db.Event.countDocuments(
  {
    "Sports_Hall.County"        : { $in: ["Galway", "Limerick"] },
    "Sports_Hall.Energy_Source" : "Solar",
    Atmosphere                  : "Excellent"
  }
)

// ─────────────────────────────────────────────────────────────
// Q22  ($nin on Event_Type, $gt on Ticket_Price)
// Question:
//   List the _id, Event_Type, Event_Year, Ticket_Price and
//   Atmosphere for all events in 2024 with a Fair atmosphere
//   where the Ticket_Price exceeded €100 AND the Event_Type was
//   NOT a Meeting or Sport.
// Expected: 4 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Type   : { $nin: ["Meeting", "Sport"] },
    Event_Year   : 2024,
    Atmosphere   : "Fair",
    Ticket_Price : { $gt: 100 }
  },
  {
    _id          : 1,
    Event_Type   : 1,
    Event_Year   : 1,
    Ticket_Price : 1,
    Atmosphere   : 1
  }
)

db.Event.countDocuments(
  {
    Event_Type   : { $nin: ["Meeting", "Sport"] },
    Event_Year   : 2024,
    Atmosphere   : "Fair",
    Ticket_Price : { $gt: 100 }
  }
)

// ─────────────────────────────────────────────────────────────
// Q23  ($gte on Duration, $in on Event_Type, $in on Year)
// Question:
//   List the _id, Event_Type, Event_Year, Duration and
//   Sports_Hall Acoustics for all Concert or Drama events in
//   2021 or 2022 that lasted at LEAST 280 minutes AND were held
//   at a venue with Poor acoustics.
// Expected: 5 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Type              : { $in: ["Concert", "Drama"] },
    Event_Year              : { $in: [2021, 2022] },
    Duration                : { $gte: 280 },
    "Sports_Hall.Acoustics" : "Poor"
  },
  {
    _id                     : 1,
    Event_Type              : 1,
    Event_Year              : 1,
    Duration                : 1,
    "Sports_Hall.Acoustics" : 1,
    "Sports_Hall.Name"      : 1
  }
)

db.Event.countDocuments(
  {
    Event_Type              : { $in: ["Concert", "Drama"] },
    Event_Year              : { $in: [2021, 2022] },
    Duration                : { $gte: 280 },
    "Sports_Hall.Acoustics" : "Poor"
  }
)

// ─────────────────────────────────────────────────────────────
// Q24  (dot notation Technician.County, multiple criteria)
// Question:
//   List the _id, Event_Type, Technician Name, County and
//   Qualification for all Concert events where the Technician
//   is based in County Kildare AND holds a Degree qualification.
// Expected: 5 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Type                 : "Concert",
    "Technician.County"        : "Kildare",
    "Technician.Qualification" : "Degree"
  },
  {
    _id                        : 1,
    Event_Type                 : 1,
    Event_Year                 : 1,
    "Technician.Name"          : 1,
    "Technician.County"        : 1,
    "Technician.Qualification" : 1
  }
)

db.Event.countDocuments(
  {
    Event_Type                 : "Concert",
    "Technician.County"        : "Kildare",
    "Technician.Qualification" : "Degree"
  }
)

// ─────────────────────────────────────────────────────────────
// Q25  ($and – multiple equality conditions)
// Question:
//   List the _id, Event_Type, Event_Year, Sponsor_Type and
//   Atmosphere for all events in 2024 where the Sponsor_Type
//   was Tourism AND the Atmosphere was rated Poor.
// Expected: 7 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Year   : 2024,
    Sponsor_Type : "Tourism",
    Atmosphere   : "Poor"
  },
  {
    _id          : 1,
    Event_Type   : 1,
    Event_Year   : 1,
    Sponsor_Type : 1,
    Atmosphere   : 1
  }
)

db.Event.countDocuments(
  {
    Event_Year   : 2024,
    Sponsor_Type : "Tourism",
    Atmosphere   : "Poor"
  }
)

// ─────────────────────────────────────────────────────────────
// Q26  ($size on Sports_Hall.Sport array)
// Question:
//   List the _id, Event_Type, Event_Year, Sports_Hall Sport
//   array and Atmosphere for all Conference events in 2022 or
//   2023 with a Good atmosphere at a Sports Hall that supports
//   EXACTLY ONE sport.
// Expected: 7 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Type          : "Conference",
    Event_Year          : { $in: [2022, 2023] },
    Atmosphere          : "Good",
    "Sports_Hall.Sport" : { $size: 1 }
  },
  {
    _id                 : 1,
    Event_Type          : 1,
    Event_Year          : 1,
    Atmosphere          : 1,
    "Sports_Hall.Sport" : 1,
    "Sports_Hall.Name"  : 1
  }
)

db.Event.countDocuments(
  {
    Event_Type          : "Conference",
    Event_Year          : { $in: [2022, 2023] },
    Atmosphere          : "Good",
    "Sports_Hall.Sport" : { $size: 1 }
  }
)

// ─────────────────────────────────────────────────────────────
// Q27  ($nin on Sponsor_Type, $in on Atmosphere)
// Question:
//   List the _id, Event_Type, Event_Year, Sponsor_Type and
//   Atmosphere for all Sport events in 2022 where the
//   Sponsor_Type was NEITHER Media NOR Tourism AND the
//   Atmosphere was Good or Excellent.
// Expected: 6 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Type   : "Sport",
    Event_Year   : 2022,
    Sponsor_Type : { $nin: ["Media", "Tourism"] },
    Atmosphere   : { $in: ["Good", "Excellent"] }
  },
  {
    _id          : 1,
    Event_Type   : 1,
    Event_Year   : 1,
    Sponsor_Type : 1,
    Atmosphere   : 1
  }
)

db.Event.countDocuments(
  {
    Event_Type   : "Sport",
    Event_Year   : 2022,
    Sponsor_Type : { $nin: ["Media", "Tourism"] },
    Atmosphere   : { $in: ["Good", "Excellent"] }
  }
)

// ─────────────────────────────────────────────────────────────
// Q28  ($eq on Total_Hours, $gt on Security_Cost)
// Question:
//   List the _id, Event_Type, Event_Year, Security_Cost and
//   Technician Total_Hours for all events in 2023 where the
//   Technician worked the MAXIMUM of 16 hours AND Security_Cost
//   exceeded €6,000.
// Expected: 4 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Year                 : 2023,
    "Technician.Total_Hours"   : 16,
    Security_Cost              : { $gt: 6000 }
  },
  {
    _id                        : 1,
    Event_Type                 : 1,
    Event_Year                 : 1,
    Security_Cost              : 1,
    "Technician.Total_Hours"   : 1,
    "Technician.Name"          : 1
  }
)

db.Event.countDocuments(
  {
    Event_Year                 : 2023,
    "Technician.Total_Hours"   : 16,
    Security_Cost              : { $gt: 6000 }
  }
)

// ─────────────────────────────────────────────────────────────
// Q29  ($gt on Sports_Hall.Cost – premium venues only)
// Question:
//   List the _id, Event_Type, Event_Year, Atmosphere and
//   Sports_Hall Name and Cost for all events in 2020 with an
//   Excellent atmosphere held at Sports Halls that cost MORE
//   than €3,500,000 to build.
// Expected: 5 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Year              : 2020,
    Atmosphere              : "Excellent",
    "Sports_Hall.Cost"      : { $gt: 3500000 }
  },
  {
    _id                     : 1,
    Event_Type              : 1,
    Event_Year              : 1,
    Atmosphere              : 1,
    "Sports_Hall.Name"      : 1,
    "Sports_Hall.Cost"      : 1
  }
)

db.Event.countDocuments(
  {
    Event_Year              : 2020,
    Atmosphere              : "Excellent",
    "Sports_Hall.Cost"      : { $gt: 3500000 }
  }
)

// ─────────────────────────────────────────────────────────────
// Q30  (Event_Month, Event_Type, Atmosphere)
// Question:
//   List the _id, Event_Type, Event_Month, Event_Year and
//   Atmosphere for all Sport events held in February with a
//   Good atmosphere.
// Expected: 6 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Month  : "Feb",
    Event_Type   : "Sport",
    Atmosphere   : "Good"
  },
  {
    _id          : 1,
    Event_Type   : 1,
    Event_Month  : 1,
    Event_Year   : 1,
    Atmosphere   : 1,
    Duration     : 1
  }
)

db.Event.countDocuments(
  {
    Event_Month  : "Feb",
    Event_Type   : "Sport",
    Atmosphere   : "Good"
  }
)

// ─────────────────────────────────────────────────────────────
// Q31  ($in on Event_Type, month, atmosphere)
// Question:
//   List the _id, Event_Type, Event_Month, Event_Year and
//   Atmosphere for all Meeting or Conference events held in
//   December with a Good atmosphere.
// Expected: 5 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Type  : { $in: ["Meeting", "Conference"] },
    Event_Month : "Dec",
    Atmosphere  : "Good"
  },
  {
    _id         : 1,
    Event_Type  : 1,
    Event_Month : 1,
    Event_Year  : 1,
    Atmosphere  : 1
  }
)

db.Event.countDocuments(
  {
    Event_Type  : { $in: ["Meeting", "Conference"] },
    Event_Month : "Dec",
    Atmosphere  : "Good"
  }
)

// ─────────────────────────────────────────────────────────────
// Q32  ($size on Refreshments array – all 4 items present)
// Question:
//   List the _id, Event_Type, Event_Year, Atmosphere and
//   Refreshments for all events in 2021 with an Excellent
//   atmosphere where ALL four refreshment options (i.e. exactly
//   4 items in the Refreshments array) were available.
// Expected: 6 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Year   : 2021,
    Atmosphere   : "Excellent",
    Refreshments : { $size: 4 }
  },
  {
    _id          : 1,
    Event_Type   : 1,
    Event_Year   : 1,
    Atmosphere   : 1,
    Refreshments : 1
  }
)

db.Event.countDocuments(
  {
    Event_Year   : 2021,
    Atmosphere   : "Excellent",
    Refreshments : { $size: 4 }
  }
)

// ─────────────────────────────────────────────────────────────
// Q33  ($eq on Ticket_Price = 0, $gt on Actual_Crowd, year)
// Question:
//   List the _id, Event_Type, Event_Year, Ticket_Price,
//   Actual_Crowd and Security_Cost for all events in 2020
//   where the Ticket_Price was €0 (free entry), more than
//   10,000 people actually attended AND the Security_Cost
//   exceeded €4,000.
// Expected: 5 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Year    : 2020,
    Ticket_Price  : 0,
    Actual_Crowd  : { $gt: 10000 },
    Security_Cost : { $gt: 4000 }
  },
  {
    _id           : 1,
    Event_Type    : 1,
    Event_Year    : 1,
    Ticket_Price  : 1,
    Actual_Crowd  : 1,
    Security_Cost : 1
  }
)

db.Event.countDocuments(
  {
    Event_Year    : 2020,
    Ticket_Price  : 0,
    Actual_Crowd  : { $gt: 10000 },
    Security_Cost : { $gt: 4000 }
  }
)


// ─────────────────────────────────────────────────────────────
// Q34  ($ne on Technician.Qualification)
// Question:
//   List the _id, Event_Type, Event_Year, Security_Cost and
//   Technician Qualification for all Sport events in 2022
//   where the Security_Cost exceeded €6,500 AND the Technician
//   did NOT hold a Cert qualification (i.e. Diploma or Degree).
// Expected: 4 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    Event_Type                 : "Sport",
    Event_Year                 : 2022,
    Security_Cost              : { $gt: 6500 },
    "Technician.Qualification" : { $ne: "Cert" }
  },
  {
    _id                        : 1,
    Event_Type                 : 1,
    Event_Year                 : 1,
    Security_Cost              : 1,
    "Technician.Qualification" : 1,
    "Technician.Name"          : 1
  }
)

db.Event.countDocuments(
  {
    Event_Type                 : "Sport",
    Event_Year                 : 2022,
    Security_Cost              : { $gt: 6500 },
    "Technician.Qualification" : { $ne: "Cert" }
  }
)

// ─────────────────────────────────────────────────────────────
// Q35  ($or operator – explicit use)
// Question:
//   List the _id, Event_Type, Event_Year, Ticket_Price and
//   Atmosphere for all events with an Excellent atmosphere and
//   a Ticket_Price above €110 that took place EITHER in 2019
//   OR in 2024.
// Expected: 6 documents
// ─────────────────────────────────────────────────────────────
db.Event.find(
  {
    $or: [
      { Event_Year: 2019 },
      { Event_Year: 2024 }
    ],
    Atmosphere   : "Excellent",
    Ticket_Price : { $gt: 110 }
  },
  {
    _id          : 1,
    Event_Type   : 1,
    Event_Year   : 1,
    Ticket_Price : 1,
    Atmosphere   : 1
  }
)

db.Event.countDocuments(
  {
    $or: [
      { Event_Year: 2019 },
      { Event_Year: 2024 }
    ],
    Atmosphere   : "Excellent",
    Ticket_Price : { $gt: 110 }
  }
)


// ============================================================
//  STAGE 3 – AGGREGATION FRAMEWORK PIPELINES (A1 – A15)
// ============================================================

// ─────────────────────────────────────────────────────────────
// A1  ($match, $group, $sort, $project)
// Question:
//   For each Event_Type, calculate the total number of events,
//   the average Ticket_Price (rounded to 2 decimal places) and
//   the average Actual_Crowd (rounded), but only include event
//   types that had MORE than 140 events overall.
//   Sort results by average Ticket_Price descending.
// ─────────────────────────────────────────────────────────────
db.Event.aggregate([
  {
    $group: {
      _id            : "$Event_Type",
      Total_Events   : { $sum: 1 },
      Avg_Ticket     : { $avg: "$Ticket_Price" },
      Avg_Crowd      : { $avg: "$Actual_Crowd" }
    }
  },
  {
    $match: {
      Total_Events: { $gt: 140 }
    }
  },
  {
    $project: {
      _id           : 1,
      Total_Events  : 1,
      Avg_Ticket    : { $round: ["$Avg_Ticket", 2] },
      Avg_Crowd     : { $round: ["$Avg_Crowd", 0] }
    }
  },
  {
    $sort: { Avg_Ticket: -1 }
  }
])

// ─────────────────────────────────────────────────────────────
// A2  ($match, $group with $sum, $avg, $max, $min, $sort)
// Question:
//   For Concert and Drama events from 2021 onwards, show each
//   Event_Type with its total number of events, total
//   Food_Sales revenue, maximum and minimum Ticket_Price,
//   and average Security_Cost.  Sort by total Food_Sales
//   descending.
// ─────────────────────────────────────────────────────────────
db.Event.aggregate([
  {
    $match: {
      Event_Type : { $in: ["Concert", "Drama"] },
      Event_Year : { $gte: 2021 }
    }
  },
  {
    $group: {
      _id            : "$Event_Type",
      Total_Events   : { $sum: 1 },
      Total_FoodSales: { $sum: "$Food_Sales" },
      Max_Ticket     : { $max: "$Ticket_Price" },
      Min_Ticket     : { $min: "$Ticket_Price" },
      Avg_Security   : { $avg: "$Security_Cost" }
    }
  },
  {
    $project: {
      _id             : 1,
      Total_Events    : 1,
      Total_FoodSales : 1,
      Max_Ticket      : 1,
      Min_Ticket      : 1,
      Avg_Security    : { $round: ["$Avg_Security", 0] }
    }
  },
  {
    $sort: { Total_FoodSales: -1 }
  }
])

// ─────────────────────────────────────────────────────────────
// A3  ($unwind on Sponsors array, $group, $sort, $limit)
// Question:
//   Unwind the Sponsors array to find which sponsor appears
//   most frequently across all events.  Show sponsor name,
//   total appearances, and average Sponsorship_Value for
//   events featuring that sponsor.  Show top 5 sponsors.
// ─────────────────────────────────────────────────────────────
db.Event.aggregate([
  {
    $unwind: "$Sponsors"
  },
  {
    $group: {
      _id              : "$Sponsors",
      Total_Events     : { $sum: 1 },
      Avg_SponValue    : { $avg: "$Sponsorship_Value" }
    }
  },
  {
    $project: {
      _id           : 1,
      Total_Events  : 1,
      Avg_SponValue : { $round: ["$Avg_SponValue", 0] }
    }
  },
  {
    $sort: { Total_Events: -1 }
  },
  {
    $limit: 5
  }
])

// ─────────────────────────────────────────────────────────────
// A4  ($unwind on Refreshments, $match, $group, $sort)
// Question:
//   For events held in 2022 and 2023, unwind the Refreshments
//   array and show how many times each refreshment item was
//   provided.  Also show average Food_Sales for events that
//   included each refreshment type.
// ─────────────────────────────────────────────────────────────
db.Event.aggregate([
  {
    $match: {
      Event_Year: { $in: [2022, 2023] }
    }
  },
  {
    $unwind: "$Refreshments"
  },
  {
    $group: {
      _id           : "$Refreshments",
      Times_Offered : { $sum: 1 },
      Avg_FoodSales : { $avg: "$Food_Sales" }
    }
  },
  {
    $project: {
      _id           : 1,
      Times_Offered : 1,
      Avg_FoodSales : { $round: ["$Avg_FoodSales", 0] }
    }
  },
  {
    $sort: { Times_Offered: -1 }
  }
])

// ─────────────────────────────────────────────────────────────
// A5  ($match, $group by Year, $sort, $project)
// Question:
//   For each year from 2019 to 2024, calculate the total number
//   of events, total revenue (sum of Food_Sales +
//   Merchandise_Sales), and average Security_Cost.
//   Sort results by year ascending.
// ─────────────────────────────────────────────────────────────
db.Event.aggregate([
  {
    $match: {
      Event_Year: { $gte: 2019, $lte: 2024 }
    }
  },
  {
    $group: {
      _id             : "$Event_Year",
      Total_Events    : { $sum: 1 },
      Total_Revenue   : { $sum: { $add: ["$Food_Sales", "$Merchandise_Sales"] } },
      Avg_Security    : { $avg: "$Security_Cost" }
    }
  },
  {
    $project: {
      _id           : 1,
      Total_Events  : 1,
      Total_Revenue : 1,
      Avg_Security  : { $round: ["$Avg_Security", 0] }
    }
  },
  {
    $sort: { _id: 1 }
  }
])

// ─────────────────────────────────────────────────────────────
// A6  ($match, $group by SH Name, $sort, $project with $sum)
// Question:
//   For events with an Excellent or Good atmosphere, group by
//   Sports_Hall Name and show: count of events, total
//   Sponsorship_Value, average Actual_Crowd and max Ticket_Price.
//   Show only halls with more than 10 events, sorted by
//   total Sponsorship_Value descending.
// ─────────────────────────────────────────────────────────────
db.Event.aggregate([
  {
    $match: {
      Atmosphere: { $in: ["Excellent", "Good"] }
    }
  },
  {
    $group: {
      _id              : "$Sports_Hall.Name",
      Event_Count      : { $sum: 1 },
      Total_Spon_Value : { $sum: "$Sponsorship_Value" },
      Avg_Crowd        : { $avg: "$Actual_Crowd" },
      Max_Ticket       : { $max: "$Ticket_Price" }
    }
  },
  {
    $match: {
      Event_Count: { $gt: 10 }
    }
  },
  {
    $project: {
      _id              : 1,
      Event_Count      : 1,
      Total_Spon_Value : 1,
      Avg_Crowd        : { $round: ["$Avg_Crowd", 0] },
      Max_Ticket       : 1
    }
  },
  {
    $sort: { Total_Spon_Value: -1 }
  }
])

// ─────────────────────────────────────────────────────────────
// A7  ($match, $group by Sponsor_Type and Atmosphere, $sort)
// Question:
//   For each combination of Sponsor_Type and Atmosphere, count
//   the number of events and calculate the average
//   Sponsorship_Value.  Filter to only include combinations
//   with at least 20 events and sort by average Sponsorship_Value
//   descending.
// ─────────────────────────────────────────────────────────────
db.Event.aggregate([
  {
    $group: {
      _id: {
        Sponsor_Type : "$Sponsor_Type",
        Atmosphere   : "$Atmosphere"
      },
      Event_Count   : { $sum: 1 },
      Avg_SponValue : { $avg: "$Sponsorship_Value" }
    }
  },
  {
    $match: {
      Event_Count: { $gte: 20 }
    }
  },
  {
    $project: {
      _id           : 1,
      Event_Count   : 1,
      Avg_SponValue : { $round: ["$Avg_SponValue", 0] }
    }
  },
  {
    $sort: { Avg_SponValue: -1 }
  }
])

// ─────────────────────────────────────────────────────────────
// A8  ($addFields, $project, $match, $sort – computed field)
// Question:
//   For Concert and Sport events in 2022, calculate the total
//   revenue per event (Food_Sales + Merchandise_Sales +
//   Ticket_Price * Actual_Crowd), show events where total
//   revenue exceeds €400,000, and sort by total revenue
//   descending.  Show _id, Event_Type, and the computed
//   Total_Revenue.
// ─────────────────────────────────────────────────────────────
db.Event.aggregate([
  {
    $match: {
      Event_Type : { $in: ["Concert", "Sport"] },
      Event_Year : 2022
    }
  },
  {
    $addFields: {
      Ticket_Revenue : { $multiply: ["$Ticket_Price", "$Actual_Crowd"] },
      Total_Revenue  : {
        $add: [
          "$Food_Sales",
          "$Merchandise_Sales",
          { $multiply: ["$Ticket_Price", "$Actual_Crowd"] }
        ]
      }
    }
  },
  {
    $match: {
      Total_Revenue: { $gt: 400000 }
    }
  },
  {
    $project: {
      _id            : 1,
      Event_Type     : 1,
      Event_Year     : 1,
      Ticket_Revenue : 1,
      Food_Sales     : 1,
      Merchandise_Sales : 1,
      Total_Revenue  : 1
    }
  },
  {
    $sort: { Total_Revenue: -1 }
  }
])

// ─────────────────────────────────────────────────────────────
// A9  ($bucket – Ticket_Price ranges)
// Question:
//   Bucket all events by Ticket_Price into ranges:
//   €0 (free), €1-€30, €31-€60, €61-€90, €91-€120.
//   For each bucket, show the count of events and the
//   average Actual_Crowd.
// ─────────────────────────────────────────────────────────────
db.Event.aggregate([
  {
    $bucket: {
      groupBy    : "$Ticket_Price",
      boundaries : [0, 1, 31, 61, 91, 121],
      default    : "Other",
      output     : {
        Event_Count : { $sum: 1 },
        Avg_Crowd   : { $avg: "$Actual_Crowd" }
      }
    }
  },
  {
    $project: {
      _id         : 1,
      Event_Count : 1,
      Avg_Crowd   : { $round: ["$Avg_Crowd", 0] }
    }
  }
])

// ─────────────────────────────────────────────────────────────
// A10  ($unwind Sports_Hall.Sport, $group, $sort)
// Question:
//   Unwind the Sports_Hall Sport array to find which sport
//   type is most commonly associated with events.  For each
//   sport, show the count, average Food_Sales, and average
//   Actual_Crowd.  Sort by event count descending.
// ─────────────────────────────────────────────────────────────
db.Event.aggregate([
  {
    $unwind: "$Sports_Hall.Sport"
  },
  {
    $group: {
      _id           : "$Sports_Hall.Sport",
      Event_Count   : { $sum: 1 },
      Avg_FoodSales : { $avg: "$Food_Sales" },
      Avg_Crowd     : { $avg: "$Actual_Crowd" }
    }
  },
  {
    $project: {
      _id           : 1,
      Event_Count   : 1,
      Avg_FoodSales : { $round: ["$Avg_FoodSales", 0] },
      Avg_Crowd     : { $round: ["$Avg_Crowd", 0] }
    }
  },
  {
    $sort: { Event_Count: -1 }
  }
])

// ─────────────────────────────────────────────────────────────
// A11  ($match, $group by County + Year, $sort)
// Question:
//   For events held in Dublin Sports Halls between 2021 and
//   2024, group by Event_Year and show: total events, total
//   Security_Cost, average Sponsorship_Value, and the most
//   common Event_Type (using $first after $sort by count).
//   Sort results by year ascending.
// ─────────────────────────────────────────────────────────────
db.Event.aggregate([
  {
    $match: {
      "Sports_Hall.County" : "Dublin",
      Event_Year           : { $gte: 2021, $lte: 2024 }
    }
  },
  {
    $group: {
      _id             : "$Event_Year",
      Total_Events    : { $sum: 1 },
      Total_Security  : { $sum: "$Security_Cost" },
      Avg_SponValue   : { $avg: "$Sponsorship_Value" }
    }
  },
  {
    $project: {
      _id            : 1,
      Total_Events   : 1,
      Total_Security : 1,
      Avg_SponValue  : { $round: ["$Avg_SponValue", 0] }
    }
  },
  {
    $sort: { _id: 1 }
  }
])

// ─────────────────────────────────────────────────────────────
// A12  ($match, $group, $project with $cond – conditional field)
// Question:
//   For all events in 2023, group by Atmosphere rating and show
//   the total events, average Ticket_Price, and classify the
//   average Food_Sales as High (>= 12000), Medium (>= 7000),
//   or Low using $cond.  Sort by total events descending.
// ─────────────────────────────────────────────────────────────
db.Event.aggregate([
  {
    $match: {
      Event_Year: 2023
    }
  },
  {
    $group: {
      _id           : "$Atmosphere",
      Total_Events  : { $sum: 1 },
      Avg_Ticket    : { $avg: "$Ticket_Price" },
      Avg_FoodSales : { $avg: "$Food_Sales" }
    }
  },
  {
    $project: {
      _id          : 1,
      Total_Events : 1,
      Avg_Ticket   : { $round: ["$Avg_Ticket", 2] },
      FoodCategory : {
        $cond: {
          if     : { $gte: ["$Avg_FoodSales", 12000] },
          then   : "High",
          else   : {
            $cond: {
              if   : { $gte: ["$Avg_FoodSales", 7000] },
              then : "Medium",
              else : "Low"
            }
          }
        }
      }
    }
  },
  {
    $sort: { Total_Events: -1 }
  }
])

// ─────────────────────────────────────────────────────────────
// A13  ($match, $group by Technician.Qualification, $sort)
// Question:
//   Compare Technician qualification levels across all events.
//   For each Qualification (Cert, Diploma, Degree), show the
//   total number of events, average Hourly_Fee, average
//   Total_Hours worked, and total earnings
//   (sum of Total_Hours * Hourly_Fee).  Sort by avg Hourly_Fee
//   descending.
// ─────────────────────────────────────────────────────────────
db.Event.aggregate([
  {
    $group: {
      _id              : "$Technician.Qualification",
      Event_Count      : { $sum: 1 },
      Avg_HourlyFee    : { $avg: "$Technician.Hourly_Fee" },
      Avg_TotalHours   : { $avg: "$Technician.Total_Hours" },
      Total_Earnings   : {
        $sum: {
          $multiply: ["$Technician.Total_Hours", "$Technician.Hourly_Fee"]
        }
      }
    }
  },
  {
    $project: {
      _id            : 1,
      Event_Count    : 1,
      Avg_HourlyFee  : { $round: ["$Avg_HourlyFee", 2] },
      Avg_TotalHours : { $round: ["$Avg_TotalHours", 1] },
      Total_Earnings : 1
    }
  },
  {
    $sort: { Avg_HourlyFee: -1 }
  }
])

// ─────────────────────────────────────────────────────────────
// A14  ($facet – multi-faceted aggregation)
// Question:
//   Generate a summary dashboard for ALL events using $facet:
//   (a) Top 5 venues by total Actual_Crowd
//   (b) Breakdown of events by Atmosphere rating
//   (c) Average Ticket_Price per Event_Type
// ─────────────────────────────────────────────────────────────
db.Event.aggregate([
  {
    $facet: {
      TopVenuesByCrowd: [
        {
          $group: {
            _id          : "$Sports_Hall.Name",
            Total_Crowd  : { $sum: "$Actual_Crowd" },
            Total_Events : { $sum: 1 }
          }
        },
        { $sort  : { Total_Crowd: -1 } },
        { $limit : 5 }
      ],
      AtmosphereBreakdown: [
        {
          $group: {
            _id          : "$Atmosphere",
            Total_Events : { $sum: 1 }
          }
        },
        { $sort: { Total_Events: -1 } }
      ],
      AvgTicketByType: [
        {
          $group: {
            _id        : "$Event_Type",
            Avg_Ticket : { $avg: "$Ticket_Price" }
          }
        },
        {
          $project: {
            _id        : 1,
            Avg_Ticket : { $round: ["$Avg_Ticket", 2] }
          }
        },
        { $sort: { Avg_Ticket: -1 } }
      ]
    }
  }
])

// ─────────────────────────────────────────────────────────────
// A15  ($match, $group, $addFields, $sort – Capacity utilisation)
// Question:
//   For events with more than 500 Expected_Crowd, calculate the
//   occupancy rate per Sports Hall (Actual_Crowd / Capacity * 100).
//   Group by Sports_Hall Name, show average occupancy rate,
//   average Actual_Crowd, and total events.  Only include halls
//   with at least 50 events.  Sort by average occupancy rate
//   descending.  Show top 8.
// ─────────────────────────────────────────────────────────────
db.Event.aggregate([
  {
    $match: {
      Expected_Crowd: { $gt: 500 }
    }
  },
  {
    $addFields: {
      Occupancy_Rate: {
        $multiply: [
          { $divide: ["$Actual_Crowd", "$Sports_Hall.Capacity"] },
          100
        ]
      }
    }
  },
  {
    $group: {
      _id              : "$Sports_Hall.Name",
      Total_Events     : { $sum: 1 },
      Avg_Crowd        : { $avg: "$Actual_Crowd" },
      Avg_Occupancy    : { $avg: "$Occupancy_Rate" }
    }
  },
  {
    $match: {
      Total_Events: { $gte: 50 }
    }
  },
  {
    $project: {
      _id           : 1,
      Total_Events  : 1,
      Avg_Crowd     : { $round: ["$Avg_Crowd", 0] },
      Avg_Occupancy : { $round: ["$Avg_Occupancy", 2] }
    }
  },
  {
    $sort: { Avg_Occupancy: -1 }
  },
  {
    $limit: 8
  }
])
