import { useEffect, useState } from "react";
// 1. CAMBIO: Importamos desde report.service (M6)
import { getTopToolsRanking } from "../services/report.service";

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

  // 2. CAMBIO: Una sola función para buscar (con o sin fechas)
  const fetchRanking = () => {
    // Llamamos al servicio de Reportes. Si las fechas están vacías, el backend de M6
    // (o el endpoint de M2 al que llama) se encarga de traer el histórico.
    getTopToolsRanking(startDate, endDate)
        .then(res => setTools(res.data))
        .catch(err => console.error("Error al obtener ranking", err));
  };

  useEffect(() => {
    fetchRanking();
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
          onClick={fetchRanking}
        >
          Filtrar por fechas
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#1b5e20", "&:hover": { backgroundColor: "#145a16" } }}
          onClick={() => {
              // Limpiamos fechas y recargamos
              setStartDate("");
              setEndDate("");
              getTopToolsRanking(null, null).then(res => setTools(res.data));
          }}
        >
          Ver histórico total
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
                {/* El backend devuelve una lista de Arrays de Objetos (JPQL default):
                   [ "Taladro Percutor", 5 ]
                   Por eso accedemos con índices [0] y [1].
                */}
                <TableCell>{tool[0]}</TableCell> 
                <TableCell>{tool[1]}</TableCell> 
              </TableRow>
            ))}
            {tools.length === 0 && (
                <TableRow>
                    <TableCell colSpan={2} align="center">No hay datos para mostrar</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ToolListRanking;
