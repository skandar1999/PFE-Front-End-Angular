import { UserService } from './../services/user.service';
import { Contact } from '../model/contact.model';

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contact: Contact = new Contact();
  formSubmitted = false;
  errorEmail: string = '';
  long: boolean = false;
  messageConfirmation: string = '';
    vide: boolean = false;

  constructor(public authService: AuthService ,public  userService: UserService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (!this.contact.emailUser || !this.contact.description ) {
      this.vide = true;
      setTimeout(() => {
        this.vide = false;
      }, 2000); // Delay for hiding the alert
      return;
    } 
    if (!this.contact.emailUser.includes('@')  || !this.contact.emailUser.includes('.')) {
      this.errorEmail = 'email non valide';
      setTimeout(() => {
        this.errorEmail = '';
      }, 3000); // hide error message after 3 seconds
      return;
    }
    if (this.contact.description.length > 200) {
      this.long = true;
      setTimeout(() => {
        this.long = false;
      }, 4500); // Delay for hiding the alert
      return;
    }
    

    if (!this.contact.description || !this.contact.emailUser) {
      this.formSubmitted = true;
      setTimeout(() => {
        this.formSubmitted = false;
      }, 2000); // set the delay time in milliseconds
      return;
    }
    this.userService.contact(this.contact).subscribe(
      response => {
        console.log(response);
        this.messageConfirmation = response.message;
    
        // Set a timeout of 5 seconds for the confirmation message
        setTimeout(() => {
          this.messageConfirmation = '';
        }, 2200);
      },
      error => {
        console.log(error);
        // Handle any errors that occur here
      }
    );
  }
  


  onLogout() {
    this.authService.logout();
  }

}
