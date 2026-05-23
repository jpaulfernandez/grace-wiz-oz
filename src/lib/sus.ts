export interface SUSResponse {
  responses: number[]
  score: number
}

/**
 * Calculates the standard System Usability Scale (SUS) score (0-100).
 * odd items (1, 3, 5, 7, 9 -> indices 0, 2, 4, 6, 8): response - 1
 * even items (2, 4, 6, 8, 10 -> indices 1, 3, 5, 7, 9): 5 - response
 */
export function calculateSUSScore(responses: number[]): SUSResponse {
  if (responses.length !== 10) {
    throw new Error('SUS requires exactly 10 responses')
  }

  let totalScore = 0
  for (let i = 0; i < 10; i++) {
    const response = responses[i]
    if (response < 1 || response > 5) {
      throw new Error(`Invalid SUS response value: ${response}. Must be between 1 and 5.`)
    }

    if (i % 2 === 0) {
      // Odd-numbered questions (1, 3, 5, 7, 9) are 0-indexed as even indices
      totalScore += response - 1
    } else {
      // Even-numbered questions (2, 4, 6, 8, 10) are 0-indexed as odd indices
      totalScore += 5 - response
    }
  }

  const finalScore = totalScore * 2.5
  return {
    responses,
    score: Number(finalScore.toFixed(1))
  }
}
