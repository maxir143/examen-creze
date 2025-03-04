# Examen Creze

## Descripción del Proyecto

> En Creze, la seguridad de la información y la protección de los datos de nuestros clientes son de
> máxima prioridad. Para este desafío técnico, te invitamos a desarrollar un módulo de autenticación
> multi-factor (MFA) que se integre en una aplicación web existente construida con Django en el
> backend y React en el frontend. Este proyecto, aunque acotado en alcance, requiere de una alta
> complejidad técnica y permitirá evaluar tus habilidades en seguridad, integración de sistemas y
> mejores prácticas de desarrollo.

## Objetivos del Caso

- Desarrollar un sistema de autenticación multi-factor que añada una capa adicional de
  seguridad al proceso de inicio de sesión.
- Integrar este sistema tanto en el backend (Django) como en el frontend (React) de manera
  transparente y eficiente.
- Implementar soluciones de seguridad avanzadas siguiendo las mejores prácticas de la
  industria.

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

1. descargar el proyecto con el comando `git clone`

2. revisar el documento docker-compose.yaml y corroborar que las variables de entorno sean las deseadas.

3. ingresar el comando `docker compose build` y esperar a que la instalación de ambos módulos finalice.

4. ingresar el comando `docker compose up -d` y verificar que ambos contenedores corran exitosamente.

5. visitar el frontend en [localhost:8000](http://localhost:8000/)

> Para visitar la documentación técnica del backend visitar [documentación](http://localhost:3000/api/docs)

---

🗣️ Aviso:
_Debido a la complejidad del examen y al poco tiempo que dispongo para realizarlo, decidí usar el framework [FastAPI](https://fastapi.tiangolo.com/) con el cual hoy en dia laboro y por tanto mas cómodo me siento para realizar la prueba_
