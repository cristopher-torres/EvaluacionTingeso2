import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import HistoryIcon from "@mui/icons-material/History";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import GroupsIcon from "@mui/icons-material/Groups";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import { useNavigate } from "react-router-dom";

export default function Sidemenu({ open, toggleDrawer }) {
  const navigate = useNavigate();

  const listOptions = () => (
    <Box role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <ListItemButton onClick={() => navigate("/")}>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>

        <Divider />

        <ListItemButton onClick={() => navigate("/user/userRegister")}>
          <ListItemIcon><PersonAddIcon /></ListItemIcon>
          <ListItemText primary="Registrar un usuario" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/tools/decommission")}>
          <ListItemIcon><RemoveCircleOutlineIcon /></ListItemIcon>
          <ListItemText primary="Dar de baja herramienta" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/tool/movementHistory")}>
          <ListItemIcon><HistoryIcon /></ListItemIcon>
          <ListItemText primary="Historial de movimientos" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/loans/ActiveLoanList")}>
          <ListItemIcon><AttachMoneyIcon /></ListItemIcon>
          <ListItemText primary="Préstamos activos" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/loans/unpaidLoans")}>
          <ListItemIcon><MoneyOffIcon /></ListItemIcon>
          <ListItemText primary="Clientes con multas sin pagar" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/reports/lateClients")}>
          <ListItemIcon><ReportProblemIcon /></ListItemIcon>
          <ListItemText primary="Clientes atrasados" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/loans/TopTools")}>
          <ListItemIcon><LeaderboardIcon /></ListItemIcon>
          <ListItemText primary="Ranking herramientas más prestadas" />
        </ListItemButton>
      </List>

      <Divider />

      <List>
        <ListItemButton onClick={() => navigate("/loans/list")}>
          <ListItemIcon><ReceiptLongIcon /></ListItemIcon>
          <ListItemText primary="Todos los préstamos" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/users/list")}>
          <ListItemIcon><GroupsIcon /></ListItemIcon>
          <ListItemText primary="Todos los clientes" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Drawer anchor={"left"} open={open} onClose={toggleDrawer(false)}>
      {listOptions()}
    </Drawer>
  );
}

