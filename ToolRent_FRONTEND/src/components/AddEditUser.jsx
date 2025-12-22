import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import userService from "../services/user.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import SaveIcon from "@mui/icons-material/Save";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Select, InputLabel, MenuItem } from "@mui/material";

const AddEditUser = () => {
  const { userId } = useParams(); 
  const [rut, setRut] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("ACTIVO"); // Valor por defecto

  const [titleUserForm, setTitleUserForm] = useState("Nuevo Usuario");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const [openSnackbar, setOpenSnackbar] = useState(false);


  const saveUser = (e) => {
    e.preventDefault();

    const userData = {
      rut,
      name,
      lastName,
      email,
      phoneNumber,
      username,
      status,
      role: "CLIENT", // Rol predeterminado
    };

    if (userId) {
      // Si userId está presente, editamos un usuario existente
      userService.updateUser(userId, userData)
        .then(() => {
          setSuccessMessage("Usuario actualizado exitosamente ✅");
          setOpenSnackbar(true);
          setTimeout(() => navigate("/users/list"), 2500);
        })
        .catch((err) => console.error("Error al actualizar usuario ❌", err));
    } else {
      // Si no hay userId, creamos un nuevo usuario
      userService.createUser(userData)
        .then(() => {
          setSuccessMessage("Usuario creado exitosamente ✅");
          setOpenSnackbar(true);
          setTimeout(() => navigate("/users/list"), 1500);
        })
        .catch((err) => console.error("Error al crear usuario ❌", err));
    }
  };

  // Cargar los datos del usuario 
  useEffect(() => {
    if (userId) {
      setTitleUserForm("Editar Usuario");
      userService.get(userId).then((res) => {
        const user = res.data;
        setRut(user.rut);
        setName(user.name);
        setLastName(user.lastName);
        setEmail(user.email);
        setPhoneNumber(user.phoneNumber);
        setUsername(user.username);
        setStatus(user.status);
      }).catch((err) => console.error("Error al cargar usuario ❌", err));
    } else {
      setTitleUserForm("Nuevo Usuario");
    }
  }, [userId]);

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
        onSubmit={saveUser}
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
          {titleUserForm}
        </Typography>

        <FormControl fullWidth>
          <TextField
            label="RUT"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            required
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            label="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            label="Apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            label="Teléfono"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            label="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </FormControl>

        {userId && (
          <FormControl fullWidth required>
            <InputLabel>Estado</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Estado"
            >
              <MenuItem value="ACTIVO">ACTIVO</MenuItem>
              <MenuItem value="RESTRINGIDO">RESTRINGIDO</MenuItem>
            </Select>
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

export default AddEditUser;



