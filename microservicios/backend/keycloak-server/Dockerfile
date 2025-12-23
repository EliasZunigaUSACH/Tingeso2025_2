# Archivo: keycloak-server/Dockerfile

# 1. Usamos la imagen oficial de Keycloak (versión reciente)
FROM quay.io/keycloak/keycloak:26.3.3

# 2. Copiamos tu archivo JSON adentro del contenedor
COPY realm-export.json /opt/keycloak/data/import/realm.json

# 3. Comando para iniciar importando esa configuración automáticamente
# El parametro --import-realm busca archivos en /opt/keycloak/data/import/
CMD ["start-dev", "--import-realm"]