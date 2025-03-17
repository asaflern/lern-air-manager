export interface Aircraft {
  id: string;
  model: string;
  registrationNumber: string;
  capacity: number;
  yearManufactured: number;
  image: string;
}

export interface Airport {
  id: string;
  name: string;
  code: string;
  city: string;
  country: string;
  coordinates: [number, number]; // [longitude, latitude]
}

export interface ParkingData {
  aircraftId: string;
  airportId: string;
  date: string;
  parkingMinutes: number;
}

// Aircraft fleet data
export const aircraftFleet: Aircraft[] = [
  {
    id: "b777-1",
    model: "Boeing 777-300ER",
    registrationNumber: "LN-A101",
    capacity: 386,
    yearManufactured: 2018,
    image: "https://images.unsplash.com/photo-1520437358207-323b43b50729?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "b747-1",
    model: "Boeing 747-8",
    registrationNumber: "LN-A102",
    capacity: 410,
    yearManufactured: 2015,
    image: "https://t3.ftcdn.net/jpg/01/11/22/44/360_F_111224494_Vcl3eafzhx6Uc5GulbI2rk0eAOq0np59.jpg"
  },
  {
    id: "a380-1",
    model: "Airbus A380",
    registrationNumber: "LN-A103",
    capacity: 525,
    yearManufactured: 2019,
    image: "https://static1.simpleflyingimages.com/wordpress/wp-content/uploads/2024/06/shutterstock_514434292.jpg"
  },
  {
    id: "a350-1",
    model: "Airbus A350-900",
    registrationNumber: "LN-A104",
    capacity: 325,
    yearManufactured: 2020,
    image: "https://content.presspage.com/uploads/2888/988a7127-66dd-42e1-a14c-0ade2a5601b5/1920_a380muc24002.jpg?10000"
  },
  {
    id: "b787-1",
    model: "Boeing 787-9 Dreamliner",
    registrationNumber: "LN-A105",
    capacity: 290,
    yearManufactured: 2017,
    image: "https://static1.simpleflyingimages.com/wordpress/wp-content/uploads/2022/12/el-al-boeing-787-8-dreamliner-4x-erc.jpg"
  }
];

// Airports data
export const airports: Airport[] = [
  {
    id: "jfk",
    name: "John F. Kennedy International Airport",
    code: "JFK",
    city: "New York",
    country: "United States",
    coordinates: [-73.7781, 40.6413]
  },
  {
    id: "lhr",
    name: "Heathrow Airport",
    code: "LHR",
    city: "London",
    country: "United Kingdom",
    coordinates: [-0.4543, 51.4700]
  },
  {
    id: "cdg",
    name: "Charles de Gaulle Airport",
    code: "CDG",
    city: "Paris",
    country: "France",
    coordinates: [2.5479, 49.0097]
  },
  {
    id: "hnd",
    name: "Haneda Airport",
    code: "HND",
    city: "Tokyo",
    country: "Japan",
    coordinates: [139.7798, 35.5494]
  },
  {
    id: "dxb",
    name: "Dubai International Airport",
    code: "DXB",
    city: "Dubai",
    country: "United Arab Emirates",
    coordinates: [55.3657, 25.2532]
  },
  {
    id: "syd",
    name: "Sydney Airport",
    code: "SYD",
    city: "Sydney",
    country: "Australia",
    coordinates: [151.1772, -33.9399]
  },
  {
    id: "sin",
    name: "Singapore Changi Airport",
    code: "SIN",
    city: "Singapore",
    country: "Singapore",
    coordinates: [103.9915, 1.3644]
  },
  {
    id: "gru",
    name: "São Paulo-Guarulhos International Airport",
    code: "GRU",
    city: "São Paulo",
    country: "Brazil",
    coordinates: [-46.4730, -23.4356]
  },
  {
    id: "fra",
    name: "Frankfurt Airport",
    code: "FRA",
    city: "Frankfurt",
    country: "Germany",
    coordinates: [8.5622, 50.0379]
  },
  {
    id: "icn",
    name: "Incheon International Airport",
    code: "ICN",
    city: "Seoul",
    country: "South Korea",
    coordinates: [126.4505, 37.4602]
  }
];

