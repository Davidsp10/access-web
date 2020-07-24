import { Component, OnInit } from '@angular/core';
import {UuidService} from '../../shared/services/uuid.service';
import {Uuid} from '../../shared/models/uuid';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import printPDF from './print';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [UuidService, MessageService, ConfirmationService]
})

export class HomeComponent implements OnInit {

  public uuidList: Uuid[] = [];
  cols: any[];
  items: MenuItem[];
  displaySaveDialog: boolean = false;
  uuid: Uuid = {
    identifier: null,
    name: null,
    uuid: null,
    creationDate: null
  };
  selectedUuid: Uuid = {
    identifier: null,
    name: null,
    uuid: null,
    creationDate: null
  }

  constructor(
    private _uuidService: UuidService,
    private _messageService: MessageService,
    private _confirmationService: ConfirmationService
  ) { 
    
  }

  ngOnInit() {
    this.getAll();
    this.cols  = [
      {field: "identifier", header: "ID"},
      {field: "name", header: "Nombre"},
      {field: "uuid", header: "UID"},
      {field: "creationDate", header: "Fecha"}
    ]
    this.items = [
      {label: "Nuevo", icon: 'pi pi-fw pi-plus', command: () => this.showSaveDialog()},
      {label: "Eliminar", icon: 'pi pi-fw pi-trash', command: () => this.delete() }
    ]
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

}