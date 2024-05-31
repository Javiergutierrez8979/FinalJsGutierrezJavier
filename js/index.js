
//Generacion de las tarjetas a partir del .json

let destinos = [];

function generarTarjetas() {
    fetch('destinos.json')
        .then(response => response.json())
        .then(data => {
            destinos = data; 
            const destinosContainer = document.getElementById("destinosContainer");

            data.forEach(function(destino) {
                const card = document.createElement("div");
                card.classList.add("card");

                const imagen = document.createElement("img");
                imagen.src = destino.imagen;
                imagen.alt = destino.nombre;
                imagen.style.width = "50%";

                const nombre = document.createElement("h2");
                nombre.textContent = destino.nombre;

                const descripcion = document.createElement("p");
                descripcion.textContent = destino.descripcion;

                const precio = document.createElement("p");
                precio.textContent = "Precio: " + destino.precio;

                card.appendChild(imagen);
                card.appendChild(nombre);
                card.appendChild(descripcion);
                card.appendChild(precio);

                destinosContainer.appendChild(card);
            });
        })
        .catch(error => console.error('Error al cargar los destinos:', error));
}

// Se obtiene lo que el usuario quiere del select.

function obtenerProductoSeleccionado() {
    const select = document.getElementById('deseo');
    const index = select.selectedIndex;
    return destinos[index];
}

// Funcion para agregar al carrito y guardarlo en el local Storage

function agregarAlCarrito() {
    const productoSeleccionado = obtenerProductoSeleccionado();
    if (productoSeleccionado) {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carrito.push(productoSeleccionado);
        console.log("Producto agregado al carrito:", productoSeleccionado); // solo para prueba funcional
        console.log("Carrito actual:", carrito); // solo para prueba funcional

        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarMensajeCarrito(productoSeleccionado.nombre);
    } else {
        alert("No se ha seleccionado ningún producto para agregar al carrito."); // En caso que se quiera finalizar el proceso sin seleccionar nada.
    }
}

function mostrarMensajeCarrito(nombreProducto) {
    const mensajeCarrito = document.getElementById("mensajeCarrito");
    mensajeCarrito.textContent = `Se agregó un pasaje a "${nombreProducto}" al carrito.`;
}

function borrarMensajeCarrito() {
    const mensajeCarrito = document.getElementById("mensajeCarrito");
    mensajeCarrito.textContent = "";
}

function borrarCarrito() {
    localStorage.removeItem("carrito");
    borrarMensajeCarrito();
    console.log('Carrito borrado');
}

function imprimirProductoEnTicket() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Atención',
            text: 'No hay productos en el carrito para confirmar la compra.',
        });
        return;
    }

    const usuario = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
    };

    try {
        if (!usuario.nombre) throw new Error('El nombre es obligatorio.');
        if (!usuario.apellido) throw new Error('El apellido es un campo obligatorio.');
        if (!usuario.telefono) throw new Error('El teléfono es un campo obligatorio.');
        if (!usuario.email) throw new Error('El email es un campo obligatorio.');
        if (!/\S+@\S+\.\S+/.test(usuario.email)) throw new Error('El email no es válido.');

        Swal.fire({
            icon: 'success',
            title: 'Felicidades',
            text: 'Revise su correo para confirmar fechas y horarios de su viaje.',
        }).then((result) => {
            if (result.isConfirmed) {
                const ticket = document.getElementById("ticket");
                ticket.innerHTML = ""; 

                carrito.forEach(function(producto) {
                    const ticketItem = document.createElement("div");
                    ticketItem.classList.add("ticket-item");
                    ticketItem.innerHTML = `
                        <h2>${producto.nombre}</h2>
                        <p>${producto.descripcion}</p>
                        <p>Precio: ${producto.precio}</p>
                    `;
                    ticket.appendChild(ticketItem);
                });

                borrarCarrito();
                document.getElementById('formUsuario').reset();
                borrarMensajeCarrito();
            }
        });

    } catch (error) {
        Swal.fire({
            icon: 'warning',
            title: 'Atención',
            text: error.message,
        });
    }
}

document.getElementById('btn').addEventListener("click", agregarAlCarrito);
document.getElementById('btnBorrar').addEventListener("click", borrarCarrito);
document.getElementById('btnConfirmar').addEventListener("click", imprimirProductoEnTicket);

window.addEventListener("load", generarTarjetas);