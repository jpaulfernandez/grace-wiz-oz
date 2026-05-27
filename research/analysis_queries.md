# Research Analysis Queries

## Overview

This document contains SQL queries for analyzing study data from the Grace prototype database. The queries are designed to extract survey responses, microprompt answers, and telemetry data per session.

---

## 1. Survey Questions and Microprompts Answers per Session

This query fetches all survey questions, survey answers, and microprompt answers per session. It also includes the user's email address if it was collected.

```sql
WITH email_events AS (
  -- Extract email from email_collected events
  SELECT
    session_id,
    payload->>'email' AS email
  FROM events
  WHERE event_type = 'email_collected'
),

survey_answers AS (
  -- Extract survey answers
  SELECT
    session_id,
    payload->>'question_id' AS question_id,
    payload->>'answer' AS answer
  FROM events
  WHERE event_type = 'survey_answer'
),

microprompt_answers AS (
  -- Extract microprompt answers (annotation IDs)
  SELECT
    session_id,
    payload->>'annotation_id' AS annotation_id
  FROM events
  WHERE event_type = 'micro_prompt_answer'
)

-- Main query to combine all data
SELECT
  s.id AS session_id,
  s.invite_code,
  s.cohort,
  s.scenario_id,
  s.nickname,
  e.email,
  s.started_at,
  s.consented_at,
  s.completed_at,
  sa.question_id,
  sa.answer,
  ma.annotation_id
FROM sessions s
LEFT JOIN email_events e ON s.id = e.session_id
LEFT JOIN survey_answers sa ON s.id = sa.session_id
LEFT JOIN microprompt_answers ma ON s.id = ma.session_id
-- Optional: Filter to completed sessions only
-- WHERE s.completed_at IS NOT NULL
ORDER BY s.started_at, s.id, sa.question_id;
```

### Key Fields:
- `session_id`: Unique identifier for each study session
- `invite_code`: Participant's invite code
- `cohort`: Study cohort (women, lawyer, clinician)
- `scenario_id`: Scenario assigned to the session
- `nickname`: Participant's chosen nickname
- `email`: Email address (if provided)
- `started_at`: Session start time
- `consented_at`: Time consent was given
- `completed_at`: Session completion time
- `question_id`: Survey question identifier (e.g., `w_write_interest`, `sus_1`)
- `answer`: Survey answer (numeric for Likert/SUS, text for open-ended)
- `annotation_id`: Microprompt annotation identifier (from journal annotations)

---

## 2. Telemetry Data and Interpretation

This query pulls comprehensive telemetry data and provides insights into user behavior.

```sql
WITH event_counts AS (
  -- Count events per session and type
  SELECT
    session_id,
    event_type,
    COUNT(*) AS event_count
  FROM events
  GROUP BY session_id, event_type
),

screen_duration AS (
  -- Calculate time spent on each screen (using SCREEN_ENTER/SCREEN_EXIT events)
  SELECT
    session_id,
    screen_id,
    MIN(ts) AS enter_time,
    MAX(ts) AS exit_time,
    EXTRACT(EPOCH FROM (MAX(ts) - MIN(ts))) AS duration_seconds
  FROM events
  WHERE event_type IN ('screen_enter', 'screen_exit')
    AND screen_id IS NOT NULL
  GROUP BY session_id, screen_id
),

session_metrics AS (
  -- Calculate session-level metrics
  SELECT
    id AS session_id,
    invite_code,
    cohort,
    scenario_id,
    nickname,
    started_at,
    consented_at,
    completed_at,
    ended_early,
    -- Time to consent (seconds)
    EXTRACT(EPOCH FROM (consented_at - started_at)) AS time_to_consent,
    -- Total session duration (seconds)
    EXTRACT(EPOCH FROM (completed_at - started_at)) AS total_duration,
    -- Session completion rate
    CASE WHEN completed_at IS NOT NULL THEN 1 ELSE 0 END AS completed,
    -- End survey and SUS responses
    end_survey,
    sus_responses,
    pricing_response
  FROM sessions
)

-- Main telemetry query
SELECT
  sm.session_id,
  sm.invite_code,
  sm.cohort,
  sm.scenario_id,
  sm.nickname,
  sm.started_at,
  sm.consented_at,
  sm.completed_at,
  sm.ended_early,
  sm.time_to_consent,
  sm.total_duration,
  sm.completed,
  ec.event_type,
  ec.event_count,
  sd.screen_id,
  sd.enter_time,
  sd.exit_time,
  sd.duration_seconds,
  sm.end_survey,
  sm.sus_responses,
  sm.pricing_response
FROM session_metrics sm
LEFT JOIN event_counts ec ON sm.session_id = ec.session_id
LEFT JOIN screen_duration sd ON sm.session_id = sd.session_id
-- Optional: Filter to specific event types or date ranges
-- WHERE ec.event_type IN ('chat_send', 'journal_save', 'survey_answer')
--   AND sm.started_at >= '2026-01-01' AND sm.started_at < '2026-06-01'
ORDER BY sm.started_at, sm.session_id, ec.event_type, sd.screen_id;
```

### Key Metrics and Interpretation:

#### Session Level Metrics:
1. **`time_to_consent`**: Time taken to give consent (seconds)
   - Interpretation: Shorter times indicate clearer consent process

2. **`total_duration`**: Total session length (seconds)
   - Interpretation: Longer sessions may indicate deeper engagement

