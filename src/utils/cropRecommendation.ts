import cropDataset from "@/assets/Crop_recommendation.csv?raw";

export interface SoilParameters {
  N?: number;
  P?: number;
  K?: number;
  temperature?: number;
  humidity?: number;
  ph?: number;
  rainfall?: number;
}

export interface CropData {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
  label: string;
}

export interface CropStats {
  name: string;
  icon: string;
  avgN: number;
  avgP: number;
  avgK: number;
  avgTemp: number;
  avgHumidity: number;
  avgPh: number;
  avgRainfall: number;
  minN: number;
  maxN: number;
  minP: number;
  maxP: number;
  minK: number;
  maxK: number;
  minTemp: number;
  maxTemp: number;
  minHumidity: number;
  maxHumidity: number;
  minPh: number;
  maxPh: number;
  minRainfall: number;
  maxRainfall: number;
  sampleCount: number;
  tips: string[];
}

export interface CropRecommendation {
  crop: CropStats;
  suitabilityScore: number;
  matchReasons: string[];
}

// Crop icons mapping
const CROP_ICONS: Record<string, string> = {
  rice: "🌾",
  maize: "🌽",
  chickpea: "🫘",
  "kidney beans": "🫘",
  "pigeon peas": "🫛",
  "moth beans": "🫘",
  "mung bean": "🫘",
  "black gram": "🫘",
  lentil: "🫘",
  pomegranate: "🍎",
  banana: "🍌",
  mango: "🥭",
  grapes: "🍇",
  watermelon: "🍉",
  muskmelon: "🍈",
  apple: "🍎",
  orange: "🍊",
  papaya: "🫐",
  coconut: "🥥",
  cotton: "☁️",
  jute: "🌿",
  coffee: "☕",
};

// Crop growing tips
const CROP_TIPS: Record<string, string[]> = {
  rice: ["Requires flooded fields", "Plant during monsoon", "Needs consistent water"],
  maize: ["Good for crop rotation", "Drought tolerant", "Harvest when kernels are hard"],
  chickpea: ["Nitrogen-fixing crop", "Good for soil health", "Avoid waterlogging"],
  "kidney beans": ["Needs moderate water", "Plant after frost", "Support with stakes"],
  "pigeon peas": ["Drought resistant", "Improves soil fertility", "Long growing season"],
  "moth beans": ["Very drought tolerant", "Thrives in arid zones", "Short growing period"],
  "mung bean": ["Fast growing", "Good summer crop", "Fixes nitrogen"],
  "black gram": ["Suits monsoon season", "Enriches soil", "Avoid waterlogging"],
  lentil: ["Cool season crop", "Low water needs", "Good protein source"],
  pomegranate: ["Drought tolerant tree", "Needs dry climate", "Prune regularly"],
  banana: ["Needs lots of water", "Heavy feeder crop", "Protect from wind"],
  mango: ["Needs dry flowering period", "Deep rooted tree", "Mulch well"],
  grapes: ["Needs trellising", "Good drainage essential", "Prune in winter"],
  watermelon: ["Needs warm weather", "Space plants well", "Avoid overhead watering"],
  muskmelon: ["Needs warm soil", "Mulch heavily", "Pick when aromatic"],
  apple: ["Needs cold winter", "Thin fruit early", "Pest management crucial"],
  orange: ["Consistent watering", "Feed regularly", "Protect from frost"],
  papaya: ["Fast growing", "Good drainage needed", "Male and female plants"],
  coconut: ["Coastal areas ideal", "High potassium needs", "Long maturity period"],
  cotton: ["Needs warm weather", "Pest control important", "Deep tillage needed"],
  jute: ["Needs humid climate", "Waterlogging tolerant", "Harvest before flowering"],
  coffee: ["Shade grown best", "Acidic soil preferred", "High altitude suits"],
};

// Parse CSV and compute crop statistics
let cropStatsCache: CropStats[] | null = null;

