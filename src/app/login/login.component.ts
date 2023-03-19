import { AuthService } from './../services/auth.service';
import { UserService } from './../services/user.service';
import { UserGuard } from './../guard/user.guard';
import { ForgotPasswordComponent } from './../forgot-password/forgot-password.component';
import { Router } from '@angular/router';
import { User } from '../model/user.model';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from "@abacritt/angularx-social-login";
import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  user = new User();
  erreur = 0;
  users! : User[];
  err: boolean = false;
  email!:any;



 
  constructor(private authService: AuthService,
              private router: Router ,
              private userService: UserService,
              private http: HttpClient) {
              }

  ngOnInit(): void {}
              
 
  onLoggedin(): void {
  this.authService.login(this.user)
    .subscribe(
      (data) => {
        this.authService.saveToken(data.token);
        this.router.navigate(['/docs']);
      },
      error => {
        this.err = true;
        setTimeout(() => {
          this.err = false;
        }, 1900);
      }
    );
}



      public hidePassword = true;
      public togglePassword(): void {
      this.hidePassword = !this.hidePassword;
        }
    

       

       
       
      
}
