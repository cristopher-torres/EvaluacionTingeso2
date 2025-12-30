import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import toolService from "../services/tool.service";
import rateService from "../services/rate.service"; // IMPORTACIÓN NUEVA
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import SaveIcon from "@mui/icons-material/Save";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useKeycloak } from "@react-keycloak/web";

const AddEditTool = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  
  // Estados Monetarios (Responsabilidad de M4)
  const [replacementValue, setReplacementValue] = useState("");
  const [dailyRate, setDailyRate] = useState("");
  const [dailyLateRate, setDailyLateRate] = useState("");
  const [repairValue, setRepairValue] = useState(""); // Este campo es opcional en M4 según diseño, pero lo enviamos
  
  const [status, setStatus] = useState("DISPONIBLE");

  const { id } = useParams();
  const [titleToolForm, setTitleToolForm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { keycloak } = useKeycloak();

  const saveTool = async (e) => {
    e.preventDefault();

    const rut = keycloak?.tokenParsed?.rut || "admin"; // Fallback por seguridad

    // Objeto base para M1
    const toolDataM1 = {
      id,
      name,
      category,
      status,
      // M1 recibe los precios en el objeto, pero M4 es el que gobierna la actualización de tarifas
      replacementValue: Number(replacementValue),
      dailyRate: Number(dailyRate),
      dailyLateRate: Number(dailyLateRate),
      repairValue: Number(repairValue),
    };

    try {
      if (id) {
        // --- MODO EDICIÓN (Separación de responsabilidades) ---
        
        // 1. Actualizar Datos de Inventario (M1)
        // Esto actualiza nombre, categoría, estado.
        await toolService.update(toolDataM1, rut);

        // 2. Actualizar Tarifas (M4) - CUMPLIMIENTO ÉPICA 4
        // M4 recibe la orden y se comunica internamente con M1 para ajustar los precios
        await rateService.updateToolRate(
            id, 
            Number(dailyRate), 
            Number(dailyLateRate), 
            Number(replacementValue), 
            rut
        );

        setSuccessMessage("Herramienta y tarifas actualizadas exitosamente ✅");
        setOpenSnackbar(true);
        setTimeout(() => navigate("/inventario"), 2500);

      } else {
        // --- MODO CREACIÓN (Todo va a M1 inicialmente) ---
        await toolService.create(toolDataM1, Number(quantity), rut);
        
        setSuccessMessage("Herramienta creada exitosamente ✅");
        setOpenSnackbar(true);
        setTimeout(() => navigate("/inventario"), 1500);
      }
    } catch (error) {
      console.error("Error al guardar herramienta ❌", error);
      alert("Ocurrió un error al guardar. Revise la consola.");
    }
  };

  useEffect(() => {
    if (id) {
      setTitleToolForm("Editar Herramienta");
      // Cargamos los datos actuales desde M1 (Inventario tiene la data maestra)
      toolService
        .get(id)
        .then((response) => {
          const tool = response.data;
          setName(tool.name);
          setCategory(tool.category);
          setQuantity(tool.stock || 0); // M1 a veces devuelve 'stock' o se calcula
          setReplacementValue(tool.replacementValue);
          setDailyRate(tool.dailyRate);
          setDailyLateRate(tool.dailyLateRate);
          setRepairValue(tool.repairValue);
          setStatus(tool.status); 
        })
        .catch((error) => console.error("Error al cargar herramienta ❌", error));
    } else {
      setTitleToolForm("Nueva Herramienta");
    }
  }, [id]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ backgroundColor: "#f5f5f5" }}
    >
      <Box
        component="form"
        onSubmit={saveTool}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "400px",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "white",
        }}
      >
        <Typography variant="h6" align="center" gutterBottom>
          {titleToolForm}
        </Typography>

        <FormControl fullWidth>
          <TextField
            id="name"
            label="Nombre"
            value={name}
            variant="outlined"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="category"
            label="Categoría"
            value={category}
            select
            variant="outlined"
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <MenuItem value="Herramientas Eléctricas">Herramientas Eléctricas</MenuItem>
            <MenuItem value="Herramientas Manuales">Herramientas Manuales</MenuItem>
            <MenuItem value="Construcción">Construcción</MenuItem>
            <MenuItem value="Carpintería">Carpintería</MenuItem>
            <MenuItem value="Jardinería">Jardinería</MenuItem>
          </TextField>
        </FormControl>

        {!id && (
          <FormControl fullWidth>
            <TextField
              id="quantity"
              label="Cantidad a crear"
              type="number"
              value={quantity}
              variant="outlined"
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </FormControl>
        )}

        {/* Sección de Tarifas (Gestionada por M4 en Edición) */}
        <Typography variant="subtitle2" color="primary" sx={{mt: 1}}>
            Configuración de Tarifas (M4)
        </Typography>

        <FormControl fullWidth>
          <TextField
            id="dailyRate"
            label="Tarifa Diaria"
            type="number"
            value={dailyRate}
            variant="outlined"
            onChange={(e) => setDailyRate(e.target.value)}
            required
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="dailyLateRate"
            label="Tarifa por Atraso"
            type="number"
            value={dailyLateRate}
            variant="outlined"
            onChange={(e) => setDailyLateRate(e.target.value)}
            required
          />
        </FormControl>

        <FormControl fullWidth>
            <TextField
                id="replacementValue"
                label="Valor de Reposición"
                type="number"
                value={replacementValue}
                variant="outlined"
                onChange={(e) => setReplacementValue(e.target.value)}
                required
            />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="repairValue"
            label="Costo de Reparación Estándar"
            type="number"
            value={repairValue}
            variant="outlined"
            onChange={(e) => setRepairValue(e.target.value)}
          />
        </FormControl>

        {id && (
          <FormControl fullWidth sx={{mt: 2}}>
            <TextField
              id="status"
              label="Estado (Inventario)"
              value={status}
              select
              variant="outlined"
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <MenuItem value="DISPONIBLE">DISPONIBLE</MenuItem>
              <MenuItem value="PRESTADA">PRESTADA</MenuItem>
              <MenuItem value="EN_REPARACION">EN REPARACION</MenuItem>
              <MenuItem value="DADA_DE_BAJA">DAR DE BAJA</MenuItem>
            </TextField>
          </FormControl>
        )}

        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#1b5e20",
            "&:hover": { backgroundColor: "#2e7d32" },
            mt: 2
          }}
          startIcon={<SaveIcon />}
        >
          Guardar Cambios
        </Button>

        <Typography variant="body2" align="center">
          <Link to="/inventario">Volver al Listado</Link>
        </Typography>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddEditTool;



