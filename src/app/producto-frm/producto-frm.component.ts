import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {  ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductoService } from '../Services/producto.service';
import { CategoriaService } from '../Services/categoria.service';
import { Categoria } from '../Models/Categoria';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-producto-frm',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,CommonModule],
  templateUrl: './producto-frm.component.html',
  styleUrl: './producto-frm.component.css'
})
export class ProductoFrmComponent   {
  private fb= inject(FormBuilder);
  private router=inject(Router);
  private route=inject(ActivatedRoute)
  private ProductoService=inject(ProductoService);
  private categoriaService=inject(CategoriaService);
  categoria:Categoria[]=[];
  form:FormGroup;
  errorMessage: string = '';



constructor(){  this.form = this.fb.group({
  nombre: ['', [Validators.required]],
  descripcion: ['', [Validators.required]],
  stock: ['', [Validators.required]],
  precio: ['', [Validators.required]],
  categoria: ['', [Validators.required]], 
  imagen: [''] // Nuevo campo para la imagen

}); }

  imagenBase64: string | null = null;


    ngOnInit(): void {
      this.cargarCategorias();
    }
    cargarCategorias(){
      this.categoriaService.listarcategorias().
      subscribe((categoria )=>{
        this.categoria=categoria
        console.log(this.categoria=categoria)
      });

    }


    onFileSelected(event: Event) {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        this.convertToBase64(file);
      }
    }
  
    convertToBase64(file: File) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenBase64 = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
    create() {
      if (this.form.valid) {
        const formValue = this.form.value;
        const producto = {
          nombre: formValue.nombre,
          descripcion: formValue.descripcion,
          stock: Number(formValue.stock),
          precio: Number(formValue.precio),
          categoriaModel: { id: Number(formValue.categoria) },
          imagen: this.imagenBase64
        };
        
        this.ProductoService.save(producto).subscribe({
          next: () => {
            this.router.navigate(['/lista']);
          },
          error: (error) => {
            console.error('Error al guardar el producto', error);
            this.errorMessage = 'Hubo un error al guardar el producto. Por favor, intente de nuevo.';
          }
        });
      } else {
        this.validateAllFormFields(this.form);
        this.errorMessage = 'Por favor, corrija los errores en el formulario antes de enviar.';
      }
    }

    validateAllFormFields(formGroup: FormGroup) {
      Object.keys(formGroup.controls).forEach(field => {
        const control = formGroup.get(field);
        if (control instanceof FormGroup) {
          this.validateAllFormFields(control);
        } else {
          control?.markAsTouched({ onlySelf: true });
        }
      });
    }
  
    getErrorMessage(field: string): string {
      const control = this.form.get(field);
      if (control?.hasError('required')) {
        return `El campo ${field} es requerido`;
      }
      return '';
    }
  
    isFieldInvalid(field: string): boolean {
      const control = this.form.get(field);
      return !!(control && control.invalid && (control.dirty || control.touched));
    }

}
