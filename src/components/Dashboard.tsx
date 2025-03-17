import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Divider, 
  Grid, 
  Paper, 
  Typography, 
  useTheme,
  Avatar,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import { 
  Bar, 
  BarChart,
  Cell,
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import FlightIcon from '@mui/icons-material/Flight';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import AirportIcon from '@mui/icons-material/LocalAirport';
import TimelapseIcon from '@mui/icons-material/Timelapse';

import { 
  aircraftFleet, 
  airports, 
  parkingData, 
  getParkingMinutesByAirport, 
  getParkingMinutesByAircraft 
} from '../data/airlineData';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const parkingByAirport = getParkingMinutesByAirport();
  const parkingByAircraft = getParkingMinutesByAircraft();
  
  // Format data for charts
  const airportChartData = airports.map(airport => ({
    name: airport.code,
    value: parkingByAirport[airport.id],
    fullName: airport.name,
    city: airport.city,
    country: airport.country
  })).sort((a, b) => b.value - a.value);

  const aircraftChartData = aircraftFleet.map(aircraft => ({
    name: aircraft.model.replace('Boeing', 'B').replace('Airbus', 'A'),
    value: parkingByAircraft[aircraft.id],
    fullModel: aircraft.model,
    registration: aircraft.registrationNumber
  }));

  // Total parking minutes across all airports
  const totalParkingMinutes = parkingData.reduce((total, data) => total + data.parkingMinutes, 0);
  
  // Calculate costs at $65 USD per minute
  const costPerMinute = 65;
  const totalCost = totalParkingMinutes * costPerMinute;
  const avgCostPerAircraft = totalCost / aircraftFleet.length;
  
  // Calculate average parking time per aircraft
  const avgParkingPerAircraft = totalParkingMinutes / aircraftFleet.length;

  // Most used airport (highest parking minutes)
  const mostUsedAirport = airports.find(airport => 
    airport.id === Object.entries(parkingByAirport)
      .sort((a, b) => b[1] - a[1])[0][0]
  );

  // Most expensive airport (highest parking cost)
  const airportCosts = airports.map(airport => ({
    ...airport,
    cost: parkingByAirport[airport.id] * costPerMinute
  })).sort((a, b) => b.cost - a.cost);
  
  const mostExpensiveAirport = airportCosts[0];

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.primary.light,
    theme.palette.secondary.main,
    theme.palette.secondary.light,
    '#8884d8',
    '#83a6ed',
    '#8dd1e1',
    '#82ca9d',
    '#ffc658',
    '#a4de6c'
  ];

  // Stat cards for the dashboard
  const statCards = [
    { 
      title: 'Total Fleet Size', 
      value: aircraftFleet.length, 
      icon: <FlightIcon fontSize="large" />,
      color: theme.palette.primary.main
    },
    { 
      title: 'Airports Served', 
      value: airports.length, 
      icon: <AirportIcon fontSize="large" />,
      color: theme.palette.secondary.main
    },
    { 
      title: 'Total Parking Cost', 
      value: formatCurrency(totalCost), 
      icon: <TimelapseIcon fontSize="large" />,
      color: theme.palette.error.main
    },
    { 
      title: 'Most Active Aircraft', 
      value: aircraftFleet.find(aircraft => 
        aircraft.id === Object.entries(parkingByAircraft)
          .sort((a, b) => b[1] - a[1])[0][0]
      )?.model.split(' ')[0] + ' ' + aircraftFleet.find(aircraft => 
        aircraft.id === Object.entries(parkingByAircraft)
          .sort((a, b) => b[1] - a[1])[0][0]
      )?.model.split(' ')[1],
      icon: <AirplanemodeActiveIcon fontSize="large" />,
      color: theme.palette.success.main 
    }
  ];
  
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              backgroundImage: 'linear-gradient(to right, #1e3a8a, #3a5fc4)',
              color: 'white',
              borderRadius: 3
            }}
          >
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Welcome to Lern-Air Fleet Management
            </Typography>
            <Typography variant="body1">
              Track and analyze your airline's parking statistics around the globe
            </Typography>
          </Paper>
        </Grid>
        
        {/* Stat Cards */}
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" color="text.secondary" fontWeight={500}>
                    {card.title}
                  </Typography>
                  <Avatar sx={{ backgroundColor: `${card.color}20`, color: card.color }}>
                    {card.icon}
                  </Avatar>
                </Box>
                <Typography variant="h4" component="div" fontWeight="bold">
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        
        {/* Bar Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold" color="text.secondary">
                Parking Minutes by Airport
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={airportChartData.slice(0, 7)} // Top 7 airports
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number, name: string, props: any) => {
                        return [`${value} minutes`, props.payload.fullName];
                      }}
                      labelFormatter={(label: string) => {
                        const airport = airportChartData.find(a => a.name === label);
                        return `${airport?.city}, ${airport?.country}`;
                      }}
                    />
                    <Bar dataKey="value">
                      {
                        airportChartData.slice(0, 7).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Pie Chart */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold" color="text.secondary">
                Fleet Distribution
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={aircraftChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {aircraftChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number, name: string, props: any) => {
                        return [`${value} minutes`, props.payload.fullModel];
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Summary Card */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold" color="text.secondary">
                Key Insights
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle1" fontWeight="500">
                    Most Used Airport
                  </Typography>
                  <Typography variant="body1">
                    {mostUsedAirport?.name} ({mostUsedAirport?.code})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {mostUsedAirport?.city}, {mostUsedAirport?.country}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle1" fontWeight="500">
                    Average Parking Time
                  </Typography>
                  <Typography variant="body1">
                    {Math.round(avgParkingPerAircraft)} minutes per aircraft
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Approx. {Math.round(avgParkingPerAircraft / 60)} hours
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle1" fontWeight="500">
                    Average Cost Per Aircraft
                  </Typography>
                  <Typography variant="body1" color="error.main" fontWeight="bold">
                    {formatCurrency(avgCostPerAircraft)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    At ${costPerMinute}/minute rate
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle1" fontWeight="500">
                    Most Expensive Airport
                  </Typography>
                  <Typography variant="body1" color="error.main" fontWeight="bold">
                    {formatCurrency(mostExpensiveAirport.cost)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {mostExpensiveAirport.name}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Financial Details Table */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold" color="text.secondary">
                Financial Overview - Parking Costs
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Airport</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">Parking Minutes</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">Parking Cost</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {airportCosts.map((airport) => (
                      <TableRow 
                        key={airport.id}
                        sx={{ 
                          '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover },
                          backgroundColor: airport === mostExpensiveAirport ? `${theme.palette.error.light}20` : undefined
                        }}
                      >
                        <TableCell>{airport.name} ({airport.code})</TableCell>
                        <TableCell>{airport.city}, {airport.country}</TableCell>
                        <TableCell align="right">{parkingByAirport[airport.id]}</TableCell>
                        <TableCell align="right">{formatCurrency(airport.cost)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                      <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Total</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>{totalParkingMinutes}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: theme.palette.error.main }}>{formatCurrency(totalCost)}</TableCell>
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

export default Dashboard; 