// Parking data - mimicking real-world patterns
export const parkingData: ParkingData[] = [
  // Boeing 777 parking data
  { aircraftId: "b777-1", airportId: "jfk", date: "2023-06-10", parkingMinutes: 320 },
  { aircraftId: "b777-1", airportId: "lhr", date: "2023-06-11", parkingMinutes: 210 },
  { aircraftId: "b777-1", airportId: "cdg", date: "2023-06-12", parkingMinutes: 180 },
  { aircraftId: "b777-1", airportId: "dxb", date: "2023-06-14", parkingMinutes: 420 },
  { aircraftId: "b777-1", airportId: "sin", date: "2023-06-15", parkingMinutes: 390 },
  { aircraftId: "b777-1", airportId: "hnd", date: "2023-06-16", parkingMinutes: 280 },
  { aircraftId: "b777-1", airportId: "lhr", date: "2023-06-18", parkingMinutes: 240 },
  
  // Boeing 747 parking data
  { aircraftId: "b747-1", airportId: "hnd", date: "2023-06-10", parkingMinutes: 450 },
  { aircraftId: "b747-1", airportId: "sin", date: "2023-06-11", parkingMinutes: 270 },
  { aircraftId: "b747-1", airportId: "syd", date: "2023-06-12", parkingMinutes: 380 },
  { aircraftId: "b747-1", airportId: "jfk", date: "2023-06-14", parkingMinutes: 195 },
  { aircraftId: "b747-1", airportId: "fra", date: "2023-06-15", parkingMinutes: 320 },
  { aircraftId: "b747-1", airportId: "icn", date: "2023-06-16", parkingMinutes: 410 },
  { aircraftId: "b747-1", airportId: "cdg", date: "2023-06-18", parkingMinutes: 290 },
  
  // Airbus A380 parking data
  { aircraftId: "a380-1", airportId: "dxb", date: "2023-06-10", parkingMinutes: 360 },
  { aircraftId: "a380-1", airportId: "lhr", date: "2023-06-11", parkingMinutes: 480 },
  { aircraftId: "a380-1", airportId: "jfk", date: "2023-06-12", parkingMinutes: 390 },
  { aircraftId: "a380-1", airportId: "sin", date: "2023-06-14", parkingMinutes: 270 },
  { aircraftId: "a380-1", airportId: "fra", date: "2023-06-15", parkingMinutes: 310 },
  { aircraftId: "a380-1", airportId: "cdg", date: "2023-06-16", parkingMinutes: 420 },
  { aircraftId: "a380-1", airportId: "icn", date: "2023-06-18", parkingMinutes: 350 },
  
  // Airbus A350 parking data
  { aircraftId: "a350-1", airportId: "gru", date: "2023-06-10", parkingMinutes: 280 },
  { aircraftId: "a350-1", airportId: "icn", date: "2023-06-11", parkingMinutes: 320 },
  { aircraftId: "a350-1", airportId: "jfk", date: "2023-06-12", parkingMinutes: 190 },
  { aircraftId: "a350-1", airportId: "fra", date: "2023-06-14", parkingMinutes: 240 },
  { aircraftId: "a350-1", airportId: "hnd", date: "2023-06-15", parkingMinutes: 370 },
  { aircraftId: "a350-1", airportId: "lhr", date: "2023-06-16", parkingMinutes: 290 },
  { aircraftId: "a350-1", airportId: "sin", date: "2023-06-18", parkingMinutes: 310 },
  
  // Boeing 787 parking data
  { aircraftId: "b787-1", airportId: "syd", date: "2023-06-10", parkingMinutes: 340 },
  { aircraftId: "b787-1", airportId: "dxb", date: "2023-06-11", parkingMinutes: 390 },
  { aircraftId: "b787-1", airportId: "lhr", date: "2023-06-12", parkingMinutes: 220 },
  { aircraftId: "b787-1", airportId: "cdg", date: "2023-06-14", parkingMinutes: 260 },
  { aircraftId: "b787-1", airportId: "gru", date: "2023-06-15", parkingMinutes: 350 },
  { aircraftId: "b787-1", airportId: "jfk", date: "2023-06-16", parkingMinutes: 300 },
  { aircraftId: "b787-1", airportId: "fra", date: "2023-06-18", parkingMinutes: 280 }
];

// Helper function to get total parking minutes by airport
export const getParkingMinutesByAirport = () => {
  const result: Record<string, number> = {};
  
  airports.forEach(airport => {
    result[airport.id] = 0;
  });
  
  parkingData.forEach(data => {
    result[data.airportId] += data.parkingMinutes;
  });
  
  return result;
};

// Helper function to get total parking minutes by aircraft
export const getParkingMinutesByAircraft = () => {
  const result: Record<string, number> = {};
  
  aircraftFleet.forEach(aircraft => {
    result[aircraft.id] = 0;
  });
  
  parkingData.forEach(data => {
    result[data.aircraftId] += data.parkingMinutes;
  });
  
  return result;
};

// Helper function to get airport by id
export const getAirportById = (id: string): Airport | undefined => {
  return airports.find(airport => airport.id === id);
};

// Helper function to get aircraft by id
export const getAircraftById = (id: string): Aircraft | undefined => {
  return aircraftFleet.find(aircraft => aircraft.id === id);
}; 