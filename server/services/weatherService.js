import axios from 'axios';

// Comprehensive realistic fallback dataset for major Indian agricultural districts
const DEMO_WEATHER_DATABASE = {
  default: {
    city: 'Ludhiana',
    district: 'Ludhiana',
    state: 'Punjab',
    temp: 26,
    feels_like: 27,
    temp_min: 18,
    temp_max: 30,
    humidity: 58,
    wind_speed: 12,
    wind_direction: 'NW',
    pressure: 1012,
    rainfall_prob: 10,
    rainfall_amount: 0,
    condition: 'Partly Cloudy',
    description: 'Scattered clouds with mild westerly winds',
    icon: 'partly-cloudy',
    uv_index: 6,
    advisory: {
      irrigation: 'Good conditions for scheduled light irrigation. Soil moisture retention is moderate.',
      spraying: 'Favorable morning window for foliar fertilizer and bio-pesticide spray.',
      harvesting: 'Suitable dry weather window for field operations.',
    },
    forecast: [
      { day: 'Today', date: 'Oct 25', temp_max: 30, temp_min: 18, condition: 'Partly Cloudy', rainfall_prob: 10, humidity: 58 },
      { day: 'Tomorrow', date: 'Oct 26', temp_max: 29, temp_min: 17, condition: 'Sunny', rainfall_prob: 5, humidity: 52 },
      { day: 'Day 3', date: 'Oct 27', temp_max: 28, temp_min: 17, condition: 'Clear Sky', rainfall_prob: 0, humidity: 50 },
      { day: 'Day 4', date: 'Oct 28', temp_max: 27, temp_min: 16, condition: 'Light Rain', rainfall_prob: 65, humidity: 75 },
      { day: 'Day 5', date: 'Oct 29', temp_max: 26, temp_min: 15, condition: 'Scattered Clouds', rainfall_prob: 20, humidity: 62 },
    ],
  },
  pune: {
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    temp: 28,
    feels_like: 29,
    temp_min: 20,
    temp_max: 31,
    humidity: 62,
    wind_speed: 14,
    wind_direction: 'W',
    pressure: 1010,
    rainfall_prob: 15,
    rainfall_amount: 0,
    condition: 'Sunny',
    description: 'Warm and sunny with pleasant breeze',
    icon: 'sunny',
    uv_index: 7,
    advisory: {
      irrigation: 'Evapotranspiration is moderately high; drip irrigation recommended for sugarcane and onion.',
      spraying: 'Ideal weather for prophylactic fungicide application in orchards and vineyards.',
      harvesting: 'Safe weather for harvesting and grain drying.',
    },
    forecast: [
      { day: 'Today', date: 'Oct 25', temp_max: 31, temp_min: 20, condition: 'Sunny', rainfall_prob: 15, humidity: 62 },
      { day: 'Tomorrow', date: 'Oct 26', temp_max: 31, temp_min: 20, condition: 'Mostly Sunny', rainfall_prob: 10, humidity: 59 },
      { day: 'Day 3', date: 'Oct 27', temp_max: 30, temp_min: 19, condition: 'Partly Cloudy', rainfall_prob: 25, humidity: 65 },
      { day: 'Day 4', date: 'Oct 28', temp_max: 29, temp_min: 19, condition: 'Passing Showers', rainfall_prob: 45, humidity: 70 },
      { day: 'Day 5', date: 'Oct 29', temp_max: 30, temp_min: 18, condition: 'Sunny', rainfall_prob: 10, humidity: 58 },
    ],
  },
  nashik: {
    city: 'Nashik',
    district: 'Nashik',
    state: 'Maharashtra',
    temp: 27,
    feels_like: 28,
    temp_min: 19,
    temp_max: 30,
    humidity: 60,
    wind_speed: 10,
    wind_direction: 'SW',
    pressure: 1011,
    rainfall_prob: 10,
    rainfall_amount: 0,
    condition: 'Pleasant',
    description: 'Mild sunny climate optimal for horticultural crops',
    icon: 'sunny',
    uv_index: 6,
    advisory: {
      irrigation: 'Maintain regular drip cycles for grapevines and vegetables.',
      spraying: 'Conduct morning spraying to prevent downy mildew.',
      harvesting: 'Favorable conditions for onion and tomato harvesting.',
    },
    forecast: [
      { day: 'Today', date: 'Oct 25', temp_max: 30, temp_min: 19, condition: 'Sunny', rainfall_prob: 10, humidity: 60 },
      { day: 'Tomorrow', date: 'Oct 26', temp_max: 30, temp_min: 18, condition: 'Sunny', rainfall_prob: 5, humidity: 58 },
      { day: 'Day 3', date: 'Oct 27', temp_max: 29, temp_min: 18, condition: 'Clear', rainfall_prob: 5, humidity: 55 },
      { day: 'Day 4', date: 'Oct 28', temp_max: 28, temp_min: 17, condition: 'Partly Cloudy', rainfall_prob: 30, humidity: 65 },
      { day: 'Day 5', date: 'Oct 29', temp_max: 29, temp_min: 17, condition: 'Clear', rainfall_prob: 10, humidity: 56 },
    ],
  },
  karnal: {
    city: 'Karnal',
    district: 'Karnal',
    state: 'Haryana',
    temp: 25,
    feels_like: 26,
    temp_min: 17,
    temp_max: 29,
    humidity: 55,
    wind_speed: 11,
    wind_direction: 'WNW',
    pressure: 1013,
    rainfall_prob: 5,
    rainfall_amount: 0,
    condition: 'Clear Sky',
    description: 'Crisp clear autumn weather with comfortable humidity',
    icon: 'sunny',
    uv_index: 5,
    advisory: {
      irrigation: 'Prepare fields for upcoming Rabi wheat sowing. Pre-sowing irrigation recommended.',
      spraying: 'Safe weather for weedicide application during land preparation.',
      harvesting: 'Basmati paddy harvesting and threshing can proceed unhindered.',
    },
    forecast: [
      { day: 'Today', date: 'Oct 25', temp_max: 29, temp_min: 17, condition: 'Clear Sky', rainfall_prob: 5, humidity: 55 },
      { day: 'Tomorrow', date: 'Oct 26', temp_max: 28, temp_min: 16, condition: 'Clear', rainfall_prob: 0, humidity: 50 },
      { day: 'Day 3', date: 'Oct 27', temp_max: 28, temp_min: 16, condition: 'Sunny', rainfall_prob: 0, humidity: 48 },
      { day: 'Day 4', date: 'Oct 28', temp_max: 27, temp_min: 15, condition: 'Hazy Sun', rainfall_prob: 10, humidity: 52 },
      { day: 'Day 5', date: 'Oct 29', temp_max: 26, temp_min: 14, condition: 'Clear', rainfall_prob: 5, humidity: 50 },
    ],
  },
  varanasi: {
    city: 'Varanasi',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    temp: 28,
    feels_like: 30,
    temp_min: 21,
    temp_max: 32,
    humidity: 68,
    wind_speed: 8,
    wind_direction: 'E',
    pressure: 1010,
    rainfall_prob: 20,
    rainfall_amount: 0,
    condition: 'Hazy Sunshine',
    description: 'Warm and humid with calm easterly winds',
    icon: 'partly-cloudy',
    uv_index: 6,
    advisory: {
      irrigation: 'Ensure proper drainage in low-lying paddy plots.',
      spraying: 'Monitor for stem borer in late paddy varieties.',
      harvesting: 'Maintain grain moisture checks before bagging.',
    },
    forecast: [
      { day: 'Today', date: 'Oct 25', temp_max: 32, temp_min: 21, condition: 'Hazy Sunshine', rainfall_prob: 20, humidity: 68 },
      { day: 'Tomorrow', date: 'Oct 26', temp_max: 31, temp_min: 20, condition: 'Sunny', rainfall_prob: 15, humidity: 65 },
      { day: 'Day 3', date: 'Oct 27', temp_max: 30, temp_min: 20, condition: 'Clear', rainfall_prob: 10, humidity: 60 },
      { day: 'Day 4', date: 'Oct 28', temp_max: 29, temp_min: 19, condition: 'Passing Clouds', rainfall_prob: 30, humidity: 66 },
      { day: 'Day 5', date: 'Oct 29', temp_max: 30, temp_min: 19, condition: 'Sunny', rainfall_prob: 10, humidity: 58 },
    ],
  },
};

