# Screenshots

Output captured from the live MongoDB Atlas cluster (`Event_db.Event`, 1,000 documents). Each query screenshot shows the question, the expected count and the documents returned. Some longer results run past the bottom of the screen, so not every document is visible. For the six cut-off queries (Q2, Q5, Q18, Q19, Q26 and Q32) there is also a `_full_result.png` listing every matching document. These are generated from the dataset with the same filter, are clearly labelled, and are not terminal screenshots. `scripts/verify_query_counts.py` confirms all 35 counts.

Passwords and connection strings are not shown. The import command uses an `<atlas_uri>` placeholder, and the Compass connection string is redacted.

## 1. Setup

| Step | Screenshot |
|---|---|
| Import 1,000 documents with `mongoimport` | [stage1_1_mongoimport.png](01_setup/stage1_1_mongoimport.png) |
| Confirm the count with `countDocuments()` | [stage1_2_countDocuments.png](01_setup/stage1_2_countDocuments.png) |
| Inspect one document with `findOne()` | [stage1_3_findOne.png](01_setup/stage1_3_findOne.png) |

## 2. Simple queries (mongosh)

| Query | Operators | Screenshot |
|---|---|---|
| Q1 | $eq, $gt, projection | [Q01.png](02_find_queries/Q01.png) |
| Q2 | dot notation on embedded doc, $gt | [Q02.png](02_find_queries/Q02.png), full result: [Q02_full_result.png](02_find_queries/Q02_full_result.png) |
| Q3 | $eq, $gt, multiple criteria | [Q03.png](02_find_queries/Q03.png) |
| Q4 | $in for year, $gt for duration | [Q04.png](02_find_queries/Q04.png) |
| Q5 | $in for year, dot notation, multiple criteria | [Q05.png](02_find_queries/Q05.png), full result: [Q05_full_result.png](02_find_queries/Q05_full_result.png) |
| Q6 | $gt, multiple dot-notation fields | [Q06.png](02_find_queries/Q06.png) |
| Q7 | dot notation, embedded doc, year | [Q07.png](02_find_queries/Q07.png) |
| Q8 | $gte, $lte: equivalent of SQL BETWEEN | [Q08.png](02_find_queries/Q08.png) |
| Q9 | dot notation, $gt on Food_Sales | [Q09.png](02_find_queries/Q09.png) |
| Q10 | $and explicit, dot notation | [Q10.png](02_find_queries/Q10.png) |
| Q11 | dot notation into Technician embedded doc, $gt, $in | [Q11.png](02_find_queries/Q11.png) |
| Q12 | $all on Sponsors array, $in for year | [Q12.png](02_find_queries/Q12.png) |
| Q13 | exact array match: only Tea in Refreshments, $eq year | [Q13.png](02_find_queries/Q13.png) |
| Q14 | $all on Sports_Hall.Sport nested array | [Q14.png](02_find_queries/Q14.png) |
| Q15 | $regex on Technician.Name | [Q15.png](02_find_queries/Q15.png) |
| Q16 | dot notation $gt on Capacity, $eq on Event_Type and Year | [Q16.png](02_find_queries/Q16.png) |
| Q17 | $nin on array: Refreshments does NOT include Coffee | [Q17.png](02_find_queries/Q17.png) |
| Q18 | $and implicit, dot notation into Technician | [Q18.png](02_find_queries/Q18.png), full result: [Q18_full_result.png](02_find_queries/Q18_full_result.png) |
| Q19 | $gte on year, dot notation for Seating | [Q19.png](02_find_queries/Q19.png), full result: [Q19_full_result.png](02_find_queries/Q19_full_result.png) |
| Q20 | $gt on two numeric fields, year | [Q20.png](02_find_queries/Q20.png) |
| Q21 | $in on county array for Sports_Hall.County | [Q21.png](02_find_queries/Q21.png) |
| Q22 | $nin on Event_Type, $gt on Ticket_Price | [Q22.png](02_find_queries/Q22.png) |
| Q23 | $gte on Duration, $in on Event_Type, $in on Year | [Q23.png](02_find_queries/Q23.png) |
| Q24 | dot notation Technician.County, multiple criteria | [Q24.png](02_find_queries/Q24.png) |
| Q25 | $and: multiple equality conditions | [Q25.png](02_find_queries/Q25.png) |
| Q26 | $size on Sports_Hall.Sport array | [Q26.png](02_find_queries/Q26.png), full result: [Q26_full_result.png](02_find_queries/Q26_full_result.png) |
| Q27 | $nin on Sponsor_Type, $in on Atmosphere | [Q27.png](02_find_queries/Q27.png) |
| Q28 | $eq on Total_Hours, $gt on Security_Cost | [Q28.png](02_find_queries/Q28.png) |
| Q29 | $gt on Sports_Hall.Cost: premium venues only | [Q29.png](02_find_queries/Q29.png) |
| Q30 | Event_Month, Event_Type, Atmosphere | [Q30.png](02_find_queries/Q30.png) |
| Q31 | $in on Event_Type, month, atmosphere | [Q31.png](02_find_queries/Q31.png) |
| Q32 | $size on Refreshments array: all 4 items present | [Q32.png](02_find_queries/Q32.png), full result: [Q32_full_result.png](02_find_queries/Q32_full_result.png) |
| Q33 | $eq on Ticket_Price = 0, $gt on Actual_Crowd, year | [Q33.png](02_find_queries/Q33.png) |
| Q34 | $ne on Technician.Qualification | [Q34.png](02_find_queries/Q34.png) |
| Q35 | $or operator: explicit use | [Q35.png](02_find_queries/Q35.png) |

