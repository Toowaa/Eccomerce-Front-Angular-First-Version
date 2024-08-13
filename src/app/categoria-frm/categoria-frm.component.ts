import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoriaService } from '../Services/categoria.service';
import { Categoria } from '../Models/Categoria';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categoria-frm',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule,CommonModule],
  templateUrl: './categoria-frm.component.html',
  styleUrl: './categoria-frm.component.css'
})
export class CategoriaFrmComponent implements OnInit{
    private fb=inject(FormBuilder);
    private router=inject(Router);
    private route=inject(ActivatedRoute)
    private categoriaService=inject(CategoriaService);

    categoria?:Categoria;

    form: FormGroup;
    errorMessage: string = '';
  
      constructor(){  
     this.form = this.fb.group({
  nombre: ['', [Validators.required]],
  categoria: ['', [Validators.required]]
});
      
      }
 
ngOnInit(): void {
    const id=this.route.snapshot.paramMap.get('id');
    if(id){
      this.categoriaService.get(parseInt(id)).
      subscribe(categoria =>{
        this.categoria=categoria;
        this.form =this.fb.group({
          nombre:[categoria.nombre,[Validators.required]],
          categoria:[categoria.categoria,[Validators.required]]


        })
      })
    }else{
      this.form= this.fb.group({
        nombre:['',[Validators.required]],
        categoria:['',[Validators.required]]
      })
  
    }
    
} 

  
    create() {
      if (this.form.valid) {
        const categoriaForm = this.form.value;

        if (this.categoria) {
          // Actualizar categoría existente
          this.categoriaService.update(categoriaForm, this.categoria.id).subscribe({
            next: () => {
              console.log("Categoría actualizada");
              this.router.navigate(['/categoria']);
            },
            error: (error) => {
              console.error("Error al actualizar la categoría", error);
              this.errorMessage = "Hubo un error al actualizar la categoría. Por favor, intente de nuevo.";
            }
          });
        } else {
          // Crear nueva categoría
          this.categoriaService.save(categoriaForm).subscribe({
            next: () => {
              console.log("Nueva categoría creada");
              this.router.navigate(['/categoria']);
            },
            error: (error) => {
              console.error("Error al crear la categoría", error);
              this.errorMessage = "Hubo un error al crear la categoría. Por favor, intente de nuevo.";
            }
          });
        }
      } else {
        // El formulario no es válido, mostrar errores
        this.validateAllFormFields(this.form);
        
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
