import { Dossier } from './../model/dossier';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../model/user.model';
import { UserService } from '../services/user.service';
import { FileServiceService } from '../services/file-service.service';
import { File } from './../model/file';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {
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
  folders: any[] = [];
  allfolders! :any[];

  dossierId!: number;

  err: boolean = false;
  err2: boolean = false;



  
  constructor(
    public authService: AuthService,
    public userService: UserService,
    public fileService: FileServiceService,
    private http: HttpClient,
    private router: Router
  
  ) {} 
  ngOnInit(): void { 
    this.token =window.localStorage.getItem('jwt')
    this.curentUser= jwt_decode(this.token);
    //console.log(jwt_decode(token))
    this.findUserById();
    this.getFiles()
    this.getFolders()
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
        this.id=this.userData.id;
       
      }
    });

  } 

 
  onLogout() {
    this.authService.logout();}     

      
   

    getFiles() {
      this.fileService.getUserFilesArchive(this.curentUser?.email).subscribe(
        files => {
          console.log(files);
          this.allfiles = files
            .filter((file:any) => file.status === false) // filter files with status === true
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
          this.allfolders = folders
          .filter((folder:any) => folder.status === false) // filter files with status === true
          .map((folder:any) => {
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

 


  onFolderSelected(folder: any) {
    // Navigate to the contents of the selected folder
    this.router.navigate(['/folders', folder.id]);
  }



  
  onKeyUp(filterText : string){
    this.files = this.allfiles.filter(item =>
      item.name.toLowerCase().includes(filterText)
    );
  }



  onDelete(file: File, event: Event) {
    event.stopPropagation();
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
          <p>Êtes-vous sûr de vouloir supprimer ce document ?</p>
          <br>
          <button type="button" class="btn btn-primary" id="confirmButton">Confirmer</button>
          <button type="button" class="btn btn-secondary" id="cancelButton">Annuler</button>
        </div>
      </form>
    `;
  
    const confirmButton = dialog.querySelector('#confirmButton')!;
    confirmButton.addEventListener('click', () => {
      dialog.close();
      if (file.id) {
        this.fileService.supprimerFilefromarchive(file.id).subscribe(() => {
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





  onRestaure(file: File) {
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
      <h2>Restaurer file</h2>
      <p>Etes-vous sûr de vouloir restaurer ce document ?</p>
      <button class="btn btn-primary" id="confirmButton">Confirmer</button>
      <button class="btn btn-secondary" id="cancelButton">Annuler</button>
    </div>
  `;

  const confirmButton = dialog.querySelector('#confirmButton')!;
  confirmButton.addEventListener('click', () => {
    dialog.close();
     if (file.id) {

      this.fileService.restaurerFile(file.id, this.curentUser?.email).subscribe(
        (response) => {

          if (response.message === 'File name already exists') {
            console.error('Error: File name already exists');
            this.err = true;
            setTimeout(() => {
              this.err = false;
            }, 7000); 

          } 
          else {
            this.reloadPage(); // reload the page

          }
        },
        (error) => {
          // Handle error
          console.log(error);
        }
      );
    }
  });

  const cancelButton = dialog.querySelector('#cancelButton')!;
  cancelButton.addEventListener('click', () => {
    dialog.close();
  });

  document.body.appendChild(dialog);
  dialog.showModal();
}



reloadPage() {
  const currentUrl = this.router.url;
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([currentUrl]);
  });
}


onRestauredossier(event: Event, folder: Dossier) {
  event.stopPropagation();
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
    <h2>Restaurer file</h2>
    <p>Etes-vous sûr de vouloir restaurer ce dossier ?</p>
    <button class="btn btn-primary" id="confirmButton">Confirmer</button>
    <button class="btn btn-secondary" id="cancelButton">Annuler</button>
  </div>
`;

  const confirmButton = dialog.querySelector('#confirmButton')!;
  confirmButton.addEventListener('click', () => {
    dialog.close();
    if (folder.id) {
      this.fileService.restaurerDossier(folder.id, this.curentUser?.email).subscribe(
        (response) => {
          if (response.message === 'Folder name already exists') {
            console.error('Error: Folder name already exists');
            this.err2 = true;
            setTimeout(() => {
              this.err2 = false;
            }, 7000); 
          } else {
            this.reloadPage(); // reload the page
          }
        },
        (error) => {
          // Handle error
          console.log(error);
        }
      );
    }
  });

  const cancelButton = dialog.querySelector('#cancelButton')!;
  cancelButton.addEventListener('click', () => {
    dialog.close();
  });

  document.body.appendChild(dialog);
  dialog.showModal();
}





 showRenameDialog(id: number) {
    const dialog = document.createElement('dialog');
  
    dialog.innerHTML = `
    <style>
    .dialog-container {
      background-color: #f5f5f5;
      border: none;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      padding: 20px;
      max-width: 500px;
      margin: 0 auto;
      font-family: Arial, sans-serif;
      color: #333;
    }
  
    .dialog-container h2 {
      margin-top: 0;
      font-size: 20px;
      color: #222;
    }
  
    .dialog-container input[type="text"] {
      width: 100%;
      padding: 12px;
      margin-bottom: 20px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
      font-size: 16px;
      outline: none;
    }
  
    .dialog-container button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.3s ease;
      outline: none;
    }
  
    .dialog-container .btn-primary {
      background-color: #f44336;
      color: #fff;
      margin-right: 8px;
    }
  
    .dialog-container .btn-primary:hover {
      background-color: #d32f2f;
    }
  
    .dialog-container .btn-secondary {
      background-color: #6c757d;
      color: #fff;
    }
  
    .dialog-container .btn-secondary:hover {
      background-color: #555;
    }
  </style>
      <form class="form-group">
        <div class="dialog-container">
          <h2>Renommer</h2>
          <input autocomplete="off" type="text" id="newFileNameInput" name="name" class="form-control" placeholder="Nouveau nom de fichier">
          <br>
          <button type="button" class="btn btn-secondary" id="cancelButton">Annuler</button>
          <button type="button" class="btn btn-primary" id="renameButton">Confirmer</button>

        </div>
      </form>
    `;
  
    const confirmButton = dialog.querySelector('#renameButton')!;
    confirmButton.addEventListener('click', () => {
      dialog.close();
      const newFileNameInput = dialog.querySelector<HTMLInputElement>('#newFileNameInput')!;
      const fileToUpdate = this.files.find(file => file.id === id);
      const newName = newFileNameInput.value;
      const updatedFile = new File([fileToUpdate], newName, { type: fileToUpdate.type });
      this.fileService.renameFile(id, updatedFile).subscribe(
        update => {
          this.reloadPage(); // reload the page
          setTimeout(() => {}, 2500); // Delay for hiding the alert
        },
        error => {
          this.reloadPage(); // reload the page
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



  
 
  renameFolder(id: number , event: MouseEvent) {
    event.stopPropagation();
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

        .dialog-container .error-message {
          color: red;
          font-size: 16px;
          margin-top: 8px;
        }
        .error-container {
          margin-bottom: 10px;
        }
        
        .error-message {
          display: inline-block;
          color: #f44336;
          font-size: 16px;
        }

      </style>
      <form class="form-group">
        <div class="dialog-container">
          <h2>Renomer Dossier</h2>
          <span class="error-message" id="errorMessage2"></span>

          <input autocomplete="off" type="text" id="newFileNameInput" name="name" class="form-control" placeholder="Nouveau nom de dossier">
          <br>
          <button type="button" class="btn btn-primary" id="renameButton">Confirmer</button>
          <button type="button" class="btn btn-secondary" id="cancelButton">Annuler</button>
        </div>
      </form>
    `;
    const confirmButton = dialog.querySelector('#renameButton')!;
  confirmButton.addEventListener('click', async () => {
  const newFileNameInput = dialog.querySelector<HTMLInputElement>('#newFileNameInput')!;
  const errorMessage2 = dialog.querySelector('#errorMessage2')!;

  const newName = newFileNameInput.value;
  
  // Check if the folder name already exists
  const exists = await this.fileService.checkFolderExists(this.curentUser?.email, newName).toPromise();

  // Process the response
  if (exists) {
    errorMessage2.textContent = `Le nom de dossier "${newName}" existe déjà.`;
    setTimeout(() => {
      errorMessage2.textContent = '';
    }, 3000);
  } else {
    const updateFolder = { name: newName };
    this.fileService.renameDossier(id, updateFolder).subscribe(
      update => {
        console.log(update);
        setTimeout(() => {
          this.reloadPage(); // reload the page
        }, 2500); // Delay for hiding the alert
      },
      error => {
        this.reloadPage(); // reload the page
      }
    );
    dialog.close();
  }
});

const cancelButton = dialog.querySelector('#cancelButton')!;
cancelButton.addEventListener('click', () => {
  dialog.close();
});

document.body.appendChild(dialog);
dialog.showModal();

  }
}