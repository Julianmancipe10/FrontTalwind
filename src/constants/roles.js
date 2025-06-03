export const ROLES = {
  ADMINISTRADOR: 'Administrador',
  INSTRUCTOR: 'Instructor',
  APRENDIZ: 'Aprendiz',
  FUNCIONARIO: 'Funcionario'
};

export const PERMISOS = {
  // Permisos de Publicaciones
  CREAR_PUBLICACION: 'crear_publicacion',
  EDITAR_PUBLICACION: 'editar_publicacion',
  ELIMINAR_PUBLICACION: 'eliminar_publicacion',
  VER_PUBLICACION: 'ver_publicacion',
  
  // Permisos de Usuarios
  CREAR_USUARIO: 'crear_usuario',
  EDITAR_USUARIO: 'editar_usuario',
  ELIMINAR_USUARIO: 'eliminar_usuario',
  VER_USUARIO: 'ver_usuario',
  
  // Permisos de Roles
  ASIGNAR_ROLES: 'asignar_roles',
  VER_ROLES: 'ver_roles',
  
  // Permisos de Permisos
  ASIGNAR_PERMISOS: 'asignar_permisos',
  VER_PERMISOS: 'ver_permisos'
};

// Mapeo de roles a permisos por defecto
export const ROLES_PERMISOS = {
  [ROLES.ADMINISTRADOR]: [
    PERMISOS.CREAR_PUBLICACION,
    PERMISOS.EDITAR_PUBLICACION,
    PERMISOS.ELIMINAR_PUBLICACION,
    PERMISOS.VER_PUBLICACION,
    PERMISOS.CREAR_USUARIO,
    PERMISOS.EDITAR_USUARIO,
    PERMISOS.ELIMINAR_USUARIO,
    PERMISOS.VER_USUARIO,
    PERMISOS.ASIGNAR_ROLES,
    PERMISOS.VER_ROLES,
    PERMISOS.ASIGNAR_PERMISOS,
    PERMISOS.VER_PERMISOS
  ],
  [ROLES.INSTRUCTOR]: [
    PERMISOS.CREAR_PUBLICACION,
    PERMISOS.EDITAR_PUBLICACION,
    PERMISOS.VER_PUBLICACION,
    PERMISOS.VER_USUARIO
  ],
  [ROLES.FUNCIONARIO]: [
    PERMISOS.CREAR_PUBLICACION,
    PERMISOS.EDITAR_PUBLICACION,
    PERMISOS.VER_PUBLICACION,
    PERMISOS.VER_USUARIO
  ],
  [ROLES.APRENDIZ]: [
    PERMISOS.VER_PUBLICACION,
    PERMISOS.VER_USUARIO
  ]
}; 