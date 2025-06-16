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
  
  // Permisos específicos de creación
  CREAR_EVENTO: 'crear_evento',
  CREAR_NOTICIA: 'crear_noticia',
  CREAR_CARRERA: 'crear_carrera',
  
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
  VER_PERMISOS: 'ver_permisos',

  // Permisos adicionales
  APROBAR_USUARIOS: 'aprobar_usuarios',
  GESTIONAR_FORMACION: 'gestionar_formacion',
  GESTIONAR_ENLACES: 'gestionar_enlaces'
};

// Mapeo de roles a permisos por defecto
export const ROLES_PERMISOS = {
  [ROLES.ADMINISTRADOR]: [
    PERMISOS.CREAR_PUBLICACION,
    PERMISOS.EDITAR_PUBLICACION,
    PERMISOS.ELIMINAR_PUBLICACION,
    PERMISOS.VER_PUBLICACION,
    PERMISOS.CREAR_EVENTO,
    PERMISOS.CREAR_NOTICIA,
    PERMISOS.CREAR_CARRERA,
    PERMISOS.CREAR_USUARIO,
    PERMISOS.EDITAR_USUARIO,
    PERMISOS.ELIMINAR_USUARIO,
    PERMISOS.VER_USUARIO,
    PERMISOS.ASIGNAR_ROLES,
    PERMISOS.VER_ROLES,
    PERMISOS.ASIGNAR_PERMISOS,
    PERMISOS.VER_PERMISOS,
    PERMISOS.APROBAR_USUARIOS,
    PERMISOS.GESTIONAR_FORMACION,
    PERMISOS.GESTIONAR_ENLACES
  ],
  [ROLES.INSTRUCTOR]: [
    PERMISOS.VER_PUBLICACION,
    PERMISOS.VER_USUARIO
  ],
  [ROLES.FUNCIONARIO]: [
    PERMISOS.VER_PUBLICACION,
    PERMISOS.VER_USUARIO
  ],
  [ROLES.APRENDIZ]: [
    PERMISOS.VER_PUBLICACION,
    PERMISOS.VER_USUARIO
  ]
};

// Descripción de permisos para mostrar en la interfaz
export const PERMISOS_DESCRIPCION = {
  [PERMISOS.CREAR_EVENTO]: 'Crear Eventos',
  [PERMISOS.CREAR_NOTICIA]: 'Crear Noticias',
  [PERMISOS.CREAR_CARRERA]: 'Crear Carreras Tecnológicas',
  [PERMISOS.CREAR_PUBLICACION]: 'Crear Publicaciones Generales',
  [PERMISOS.EDITAR_PUBLICACION]: 'Editar Publicaciones',
  [PERMISOS.ELIMINAR_PUBLICACION]: 'Eliminar Publicaciones',
  [PERMISOS.VER_PUBLICACION]: 'Ver Publicaciones',
  [PERMISOS.CREAR_USUARIO]: 'Crear Usuarios',
  [PERMISOS.EDITAR_USUARIO]: 'Editar Usuarios',
  [PERMISOS.ELIMINAR_USUARIO]: 'Eliminar Usuarios',
  [PERMISOS.VER_USUARIO]: 'Ver Usuarios',
  [PERMISOS.ASIGNAR_ROLES]: 'Asignar Roles',
  [PERMISOS.VER_ROLES]: 'Ver Roles',
  [PERMISOS.ASIGNAR_PERMISOS]: 'Asignar Permisos',
  [PERMISOS.VER_PERMISOS]: 'Ver Permisos',
  [PERMISOS.APROBAR_USUARIOS]: 'Aprobar Usuarios',
  [PERMISOS.GESTIONAR_FORMACION]: 'Gestionar Formación',
  [PERMISOS.GESTIONAR_ENLACES]: 'Gestionar Enlaces'
}; 