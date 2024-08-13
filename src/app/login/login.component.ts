import { Component, inject } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Router, RouterLink, RouterModule } from "@angular/router";
import { UsuarioService } from "../Services/usuario.service";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "../auth/auth.service";
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private authService = inject(AuthService);

  form: FormGroup;
  errorMessage: string = '';

  constructor() {
    this.form = this.fb.group({
      usuario: ['', [Validators.required]],
      contraseña: ['', [Validators.required]]
    });
  }

 
  login() {
    if (this.form.valid) {
      const { usuario, contraseña } = this.form.value;
      this.usuarioService.login(usuario!, contraseña!).subscribe(
        () => {
          // El usuario ya se guardó en el AuthService
          this.router.navigate(['/home']);
        },
        (error) => {
          this.errorMessage = 'Usuario o contraseña incorrectos';
        }
      );
    } else {
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