## 3. Aggregation pipelines (mongosh)

| Pipeline | Stages | Screenshot |
|---|---|---|
| A1 | $match, $group, $sort, $project | [A01.png](03_aggregations/A01.png) |
| A2 | $match, $group with $sum, $avg, $max, $min, $sort | [A02.png](03_aggregations/A02.png) |
| A3 | $unwind on Sponsors array, $group, $sort, $limit | [A03.png](03_aggregations/A03.png) |
| A4 | $unwind on Refreshments, $match, $group, $sort | [A04.png](03_aggregations/A04.png) |
| A5 | $match, $group by Year, $sort, $project | [A05.png](03_aggregations/A05.png) |
| A6 | $match, $group by SH Name, $sort, $project with $sum | [A06.png](03_aggregations/A06.png) |
| A7 | $match, $group by Sponsor_Type and Atmosphere, $sort | [A07.png](03_aggregations/A07.png) |
| A8 | $addFields, $project, $match, $sort: computed field | [A08.png](03_aggregations/A08.png) |
| A9 | $bucket: Ticket_Price ranges | [A09.png](03_aggregations/A09.png) |
| A10 | $unwind Sports_Hall.Sport, $group, $sort | [A10.png](03_aggregations/A10.png) |
| A11 | $match, $group by County + Year, $sort | [A11.png](03_aggregations/A11.png) |
| A12 | $match, $group, $project with $cond: conditional field | [A12.png](03_aggregations/A12.png) |
| A13 | $match, $group by Technician.Qualification, $sort | [A13.png](03_aggregations/A13.png) |
| A14 | $facet: multi-faceted aggregation | [A14.png](03_aggregations/A14.png) |
| A15 | $match, $group, $addFields, $sort: Capacity utilisation | [A15.png](03_aggregations/A15.png) |

## 4. Compass and Atlas

| Screenshot | What it shows |
|---|---|
| [atlas_01_cluster_dashboard.png](04_compass_atlas/atlas_01_cluster_dashboard.png) | Atlas cluster overview (free tier, AWS Mumbai, 3-node replica set) |
| [atlas_02_browse_collections.png](04_compass_atlas/atlas_02_browse_collections.png) | Atlas Data Explorer: the `Event` collection with 1K documents |
| [atlas_03_query_regex.png](04_compass_atlas/atlas_03_query_regex.png) | Atlas filter with `$regex`: 2022 events whose technician name starts with "Dan" (5 documents) |
| [atlas_04_query_or.png](04_compass_atlas/atlas_04_query_or.png) | Atlas filter with `$or`: Excellent events over €110 in 2019 or 2024 (6 documents) |
| [compass_01_new_connection.png](04_compass_atlas/compass_01_new_connection.png) | Compass connection dialog (connection string redacted) |
| [compass_02_database_list.png](04_compass_atlas/compass_02_database_list.png) | Compass connected to the cluster, showing `Event_db` |
| [compass_03_collection_documents.png](04_compass_atlas/compass_03_collection_documents.png) | Compass document view of the collection |
| [compass_04_query_concert_2024.png](04_compass_atlas/compass_04_query_concert_2024.png) | Compass filter and projection: Concerts in 2024, Excellent, tickets over €90 (5 documents) |
| [compass_05_query_size_sport.png](04_compass_atlas/compass_05_query_size_sport.png) | Compass filter with `$in` and `$size`: Conferences in 2022 or 2023 at single-sport halls (7 documents) |
| [compass_06a_aggregation_stages_1_2.png](04_compass_atlas/compass_06a_aggregation_stages_1_2.png) | Compass aggregation builder: `$group` and `$match` stages |
| [compass_06b_aggregation_stages_3_4.png](04_compass_atlas/compass_06b_aggregation_stages_3_4.png) | Compass aggregation builder: `$project` and `$sort` stages |
| [compass_07_aggregation_bucket.png](04_compass_atlas/compass_07_aggregation_bucket.png) | Compass aggregation builder: `$bucket` by ticket price |
