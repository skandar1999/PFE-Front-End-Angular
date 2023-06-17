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
import { groupBy, mergeMap, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css'],})


export class DocsComponent implements OnInit {

  file!: File;

  id!:number;
  user!: User;
  curentUser:any;
  userData: any;
  token!:any;
  notfication!: string;
  email:any;
  deletedd: boolean = false;
  name!:string;
  allfiles! :any[];
  allFolders! :any[];

  notificationsEnabled: boolean = true;
  selectedFile: File | null = null;

  files!: any[];
  Dossier!: any[];

  folders: any[] = [];
  allfolders! :any[];
  newFileName!: string;
  updateSuccess: boolean = false;
  isUploading = false;

  new_name!: string;
  successMessage: string = '';

  username!: string;
  path!:string;

  
  
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
    this.findUserByEmail();
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
        this.id=this.userData.id; 
        this.notfication=this.notfication} });
  } 

 
  onLogout() {
    this.authService.logout();}     


    

      onFileSelected(event: any) {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('files', file);
      
        this.fileService.checkFileExistsforUser(this.curentUser?.email, file).subscribe((exists: boolean) => {
          if (exists) {
            this.dialogfilexiste(event);
          } else {
            this.addFileToDossier(formData);
          }
        });
      }
    




    dialogfilexiste(event: any) {
      const file = event.target.files[0];
    const formData = new FormData();
    formData.append('files', file);
  
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
            this.fileService.uploadFileandreplaceDocu(this.curentUser?.email, file).subscribe(
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
          // Clear the file input value if cancel is pressed
          const fileInput = document.querySelector('#file-input') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
          }
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

  
    
    addFileToDossier(formData: FormData): void {
      this.fileService.uploadFile(formData, this.curentUser?.email).subscribe(
        (response) => {
          this.showSuccessMessageAndReload();
        },
        (error) => {
          this.showSuccessMessageAndReload();
        }
      );
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
      
        .dialog-container h3 {
          margin-top: 0;
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
          padding: auto;
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
          padding: auto;
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
      
        /* Responsive styles */
        @media only screen and (max-width: 768px) {
          .dialog-container {
            max-width: 90%;
          }
        }
      
        @media only screen and (max-width: 576px) {
          .dialog-container {
            max-width: 100%;
          }
      
          .form-group button {
            margin-bottom: 8px;
            width: 100%;
          }
      
          .btn-primary {
            display: block;
            width: 100%;
          }
        }
      </style>
      
          <div class="dialog-container">
            <h3>Partager "${fileName}"</h3>
           
            <button class="btn btn-secondary" id="cancelButton">Close</button>
            <button class="btn btn-info" id="copyButton" style="color: white;">Copier le lien</button>

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
      }, 3000);
    }
    
    
  
  getFolders() {
    this.fileService.getUserFolders(this.curentUser?.email).subscribe(
      folders => {
        console.log(folders);
        this.allfolders = folders
        .filter((folder:any) => folder.status === true) // filter files with status === true
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
  

  createNewFolder(folderName: string) {
    const formData = new FormData();
    formData.append('user_id', '1'); // Replace with the ID of the user
    formData.append('namedossier', folderName);
    formData.append('datedossier', new Date().toISOString().slice(0, 10)); // Use today's date as the default date
    this.fileService.createFolder(formData, this.curentUser?.email).subscribe(
      (response) => {
        this.reloadPage(); // Reload the page
      },
      (error) => {
        this.reloadPage(); // Reload the page
      }
    );
  }
  
  openCreateFolderDialog() {
    const dialog = document.createElement('dialog');
  
    dialog.innerHTML = `
      <style>
        .dialog-container {
          background-color: #f5f5f5;
          border: none;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
          max-width: 400px;
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
  
      <div class="dialog-container">
  <div class="dialog-container">
  <h2>Nouveau dossier</h2>
  <div class="error-container">
    <span class="error-message" id="errorMessage"></span>
  </div>
  <input autocomplete="off" type="text" id="folderNameInput" placeholder="Nom de dossier" />
  <button class="btn btn-secondary" id="cancelButton">Cancel</button>
  <button class="btn btn-primary" id="confirmButton">Créer</button>
</div>

    `;
  
    const folderNameInput = dialog.querySelector('#folderNameInput') as HTMLInputElement;
    const errorMessage = dialog.querySelector('#errorMessage')!;
    const confirmButton = dialog.querySelector('#confirmButton')!;
    const cancelButton = dialog.querySelector('#cancelButton')!;
  
    confirmButton.addEventListener('click', async () => {
      const folderName = folderNameInput.value.trim();
      if (folderName !== '') {
        errorMessage.textContent = '';
  
        // Call the checkFolderExists method to check if the folder exists
        const exists = await this.fileService.checkFolderExists(this.curentUser?.email, folderName).toPromise();
  
        // Process the response
        if (exists) {
          errorMessage.textContent = `Le nom de dossier " ${folderName} " existe déjà.`;
          setTimeout(() => {
            errorMessage.textContent = '';
          }, 3000);
        } else {
          dialog.close();
          this.createNewFolder(folderName); // Call the createNewFolder method from your component
        }
      } else {
        errorMessage.textContent = 'Veuillez saisir le nom du dossier';
  
        // Clear the error message after 3 seconds
        setTimeout(() => {
          errorMessage.textContent = '';
        }, 3000);
      }
    });
  
    cancelButton.addEventListener('click', () => {
      dialog.close();
    });
  
    document.body.appendChild(dialog);
    dialog.showModal();
  }
  

  


  onFolderSelected(folder: any) {
    // Navigate to the contents of the selected folder
    this.router.navigate(['/folders', folder.id]);
  }



  
  onKeyUp(filterText : string){
    this.files = this.allfiles.filter(item =>
      item.name.toLowerCase().includes(filterText)
    );
    this.Dossier = this.allFolders.filter((folder) =>
    folder.name.toLowerCase().includes(filterText.toLowerCase())
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
          border-radius: 4px;
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
          border: none;
          border-radius: 4px;
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
        <button class="btn btn-secondary" id="cancelButton">Annuler</button>
        <button class="btn btn-primary" id="confirmButton">Confirmer</button>

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
  
  onArchiveDossier(dossier: Dossier, event: MouseEvent) {
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
        <h2>Archiver</h2>
        <p>Etes-vous sûr de vouloir archiver ce dossier ?</p>
        <button class="btn btn-secondary" id="cancelButton">Annuler</button>
        <button class="btn btn-primary" id="confirmButton">Confirmer</button>

      </div>
    `;
  
    const confirmButton = dialog.querySelector('#confirmButton')!;
    confirmButton.addEventListener('click', () => {
      dialog.close();
      if (dossier.id) {
        this.fileService.archiveDossier(dossier.id, this.curentUser?.email).subscribe(() => {
          this.getFiles();
          this.deletedd = true;
          this.reloadPage(); // reload the page

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
        this.reloadPage(); // reload the page

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

  reloadPage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
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
        this.updateSuccess = true;
        setTimeout(() => {
          this.updateSuccess = false;
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
  

  findUserByEmail(){
    this.userService.rechercherParEmail(this.curentUser?.email).subscribe(us => {
      console.log(us);
      if (us) {
        this.userData = us;
        this.username=this.userData.username;
        this.notfication=this.userData.notfication;
      }
      
    });
  }
 
 


  
  getVersion(fileId: number): void {
    const dialog = document.createElement('dialog');
    const filesTableBody = document.createElement('tbody');
    const file = this.allfiles.find((f: any) => f.id === fileId);

    const fileName = file?.name;

    dialog.innerHTML = `
   <style>
   #getversion-dialog {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    padding: 20px;
    max-width: 500px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
    color: #333;
    display: flex;
    flex-direction: column;
  }

  #getversion-dialog table {
    width: 100%;
    border-collapse: collapse;
  }

  #getversion-dialog th {
    text-align: left;
    padding: 12px;
    background-color: #f1f1f1;
    font-weight: bold;
    text-transform: uppercase;
  }

  #getversion-dialog td {
    padding: 12px;
    border-bottom: 1px solid #ddd;
  }

  #getversion-dialog .btn-secondary {
    background-color: #6c757d;
    color: #fff;
    border: none;
    padding: 8px 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    align-self: flex-end;
    
  }

  #getversion-dialog .btn-secondary:hover {
    background-color: #666666;
    color: #fff;
    border: none;
  }

  #getversion-dialog tbody {
    background-color: #fff;
  }

  #getversion-dialog tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  #getversion-dialog tr:hover {
    background-color: #f1f1f1;
  }
</style>
</style>

<div id="getversion-dialog" class="dialog-container">
  <h3 style="margin-bottom: 20px;">Liste des versions de "${fileName}"</h3>
  <table>
    <thead>
      <tr>
        <th>Nom de document</th>
      </tr>
    </thead>
    <tbody id="filesTableBody"> </tbody>
  </table> <br>
  <button type="button" class="btn btn-secondary" id="cancelButton">Annuler</button>
</div>

  `;
  
  

  this.fileService.samecodefiles(fileId).subscribe(
    (fileNames: string[]) => {
      fileNames.forEach((fileName) => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = fileName;
        row.appendChild(nameCell);
        filesTableBody.appendChild(row);
      });
  
      const table = dialog.querySelector('table');
      table?.appendChild(filesTableBody);
    },
    (error) => {
      console.error(error);
    }
  );

  document.body.appendChild(dialog);
  dialog.showModal();



  const closeButton = dialog.querySelector('#cancelButton') as HTMLButtonElement;
  closeButton.addEventListener('click', () => {
    dialog.close();
  });

}
  
  
  
  





 
  



















    
  
}







