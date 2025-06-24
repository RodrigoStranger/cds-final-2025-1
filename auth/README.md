# Servidor de Autenticación

Este es un servidor de autenticación para empleados basado en JWT (JSON Web Tokens).

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
   - Copia el archivo `.env` y configura las variables según tu base de datos
   - Cambia el `JWT_SECRET` por una clave segura

3. Ejecutar el servidor:
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## Endpoints

### POST /api/auth/login
Autenticar empleado con DNI y contraseña.

**Request:**
```json
{
  "dni": "12345678",
  "contraseña": "mi_contraseña"
}
```

**Response exitoso:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "jwt_token_aqui",
  "empleado": {
    "cod_empleado": 1,
    "dni": "12345678",
    "es_administrador": false,
    "estado": "activo"
  }
}
```

### POST /api/auth/verify
Verificar si un token JWT es válido.

**Headers:**
```
Authorization: Bearer jwt_token_aqui
```

### GET /api/auth/perfil
Obtener información del empleado autenticado.

**Headers:**
```
Authorization: Bearer jwt_token_aqui
```

### GET /api/auth/admin-test
Endpoint de prueba para verificar permisos de administrador.

**Headers:**
```
Authorization: Bearer jwt_token_aqui
```

## Estructura de la Base de Datos

El servidor espera la siguiente tabla en la base de datos:

```sql
CREATE TABLE IF NOT EXISTS Empleados (
    cod_empleado INT AUTO_INCREMENT PRIMARY KEY,
    dni CHAR(8) NOT NULL,
    estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    contraseña VARCHAR(30),
    es_administrador BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (dni) REFERENCES Personas(dni) ON UPDATE CASCADE
);
```

## Seguridad

- Las contraseñas deben estar hasheadas con bcrypt antes de almacenarlas en la base de datos
- Los tokens JWT expiran en 24 horas por defecto
- Solo empleados con estado 'activo' pueden autenticarse
- Se verifica tanto la validez del token como el estado del empleado en cada request protegido
