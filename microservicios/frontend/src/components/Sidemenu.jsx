import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BadgeIcon from '@mui/icons-material/Badge';
import AnalyticsIcon from "@mui/icons-material/Analytics";
import HomeIcon from "@mui/icons-material/Home";
import HandymanIcon from '@mui/icons-material/Handyman';
import { useNavigate } from "react-router-dom";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"; // Importar el nuevo icono
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

export default function Sidemenu({ open, toggleDrawer }) {
  const navigate = useNavigate();

  const listOptions = () => (
    <Box
      role="presentation"
      onClick={toggleDrawer(false)}
      sx={{
        backgroundColor: "black",
        color: "white",
        height: "100%",
        fontFamily: "'DIN Pro Cond Black', sans-serif",
      }}
    >
      <List>
        <ListItemButton onClick={() => navigate("/")}>
          <ListItemIcon sx={{ color: "white" }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
        <Divider sx={{ backgroundColor: "white" }} />

        {/* Inventario (Herramientas) */}
        <ListItemButton onClick={() => navigate("/tool/list")}> 
          <ListItemIcon sx={{ color: "white" }}>
            <HandymanIcon />
          </ListItemIcon>
          <ListItemText primary="Inventario" />
        </ListItemButton>

        {/* Clientes */}
        <ListItemButton onClick={() => navigate("/client/list")}> 
          <ListItemIcon sx={{ color: "white" }}>
            <PeopleAltIcon />
          </ListItemIcon>
          <ListItemText primary="Clientes" />
        </ListItemButton>

        {/* Kardex */}
        <ListItemButton onClick={() => navigate("/kardex")}> 
          <ListItemIcon sx={{ color: "white" }}>
            <CalendarTodayIcon />
          </ListItemIcon>
          <ListItemText primary="Kardex" />
        </ListItemButton>

        {/* Tarifas */}
        <ListItemButton onClick={() => navigate("/tariff")}> 
          <ListItemIcon sx={{ color: "white" }}>
            <LocalAtmIcon />
          </ListItemIcon>
          <ListItemText primary="Tarifas" />
        </ListItemButton>

        {/* Reportes */}
        <ListItemButton onClick={() => navigate("/report/list")}> 
          <ListItemIcon sx={{ color: "white" }}>
            <AnalyticsIcon />
          </ListItemIcon>
          <ListItemText primary="Reportes" />
        </ListItemButton>
      </List>
      <Divider sx={{ backgroundColor: "white" }} />
    </Box>
  );

  return (
    <div>
      <Drawer anchor={"left"} open={open} onClose={toggleDrawer(false)}>
        {listOptions()}
      </Drawer>
    </div>
  );
}