3. **`completed`**: 1 if session completed, 0 if ended early
   - Interpretation: Completion rate = (number of completed sessions / total sessions)

#### Event Count Metrics:
- **`chat_send`**: Number of chat messages sent
- **`journal_save`**: Number of journal entries saved
- **`survey_answer`**: Number of survey questions answered
- **`micro_prompt_answer`**: Number of microprompt annotations tapped
- **`button_tap`**: Number of button clicks
- **`screen_enter` / `screen_exit`**: Screen navigation events

#### Screen Duration Metrics:
- **`screen_id`**: Which screen the user visited
- **`duration_seconds`**: Time spent on that screen
- Key screens to analyze: `guided-home`, `companion-chat`, `journal-editor`, `incident-log`

#### Survey Responses:
- **`end_survey`**: JSON object with cohort-specific survey answers
- **`sus_responses`**: JSON object with SUS score and individual answers
  - `sus_responses->>'score'`: Overall SUS score (0-100)
- **`pricing_response`**: Text response to pricing question (lawyer/clinician cohorts)

---

## 3. Completed vs. Not Completed Sessions

```sql
SELECT
  COUNT(*) FILTER (WHERE completed_at IS NOT NULL) AS completed,
  COUNT(*) FILTER (WHERE completed_at IS NULL) AS not_completed,
  COUNT(*) AS total,
  ROUND(
    COUNT(*) FILTER (WHERE completed_at IS NOT NULL)::numeric / COUNT(*) * 100, 1
  ) AS completion_rate_pct
FROM sessions
WHERE consented_at IS NOT NULL;
```

---

## 4. Helper Query: Extract SUS Scores

This query extracts SUS scores from the `sus_responses` JSON field:

```sql
SELECT
  id AS session_id,
  cohort,
  (sus_responses->>'score')::numeric AS sus_score,
  -- Extract individual SUS answers (1-10)
  (sus_responses->'responses'->>0)::numeric AS sus_q1,
  (sus_responses->'responses'->>1)::numeric AS sus_q2,
  (sus_responses->'responses'->>2)::numeric AS sus_q3,
  (sus_responses->'responses'->>3)::numeric AS sus_q4,
  (sus_responses->'responses'->>4)::numeric AS sus_q5,
  (sus_responses->'responses'->>5)::numeric AS sus_q6,
  (sus_responses->'responses'->>6)::numeric AS sus_q7,
  (sus_responses->'responses'->>7)::numeric AS sus_q8,
  (sus_responses->'responses'->>8)::numeric AS sus_q9,
  (sus_responses->'responses'->>9)::numeric AS sus_q10
FROM sessions
WHERE sus_responses IS NOT NULL
ORDER BY cohort, sus_score DESC;
```

### SUS Score Interpretation:
- **0-49**: Poor usability
- **50-74**: Average usability
- **75-100**: Good usability

---

## 5. Helper Query: Analyze Cohort Differences

This query compares metrics across study cohorts:

```sql
SELECT
  cohort,
  COUNT(*) AS total_sessions,
  COUNT(*) FILTER (WHERE completed_at IS NOT NULL) AS completed_sessions,
  ROUND(COUNT(*) FILTER (WHERE completed_at IS NOT NULL)::numeric / COUNT(*) * 100, 1) AS completion_rate,
  ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - started_at)) / 60), 1) AS avg_duration_minutes,
  ROUND(AVG((sus_responses->>'score')::numeric), 1) AS avg_sus_score
FROM sessions
WHERE consented_at IS NOT NULL
GROUP BY cohort
ORDER BY cohort;
```

---

## Query Execution Instructions

### Running in Supabase SQL Editor:
1. Go to the Supabase dashboard
2. Navigate to "SQL Editor"
3. Copy and paste the query
4. Click "Run"

### Exporting Results:
- After running a query, click the "Download CSV" button in the Supabase SQL Editor
- For large datasets, consider limiting the date range using `WHERE sm.started_at BETWEEN '2026-01-01' AND '2026-06-01'`

---

## 6. Reset Database (Start Fresh)

**WARNING: This will permanently delete all data in the database. Use with caution!**

```sql
-- Truncate events table (foreign key reference to sessions)
TRUNCATE TABLE events CASCADE;

-- Truncate sessions table (will also delete all associated events due to CASCADE)
TRUNCATE TABLE sessions CASCADE;
```

### Why use this query?
- For testing purposes
- When resetting the study for a new cohort
- To clean up test data

---

## 7. Participant Overview (Excluding Test Accounts)

Count of participants, their nicknames, and email addresses — excluding the test nickname "paul".

```sql
WITH email_events AS (
  SELECT
    session_id,
    payload->>'email' AS email
  FROM events
  WHERE event_type = 'email_collected'
)

SELECT
  s.id AS session_id,
  s.nickname,
  e.email,
  s.started_at,
  s.cohort
FROM sessions s
LEFT JOIN email_events e ON s.id = e.session_id
WHERE LOWER(s.nickname) != 'paul'
ORDER BY s.started_at DESC;
```

To get just the count:

```sql
SELECT COUNT(*) AS participant_count
FROM sessions
WHERE LOWER(nickname) != 'paul';
```

---

## Notes on Data Quality:
- Email addresses are optional and may be missing
- Some sessions may have `ended_early = true` indicating the user left before completing
- Microprompt answers are only available for sessions that reached the journal annotations screen
- Survey responses are only available for completed sessions
