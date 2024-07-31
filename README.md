<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


# Ejecutar en desarrollo

1. clonar el repositorio
2. ejecutar
```
npm install
```
3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```

4. Levantar la bases de datos. (instalar docker desktop)
```
docker-compose up -d
```
5. Clonar el archivo __.env.template__ y renombrar a __.env__

6. LLenar las variables de entorno definidas en el __.env__

7. Ejectucar la aplicación en dev:
```
npm run satrt:dev
```
8. Reconstruir la base de datos con la semilla
```
http://localhost:3000/api/v2/seed
```

## Stack usado
  * MongoDB
  * Nest