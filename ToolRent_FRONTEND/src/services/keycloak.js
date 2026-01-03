import Keycloak from "keycloak-js";



const keycloak = new Keycloak({
  url: "http://172.23.14.168:31147",  
  realm: "tingeso-realm",              // Confirmado en tu URL de Keycloak
  clientId: "toolrent-frontend"        // Asegúrate de que este sea el ID que creaste
});

export default keycloak;

