# Introducción a la página web
## ¿De que va la web?.
La web consiste en un gestor de reservas de clases, la funcionalidad principal es que los usuarios, previa identificación del gimnasio en el que están inscritos, puedan reservar sus clases para entrenar, teniendo en cuenta su cuota (cuantas clases mensuales pagan). 
El usuario tendrá sus datos identificativos: id, nombre, apellidos, tlfn, email, contraseña y cuota.
Las clases tendrán aforo máximo y únicamente el usuario no podrá efectuar la reserva si las clases están completas. 
Los gimnasios también tendrán acceso a quien ha reservado sus clases, y podrán ver en todo momento todos los usuarios que están inscritos actualmente en el gimnasio. Cada gimnasio tendrá unas clases específicas. Cada gimnasio tendrá su id, nombre, dirección, logo, bonos disponibles, entrenadores y clases.

## Descripción funcional de la aplicación
¿qué se puede hacer?
-	A nivel de usuario
    1.  Crear nuevo usuario (que estará vinculado con un gimnasio)introduciendo sus datos personales y asociarle la cuota pagada (dará lugar al número de clases). Dentro de las clases tendrá derecho a cualquiera de sus modalidades. ✅ Ruta --> /api/usuarios
    2.  Mostrar todos usuarios disponibles en la BBDD.  Ruta --> /api/usuarios✅
    3.  Obtener 1 usuario por id y ver sus clases.  Ruta --> api/usuarios/find/:id ✅
    5.	Reservar una nueva clase. Ruta --> api/usuarios/inscribirse/:id 
    6.	Cancelar reservas. ✅
    7.  Modificar usuario.✅
    8.  Borrar usuario.

-	A nivel de Clases
    1.	Contendrán el id, el tipo de la clase (tacfit, entrenamiento personal, entrenamiento en grupo) la fecha y hora, los alumnos inscritos (llevara el id de cada alumno), y el máximo de alumnos.  ✅
    2.	Las clases se actualizaran automaticamente cuando un usuario entre a la aplicacion, y asi la clase que ya haya finalziado se modificara y pasará a ser la de dentro de 7 dias //y eliminar participantes AQUIII. ✅
    3.	Tendremos un listado, de todas las reservas que hay para el día / semana. ❌
    4.  Mostrar todas clases ✅
    5.  Mostrar todos los usuarios de tooodas las clases ✅
    5.  Mostrar 1 clase por id.
    6.  Eliminar 1 clase.

-	A nivel de gimnasio.
    1.  Creación gimnasio. Cada gimnasio tendrá su id, el nombre del centro, la dirección, el logo, un array con un objeto por cada entrenador [entr0, entr1] y un array con las distintas cuotas que ofrece el gimnasio (ej, cuota1 { precio : 55, clases : 8};) y el tipo de las clases que va a ofrecer: (tacfit, entrenamiento en grupo, entrenamiento personal). ✅
    Ruta --> /api/gimnasios (POST).
    2.  Se podran ver todos los gimnasios de la BBDD 
    Ruta--> api/gimnasios/✅
    3.  Buscar un gimnasio por su id. 
    Ruta --> api/gimnasios/find/:id✅
    4.	Los gimnasios podrán ver todos los usuarios activos en su centro. 
    Ruta --> api/gimnasios/find/:id/users✅
    5.  Actualizar los dmatos del gimnasio (incluyendo clases nuevas creadas)
    Ruta -->/api/gimnasios/:id/update✅
    7.	Los gimnasios podrán ver las reservas totales, además de las reservas por cada uno de sus TIPOS de clase. ❌
    8.  Borrar un gimnasio por id. 
    Ruta --> /api/gimnasios/delete/:id ✅
    9.  Actualizar los datos de un gimnasio
    Ruta --> /api/gimnasios/update/:id 
    10.  Usuarios listados por cuota
    Ruta --> /api/gimnasios/:id/listarCuotas✅

- A nivel de cuotas (Fees)
    1. Crear.  Ruta--> /api/cuotas  (POST)✅
    2. Mostrar todos.  Ruta--> /api/cuotas   (GET)✅
    3. Mostrar 1 por id.   Ruta-->/api/cuotas/find/:id✅
    4. Actualizar cuota.  Ruta --> /api/cuotas/update/:id✅ 
    5. Eliminar cuota.  Ruta --> /api/cuotas/delete/:id✅ 

![ScreenShot](./GestorReservas.png)
 
