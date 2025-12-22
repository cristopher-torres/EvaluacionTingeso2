import Keycloak from "keycloak-js";

const isDocker = window.location.hostname !== "localhost";

const keycloak = new Keycloak({
  url: isDocker ? "http://keycloak:8080" : "http://localhost:9090",
  realm: "tingeso-realm",
  clientId: "toolrent-frontend"
});

export default keycloak;

