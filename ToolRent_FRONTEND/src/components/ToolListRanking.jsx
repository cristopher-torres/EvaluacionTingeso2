import { useEffect, useState } from "react";
import { getTopToolsByDate, getTopToolsAllTime } from "../services/loan.service";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

const ToolListRanking = () => {
  const [tools, setTools] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchAllTools = () => {
    getTopToolsAllTime().then(res => setTools(res.data));
  };

  const fetchToolsByDate = () => {
    if (!startDate || !endDate) return;
    getTopToolsByDate(startDate, endDate).then(res => setTools(res.data));
  };

  useEffect(() => {
    fetchAllTools();
  }, []);

  return (
    <div>
      <h2 style={{ color: "#1b5e20", fontSize: 30, marginBottom: 24 }}>
            Ranking de Herramientas Más Prestadas
      </h2>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          type="date"
          label="Desde"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          type="date"
          label="Hasta"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: "#1b5e20", "&:hover": { backgroundColor: "#145a16" } }}
          onClick={fetchToolsByDate}
        >
          Filtrar por fechas
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#1b5e20", "&:hover": { backgroundColor: "#145a16" } }}
          onClick={fetchAllTools}
        >
          Ver todos
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre Herramienta</TableCell>
              <TableCell>Veces Prestada</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tools.map((tool, index) => (
              <TableRow key={index}>
                <TableCell>{tool[0]}</TableCell> 
                <TableCell>{tool[1]}</TableCell> 
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ToolListRanking;
