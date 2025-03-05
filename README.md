# Examen Creze

[Demo](http://145.223.75.232:3005/login)

Rutas:
- /login
- /sing-up
- /otp
- /protected

[API Docs](http://145.223.75.232:3004/api/docs)

## Descripción del Proyecto

> En Creze, la seguridad de la información y la protección de los datos de nuestros clientes son de
> máxima prioridad. Para este desafío técnico, te invitamos a desarrollar un módulo de autenticación
> multi-factor (MFA) que se integre en una aplicación web existente construida con Django en el
> backend y React en el frontend. Este proyecto, aunque acotado en alcance, requiere de una alta
> complejidad técnica y permitirá evaluar tus habilidades en seguridad, integración de sistemas y
> mejores prácticas de desarrollo.

## Objetivos del Caso

- Desarrollar un sistema de autenticación multi-factor que añada una capa adicional de
  seguridad al proceso de inicio de sesión
- Integrar este sistema tanto en el backend (Django) como en el frontend (React) de manera
  transparente y eficiente
- Implementar soluciones de seguridad avanzadas siguiendo las mejores prácticas de la
  industria

## Requerimientos Específicos

- [x] Autenticación Básica
- [x] Autenticación Multi-Factor
- [x] Integración Frontend
- [x] Seguridad Avanzada
- [ ] Testing y Validación
- [x] Documentación
- [ ] Desplegar la aplicación utilizando los servicios gratuitos de AWS

## Criterios de Evaluación

- Calidad del Código
- Complejidad Técnica
- Funcionalidad Completa
- Documentación y Pruebas
- Toma de Decisiones

## Instalación del proyecto

### Requisitos

- Docker
- Git

### Levantar proyecto con docker

1. Descargar el proyecto con el comando `git clone https://github.com/maxir143/examen-creze.git`.

2. Ingresa a la carpeta `cd examen-creze`.

3. Revisar el documento **docker-compose.yaml** y corroborar que las variables de entorno sean las deseadas.

4. Ingresar el comando `docker compose build` y esperar a que la instalación de ambos módulos finalice.

5. Ingresar el comando `docker compose up -d` y verificar que ambos contenedores corran exitosamente.

6. Visitar el frontend desplegado en [localhost](http://localhost:3005/).

> Para mas información sobre la documentación técnica de la api visitar [documentación](http://localhost:3004/api/docs).

### Configuración OTP

1. Registrase como usuario de la aplicación [pagina de registro](http://localhost:3005/sing-up).

2. Iniciar sesión en la aplicación [pagina de inicio de sesión](http://localhost:3005/login).

3. Sera redirigido automáticamente a la pagina de validación de código OTP, de caso contrario por favor diríjase a ella [pagina de verificación otp](http://localhost:3005/otp).

4. Para obtener un código QR deberá dar click en el botón _need a QR code ?_, debajo de el aparecerá el código que puedes escanear con google authenticator.

5. Ingresar el código de 6 dígitos que aparecerá en la aplicación una vez vinculado.

> Instrucciones para instalar el [Authenticator de google](https://support.google.com/accounts/answer/1066447?hl=es-419&co=GENIE.Platform%3DAndroid).

---

🗣️ Aviso:
_Debido a la complejidad del examen y al poco tiempo que dispongo para realizarlo, decidí usar el framework [FastAPI](https://fastapi.tiangolo.com/) con el cual hoy en dia laboro y por tanto mas cómodo me siento para realizar la prueba._
