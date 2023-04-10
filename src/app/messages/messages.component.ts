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
  contacts: any[] = [];
  isUpdating: boolean = false;
  deletedd: boolean = false;
  isSuccess = false;
  showAllMessages = false;



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


  onDelete(contact: Contact) {
    const dialog = document.createElement('dialog');
  
    dialog.innerHTML = `
      <style>
        .dialog-container {
          background-color: #fff;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          padding: 20px;
          max-width: 400px;
          margin: 0 auto;
        }
  
        .form-group button {
          margin-right: 8px;
        }
        .btn-primary {
          background-color: #f44336;
          color: #fff;
          border: none;
          padding:auto;
        }
        .btn-primary:hover {
          background-color: #f44336;
          color: rgb(0, 0, 0);
          cursor: pointer;
          transition: 0.5s all ease;
        }
        .btn-secondary {
          background-color: #6c757d;
          color: #fff;
          border: none;
          padding:auto;
        }
        .btn-secondary:hover {
          background-color: #666666;
          color: #fff;
          border: none;
        }
      </style>
      <form class="form-group">
        <div class="dialog-container">
          <h3>Confirmation de suppression</h3>
          <p>Etes-vous sûr de vouloir supprimer ce message ?</p>
          <button type="button" class="btn btn-primary" id="confirmButton">Confirmer</button>
          <button type="button" class="btn btn-secondary" id="cancelButton">Annuler</button>
        </div>
      </form>
    `;
  
    const confirmButton = dialog.querySelector('#confirmButton')!;
    const cancelButton = dialog.querySelector('#cancelButton')!;
  
    confirmButton.addEventListener('click', () => {
      dialog.close();
      this.userService.supprimerMessage(contact.id).subscribe(() => {
        this.listerMes();
        this.deletedd = true;
        setTimeout(() => {
          this.deletedd = false;
        }, 2000);
      });
    });
  
    cancelButton.addEventListener('click', () => {
      dialog.close();
    });
  
    document.body.appendChild(dialog);
    dialog.showModal();
  }
  

  updateStatus(contact: Contact) {
    contact.status = true; // set the status to true
    this.userService.updatestatuts(contact.id).subscribe(
      contact => {
        console.log(contact);
        this.isSuccess = true;
        setTimeout(() => {
          this.isSuccess = false;
        }, 1900);
      },
      error => {
        console.error(error);
        contact.status = false; // reset the status to false on error
      }
    );
  }
  

  onLogout() {
    this.authService.logout();
  }


  

}
