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
import { useKeycloak } from "@react-keycloak/web";

const ToolDecommission = () => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const [tools, setTools] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const rut = keycloak?.tokenParsed?.rut;

  // Cargar todas las herramientas
  const init = () => {
    toolService
      .getAll()
      .then((response) => setTools(response.data))
      .catch((error) => console.error("Error al cargar herramientas", error));
  };

  useEffect(() => {
    init();
  }, []);

  const handleDecommission = (tool) => {
    if (!keycloak.authenticated) {
      alert("Debes iniciar sesión para dar de baja una herramienta.");
      return;
    }

    const isAdmin = keycloak.hasRealmRole("ADMIN");
    if (!isAdmin) {
      alert("No tienes permisos para dar de baja esta herramienta.");
      return;
    }

    // Crear objeto tool con status cambiado a DADA_DE_BAJA
    const toolDetails = {
      ...tool,       // copiar todos los campos
      status: "DADA_DE_BAJA"
    };

    toolService.update(toolDetails, rut)
      .then(() => {
        alert("Herramienta dada de baja ✅");
        init(); // recargar lista
      })
      .catch((error) => console.error("Error al dar de baja herramienta ❌", error));
  };

  // Filtrar herramientas: ocultar las que ya están dadas de baja
  const filteredTools = tools
    .filter((tool) => tool.status !== "DADA_DE_BAJA")
    .filter((tool) => {
      const term = searchTerm.toLowerCase();
      return (
        tool.id.toString().includes(term) ||
        tool.name.toLowerCase().includes(term) ||
        tool.category.toLowerCase().includes(term)
      );
    });

  return (
    <div>
      <h2>Dar de baja herramientas</h2>

      <TextField
        label="Buscar por ID, Nombre o Categoría"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

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
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDecommission(tool)}
                  >
                    Dar de baja
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

export default ToolDecommission;




