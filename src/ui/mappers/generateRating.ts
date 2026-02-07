export function getRatingLabel(score: number): string {
  if (score >= 9) return "Wonderful";
  if (score >= 8) return "Very Good";
  if (score >= 7) return "Good";
  return "Pleasant";
}

export function generateRating(id: string): { score: number; reviews: number } {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  const score = 7.0 + (Math.abs(hash) % 30) / 10;
  const reviews = 50 + (Math.abs(hash >> 4) % 950);
  return { score: Math.min(score, 9.9), reviews };
}
