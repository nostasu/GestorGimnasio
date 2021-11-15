1. Descripción del proyecto - explicar un poco el proyecto, por ejemplo: Se trata de una pagina web mediante cual el usuario puede acceder a la clasificación y resultados de la liga española 


2. Funcionalidades : - acceso a la clasificación 
- acceso a los resultados de todos los partidos 
- filtrar los partidos por el nombre del equipo favorito 


3. Tecnologias empleadas : 
- HTML : para el esqueleto
- CSS3 y Bootstrap - para diseño de la interfaz, creando al mismo tiempo un sitio web responsive 
- Javascript : para dar dinamismo y funcionalidad a la pagina web 


4. Descripcion técnica del proyecto - aquí describir un poco las funciónes 

5. Versiones - la version del proyecto, en vuestro caso es la primera y la fecha 

6. To DO - cosas pendientes por hacer en el proyecto : ejemplo - añadir más ligas, inglesa, francesa, italiana , etc. 
- Mejorar pagina home. 

# Introducción a la página web
## ¿De que va la web?.
La web consiste en un gestor de reservas de clases, la funcionalidad principal es que los usuarios, previa identificación del gimnasio en el que están inscritos, puedan reservar sus clases para entrenar, teniendo en cuenta su cuota (cuantas clases mensuales pagan). 
El usuario tendrá sus datos identificativos: id, nombre, apellidos, tlfn, email, contraseña y cuota.
Las clases tendrán aforo máximo y únicamente el usuario no podrá efectuar la reserva si las clases están completas. 
Los gimnasios también tendrán acceso a quien ha reservado sus clases, y podrán ver en todo momento todos los usuarios que están inscritos actualmente en el gimnasio. Cada gimnasio tendrá unas clases específicas. Cada gimnasio tendrá su id, nombre, contraseña, dirección, logo, bonos disponibles, entrenadores y clases.

## Descripción funcional de la aplicación
¿qué se puede hacer?
-   A nivel de usuario. Todas estas rutas van a ser privadas y necesitan el token del login.
    1.  Crear nuevo usuario (que estará vinculado con un gimnasio)introduciendo sus datos personales y asociarle la cuota pagada (dará lugar al número de clases). Dentro de las clases tendrá derecho a cualquiera de sus modalidades. 
    Ruta --> /api/usuarios/signup✅ 
    Login. Ruta --> /api/usuarios/login ✅
    2.  Mostrar todos usuarios disponibles en la BBDD.  Ruta --> /api/usuarios✅
    3.  Obtener 1 usuario por id y ver sus clases.  Ruta --> api/usuarios/find/:id ✅
    5.  Reservar una nueva clase. Ruta --> api/usuarios/inscribirse/:id ✅
    6.  Cancelar reservas. Ruta --> api/usuarios/delete/clase/:id✅
    7.  Modificar usuario. Ruta --> api/usuarios/update/:id✅
    8.  Borrar usuario, si el usuario estaba inscrito en alguna clase borrarlo. Ruta --> api/usuarios/delete✅

-   A nivel de Clases
    1.  Contendrán el id, el tipo de la clase (tacfit, entrenamiento personal, entrenamiento en grupo) la fecha y hora, los alumnos inscritos (llevara el id de cada alumno), y el máximo de alumnos.  Ruta --> api/usuarios/delete/✅
    2.  Las clases se actualizarán automáticamente cuando un usuario entre a la aplicación, y así la clase que ya haya finalizado se modificara y pasará a ser la de dentro de 7 días.  Ruta --> api/clases/updateClasses✅ Pública
    3.  Mostrar todas clases.  Ruta-->api/clases/✅
    4.  Mostrar todos los usuarios de todas las clases.  Ruta --> api/clases/todasClasesUsuarios✅
    5.  Mostrar 1 clase por id.  Ruta --> api/clases/find/:id ✅
    6.  Eliminar 1 clase.  Ruta --> api/clases/delete/:id ✅

-   A nivel de gimnasio.
    1.  Creación gimnasio. Cada gimnasio tendrá su id, el nombre del centro, la dirección, un array con un objeto por cada entrenador [entr0, entr1] y un array con las distintas cuotas que ofrece el gimnasio (ej, cuota1 { precio : 55, clases : 8};) y el tipo de las clases que va a ofrecer: (tacfit, entrenamiento en grupo, entrenamiento personal). 
    Ruta --> /api/authGym/signup✅
    Y el gym se tendra que loguearse para acceder a todas las funcionalidades relativas a gymnasios:
    Ruta --> /api/authGym/login✅
    2.  Se podrán ver todos los gimnasios de la BBDD 
    Ruta--> api/gimnasios/✅
    3.  Buscar un gimnasio por su id. 
    Ruta --> api/gimnasios/find/:id✅
    4.  Actualizar los datos del gimnasio
    Ruta -->/api/gimnasios/:id/update✅
    5.  Borrar un gimnasio por id. 
    Ruta --> /api/gimnasios/delete/:id ✅
    6.  Usuarios listados por cuota
    Ruta --> /api/gimnasios/listarCuotas✅
    7. Mostrar el nombre de todos los usuarios de un gimnasio
    Ruta --> /api/gimnasios/:id/listaUsuarios✅ 

- A nivel de cuotas (Fees). Son todas privadas (nivel Gym) menos ver todas cuotas y mostrar una cuota por id
    1. Crear.  Ruta--> /api/cuotas  (POST)✅
    2. Mostrar todos.  Ruta--> /api/cuotas   (GET)✅
    3. Mostrar 1 por id.   Ruta-->/api/cuotas/find/:id✅
    4. Actualizar cuota.  Ruta --> /api/cuotas/update/:id✅ 
    5. Eliminar cuota.  Ruta --> /api/cuotas/delete/:id✅ 


![ScreenShot](./GestorReservas.png)
 
