import { Contact } from './../model/contact.model';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  contact = new Contact();
  contacts: Contact[] = [];
  deletedd: boolean = false;

  constructor(private userService: UserService , private authService: AuthService) { }

  ngOnInit(): void {
    this.listerMes();
    
  }

  listerMes() {
    this.userService.listerMessages().subscribe((contacts) => {
      this.contacts = contacts;
      console.log(contacts); // Store the response data in the contacts array
    }, (error) => {
      console.log(error); // Handle the error
    });
  } 




  onLogout() {
    this.authService.logout();
  }



  onDelete(contact: Contact) {
    let conf = confirm("Etes-vous sûr de vouloir supprimer ce message ?");
    if (conf) {
      this.userService.supprimerMessage(contact.id).subscribe(() => {
        this.listerMes();
        this.deletedd = true;
        setTimeout(() => {
          this.deletedd = false;
        }, 1700);
      });
    }
  }
  

  
  

}
