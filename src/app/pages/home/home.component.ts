import { Component, OnInit } from '@angular/core';
import {UuidService} from '../../shared/services/uuid.service';
import {AuthService} from '../../shared/services/auth.service'
import {Uuid} from '../../shared/models/uuid';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import swal from 'sweetalert';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [UuidService, MessageService, ConfirmationService, AuthService]
})

export class HomeComponent implements OnInit {

  public uuidList: Uuid[] = [];
  cols: any[];
  items: MenuItem[];
  displaySaveDialog: boolean = false;
  displayUpdateDialog: boolean = false;
  checked: Boolean = true;
  uuid: Uuid = {
    identifier: null,
    name: null,
    uuid: null,
    creationDate: null,
    enabled: null
  };
  selectedUuid: Uuid = {
    identifier: null,
    name: null,
    uuid: null,
    creationDate: null,
    enabled: null
  }

  constructor(
    private _uuidService: UuidService,
    private _messageService: MessageService,
    private _confirmationService: ConfirmationService,
    private _authService: AuthService,
    private _router: Router
  ) { 
    
  }

  ngOnInit() {
    this.getAll();
    this.cols  = [
      {field: "identifier", header: "ID"},
      {field: "name", header: "Nombre"},
      {field: "uuid", header: "UID"},
      {field: "enabled", header: "Habilitado"},
      {field: "creationDate", header: "Fecha de creación"}
    ]
    this.items = [
      {label: "Nuevo", icon: 'pi pi-fw pi-plus', command: () => this.showSaveDialog()},
      {label: "Habilitar", icon: 'pi pi-fw pi-pencil', command: () => this.showUpdateDialog()},
      {label: "Eliminar", icon: 'pi pi-fw pi-trash', command: () => this.delete() }
    ]
    //LOGOUT STEP 1
    if(!this._authService.isAuthenticated()){
      swal('Error!', 'No has iniciado sesión', 'error');
      console.log("No estás autenticado!");
      this._router.navigate(['']);
    }
  }

  getAll() {
    this._uuidService.getUuidList().subscribe(
      response => {
        console.log(response);
        this.uuidList = response;
      },
      error => {
        this._messageService.add({severity: 'error', summary: "Resultado", detail: "Ocurrió un error."});
      }
    )
  }

  showSaveDialog() {
    this.uuid = new Uuid(null, null, null, null, null);
    this.displaySaveDialog = true;
  }

  save() {
    if(this.uuid.name != null && this.uuid.uuid != null) {
    this._uuidService.save(this.uuid).subscribe(
      response => {
        console.log(response);
        let uuid = response as Uuid;
        this.uuidList.push(uuid);
        this._messageService.add({severity: 'success', summary: 'Resultado', detail: 'Se guardaron los datos correctamente'});
        this.displaySaveDialog = false;
      },
      error => {
        console.log(error);
        this._messageService.add({severity: 'error', summary: "Resultado", detail: "El nombre o el UUID ya está regitrado."});
      }
    )
    } else{
        this._messageService.add({severity: 'warn', summary: "Advertencia!", detail: "Por favor complete los campos."});
    }
  }

  delete() {
    if(this.selectedUuid != null && this.selectedUuid.identifier != null) {
      this._confirmationService.confirm({
        message: "¿Está seguro que desea eliminar el registro?.",
        accept: () => {
          this._uuidService.delete(this.selectedUuid.identifier).subscribe(
            response => {
              this._messageService.add({severity: 'success', summary: "Resultado", detail: "Se eliminó el registro correctamente."});
              this.deletedObject(response.identifier);
            },
            error => {
              console.log(error);
              this._messageService.add({severity: 'error', summary: "Resultado", detail: "Ocurrió un error."});
            }
          )
        }
      })
    } else {
      this._messageService.add({severity: 'warn', summary: "Advertencia!", detail: "Por favor seleccione un registro."});
    }
  }

    deletedObject(id:Number) {
      let index = this.uuidList.findIndex((e) => e.identifier == id);
      if(index != -1) {
        this.uuidList.splice(index, 1)
      }
    } 

    showUpdateDialog() {
      if(this.selectedUuid != null && this.selectedUuid.identifier != null) {
        this.uuid = this.selectedUuid;
        this.checked = this.uuid.enabled;
        this.displayUpdateDialog = true;
      } else {
        this._messageService.add({severity: 'warn', summary: "Advertencia!", detail: "Por favor seleccione un registro."});
      }
    }

    update() {
      this.selectedUuid.enabled = this.checked;
      this._uuidService.update(this.selectedUuid).subscribe(
        response => {
          this._messageService.add({severity: 'success', summary: "Resultado", detail: "Se actualizó el registro correctamente."});
          let index = this.uuidList.findIndex((e) => e.identifier == response.identifier);
          this.uuidList[index] = response;
          this.displayUpdateDialog = false;
        },
        error => {
          console.log(error);
          this._messageService.add({severity: 'error', summary: "Resultado", detail: "Ocurrió un error."});
        }
      )
    }

    //LOGOUT STEP 2
    //LOGOUT STEP 3 en authService
    logout(): void {
      this._authService.logout();
      swal('Logout', 'Has cerrado sesión con éxito', 'success');
      console.log("Has cerrado sesión con éxito");
    }

}