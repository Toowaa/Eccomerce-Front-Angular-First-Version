import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../Services/usuario.service';
import { MatCardModule } from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import {MatDividerModule} from '@angular/material/divider';
import { DireccionService } from '../Services/direccion.service';
import { switchMap, of } from 'rxjs';
import {MatButtonModule} from '@angular/material/button';

import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-registra',
  standalone: true,
  imports: [MatCardModule,MatRadioModule,RouterLink,MatButtonModule,MatDividerModule,MatIconButton,ReactiveFormsModule,CommonModule],
  templateUrl: './registra.component.html',
  styleUrl: './registra.component.css'
})
export class RegistraComponent implements OnInit {
  dniError: string = '';
  usuarioError: string = '';


  usuario:[]=[];
  private fb=inject(FormBuilder);
  private usuarioService=inject(UsuarioService);
  private router=inject(Router);
  private direccionservice=inject(DireccionService);

  
  form = this.fb.group({
    nombre:['',[Validators.required]],
    apellido:['',[Validators.required]],
    dni:['',[Validators.required]],
    usuario:['',[Validators.required]],
    contraseña:['',[Validators.required]],
    telefono:['',[Validators.required]],
    calle:['',[Validators.required]],
    numeroExterior:['',[Validators.required]],
    ciudad:['',[Validators.required]],
    tipoDireccion:['',[Validators.required]],
    codigoPostal:['',[Validators.required]]



  }); 
  
 
  ngOnInit() {
    this.form.get('dni')?.valueChanges.subscribe(() => {
      this.dniError = '';
    });
  
    this.form.get('usuario')?.valueChanges.subscribe(() => {
      this.usuarioError = '';
    });
  }

  
   create(){
    const formvalue=this.form.value;
  if (!formvalue.dni || !formvalue.usuario || !formvalue.nombre || !formvalue.apellido || 
    !formvalue.contraseña || !formvalue.telefono || !formvalue.calle || 
    !formvalue.numeroExterior || !formvalue.ciudad || !formvalue.codigoPostal || 
    !formvalue.tipoDireccion) {
  alert("Por favor, complete todos los campos del formulario");
  return;
  }
    const direccion = {
      id: Number(formvalue.dni),
      calle: formvalue.calle,
      numero_exterior: formvalue.numeroExterior,
      ciudad: formvalue.ciudad,
      codigopostal: formvalue.codigoPostal,
      tipodireccion: formvalue.tipoDireccion
    };

    const usuario={
      nombre: formvalue.nombre,
      usuario:formvalue.usuario,
      contraseña:formvalue.contraseña,
      apellido:formvalue.apellido,
      dni: Number(formvalue.dni),
      telefono:Number(formvalue.telefono),
      direccion:{id:formvalue.dni
      }
    }
    this.usuarioService.dni(usuario.dni).pipe(
      switchMap(dniExiste => {
        if (dniExiste) {
          this.dniError="El DNI ya existe";
          console.log("DNI");
          return of(null);
        }
        return this.usuarioService.usuario(usuario.usuario).pipe(
          switchMap(usuarioExiste => {
            if (usuarioExiste) {
              this.usuarioError="El usuario ya existe";
              console.log("usuario");
              return of(null);
            }
            return this.direccionservice.save(direccion).pipe(
              switchMap(() => this.usuarioService.save(usuario))
            );
          })
        );
      })
    ).subscribe({
      next: (result) => {
        if (result) {
          this.router.navigate(['/login']);
          alert("Usuario creado con éxito");
        }
      },
      error: (error) => {
        console.error('Error al crear usuario o dirección', error);
      }
    });
  }
}