function parseCropDataset(): CropStats[] {
  if (cropStatsCache) return cropStatsCache;

  const lines = cropDataset.trim().split("\n");
  const dataByLabel: Record<string, CropData[]> = {};

  // Skip header, parse data
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    if (values.length !== 8) continue;

    const data: CropData = {
      N: parseFloat(values[0]),
      P: parseFloat(values[1]),
      K: parseFloat(values[2]),
      temperature: parseFloat(values[3]),
      humidity: parseFloat(values[4]),
      ph: parseFloat(values[5]),
      rainfall: parseFloat(values[6]),
      label: values[7].trim().toLowerCase(),
    };

    if (!dataByLabel[data.label]) {
      dataByLabel[data.label] = [];
    }
    dataByLabel[data.label].push(data);
  }

  // Compute statistics for each crop
  const cropStats: CropStats[] = [];

  for (const [label, samples] of Object.entries(dataByLabel)) {
    const count = samples.length;
    
    const avgN = samples.reduce((sum, s) => sum + s.N, 0) / count;
    const avgP = samples.reduce((sum, s) => sum + s.P, 0) / count;
    const avgK = samples.reduce((sum, s) => sum + s.K, 0) / count;
    const avgTemp = samples.reduce((sum, s) => sum + s.temperature, 0) / count;
    const avgHumidity = samples.reduce((sum, s) => sum + s.humidity, 0) / count;
    const avgPh = samples.reduce((sum, s) => sum + s.ph, 0) / count;
    const avgRainfall = samples.reduce((sum, s) => sum + s.rainfall, 0) / count;

    const minN = Math.min(...samples.map(s => s.N));
    const maxN = Math.max(...samples.map(s => s.N));
    const minP = Math.min(...samples.map(s => s.P));
    const maxP = Math.max(...samples.map(s => s.P));
    const minK = Math.min(...samples.map(s => s.K));
    const maxK = Math.max(...samples.map(s => s.K));
    const minTemp = Math.min(...samples.map(s => s.temperature));
    const maxTemp = Math.max(...samples.map(s => s.temperature));
    const minHumidity = Math.min(...samples.map(s => s.humidity));
    const maxHumidity = Math.max(...samples.map(s => s.humidity));
    const minPh = Math.min(...samples.map(s => s.ph));
    const maxPh = Math.max(...samples.map(s => s.ph));
    const minRainfall = Math.min(...samples.map(s => s.rainfall));
    const maxRainfall = Math.max(...samples.map(s => s.rainfall));

    cropStats.push({
      name: label.charAt(0).toUpperCase() + label.slice(1),
      icon: CROP_ICONS[label] || "🌱",
      avgN,
      avgP,
      avgK,
      avgTemp,
      avgHumidity,
      avgPh,
      avgRainfall,
      minN,
      maxN,
      minP,
      maxP,
      minK,
      maxK,
      minTemp,
      maxTemp,
      minHumidity,
      maxHumidity,
      minPh,
      maxPh,
      minRainfall,
      maxRainfall,
      sampleCount: count,
      tips: CROP_TIPS[label] || ["Consult local agriculture experts", "Monitor soil regularly"],
    });
  }

  cropStatsCache = cropStats;
  return cropStats;
}

// Calculate Euclidean distance between user params and crop averages
function calculateSimilarityScore(params: SoilParameters, crop: CropStats): number {
  let sumSquaredDiff = 0;
  let paramCount = 0;

  // Normalize and calculate weighted distance
  if (params.N !== undefined) {
    const normalized = (params.N - crop.avgN) / (crop.maxN - crop.minN || 1);
    sumSquaredDiff += normalized * normalized;
    paramCount++;
  }

  if (params.P !== undefined) {
    const normalized = (params.P - crop.avgP) / (crop.maxP - crop.minP || 1);
    sumSquaredDiff += normalized * normalized;
    paramCount++;
  }

  if (params.K !== undefined) {
    const normalized = (params.K - crop.avgK) / (crop.maxK - crop.minK || 1);
    sumSquaredDiff += normalized * normalized;
    paramCount++;
  }

  if (params.temperature !== undefined) {
    const normalized = (params.temperature - crop.avgTemp) / (crop.maxTemp - crop.minTemp || 1);
    sumSquaredDiff += normalized * normalized * 1.5; // Temperature is important
    paramCount += 1.5;
  }

  if (params.humidity !== undefined) {
    const normalized = (params.humidity - crop.avgHumidity) / (crop.maxHumidity - crop.minHumidity || 1);
    sumSquaredDiff += normalized * normalized;
    paramCount++;
  }

  if (params.ph !== undefined) {
    const normalized = (params.ph - crop.avgPh) / (crop.maxPh - crop.minPh || 1);
    sumSquaredDiff += normalized * normalized * 1.2; // pH is important
    paramCount += 1.2;
  }

  if (params.rainfall !== undefined) {
    const normalized = (params.rainfall - crop.avgRainfall) / (crop.maxRainfall - crop.minRainfall || 1);
    sumSquaredDiff += normalized * normalized * 1.3; // Rainfall is important
    paramCount += 1.3;
  }

  if (paramCount === 0) return 0;

  // Convert distance to similarity score (0-100)
  const avgSquaredDiff = sumSquaredDiff / paramCount;
  const distance = Math.sqrt(avgSquaredDiff);
  const similarity = Math.max(0, 100 * (1 - distance));

  return similarity;
}

