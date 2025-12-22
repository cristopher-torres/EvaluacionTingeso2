import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toolService from "../services/tool.service";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useKeycloak } from "@react-keycloak/web";

const ToolList = () => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const [tools, setTools] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const init = () => {
    toolService
      .getAll()
      .then((response) => {
        setTools(response.data);
      })
      .catch((error) => {
        console.log("Error al cargar herramientas.", error);
      });
  };

  useEffect(() => {
    init();
  }, []);

  const filteredTools = tools.filter((tool) => {
    const term = searchTerm.toLowerCase();
    return (
      tool.id.toString().includes(term) ||
      tool.name.toLowerCase().includes(term) ||
      tool.category.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <h2>Listado de Herramientas</h2>

      <TextField
        label="Buscar por ID, Nombre o Categoría"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Botón Agregar herramienta */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{
          mb: 2,
          backgroundColor: "#1b5e20",
          "&:hover": { backgroundColor: "#2e7d32" },
        }}
        onClick={() => navigate("/tools/add")}
      >
        Agregar herramienta
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTools.map((tool) => (
              <TableRow key={tool.id}>
                <TableCell>{tool.id}</TableCell>
                <TableCell>{tool.name}</TableCell>
                <TableCell>{tool.category}</TableCell>
                <TableCell>{tool.status}</TableCell>
                <TableCell>
                  {/* Botón Editar solo para ADMIN */}
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<EditIcon />}
                    sx={{ mr: 1 }}
                    onClick={() => {
                      if (!keycloak.authenticated) {
                        alert(
                          "Debes iniciar sesión para editar una herramienta."
                        );
                        return;
                      }

                      const isAdmin = keycloak.hasRealmRole("ADMIN");
                      if (!isAdmin) {
                        alert(
                          "No tienes permisos para editar esta herramienta."
                        );
                        return;
                      }

                      navigate(`/tools/edit/${tool.id}`);
                    }}
                  >
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ToolList;





