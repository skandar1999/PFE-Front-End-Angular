import { Dossier } from './../model/dossier';
import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../model/user.model';
import { UserService } from '../services/user.service';
import { FileServiceService } from '../services/file-service.service';
import { File } from './../model/file';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css'],
})


export class DocsComponent implements OnInit {

  file!: File;

  id!:number;
  user!: User;
  curentUser:any;
  userData: any;
  token!:any;
  username!: string;
  email:any;
  deletedd: boolean = false;
  name!:string;
  allfiles! :any[];
  notificationsEnabled: boolean = true;
  selectedFile: File | null = null;

  files!: any[];
  Dossier!: any[];

  folders: any[] = [];
  allfolders! :any[];
  newFileName!: string;
  updateSuccess: boolean = false;

  new_name!: string;

  
  
  constructor(
    public authService: AuthService,
    public userService: UserService,
    public fileService: FileServiceService,
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
   
  
  ) {} 
  ngOnInit(): void { 
    this.token =window.localStorage.getItem('jwt')
    this.curentUser= jwt_decode(this.token);
    //console.log(jwt_decode(token))
    this.findUserById();
    this.getFiles()
    this.getFolders()
    
  }


  downloadFile(id: number, name: string): void {
    this.fileService.downloadFile(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }



  getDecodedAccessToken(token: string): any {
    try {
      this.curentUser= jwt_decode(token);
    } catch(Error) {
      return null;
    }
  }
  

  findUserById(){
    this.userService.rechercherParEmail(this.curentUser?.email).subscribe(us => {
      console.log(us);
      if (us) {
        this.userData = us;
        this.id=this.userData.id; } });
  } 

 
  onLogout() {
    this.authService.logout();}     


    onFileSelected(event: any) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('files', file);
    
      this.fileService.uploadFile(formData, this.curentUser?.email).subscribe(
        (response) => {
          console.log('File uploaded successfully');
          this.selectedFile = file; // Set the selected file in the component property
        },
        (error) => {
          console.log('Error uploading file');
        }
      );
    }

    getFiles() {
      this.fileService.getUserFiles(this.curentUser?.email).subscribe(
        files => {
          console.log(files);
          this.allfiles = files
            .filter((file:any) => file.status === true) // filter files with status === true
            .map((file:any) => {
              return {
                id: file.id,
                name: file.name,
                date: file.date,
                url: 'http://localhost:8000/files/' + file.name
              };
            });
          this.files = this.allfiles;
        },
        error => {
          console.error(error);
        }
      );
    }
    

  getFolders() {
    this.fileService.getUserFolders(this.curentUser?.email).subscribe(
      folders => {
        console.log(folders);
        this.allfolders = folders.map((folder:any) => {
          return {
            id: folder.id,
            namefolder: folder.name, // Update the field name here
            date: folder.date, // Update the field name here
            url: 'http://localhost:8000/folders/' + folder.id // Update the URL here
          };
        });
        this.folders = this.allfolders;
      },
      error => {
        console.error(error);
      }
    );
  }

  createNewFolder() {
    const formData = new FormData();
    formData.append('user_id', '1'); // Replace with the ID of the user
    formData.append('namedossier', 'Nouveau dossier');
    formData.append('datedossier', new Date().toISOString().slice(0, 10)); // Use today's date as the default date
    this.fileService.createFolder(formData, this.curentUser?.email).subscribe(
      (response) => {
        console.log(response);
      },
      error => {
        console.log(error);
      }
    );
  }


