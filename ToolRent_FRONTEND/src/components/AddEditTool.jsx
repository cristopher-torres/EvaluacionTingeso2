import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import toolService from "../services/tool.service";
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
  const [replacementValue, setReplacementValue] = useState("");
  const [dailyRate, setDailyRate] = useState("");
  const [dailyLateRate, setDailyLateRate] = useState("");
  const [repairValue, setRepairValue] = useState("");
  const [status, setStatus] = useState("DISPONIBLE"); // Valor por defecto

  const { id } = useParams();
  const [titleToolForm, setTitleToolForm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { keycloak } = useKeycloak();

  const saveTool = (e) => {
    e.preventDefault();

    const rut = keycloak?.tokenParsed?.rut;

    const tool = {
      name,
      category,
      replacementValue: Number(replacementValue),
      dailyRate: Number(dailyRate),
      dailyLateRate: Number(dailyLateRate),
      repairValue: Number(repairValue),
      id,
      status
    };

    if (id) {
      toolService
        .update(tool, rut)
        .then(() => {
          setSuccessMessage("Herramienta actualizada exitosamente ✅");
          setOpenSnackbar(true);
          setTimeout(() => navigate("/inventario"), 3000);
        })
        .catch((error) => console.error("Error al actualizar herramienta ❌", error));
    } else {
      toolService
        .create(tool, Number(quantity), rut)
        .then(() => {
          setSuccessMessage("Herramienta creada exitosamente ✅");
          setOpenSnackbar(true);
          setTimeout(() => navigate("/inventario"), 1500);
        })
        .catch((error) => console.error("Error al crear herramienta ❌", error));
    }
  };

  useEffect(() => {
    if (id) {
      setTitleToolForm("Editar Herramienta");
      toolService
        .get(id)
        .then((response) => {
          const tool = response.data;
          setName(tool.name);
          setCategory(tool.category);
          setQuantity(tool.stock);
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
            id="dailyRate"
            label="Tarifa Diaria"
            type="number"
            value={dailyRate}
            variant="outlined"
            onChange={(e) => setDailyRate(e.target.value)}
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
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="repairValue"
            label="Costo de Reparación"
            type="number"
            value={repairValue}
            variant="outlined"
            onChange={(e) => setRepairValue(e.target.value)}
          />
        </FormControl>

        {id && (
          <FormControl fullWidth>
            <TextField
              id="status"
              label="Estado"
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
          }}
          startIcon={<SaveIcon />}
        >
          Guardar
        </Button>

        <Typography variant="body2" align="center">
          <Link to="/inventario">Volver al Listado</Link>
        </Typography>
      </Box>

      {/* Snackbar de éxito */}
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



