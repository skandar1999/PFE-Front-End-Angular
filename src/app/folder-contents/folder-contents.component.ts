import { Dossier } from './../model/dossier';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../model/user.model';
import { UserService } from '../services/user.service';
import { FileServiceService } from '../services/file-service.service';
import { File } from './../model/file';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-folder-contents',
  templateUrl: './folder-contents.component.html',
  styleUrls: ['./folder-contents.component.css']
})
export class FolderContentsComponent implements OnInit {
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
  dossierFiles!: any[];
  dossierName!: string;

  versionning!: boolean  ;
  ;

  
  constructor(
    public authService: AuthService,
    public userService: UserService,
    public fileService: FileServiceService,
    private route: ActivatedRoute,
    private router: Router
  
  ) {} 
  

  ngOnInit() {
    this.getFiles();
  }

  toggleVersioning() {
    const dossierId = this.dossierId;
    this.fileService.toggleVersioning(dossierId).subscribe(
      response => {
        // Update the status of the dossier based on the response from the server
        this.versionning = response.versionning;
      },
      error => console.error(error)
    );
  }

  
  reloadPage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl);
    });
  }
  
  
  getFiles() {
    this.route.params.subscribe(params => {
      this.dossierId = +params['id'];
      this.fileService.getDossierName(this.dossierId).subscribe(
        (response) => {
          this.dossierName = response.name;
          this.versionning=response.versionning;
          console.log(this.dossierName)
          console.log(this.versionning)

        },
        (error) => {
          console.log('Error retrieving dossier name');
        }
      );
    this.fileService.getFilesByDossier(this.dossierId).subscribe(
      files => {
        console.log(files);
        this.allfiles = files
          .filter((file:any) => file.status === true) // filter files with status === true
          .map((file:any) => {
            return {
              id: file.id,
              name: file.name,
              date: file.date,
              size: file.size,
              url: 'http://localhost:8000/files/' + file.name
            };
          });
        this.files = this.allfiles;
      },
      error => {
        console.error(error);
      }
    );
  });
  }
  
  

  
  onFileSelected(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
  
    if (this.versionning) {
      this.fileService.uploadFileandreplace(this.dossierId, file).subscribe(
        (response) => {
          console.log('File uploaded successfully');
          this.selectedFile = file;
          this.reloadPage(); // reload the page

        },
        (error) => {
          this.reloadPage(); // reload the page

        }
      );
    } else {
      this.fileService.addFileToDossier(formData, this.dossierId).subscribe(
        (response) => {
          console.log('File uploaded successfully');
          this.selectedFile = file;
          this.reloadPage(); // reload the page

        },
        (error) => {
          this.reloadPage(); // reload the page
        }
      );
    }
  }
  




  
  
  
  getDossierFiles(): void {
    this.dossierId = Number(this.route.snapshot.paramMap.get('id'));
    this.fileService.getFilesByDossier(this.dossierId).subscribe(
      (response) => {
        this.dossierFiles = response.files;
      },
      (error) => {
        console.log('Error getting dossier files');
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

  
  
  onKeyUp(filterText : string){
    this.files = this.allfiles.filter(item =>
      item.name.toLowerCase().includes(filterText)
    );
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
        this.fileService.archiveFileFromDossier(file.id).subscribe(() => {
          setTimeout(() => {
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
          padding: 8px 16px;
        }
        .btn-primary:hover {
          background-color: #ff5a4c;
          cursor: pointer;
          transition: 0.5s all ease;
        }
        .btn-secondary {
          background-color: #6c757d;
          color: #fff;
          border: none;
          padding: 8px 16px;
        }
        .btn-secondary:hover {
          background-color: #666666;
          color: #fff;
          cursor: pointer;
          transition: 0.5s all ease;
        }
      </style>
      <form class="form-group">
        <div class="dialog-container">
          <h2>Renomer</h2>
          <input autocomplete="off" type="text" id="newFileNameInput" name="name" class="form-control" placeholder="Nouveau nom de fichier">
          <br>
          <button type="button" class="btn btn-primary" id="renameButton">Confirmer</button>
          <button type="button" class="btn btn-secondary" id="cancelButton">Annuler</button>
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
  
  getfileUrl(fileId: number) {
    const file = this.allfiles.find((f: any) => f.id === fileId);
    const fileUrl = file?.url;
    const fileName = file?.name;
  
    if (fileUrl) {
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
          .alert {
            position: fixed;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px;
            background-color: #4CAF50;
            color: white;
            z-index: 9999;
          }
        </style>
        <div class="dialog-container">
          <h3>Partager "${fileName}"</h3>
         
          <button class="btn btn-info" id="copyButton" style="color: white;">Copier le lien</button>
          <button class="btn btn-secondary" id="cancelButton">Close</button>
        </div>
      `;
  
      const copyButton = dialog.querySelector('#copyButton')!;
      copyButton.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(fileUrl);
          this.showAlert('Lien copieé');
        } catch (err) {
          console.error('Failed to copy link: ', err);
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
  
   showAlert(message: string) {
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert');
    alertDiv.innerText = message;
    document.body.appendChild(alertDiv);
  
    setTimeout(() => {
      alertDiv.remove();
    }, 4000);
  }
}