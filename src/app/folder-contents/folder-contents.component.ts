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
  show: boolean = true;

  selectedFile: File | null = null;
  successMessage: string = '';

  files!: any[];
  folders: any[] = [];
  allfolders! :any[];
  dossierId!: number;
  dossierFiles!: any[];
  dossierName!: string;

  versionning!: boolean  ;

  
  constructor(
    public authService: AuthService,
    public userService: UserService,
    public fileService: FileServiceService,
    private route: ActivatedRoute,
    private router: Router
  
  ) {} 
  

  ngOnInit() {
    this.getFiles();
    setTimeout(() => {
      this.show = false;
    }, 3000);
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
      this.displayConfirmationPopup(event);
    } else {
      this.fileService.checkFileExists(this.dossierId, file).subscribe((exists: boolean) => {
        if (exists) {
          this.dialogfilexiste(event);
        } else {
          this.addFileToDossier(formData);
        }
      });
    }
  }
  
  
  addFileToDossier(formData: FormData): void {
    this.fileService.addFileToDossier(formData, this.dossierId).subscribe(
      (response) => {
        this.showSuccessMessageAndReload();
      },
      (error) => {
        this.reloadPage(); // reload the page
      }
    );
  }
  

  
  dialogfilexiste(event: any) {
    const file = event.target.files[0];
  const formData = new FormData();
  formData.append('file', file);

  const showDialog = () => {
    const dialog = document.createElement('dialog');
  
    dialog.innerHTML = `
    <style>
  .dialog-container {
    background-color: #f7f7f7;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    padding: 20px;
    max-width: 520px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
  }

  .dialog-container h2 {
    margin-top: 0;
    font-size: 20px;
    font-weight: bold;
  }

  .dialog-container p {
    margin-bottom: 20px;
    font-size: 16px;
  }

  .dialog-container button {
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px;
  }

  .dialog-container button.yes-btn {
    background-color: #4caf50;
    color: #fff;
    border: none;
  }

  .dialog-container button.no-btn {
    background-color: #f44336;
    color: #fff;
    border: none;
  }

  .dialog-container .icon {
    margin-right: 10px;
  }

  .dialog-container input[type="radio"] {
    display: none;
  }

  .dialog-container input[type="radio"] + label {
    position: relative;
    padding-left: 30px;
    cursor: pointer;
    font-size: 16px;
    color: #333;
  }

  .dialog-container input[type="radio"] + label:before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    border: 2px solid #ccc;
    border-radius: 50%;
    background-color: #fff;
    transition: border-color 0.3s ease;
  }

  .dialog-container input[type="radio"] + label:after {
    content: "";
    position: absolute;
    left: 4.2px;
    top: 50%;
    transform: translateY(-50%);
    width: 11.3px;
    height: 11px;
    border-radius: 50%;
    background-color: #030303;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .dialog-container input[type="radio"]:checked + label:before {
    border-color: #030303;
  }

  .dialog-container input[type="radio"]:checked + label:after {
    opacity: 1;
  }
</style>
  
  <div class="dialog-container">
    <h2>Option d'importation</h2>
    <p>
      <span class="text">Le fichier selectionner existe déjà à cet emplacement. Voulez-vous remplacer le fichier existant par une nouvelle version ou conserver les deux ?</span>
    </p>
    <input type="radio" id="replace-radio" name="method" value="replace" checked>
    <label for="replace-radio">Remplacer le fichier existant</label><br>
    <input type="radio" id="skip-radio" name="method" value="skip">
    <label for="skip-radio">Conserver les deux fichiers</label><br>
    <button id="cancel-btn" class="no-btn">Annuler</button>
    <button id="confirm-btn" class="yes-btn">Importer</button>
  </div>
  
  
    `;
  
    const confirmBtn = dialog.querySelector('#confirm-btn');
    const cancelBtn = dialog.querySelector('#cancel-btn');

    if (confirmBtn && cancelBtn) {
      confirmBtn.addEventListener('click', () => {
        const selectedMethod = (document.querySelector('input[name="method"]:checked') as HTMLInputElement)?.value;

        if (selectedMethod === 'replace') {
          this.fileService.uploadFileandreplace(this.dossierId, file).subscribe(
            (response) => {
              console.log('File uploaded successfully');
              this.selectedFile = file;
              this.showSuccessMessageAndReload();
            },
            (error) => {
              this.showSuccessMessageAndReload();
            }
          );
        } else if (selectedMethod === 'skip') {
          this.addFileToDossier(formData);
        }
        dialog.close();
      });

      cancelBtn.addEventListener('click', () => {
        dialog.close();
        // Stop the action or perform any desired action when cancel is pressed
        // For example, you can return or display a message
        return;
      });
    }

    document.body.appendChild(dialog);
    dialog.showModal();
  };

  // Remove any existing dialogs before showing a new one
  const existingDialog = document.querySelector('dialog');
  if (existingDialog) {
    existingDialog.remove();
  }

  showDialog();
}

  

  
  
  



  displayConfirmationPopup(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    const dialog = document.createElement('dialog');
  
    dialog.innerHTML = `
    <style>
    .dialog-container {
      background-color: #f7f7f7;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      padding: 20px;
      max-width: 500px;
      margin: 0 auto;
      font-family: Arial, sans-serif;
    }
  
    .dialog-container h2 {
      margin-top: 0;
      font-size: 20px;
      font-weight: bold;
    }
  
    .dialog-container p {
      margin-bottom: 20px;
      font-size: 16px;
    }
  
    .dialog-container button {
      padding: 10px 20px;
      font-size: 16px;
      border-radius: 4px;
      cursor: pointer;
    }
  
    .dialog-container button.yes-btn {
      background-color: #4caf50;
      margin-left:150px;
      color: #fff;
      border: none;
    }
  
    .dialog-container button.no-btn {
      background-color: #f44336;
      color: #fff;
      border: none;
    }
  
    .dialog-container .icon {
      margin-right: 10px;
    }
  </style>
  
  <div class="dialog-container">
    <h2>Confirmer l'importation</h2>
    <p>
      <span class="icon fas fa-exclamation-triangle"></span>
      <span class="text">Attention : La fonctionnalité de versioning est activée. Importer un fichier existant entraînera son remplacement par la nouvelle version. Pensez à sauvegarder votre fichier original si vous souhaitez le conserver.</span>
    </p>
    <button id="confirm-btn" class="yes-btn">Oui</button>
    <button id="cancel-btn" class="no-btn">Non</button>
  </div>
  
    `;
  
    document.body.appendChild(dialog);
  
    const confirmBtn = dialog.querySelector('#confirm-btn');
    const cancelBtn = dialog.querySelector('#cancel-btn');
  
     if (confirmBtn && cancelBtn) {
    confirmBtn.addEventListener('click', () => {
      this.fileService.uploadFileandreplace(this.dossierId, file).subscribe(
        (response) => {
          console.log('File uploaded successfully');
          this.selectedFile = file;
          this.showSuccessMessageAndReload();
        },
        (error) => {
          this.showSuccessMessageAndReload();
        }
      );
      dialog.close();
    });
    }
  
    dialog.showModal();
  }
  

  showSuccessMessageAndReload(): void {
    // Display ongoing download message
    this.successMessage = "Téléchargement en cours...";
  
    setTimeout(() => {
      // Clear the ongoing download message
      this.successMessage = '';
  
      // Display success message
      this.successMessage = "L'importation est terminée avec succès !";
  
      // Reload the page after a delay of 3 seconds
      setTimeout(() => {
        this.reloadPage();
      }, 3000);
    }, 3000);
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