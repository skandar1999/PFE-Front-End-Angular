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
      <p>Etes-vous sûr de vouloir archiver ce document ?</p>
      <button class="btn btn-primary" id="confirmButton">Confirmer</button>
      <button class="btn btn-secondary" id="cancelButton">Annuler</button>
    </div>
  `;

  const confirmButton = dialog.querySelector('#confirmButton')!;
  confirmButton.addEventListener('click', () => {
    dialog.close();
    if (file.id) {
      this.fileService.restaurerFile(file.id, this.curentUser?.email).subscribe(() => {
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



}