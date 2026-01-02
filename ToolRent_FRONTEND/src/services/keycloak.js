import Keycloak from "keycloak-js";



const keycloak = new Keycloak({
  url: "http://localhost:9090",  // Hardcodeada: URL del servicio de Keycloak
  realm: "tingeso-realm",       // Nombre del realm en Keycloak
  clientId: "toolrent-frontend" // ID del cliente en Keycloak
});

export default keycloak;

