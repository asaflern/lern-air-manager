import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  CardMedia, 
  Divider,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  LinearProgress,
  useTheme,
  Paper
} from '@mui/material';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TimerIcon from '@mui/icons-material/Timer';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import { 
  aircraftFleet, 
  getParkingMinutesByAircraft, 
  getAircraftById 
} from '../data/airlineData';

const Fleet: React.FC = () => {
  const theme = useTheme();
  const parkingByAircraft = getParkingMinutesByAircraft();
  
  // Calculate the total parking minutes
  const totalParkingMinutes = Object.values(parkingByAircraft).reduce((sum, minutes) => sum + minutes, 0);
  
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
  
  // Enhance aircraft data with parking information
  const enhancedFleet = aircraftFleet.map(aircraft => ({
    ...aircraft,
    parkingMinutes: parkingByAircraft[aircraft.id],
    parkingHours: Math.round(parkingByAircraft[aircraft.id] / 60),
    parkingCost: parkingByAircraft[aircraft.id] * costPerMinute,
    parkingPercentage: (parkingByAircraft[aircraft.id] / totalParkingMinutes) * 100
  })).sort((a, b) => b.parkingMinutes - a.parkingMinutes);
  
  // Get the aircraft with the most and least parking time
  const mostParkedAircraft = enhancedFleet[0];
  const leastParkedAircraft = enhancedFleet[enhancedFleet.length - 1];
  
  // Calculate average parking time per aircraft
  const avgParkingMinutes = totalParkingMinutes / aircraftFleet.length;
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Lern-Air Fleet Management
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Overview of the airline's aircraft fleet and their parking statistics
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Stats */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundImage: 'linear-gradient(to right, #1e3a8a, #3a5fc4)',
              color: 'white'
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Total Fleet Size
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {aircraftFleet.length}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.8 }}>
                    Aircraft in operation
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Total Parking Time
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {Math.round(totalParkingMinutes / 60)}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.8 }}>
                    Hours across all aircraft
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Total Parking Cost
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    {formatCurrency(totalCost)}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.8 }}>
                    At ${costPerMinute}/minute rate
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Aircraft Cards */}
        {enhancedFleet.map((aircraft) => (
          <Grid item xs={12} md={6} lg={4} key={aircraft.id}>
            <Card sx={{ height: '100%', borderRadius: 3, overflow: 'hidden' }}>
              <CardMedia
                component="img"
                height="180"
                image={aircraft.image}
                alt={aircraft.model}
              />
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="div" fontWeight="bold">
                    {aircraft.model}
                  </Typography>
                  <Chip 
                    label={aircraft.registrationNumber} 
                    size="small" 
                    color="primary" 
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
                <Divider sx={{ my: 2 }} />
                
                <List dense>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${theme.palette.primary.main}20`, color: theme.palette.primary.main }}>
                        <AirlineSeatReclineExtraIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary="Passenger Capacity" 
                      secondary={aircraft.capacity} 
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      secondaryTypographyProps={{ variant: 'body1', fontWeight: 'bold' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${theme.palette.secondary.main}20`, color: theme.palette.secondary.main }}>
                        <CalendarTodayIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary="Year Manufactured" 
                      secondary={aircraft.yearManufactured} 
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      secondaryTypographyProps={{ variant: 'body1', fontWeight: 'bold' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${theme.palette.success.main}20`, color: theme.palette.success.main }}>
                        <TimerIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary="Parking Time" 
                      secondary={`${aircraft.parkingHours} hours (${aircraft.parkingMinutes} minutes)`} 
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      secondaryTypographyProps={{ variant: 'body1', fontWeight: 'bold' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${theme.palette.error.main}20`, color: theme.palette.error.main }}>
                        <AttachMoneyIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary="Parking Cost" 
                      secondary={formatCurrency(aircraft.parkingCost)} 
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      secondaryTypographyProps={{ variant: 'body1', fontWeight: 'bold', color: 'error.main' }}
                    />
                  </ListItem>
                </List>
                
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Percentage of Total Parking Time
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {aircraft.parkingPercentage.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={aircraft.parkingPercentage} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: theme.palette.grey[200],
                      '& .MuiLinearProgress-bar': {
                        bgcolor: aircraft === mostParkedAircraft 
                          ? theme.palette.secondary.main 
                          : theme.palette.primary.main
                      }
                    }}
                  />
                </Box>
                
                {(aircraft === mostParkedAircraft || aircraft === leastParkedAircraft) && (
                  <Box 
                    sx={{ 
                      mt: 2, 
                      p: 1, 
                      borderRadius: 2, 
                      bgcolor: aircraft === mostParkedAircraft 
                        ? `${theme.palette.secondary.main}10` 
                        : `${theme.palette.info.main}10`,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <AirplanemodeActiveIcon 
                      sx={{ 
                        mr: 1, 
                        color: aircraft === mostParkedAircraft 
                          ? theme.palette.secondary.main 
                          : theme.palette.info.main 
                      }} 
                    />
                    <Typography variant="body2" fontWeight="medium">
                      {aircraft === mostParkedAircraft 
                        ? 'Highest parking time in the fleet' 
                        : 'Lowest parking time in the fleet'}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Fleet; 