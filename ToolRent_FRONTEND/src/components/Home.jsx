import { useKeycloak } from "@react-keycloak/web";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import toolService from "../services/tool.service";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { keycloak } = useKeycloak();
  const username = keycloak.tokenParsed?.preferred_username;

  const [toolsStock, setToolsStock] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Traer stock de herramientas
    toolService
      .getStock()
      .then((response) => {
        setToolsStock(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar stock de herramientas", error);
      });
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "white",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Contenido principal */}
      <Box sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              background: "linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)",
              borderRadius: 4,
              mb: 6,
            }}
          >
            {keycloak.authenticated ? (
              <>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: "bold", color: "#1b5e20", mb: 2 }}
                >
                  ToolRent: Sistema de Gestión de Herramientas
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "#2e7d32", mb: 4 }}
                >
                  Herramientas de construcción y reparación.
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "#1b5e20",
                    fontSize: "1.1rem",
                    py: 1.5,
                    px: 4,
                    borderRadius: 3,
                    "&:hover": { backgroundColor: "#2e7d32" },
                  }}
                  onClick={() => navigate("/prestamos")}
                  
                >
                  Registrar Préstamos
                </Button>
              </>
            ) : (
              <>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: "bold", color: "#1b5e20", mb: 2 }}
                >
                  ToolRent: Sistema de Gestión de Herramientas
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "#2e7d32", mb: 4 }}
                >
                  Herramientas de construcción y reparación.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "#1b5e20",
                    fontSize: "1.2rem",
                    py: 2,
                    px: 4,
                    borderRadius: 3,
                    "&:hover": { backgroundColor: "#2e7d32" },
                  }}
                  onClick={() => keycloak.login()}
                >
                  Iniciar sesión
                </Button>
              </>
            )}
          </Box>

          {/* Tabla de stock */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Disponible</TableCell>
                  <TableCell>Prestada</TableCell>
                  <TableCell>En Reparación</TableCell>
                  <TableCell>Dada de Baja</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {toolsStock.map((tool) => (
                  <TableRow key={tool.name}>
                    <TableCell>{tool.name}</TableCell>
                    <TableCell>{tool.category}</TableCell>
                    <TableCell>{tool.disponible}</TableCell>
                    <TableCell>{tool.prestada}</TableCell>
                    <TableCell>{tool.enReparacion}</TableCell>
                    <TableCell>{tool.dadaDeBaja}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          borderTop: "1px solid rgba(255,255,255,0.2)",
          mt: 4,
          pt: 3,
          pb: 3,
          textAlign: "center",
          backgroundColor: "#1b5e20",
          color: "white",
        }}
      >
        <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
          ToolRent - Sistema de Gestión de Herramientas
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          © 2025 ToolRent. Todos los derechos reservados.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;





