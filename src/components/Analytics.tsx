import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Divider, 
  FormControl, 
  Grid, 
  InputLabel, 
  MenuItem, 
  Select, 
  SelectChangeEvent, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  useTheme
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

import { 
  aircraftFleet, 
  airports, 
  parkingData, 
  getParkingMinutesByAirport, 
  getParkingMinutesByAircraft, 
  getAirportById, 
  getAircraftById 
} from '../data/airlineData';

const Analytics: React.FC = () => {
  const theme = useTheme();
  const [selectedAircraft, setSelectedAircraft] = useState<string>('all');
  const [selectedAirport, setSelectedAirport] = useState<string>('all');

  // Handle select changes
  const handleAircraftChange = (event: SelectChangeEvent) => {
    setSelectedAircraft(event.target.value);
  };

  const handleAirportChange = (event: SelectChangeEvent) => {
    setSelectedAirport(event.target.value);
  };

  // Filter data based on selections
  const filteredData = parkingData.filter(data => {
    if (selectedAircraft !== 'all' && data.aircraftId !== selectedAircraft) return false;
    if (selectedAirport !== 'all' && data.airportId !== selectedAirport) return false;
    return true;
  });

  // Process data for charts
  const processDataByAirport = () => {
    const result: { [key: string]: number } = {};
    
    filteredData.forEach(data => {
      if (!result[data.airportId]) {
        result[data.airportId] = 0;
      }
      result[data.airportId] += data.parkingMinutes;
    });
    
    return Object.entries(result).map(([airportId, minutes]) => {
      const airport = getAirportById(airportId);
      return {
        name: airport?.code || airportId,
        minutes,
        fullName: airport?.name,
        city: airport?.city,
        country: airport?.country
      };
    }).sort((a, b) => b.minutes - a.minutes);
  };
  
  const processDataByAircraft = () => {
    const result: { [key: string]: number } = {};
    
    filteredData.forEach(data => {
      if (!result[data.aircraftId]) {
        result[data.aircraftId] = 0;
      }
      result[data.aircraftId] += data.parkingMinutes;
    });
    
    return Object.entries(result).map(([aircraftId, minutes]) => {
      const aircraft = getAircraftById(aircraftId);
      return {
        name: aircraft?.model.split(' ')[0] + ' ' + aircraft?.model.split(' ')[1] || aircraftId,
        minutes,
        fullModel: aircraft?.model,
        registration: aircraft?.registrationNumber
      };
    }).sort((a, b) => b.minutes - a.minutes);
  };

  // Process data by date
  const processDataByDate = () => {
    const dateMap: { [key: string]: number } = {};
    
    filteredData.forEach(data => {
      if (!dateMap[data.date]) {
        dateMap[data.date] = 0;
      }
      dateMap[data.date] += data.parkingMinutes;
    });
    
    return Object.entries(dateMap)
      .map(([date, minutes]) => ({ date, minutes }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };
  
  const airportData = processDataByAirport();
  const aircraftData = processDataByAircraft();
  const dateData = processDataByDate();
  
  // Calculate totals
  const totalMinutes = filteredData.reduce((sum, data) => sum + data.parkingMinutes, 0);
  const averageMinutes = filteredData.length ? totalMinutes / filteredData.length : 0;

  // Calculate costs at $65 USD per minute
  const costPerMinute = 65;
  const totalCostFiltered = totalMinutes * costPerMinute;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Parking Analytics
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Analyze detailed parking data for Lern-Air fleet across global airports
      </Typography>
      
      <Grid container spacing={3}>
        {/* Filters */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Filter Data
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="aircraft-select-label">Aircraft</InputLabel>
                    <Select
                      labelId="aircraft-select-label"
                      id="aircraft-select"
                      value={selectedAircraft}
                      label="Aircraft"
                      onChange={handleAircraftChange}
                    >
                      <MenuItem value="all">All Aircraft</MenuItem>
                      {aircraftFleet.map(aircraft => (
                        <MenuItem key={aircraft.id} value={aircraft.id}>
                          {aircraft.model} ({aircraft.registrationNumber})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="airport-select-label">Airport</InputLabel>
                    <Select
                      labelId="airport-select-label"
                      id="airport-select"
                      value={selectedAirport}
                      label="Airport"
                      onChange={handleAirportChange}
                    >
                      <MenuItem value="all">All Airports</MenuItem>
                      {airports.map(airport => (
                        <MenuItem key={airport.id} value={airport.id}>
                          {airport.name} ({airport.code})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Summary Stats */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.secondary">
                Summary Statistics
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="500">
                  Total Parking Time
                </Typography>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {totalMinutes.toLocaleString()} minutes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round(totalMinutes / 60).toLocaleString()} hours
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="500">
                  Total Parking Cost
                </Typography>
                <Typography variant="h4" color="error" fontWeight="bold">
                  {formatCurrency(totalCostFiltered)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  At ${costPerMinute}/minute rate
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="500">
                  Average Parking Time
                </Typography>
                <Typography variant="h4" color="secondary" fontWeight="bold">
                  {Math.round(averageMinutes)} minutes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Per parking event (${costPerMinute * Math.round(averageMinutes)}/event)
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle1" fontWeight="500">
                  Total Records
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {filteredData.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Parking events analyzed
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Timeline Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.secondary">
                Parking Minutes Over Time
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dateData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }} 
                    />
                    <YAxis />
                    <Tooltip labelFormatter={(value) => `Date: ${value}`} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="minutes" 
                      name="Parking Minutes" 
                      stroke={theme.palette.primary.main} 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Airport Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.secondary">
                Parking Minutes by Airport
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={airportData.slice(0, 8)}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      tick={{ fontSize: 12 }} 
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value} minutes`, 'Parking Time']}
                      labelFormatter={(label) => {
                        const airport = airportData.find(a => a.name === label);
                        return `${airport?.fullName} (${airport?.city}, ${airport?.country})`;
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="minutes" 
                      name="Parking Minutes" 
                      fill={theme.palette.primary.main} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Aircraft Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.secondary">
                Parking Minutes by Aircraft
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={aircraftData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      tick={{ fontSize: 12 }} 
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value} minutes`, 'Parking Time']}
                      labelFormatter={(label) => {
                        const aircraft = aircraftData.find(a => a.name === label);
                        return `${aircraft?.fullModel} (${aircraft?.registration})`;
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="minutes" 
                      name="Parking Minutes" 
                      fill={theme.palette.secondary.main} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Data Table */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.secondary">
                Detailed Parking Records
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Aircraft</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Airport</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">Parking Minutes</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">Cost</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.map((row, index) => {
                      const aircraft = getAircraftById(row.aircraftId);
                      const airport = getAirportById(row.airportId);
                      const cost = row.parkingMinutes * costPerMinute;
                      
                      return (
                        <TableRow
                          key={index}
                          sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}
                        >
                          <TableCell>{row.date}</TableCell>
                          <TableCell>{aircraft?.model || row.aircraftId}</TableCell>
                          <TableCell>{airport?.name || row.airportId}</TableCell>
                          <TableCell align="right">{row.parkingMinutes}</TableCell>
                          <TableCell align="right" sx={{ color: theme.palette.error.main, fontWeight: 'medium' }}>
                            {formatCurrency(cost)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                      <TableCell colSpan={3} sx={{ fontWeight: 'bold' }}>Total</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>{totalMinutes}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: theme.palette.error.main }}>
                        {formatCurrency(totalCostFiltered)}
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

export default Analytics; 