import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';


@Component({
  selector: 'register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService)
  private router = inject(Router);

  userForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.matchPassword });


  matchPassword(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    if (password && confirm && password !== confirm) {
      return { passwordsNotMatch: true }
    }
    return null;
  }

  onSubmit() {
    if (this.userForm.valid) {
      const { name, email, password } = this.userForm.getRawValue();
      this.authService.register({ name, email, password }).subscribe({
        next: (response) => {
          alert('נרשמת בהצלחה! כעת תועבר למסך ההתחברות');
          this.router.navigate(['/projects']);
        },
        error: (err) => {
          // if (err.status === 400 || err.status === 409) {
          //   this.errorMessage = "This email is already registered. Please try another or login.";
          // } else {
          //   this.errorMessage = "An unexpected error occurred. Please try again.";
          // }
        }
      });
    }
  }
}
