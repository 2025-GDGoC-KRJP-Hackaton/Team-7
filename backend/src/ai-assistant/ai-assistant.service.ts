import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as firebase from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AiAssistantService {
  private db;
  private model;

  constructor() {
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    };
    const app = firebase.initializeApp(firebaseConfig);
    this.db = getFirestore(app);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('Missing Gemini API Key');
    const ai = new GoogleGenerativeAI(apiKey);
    this.model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateRecommendation(userId: string, locationText: string, preferences: string) {
    const location = await this.geocodeLocation(locationText);
    const userPreferences = await this.getUserPreferences(userId);
    const weather = await this.getWeather(location);
    const holiday = await this.checkHolidays(location);
    const crowdLevels = await this.getCrowdLevels(location);
    const context = this.buildContext(preferences, location, userPreferences, weather, holiday, crowdLevels);

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `${context}\n\n${preferences}`,
          },
        ],
      },
    ];

    const result = await this.model.generateContentStream({
      contents,
      generationConfig: {
        temperature: 0.6,
      },
      systemInstruction: {
        role: 'system',
        parts: [
          {
            text: `You are a smart, real-time travel assistant helping a user currently exploring a specific country.\nYou have access to:\n1. Google Maps data in the local language of the country\n2. Real-time crowd level information for public spaces\n3. Recent search trends, reviews, and location ratings\n4. The current weather and the local holiday calendar\nYour primary goal is to optimize the user's time and experience in their current area by:\n1. Avoiding overcrowded or weather-affected locations\n2. Recommending relevant, personalized alternatives based on user preferences (e.g., museums, quiet cafés, history, nature, etc.)\n3. Providing practical, actionable suggestions that help them get the most out of the current moment\nGuidelines for response:\n1. Prioritize: 1) user preferences, 2) weather suitability, 3) crowd density\n2. If the user wants to visit a place that is currently crowded or weather-affected:\n* Recommend a nearby or relevant alternative to visit now (based on their preferences)\n* Suggest returning to the original place at a later, more optimal time\n3. Offer 1–3 tailored suggestions at a time\n4. For each suggestion, return both:\n  - natural language description\n  - structured JSON: { id, name, address, description }\n5. Be proactive and helpful.`,
          },
        ],
      },
    });

    let fullText = '';
    for await (const chunk of result.stream) {
      fullText += chunk.text();
    }

    const jsonMatches = fullText.match(/\{[^{}]+\}/g) || [];

    type PlaceRecommendation = {
      id: string;
      name: string;
      address: string;
      description: string;
    };

    const suggestions: PlaceRecommendation[] = [];
    const seen = new Set<string>();

    for (const raw of jsonMatches) {
      if (suggestions.length >= 5) break;
      try {
        const parsed = JSON.parse(raw);
        const key = `${parsed.name}_${parsed.address}`;
        if (
          parsed.id &&
          parsed.name &&
          parsed.address &&
          parsed.description &&
          !seen.has(key)
        ) {
          seen.add(key);
          await this.storeRecommendation(userId, parsed);
          suggestions.push(parsed);
        }
      } catch (e) {
        continue;
      }
    }

    await this.storeInteraction(userId, preferences, fullText);
    return {
      message: fullText,
      suggestions,
    };
  }

  private async geocodeLocation(locationText: string) {
    const res = await axios.get<{ results: any[] }>('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: locationText,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const result = res.data.results[0];
    const { lat, lng } = result.geometry.location;
    const country = result.address_components.find(c => c.types.includes('country'))?.short_name;
    const city = result.address_components.find(c => c.types.includes('locality'))?.long_name;

    return {
      country,
      city,
      latitude: lat,
      longitude: lng,
    };
  }

  private async getUserPreferences(userId: string) {
    const ref = collection(this.db, 'userPreferences');
    const q = query(ref, where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.empty ? null : snap.docs[0].data();
  }

  private async storeInteraction(userId: string, query: string, response: string) {
    await addDoc(collection(this.db, 'interactions'), {
      userId,
      query,
      response,
      timestamp: new Date(),
    });
  }

  private async storeRecommendation(userId: string, place: any) {
    await addDoc(collection(this.db, 'recommendation_results'), {
      userId,
      ...place,
      timestamp: new Date(),
    });
  }

  private async checkHolidays(location: any) {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    const res = await axios.get<any[]>(`https://date.nager.at/api/v3/PublicHolidays/${y}/${location.country}`);
    const found = res.data.find((h) => h.date === `${y}-${m}-${d}`);
    return found ? { isHoliday: true, holidayName: found.name } : { isHoliday: false };
  }

  private async getWeather(location: any) {
    const res = await axios.get<any>('https://api.weatherapi.com/v1/forecast.json', {
      params: {
        key: process.env.WEATHER_API_KEY,
        q: `${location.latitude},${location.longitude}`,
        days: 1,
      },
    });
    return res.data;
  }

  private async getCrowdLevels(location: any) {
    return {
      'Popular Museum': 'high',
      'City Park': 'medium',
      'Botanical Garden': 'low',
      'Historic Downtown': 'high',
      'Local Cafe': 'low',
      'Shopping Mall': 'medium',
      'Art Gallery': 'low',
      'Beach': 'medium',
      'Zoo': 'medium',
    };
  }

  private buildContext(preferences: string, loc: any, pref: any, weather: any, hol: any, crowd: any) {
    let context = `User query: ${preferences}\n\n`;
    context += `Location: ${loc.city}, ${loc.country}\n`;
    context += `Coordinates: ${loc.latitude}, ${loc.longitude}\n\n`;

    if (weather) {
      context += `Weather: ${weather.current.condition.text}\n`;
      context += `Temperature: ${weather.current.temp_c}°C / ${weather.current.temp_f}°F\n`;
      context += `Humidity: ${weather.current.humidity}%\n`;
      context += `Wind: ${weather.current.wind_kph} km/h\n`;
      context += `UV Index: ${weather.current.uv}\n`;
      context += `Chance of Rain: ${weather.forecast.forecastday[0].day.daily_chance_of_rain}%\n\n`;
    }

    if (hol.isHoliday) {
      context += `Today is a public holiday: ${hol.holidayName}\n\n`;
    }

    context += `Current crowd levels:\n`;
    for (const [place, level] of Object.entries(crowd)) {
      context += `- ${place}: ${level}\n`;
    }
    context += '\n';

    if (pref) {
      context += `User preferences:\n`;
      context += `- Interests: ${pref.interests.join(', ')}\n`;
      context += `- Avoid crowds: ${pref.avoidCrowds ? 'Yes' : 'No'}\n`;
      context += `- Prefer indoor activities: ${pref.preferIndoor ? 'Yes' : 'No'}\n`;
      context += `- Prefer outdoor activities: ${pref.preferOutdoor ? 'Yes' : 'No'}\n`;
      context += `- Budget: ${pref.budget}\n`;
      context += `- Mobility issues: ${pref.mobilityIssues ? 'Yes' : 'No'}\n`;
    }

    return context;
  }

  async getRecommendationsByUser(userId: string) {
  const ref = collection(this.db, 'recommendation_results');

  const q = query(
    ref,
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(5)
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const { timestamp, ...rest } = doc.data(); // timestamp 제외
    return {
      id: doc.id,
      ...rest,
    };
  });
}

}
