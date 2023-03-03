import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { Box, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Box sx={{ backgroundColor: "#837d7d", minHeight: "100vh" }}>
      <Box sx={{
        height: 60,
        display: 'flex',
        alignItems: 'center',
        padding: "0px 24px",
        margin: "0 auto",
        gap: 2,
      }}>
        <TravelExploreIcon sx={{ color: "#FFF" }} />
        <Typography color="#FFF">Countries List</Typography>
      </Box>

      <Outlet />
    </Box>
  );
}

export default App;