export const getWeatherByLocation = async (queryLocation = 'Ludhiana') => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const cleanQuery = queryLocation.trim().toLowerCase();

  // If API key is present and configured, attempt live fetch
  if (apiKey && apiKey !== 'your_openweather_api_key_optional') {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          queryLocation
        )},IN&units=metric&appid=${apiKey}`,
        { timeout: 5000 }
      );

      const data = response.data;
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          queryLocation
        )},IN&units=metric&appid=${apiKey}`,
        { timeout: 5000 }
      );

      // Process 5-day forecast
      const dailyList = [];
      const seenDays = new Set();
      if (forecastResponse.data && forecastResponse.data.list) {
        for (const item of forecastResponse.data.list) {
          const dayName = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
          if (!seenDays.has(dayName) && dailyList.length < 5) {
            seenDays.add(dayName);
            dailyList.push({
              day: dayName,
              date: new Date(item.dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              temp_max: Math.round(item.main.temp_max),
              temp_min: Math.round(item.main.temp_min),
              condition: item.weather[0]?.main || 'Clear',
              rainfall_prob: Math.round((item.pop || 0) * 100),
              humidity: item.main.humidity,
            });
          }
        }
      }

      return {
        isDemonstrationData: false,
        dataSource: 'OpenWeather Live API',
        city: data.name,
        district: data.name,
        state: 'India',
        temp: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        temp_min: Math.round(data.main.temp_min),
        temp_max: Math.round(data.main.temp_max),
        humidity: data.main.humidity,
        wind_speed: Math.round((data.wind?.speed || 0) * 3.6),
        wind_direction: 'Var',
        pressure: data.main.pressure,
        rainfall_prob: Math.round((data.rain?.['1h'] ? 70 : 10)),
        rainfall_amount: data.rain?.['1h'] || 0,
        condition: data.weather[0]?.main || 'Clear',
        description: data.weather[0]?.description || 'Clear skies',
        icon: data.weather[0]?.main?.toLowerCase() || 'sunny',
        uv_index: 6,
        advisory: {
          irrigation: 'Monitor local soil moisture before scheduling next irrigation cycle.',
          spraying: data.wind?.speed > 5 ? 'High wind speed detected; postpone spraying.' : 'Calm winds suitable for spraying.',
          harvesting: data.weather[0]?.main === 'Rain' ? 'Postpone harvesting operations until dry.' : 'Favorable dry conditions.',
        },
        forecast: dailyList.length > 0 ? dailyList : DEMO_WEATHER_DATABASE.default.forecast,
      };
    } catch (err) {
      console.warn(`[WeatherService] OpenWeather API lookup failed (${err.message}). Falling back to demonstration dataset.`);
    }
  }

  // Demonstration Fallback (Transparently labeled)
  let matched = DEMO_WEATHER_DATABASE[cleanQuery];
  if (!matched) {
    const keys = Object.keys(DEMO_WEATHER_DATABASE);
    for (const key of keys) {
      if (cleanQuery.includes(key)) {
        matched = DEMO_WEATHER_DATABASE[key];
        break;
      }
    }
  }

  if (!matched) {
    matched = {
      ...DEMO_WEATHER_DATABASE.default,
      city: queryLocation.charAt(0).toUpperCase() + queryLocation.slice(1),
      district: queryLocation.charAt(0).toUpperCase() + queryLocation.slice(1),
    };
  }

  return {
    isDemonstrationData: true,
    dataSource: 'AgriTech Demonstration Agro-Weather System (India Fallback Model)',
    disclaimer: 'Demonstration weather data active. Connect an OpenWeather API key in server/.env for live regional satellite readings.',
    ...matched,
  };
};
