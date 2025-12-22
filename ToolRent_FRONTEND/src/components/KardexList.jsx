import React, { useState, useEffect } from "react";
import { getMovementsByTool, getMovementsByDateRange } from "../services/kardex.service";
import toolService from "../services/tool.service";
import { Autocomplete, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from "@mui/material";

const KardexList = () => {
    const [tools, setTools] = useState([]);
    const [selectedTool, setSelectedTool] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [movements, setMovements] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        toolService.getAll()
            .then(res => setTools(res.data))
            .catch(err => console.error("Error cargando herramientas", err));
    }, []);

    const handleToolChange = (event, value) => {
        setSelectedTool(value);
    };

    const fetchMovementsByTool = () => {
        if (!selectedTool) {
            setError("Por favor selecciona una herramienta");
            return;
        }
        getMovementsByTool(selectedTool.id)
            .then(res => {
                setMovements(res.data);
                setError("");
            })
            .catch(err => {
                console.error("Error fetching movements by tool", err);
                setError("Error al obtener movimientos de la herramienta");
            });
    };

    const fetchMovementsByDateRange = () => {
        if (!startDate || !endDate) {
            setError("Por favor ingresa ambas fechas");
            return;
        }

        const startIso = `${startDate}T00:00:00`;
        const endIso = `${endDate}T23:59:59`;

        getMovementsByDateRange(startIso, endIso)
            .then(res => {
                setMovements(res.data);
                setError("");
            })
            .catch(err => {
                setError("Error al obtener movimientos en el rango de fechas");
            });
    };

    const buttonStyle = {
        backgroundColor: "#1b5e20",
        "&:hover": { backgroundColor: "#145a16" }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Kardex de Herramientas</Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Autocomplete
                    options={tools}
                    getOptionLabel={(option) => `${option.id}. ${option.name}`}
                    value={selectedTool}
                    onChange={handleToolChange}
                    renderInput={(params) => <TextField {...params} label="Selecciona Herramienta" />}
                    sx={{ minWidth: 300 }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    freeSolo
                />
                <Button variant="contained" onClick={fetchMovementsByTool} sx={buttonStyle}>
                    Buscar por Herramienta
                </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    label="Fecha Inicio"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Fecha Fin"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <Button variant="contained" onClick={fetchMovementsByDateRange} sx={buttonStyle}>
                    Buscar por Rango de Fechas
                </Button>
            </Box>

            {error && <Typography color="error" gutterBottom>{error}</Typography>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>rut Usuario</TableCell>
                            <TableCell>Cantidad afectada</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Fecha</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {movements.map(m => (
                            <TableRow key={m.id}>
                                <TableCell>{m.id}</TableCell>
                                <TableCell>{m.userRut}</TableCell>
                                <TableCell>{m.quantity}</TableCell>
                                <TableCell>{m.type}</TableCell>
                                <TableCell>{new Date(m.dateTime).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default KardexList;


