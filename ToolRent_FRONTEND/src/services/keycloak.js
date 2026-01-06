import Keycloak from "keycloak-js";



const keycloak = new Keycloak({
  url: "http://172.17.252.194:30080",  
  realm: "tingeso-realm",              
  clientId: "toolrent-frontend"        
});

export default keycloak;

