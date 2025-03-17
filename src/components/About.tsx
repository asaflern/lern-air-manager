import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Avatar, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar,
  Divider,
  Paper,
  useTheme
} from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import InfoIcon from '@mui/icons-material/Info';
import StorageIcon from '@mui/icons-material/Storage';
import CodeIcon from '@mui/icons-material/Code';
import DesignServicesIcon from '@mui/icons-material/DesignServices';

const About: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        About Lern-Air Manager
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Information about this application and Lern-Air
      </Typography>
      
      <Grid container spacing={3}>
        {/* Company Info */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <Box 
              sx={{ 
                p: 3, 
                backgroundImage: 'linear-gradient(to right, #1e3a8a, #3a5fc4)',
                color: 'white',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <FlightIcon sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h5" fontWeight="bold">
                Lern-Air Airlines
              </Typography>
            </Box>
            <CardContent>
              <Typography variant="body1" paragraph>
                Lern-Air is a premium international airline company founded in 2010. 
                With a modern fleet of aircraft including Boeing and Airbus models, 
                Lern-Air serves destinations across six continents.
              </Typography>
              <Typography variant="body1" paragraph>
                Our commitment to excellence has made us one of the fastest-growing airlines, 
                with a focus on customer satisfaction, operational efficiency, and sustainable practices.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Company Facts
              </Typography>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: `${theme.palette.primary.main}20`, color: theme.palette.primary.main }}>
                      <FlightIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Fleet Size" 
                    secondary="5 aircraft (Boeing 777, 747, 787 and Airbus A380, A350)" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: `${theme.palette.primary.main}20`, color: theme.palette.primary.main }}>
                      <StorageIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Airport Network" 
                    secondary="10 major international airports" 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* App Info */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <Box 
              sx={{ 
                p: 3, 
                backgroundImage: 'linear-gradient(to right, #ff6b35, #ff8b5e)',
                color: 'white',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <InfoIcon sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h5" fontWeight="bold">
                About This Application
              </Typography>
            </Box>
            <CardContent>
              <Typography variant="body1" paragraph>
                Lern-Air Manager is a comprehensive analytics dashboard designed to monitor
                and analyze the parking time of Lern-Air's fleet at airports around the world.
              </Typography>
              <Typography variant="body1" paragraph>
                This application helps airline management track operational efficiency,
                identify patterns in aircraft ground time, and optimize scheduling to reduce
                unnecessary parking expenses.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Technology Stack
              </Typography>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: `${theme.palette.secondary.main}20`, color: theme.palette.secondary.main }}>
                      <CodeIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Frontend" 
                    secondary="React, TypeScript, Material UI" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: `${theme.palette.secondary.main}20`, color: theme.palette.secondary.main }}>
                      <DesignServicesIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Visualization" 
                    secondary="Recharts, Leaflet, React-Globe" 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Data Information */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: '#f5f5f5' }}>
            <Typography variant="subtitle2" color="text.secondary" align="center">
              Note: This application uses sample data for demonstration purposes.
              In a production environment, it would connect to real-time data sources and airline management systems.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default About; 