  onFolderSelected(folder: any) {
    // Navigate to the contents of the selected folder
    this.router.navigate(['/folders', folder.id]);
  }



  
  onKeyUp(filterText : string){
    this.files = this.allfiles.filter(item =>
      item.name.toLowerCase().includes(filterText)
    );
  }

  
  onArchive(file: File) {
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
  
        .dialog-container h2 {
          margin-top: 0;
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
      <div class="dialog-container">
        <h2>Archiver</h2>
        <p>Etes-vous sûr de vouloir archiver ce document ?</p>
        <button class="btn btn-primary" id="confirmButton">Confirmer</button>
        <button class="btn btn-secondary" id="cancelButton">Annuler</button>
      </div>
    `;
  
    const confirmButton = dialog.querySelector('#confirmButton')!;
    confirmButton.addEventListener('click', () => {
      dialog.close();
      if (file.id) {
        this.fileService.archiveFile(file.id, this.curentUser?.email).subscribe(() => {
          this.getFiles();
          this.deletedd = true;
          setTimeout(() => {
            this.deletedd = false;
          }, 1700);
        });
      }
    });
  
    const cancelButton = dialog.querySelector('#cancelButton')!;
    cancelButton.addEventListener('click', () => {
      dialog.close();
    });
  
    document.body.appendChild(dialog);
    dialog.showModal();
  }
  
 

  onDeletefolder(dossier: Dossier, event: Event) {
    event.stopPropagation(); // Add this line to prevent the link from opening
    let conf = confirm("Etes-vous sûr de vouloir supprimer ce dossier ?");
    if (conf && dossier.id) {
      this.fileService.supprimerFolder(dossier.id).subscribe(() => {
        this.getFolders();
        this.deletedd = true;
        setTimeout(() => {
          this.deletedd = false;
        }, 1700);
      });
    }
  }
  




rechercherParFile() {
  this.fileService.rechercherParName(this.name).subscribe(
    files => {
      this.files = files.map((file: any) => {
        return {
          id: file.id,
          name: file.name,
          date: file.date,
          url: 'http://localhost:8000/files/' + file.name
        };
      });
    },
    error => {
      console.error(error);
    }
  );

  }


  toggleNotifications() {
    this.notificationsEnabled = !this.notificationsEnabled;
  }

  
  



  showRenameDialog(id: number) {
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
  
        .form-group input {
          width: 100%;
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #ccc;
          margin-bottom: 16px;
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
          <h2>Renomer</h2>
          <input autocomplete="off" type="text" id="newFileNameInput" name="name" class="form-control" placeholder="Nouveau nom de fichier">
          <br>
          <button type="submit" class="btn btn-primary" id="renameButton">Confirmer</button>
          <button type="button" class="btn btn-secondary" id="cancelButton">Annuler</button>
        </div>
      </form>
    `;
  
    const confirmButton = dialog.querySelector('#renameButton')!;
    confirmButton.addEventListener('click', () => {
      dialog.close();
      const newFileNameInput = dialog.querySelector<HTMLInputElement>('#newFileNameInput')!;
      const fileToUpdate = this.files.find(file => file.id === id);
        const newName = (document.getElementById('newFileNameInput') as HTMLInputElement).value;
      const updatedFile = new File([fileToUpdate], newName, { type: fileToUpdate.type });
      this.fileService.renameFile(id, updatedFile).subscribe(
    update => {
        console.log(update);
        this.updateSuccess = true;
        setTimeout(() => {
            this.updateSuccess = false;
        }, 2500); // Delay for hiding the alert
    },
    error => {
        // Handle error
    }
);
    });
    
    const cancelButton = dialog.querySelector('#cancelButton')!;
    cancelButton.addEventListener('click', () => {
      dialog.close();
    });
    
    document.body.appendChild(dialog);
    dialog.showModal();
  }
  
 
  renameFolder(id: number) {
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
  
        .form-group input {
          width: 100%;
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #ccc;
          margin-bottom: 16px;
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
          <h2>Renomer Dossier</h2>
          <input autocomplete="off" type="text" id="newFileNameInput" name="name" class="form-control" placeholder="Nouveau nom de dossier">
          <br>
          <button type="button" class="btn btn-primary" id="renameButton">Confirmer</button>
          <button type="button" class="btn btn-secondary" id="cancelButton">Annuler</button>
        </div>
      </form>
    `;
  
    const confirmButton = dialog.querySelector('#renameButton')!;
    confirmButton.addEventListener('click', () => {
      const newFileNameInput = dialog.querySelector<HTMLInputElement>('#newFileNameInput')!;
      const newName = newFileNameInput.value;
      const updateFolder = { name: newName };
      this.fileService.renameDossier(id, updateFolder).subscribe(
        update => {
          console.log(update);
          this.updateSuccess = true;
          setTimeout(() => {
            this.updateSuccess = false;
          }, 2500); // Delay for hiding the alert
        },
        error => {
          // Handle error
        }
      );
      dialog.close();
    });
  
    const cancelButton = dialog.querySelector('#cancelButton')!;
    cancelButton.addEventListener('click', () => {
      dialog.close();
    });
  
    document.body.appendChild(dialog);
    dialog.showModal();
  }
  

  



    }
  
  
  
  





 
  



















    
  
 







