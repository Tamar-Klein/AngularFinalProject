// import { Component, inject } from '@angular/core';
// import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { AuthService } from '../../services/auth-service';
// import { Router, RouterLink } from '@angular/router';

// @Component({
//   selector: 'login',
//   imports: [ReactiveFormsModule, RouterLink],
//   templateUrl: './login.html',
//   styleUrl: './login.css',
// })
// export class Login {
// private fb = inject(FormBuilder);
//   private authService = inject(AuthService);
//   private router = inject(Router);

//   loginForm = this.fb.nonNullable.group({
//     email: ['', [Validators.required]],
//     password: ['', [Validators.required]],
//   });

//    errorMsg :string='';


//   onSubmit() {
//     if (this.loginForm.valid) {
//      this.authService.login(this.loginForm.getRawValue()).subscribe({

//         next: (response) => {
//           alert(`You connected successfully ${response.user.name}`);
//             this.router.navigate(['/projects']);
//         },
//         error: (err) => {
//         this.errorMsg = err.error?.message || 'There was an error during login.';
//         alert('Error during login: ' + this.errorMsg);
//         }
//       });

//   }

// }
// }


import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  errorMsg: string = '';
  isLoading = false;
  hidePassword = true;

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMsg = '';

      this.authService.login(this.loginForm.getRawValue()).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open(
            `🎉 Welcome back, ${response.user.name}!`,
            'Close',
            {
              duration: 4000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            }
          );
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMsg = err.error?.message || 'The email or password is incorrect. Please try again.';
          this.snackBar.open(
            `❌ ${this.errorMsg}`,
            'Close',
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            }
          );
        }
      });
    }
  }

  getEmailErrorMessage() {
    const emailControl = this.loginForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'Email is required';
    }
    if (emailControl?.hasError('email')) {
      return 'Please enter a valid email';
    }
    return '';
  }

  getPasswordErrorMessage() {
    const passwordControl = this.loginForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'Password is required';
    }
    if (passwordControl?.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    }
    return '';
  }
}

