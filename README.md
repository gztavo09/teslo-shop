# Next.js Tesloshop
Aplicación hecha con __REACT, TS, NEXT, DOCKER y MONGO__. 
WebApp estilo tienda de Tesla.

Para correr local, se necesita la base de datos
```

docker-compose up -d
```

* El -d, significa __detached
```
MongoDB Url local:
```
MONGO_URL=mongodb://localhost:27017/teslodb

```
* npm install
* npm dev
```
## Configurar variables de entorno
Renombrar el archivo __.env.template__ a __.env__

## LLenar la base de datos con informacion de prueba

Llamara:
```http://localhost:3000/api/seed```