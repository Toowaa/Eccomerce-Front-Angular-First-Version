import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { UsuarioService } from '../Services/usuario.service';
import { ProductoService } from '../Services/producto.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {MatNativeDateModule, provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatInputModule} from '@angular/material/input';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-pago',
  standalone: true,
  providers: [provideNativeDateAdapter(),DatePipe],
  imports: [MatRadioModule,
    MatDatepickerModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,MatIconModule,MatButtonModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatIconModule,
    NgIf,
    RouterLink],
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.css'
})
export class PagoComponent implements OnInit{
    private usuarioService=inject(UsuarioService);
    private productoService= inject(ProductoService);
    private fb=inject(FormBuilder);
    productoDetails: any = [];
    isGeneratingPDF: boolean = false;

    formulario!: FormGroup;


    data:any []=[];
    isLoggedIn: boolean = false;
    userId: number | null = null;
    username: string | null = null;
    direccion:string |null =  null;
    constructor(private authService: AuthService , private http: HttpClient,
      private datePipe: DatePipe) {}

   
      
 
    ngOnInit() {
      this.formulario = this.fb.group({
        tipoEntrega: [''],
        fechaEnvio: ['']
      });
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      if (this.isLoggedIn) {
        this.direccion=this.authService.getdireccion();
        this.userId = this.authService.getUserId();
        this.username = this.authService.getUsername();

        console.log('ID del usuario:', this.userId);
        console.log('Nombre de usuario:', this.username);
        console.log('Direccion de usuario:', this.direccion);
      } else {
        console.log('No hay usuario logueado');
      }
    });

    this.carrit();
    }


    myFilter = (d: Date | null): boolean => {
      const today = new Date();
      // Allow dates that are greater than or equal to tomorrow
      return d !== null && d > today;
    };
  

    onSubmit() {
      if (this.formulario.valid && this.userId) {
        const tipoEntrega = this.formulario.get('tipoEntrega')?.value;
        const fechaEnvio = this.formulario.get('fechaEnvio')?.value;
        
        const formattedDate = this.datePipe.transform(fechaEnvio, 'dd-MM-yyyy');
        const url = `http://127.0.0.1:8080/registro/${this.userId}/${tipoEntrega}/${formattedDate}`;
        
        this.isGeneratingPDF = true;
    
        // Primero, actualizamos el stock de todos los productos en el carrito
        const stockUpdatePromises = this.data.map(item => 
          new Promise<void>((resolve) => {
            this.actualizarstock(item.idProducto, item.cantidad);
            resolve();
          })
        );

        
    
        // Esperamos a que todas las actualizaciones de stock se completen
        Promise.all(stockUpdatePromises).then(() => {
          // Ahora procedemos con la creación del registro y generación del PDF
          this.http.post(url, {}).subscribe(
            (response: any) => {
              console.log('Registro creado exitosamente', response);
              this.generarPDF(response);
              
              if (this.userId) {
                this.usuarioService.borrarCarrito(this.userId).subscribe({
                  next: (response) => {
                    console.log(response.mensaje);
                    this.data = [];
                    this.carrit();
                  },
                  error: (error) => {
                    console.error('Error al borrar el carrito', error);
                    if (error.error && error.error.error) {
                      console.log(error.error.error);
                      this.data = [];
                      this.carrit();
                    }
                  }
                });
              } else {
                console.log('Usuario no identificado. No se puede borrar el carrito.');
              }
            },
            (error) => {
              console.error('Error al crear el registro', error);
              this.isGeneratingPDF = false;
            }
          );
        });
      } else {
        console.log('Formulario inválido o usuario no identificado');
      }
    }
    carrit() {
      console.log('Método carrit() llamado');
      if (this.userId !== null) {
        this.usuarioService.carritocompras(this.userId).subscribe(
          (data: any) => {
           // console.log('Respuesta completa del carrito:', data);
            if (Array.isArray(data) && data.length > 0) {
              this.data = data;
             console.log('Carrito de compras actualizado:', this.data);
              this.data.forEach((item: any) => {
                console.log(`Obteniendo detalles para el producto ${item.idProducto}`);
                this.getProductDetails(item.idProducto);
              });
            } else {
              console.log('El carrito está vacío o la respuesta no es un array');
            }
          },
          (error) => {
            console.error('Error al obtener el carrito de compras:', error);
          }
        );
      } else {
        console.log('No se puede obtener el carrito de compras: Usuario no identificado');
      }
    }
    getProductDetails(id: number) {
      //console.log(`Intentando obtener detalles para el producto con id: ${id}`);
      this.productoService.getproductoid(id).subscribe(
        (details: any) => {
        //  console.log(`Respuesta completa para el producto ${id}:`, details);
          if (details === null || details === undefined) {
            console.error(`No se recibieron datos para el producto ${id}`);
          } else {
            this.productoDetails[id] = details;
           // console.log(`Detalles almacenados para el producto ${id}:`, this.productoDetails[id]);
          }
        },
        (error) => {
          console.error(`Error al obtener detalles del producto ${id}:`, error);
        }
      );
    }

    logout() {
      this.authService.logout();
      window.location.reload();
    }
    actualizarstock(productoId: number, cantidadVendida: number) {
      // Asegurarse de que stockActual sea un número
      const stockActual = Number(this.productoDetails[productoId]?.stock) || 0;
      
      // Calcular el nuevo stock y asegurarse de que sea un entero no negativo
      const nuevoStock = Math.max(Math.floor(stockActual - cantidadVendida), 0);
    
      console.log(`Actualizando stock para producto ${productoId}. Stock actual: ${stockActual}, Cantidad vendida: ${cantidadVendida}, Nuevo stock: ${nuevoStock}`);
    
      // Crear el objeto de datos para enviar al servidor
      const datosActualizacion = { stock: nuevoStock };
    
      this.productoService.actualizarstock(productoId, datosActualizacion).subscribe({
        next: (respuesta) => {
          console.log(`Stock actualizado para el producto ${productoId}. Nuevo stock: ${nuevoStock}`);
          // Actualizamos el stock en nuestro objeto local
          if (this.productoDetails[productoId]) {
            this.productoDetails[productoId].stock = nuevoStock;
          }
        },
        error: (error) => {
          console.error(`Error al actualizar el stock del producto ${productoId}:`, error);
          if (error.error && error.error.message) {
            console.error('Mensaje de error del servidor:', error.error.message);
          }
          // Aquí puedes añadir lógica adicional para manejar el error, como mostrar un mensaje al usuario
        }
      });
    }
    generarPDF(datos: any) {
      const doc = new jsPDF();
  
      // Añadir un logo (asumiendo que tienes una imagen base64)
      // const logoData = 'TU_LOGO_EN_BASE64';
      const logoData='data:image/jpeg;base64,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 '
      doc.addImage(logoData, 'PNG', 14, 10, 50, 25);
  
      // Configurar fuentes
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(255, 91, 143);  
      doc.text('Boleta de Registro', 75, 30);


  
      // Información del registro
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);  // Negro

      
      doc.text("Razón Social: Tienda de regalos personalizados Marcela Naveda E.I.R.L.", 14, 50);
      doc.text("RUC: 20606455471", 14, 58);
      doc.text("Tipo Empresa: Empresa Individual de Responsabilidad Limitada", 14, 66);
      doc.text("Dirección Legal: Av. Allamanda Nro. 122- Santiago de Surco Lima - Peru", 14, 74);
      doc.text("Teléfono: 986 370 573", 14, 82);
      doc.text(`ID de Registro: ${datos.id}`, 14, 90);
      doc.text(`Cliente: ${this.username}`, 18, 102);
      doc.text(`Dni del cliente: ${this.userId}`, 18, 110);
      doc.text(`Tipo de Entrega: ${datos.tipoentrega}`, 18, 118);
      doc.text(`Fecha de Envío: ${datos.fecha}`, 18, 126);
      
      doc.setDrawColor(255, 91, 143);  // Color de la línea
      doc.setLineWidth(0.5);            // Grosor de la línea
      
      // Dibujar la línea
      doc.line(14, 96, 196, 96);        
      


      doc.setDrawColor(255, 91, 143);  // Azul
      doc.setLineWidth(0.5);
      doc.line(14, 40, 196, 40);
      // Tabla de productos
      const tableColumn = ["Producto", "Cantidad", "Precio Unitario", "Total"];
      const tableRows: any[] = [];
  
      datos.items.forEach((item: any) => {
        const productoInfo = this.productoDetails[item.producto.id];
        const totalItem = productoInfo.precio * item.cantidad;
        tableRows.push([
          productoInfo.nombre,
          item.cantidad,
          `$${productoInfo.precio.toFixed(2)}`,
          `$${totalItem.toFixed(2)}`
        ]);
      });
  
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 140,
        theme: 'striped',
        headStyles: {
          fillColor: [255, 91, 143],
          textColor: 255
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 30, halign: 'center' },
          2: { cellWidth: 40, halign: 'right' },
          3: { cellWidth: 40, halign: 'right' }
        },
      });
  
      // Calcular y añadir el total
      const total = datos.items.reduce((acc: number, item: any) => {
        const productoInfo = this.productoDetails[item.producto.id];
        return acc + (productoInfo.precio * item.cantidad);
      }, 0);
  
      const finalY = (doc as any).lastAutoTable.finalY || 80;
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`Total: $${total.toFixed(2)}`, 150, finalY + 10);
  
      // Añadir pie de página
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);  // Gris
      doc.text('Gracias por su compra', 14, 280);
  
      // Añadir número de página
      const pageCount = (doc as any).internal.pages.length - 1;
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`Página ${i} de ${pageCount}`, 196, 285, { align: 'right' });
      }
  
      // Generar el PDF y abrirlo en una nueva pestaña
      const pdfOutput = doc.output('datauristring');
      window.open(pdfOutput);
      this.isGeneratingPDF = false;
    }
}
