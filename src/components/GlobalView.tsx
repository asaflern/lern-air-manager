import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { 
  MapContainer, 
  TileLayer, 
  CircleMarker, 
  Tooltip, 
  Popup
} from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { 
  airports, 
  aircraftFleet,
  getParkingMinutesByAirport, 
  getAirportById 
} from '../data/airlineData';

// Function to get marker size based on parking minutes
const getMarkerSize = (minutes: number) => {
  const baseSize = 5;
  const maxSize = 25;
  const minMinutes = 100;
  const maxMinutes = 3000;
  
  if (minutes <= minMinutes) return baseSize;
  if (minutes >= maxMinutes) return maxSize;
  
  const ratio = (minutes - minMinutes) / (maxMinutes - minMinutes);
  return baseSize + ratio * (maxSize - baseSize);
};

const GlobalView: React.FC = () => {
  const theme = useTheme();
  const [selectedContinent, setSelectedContinent] = useState<string>('all');
  
  const parkingByAirport = getParkingMinutesByAirport();
  
  // Helper function to determine continent from country
  const getContinent = (country: string): string => {
    const continentMap: { [key: string]: string } = {
      'United States': 'North America',
      'Canada': 'North America',
      'Mexico': 'North America',
      'Brazil': 'South America',
      'Argentina': 'South America',
      'Colombia': 'South America',
      'United Kingdom': 'Europe',
      'France': 'Europe',
      'Germany': 'Europe',
      'Italy': 'Europe',
      'Spain': 'Europe',
      'China': 'Asia',
      'Japan': 'Asia',
      'South Korea': 'Asia',
      'India': 'Asia',
      'Singapore': 'Asia',
      'Thailand': 'Asia',
      'United Arab Emirates': 'Asia',
      'Australia': 'Oceania',
      'New Zealand': 'Oceania',
      'South Africa': 'Africa',
      'Egypt': 'Africa',
      'Kenya': 'Africa'
    };
    
    return continentMap[country] || 'Other';
  };
  
  // Filter airports based on selected continent
  const filteredAirports = airports.filter(airport => {
    if (selectedContinent === 'all') return true;
    return getContinent(airport.country) === selectedContinent;
  });
  
  // Format data for display
  const airportData = filteredAirports.map(airport => ({
    ...airport,
    parkingMinutes: parkingByAirport[airport.id],
    continent: getContinent(airport.country)
  })).sort((a, b) => b.parkingMinutes - a.parkingMinutes);
  
  // Calculate stats
  const totalParkingMinutes = airportData.reduce((sum, airport) => sum + airport.parkingMinutes, 0);
  const mostUsedAirport = airportData[0];
  
  // Continent totals for insights
  const continentTotals = airportData.reduce((acc: { [key: string]: number }, airport) => {
    const continent = airport.continent;
    acc[continent] = (acc[continent] || 0) + airport.parkingMinutes;
    return acc;
  }, {});
  
  // Calculate costs at $65 USD per minute
  const costPerMinute = 65;
  const totalCost = totalParkingMinutes * costPerMinute;
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const handleContinentChange = (event: SelectChangeEvent) => {
    setSelectedContinent(event.target.value);
  };
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Global Parking Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Explore Lern-Air's parking minutes across airports around the world
      </Typography>
      
      <Grid container spacing={3}>
        {/* Filter */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Filter by Region
              </Typography>
              <FormControl sx={{ width: 300 }}>
                <InputLabel id="continent-select-label">Region</InputLabel>
                <Select
                  labelId="continent-select-label"
                  id="continent-select"
                  value={selectedContinent}
                  label="Region"
                  onChange={handleContinentChange}
                >
                  <MenuItem value="all">All Regions</MenuItem>
                  <MenuItem value="North America">North America</MenuItem>
                  <MenuItem value="South America">South America</MenuItem>
                  <MenuItem value="Europe">Europe</MenuItem>
                  <MenuItem value="Asia">Asia</MenuItem>
                  <MenuItem value="Oceania">Oceania</MenuItem>
                  <MenuItem value="Africa">Africa</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Map */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.secondary">
                Global Parking Distribution
              </Typography>
              <Box 
                sx={{ 
                  height: 500, 
                  width: '100%', 
                  '& .leaflet-container': { 
                    height: '100%', 
                    width: '100%',
                    borderRadius: 2
                  }
                }}
              >
                <MapContainer 
                  center={[20, 0] as LatLngExpression}
                  zoom={2} 
                  scrollWheelZoom={true}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {airportData.map((airport) => (
                    <CircleMarker
                      key={airport.id}
                      center={[airport.coordinates[1], airport.coordinates[0]] as LatLngExpression}
                      pathOptions={{
                        fillColor: airport.parkingMinutes > 1500 ? theme.palette.secondary.main : theme.palette.primary.main,
                        fillOpacity: 0.8,
                        weight: 1,
                        color: '#fff'
                      }}
                      radius={getMarkerSize(airport.parkingMinutes)}
                    >
                      <Tooltip>
                        <Typography variant="subtitle2">{airport.name} ({airport.code})</Typography>
                        <Typography variant="body2">{airport.parkingMinutes} minutes</Typography>
                      </Tooltip>
                      <Popup>
                        <Box sx={{ p: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">{airport.name}</Typography>
                          <Typography variant="body2">{airport.city}, {airport.country}</Typography>
                          <Typography variant="body2" fontWeight="bold" color="primary.main">
                            {airport.parkingMinutes} parking minutes
                          </Typography>
                          <Typography variant="body2">
                            {Math.round(airport.parkingMinutes / 60)} hours
                          </Typography>
                        </Box>
                      </Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                Bubble size represents relative parking time. Hover or click for details.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 3, background: theme.palette.primary.main, color: 'white' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Total Parking Time
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {totalParkingMinutes.toLocaleString()}
              </Typography>
              <Typography variant="subtitle1">
                minutes
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                {Math.round(totalParkingMinutes / 60).toLocaleString()} hours across {airportData.length} airports
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 3, background: theme.palette.error.main, color: 'white' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Total Parking Cost
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {formatCurrency(totalCost)}
              </Typography>
              <Typography variant="subtitle1">
                USD
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                At ${costPerMinute}/minute rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 3, backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Fleet Utilization
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {aircraftFleet.length}
              </Typography>
              <Typography variant="subtitle1">
                aircraft in operation
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                Average {Math.round(totalParkingMinutes / aircraftFleet.length / 60)} hours parked per aircraft
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Airport Table */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.secondary">
                Airport Parking Details
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 500 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Code</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Airport</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Region</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">Parking Minutes</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">Hours</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">Cost (USD)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {airportData.map((airport) => (
                      <TableRow
                        key={airport.id}
                        sx={{ 
                          '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover },
                          backgroundColor: airport === mostUsedAirport ? `${theme.palette.primary.light}20` : undefined
                        }}
                      >
                        <TableCell>{airport.code}</TableCell>
                        <TableCell>{airport.name}</TableCell>
                        <TableCell>{airport.city}, {airport.country}</TableCell>
                        <TableCell>{airport.continent}</TableCell>
                        <TableCell align="right">{airport.parkingMinutes.toLocaleString()}</TableCell>
                        <TableCell align="right">{Math.round(airport.parkingMinutes / 60).toLocaleString()}</TableCell>
                        <TableCell align="right" sx={{ color: theme.palette.error.main, fontWeight: 'medium' }}>
                          {formatCurrency(airport.parkingMinutes * costPerMinute)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                      <TableCell colSpan={4} sx={{ fontWeight: 'bold' }}>Total</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>{totalParkingMinutes.toLocaleString()}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>{Math.round(totalParkingMinutes / 60).toLocaleString()}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: theme.palette.error.main }}>
                        {formatCurrency(totalCost)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GlobalView; 