// Check if value is within acceptable range
function isInRange(value: number, min: number, max: number, avg: number): boolean {
  const range = max - min;
  const tolerance = range * 0.15; // 15% tolerance
  return value >= min - tolerance && value <= max + tolerance;
}

export function recommendCrops(params: SoilParameters): CropRecommendation[] {
  const cropStats = parseCropDataset();
  const recommendations: CropRecommendation[] = [];

  for (const crop of cropStats) {
    const suitabilityScore = calculateSimilarityScore(params, crop);
    const matchReasons: string[] = [];

    // Build match reasons
    if (params.N !== undefined && isInRange(params.N, crop.minN, crop.maxN, crop.avgN)) {
      matchReasons.push(`Nitrogen level (${params.N}) is ideal`);
    }

    if (params.P !== undefined && isInRange(params.P, crop.minP, crop.maxP, crop.avgP)) {
      matchReasons.push(`Phosphorus level (${params.P}) matches well`);
    }

    if (params.K !== undefined && isInRange(params.K, crop.minK, crop.maxK, crop.avgK)) {
      matchReasons.push(`Potassium level (${params.K}) is suitable`);
    }

    if (params.temperature !== undefined && isInRange(params.temperature, crop.minTemp, crop.maxTemp, crop.avgTemp)) {
      matchReasons.push(`Temperature (${params.temperature}°C) is perfect`);
    }

    if (params.humidity !== undefined && isInRange(params.humidity, crop.minHumidity, crop.maxHumidity, crop.avgHumidity)) {
      matchReasons.push(`Humidity (${params.humidity}%) is optimal`);
    }

    if (params.ph !== undefined && isInRange(params.ph, crop.minPh, crop.maxPh, crop.avgPh)) {
      matchReasons.push(`pH level (${params.ph}) is good`);
    }

    if (params.rainfall !== undefined && isInRange(params.rainfall, crop.minRainfall, crop.maxRainfall, crop.avgRainfall)) {
      matchReasons.push(`Rainfall (${params.rainfall}mm) is appropriate`);
    }

    if (matchReasons.length === 0 && suitabilityScore > 50) {
      matchReasons.push(`${Math.round(suitabilityScore)}% overall compatibility`);
    }

    recommendations.push({
      crop,
      suitabilityScore,
      matchReasons: matchReasons.length > 0 ? matchReasons : [`${Math.round(suitabilityScore)}% match`],
    });
  }

  // Sort by suitability score
  return recommendations.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}

// Extract numeric parameters from text using regex patterns
export function extractParameters(text: string): SoilParameters {
  const params: SoilParameters = {};
  const lowerText = text.toLowerCase();

  // N, P, K patterns
  const nMatch = lowerText.match(/\bn[:\s=]+(\d+(?:\.\d+)?)/i) || lowerText.match(/nitrogen[:\s=]+(\d+(?:\.\d+)?)/i);
  const pMatch = lowerText.match(/\bp[:\s=]+(\d+(?:\.\d+)?)/i) || lowerText.match(/phosphorus[:\s=]+(\d+(?:\.\d+)?)/i);
  const kMatch = lowerText.match(/\bk[:\s=]+(\d+(?:\.\d+)?)/i) || lowerText.match(/potassium[:\s=]+(\d+(?:\.\d+)?)/i);
  
  // Temperature patterns
  const tempMatch = lowerText.match(/temp(?:erature)?[:\s=]+(\d+(?:\.\d+)?)/i) || 
                    lowerText.match(/(\d+(?:\.\d+)?)\s*°?c/i);
  
  // Humidity patterns
  const humMatch = lowerText.match(/humidity[:\s=]+(\d+(?:\.\d+)?)/i) ||
                   lowerText.match(/(\d+(?:\.\d+)?)\s*%/i);
  
  // pH patterns
  const phMatch = lowerText.match(/ph[:\s=]+(\d+(?:\.\d+)?)/i);
  
  // Rainfall patterns
  const rainMatch = lowerText.match(/rain(?:fall)?[:\s=]+(\d+(?:\.\d+)?)/i) ||
                    lowerText.match(/(\d+(?:\.\d+)?)\s*mm/i);

  if (nMatch) params.N = parseFloat(nMatch[1]);
  if (pMatch) params.P = parseFloat(pMatch[1]);
  if (kMatch) params.K = parseFloat(kMatch[1]);
  if (tempMatch) params.temperature = parseFloat(tempMatch[1]);
  if (humMatch) params.humidity = parseFloat(humMatch[1]);
  if (phMatch) params.ph = parseFloat(phMatch[1]);
  if (rainMatch) params.rainfall = parseFloat(rainMatch[1]);

  return params;
}
