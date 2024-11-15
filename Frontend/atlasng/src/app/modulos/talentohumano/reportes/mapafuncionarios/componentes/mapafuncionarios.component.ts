import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta, Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { GMapModule } from 'primeng/primeng';

declare var google: any;
@Component({
  selector: 'app-mapa-funcionarios',
  templateUrl: 'mapafuncionarios.html'
})
export class MapaFuncionariosComponent extends BaseComponent implements OnInit, AfterViewInit {

  public options: any;
  
  public dialogVisible: boolean;
  public overlays: any[];

  public infoWindow: any;
  public marker :any[];
  public markerTitle: string;
  public draggable: boolean;
  public url:any;
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'DIRECCIÓN', false);
  }
  consultar() {
    this.rqConsulta.CODIGOCONSULTA = 'MAPAFUNCIONARIO';
    this.rqConsulta.mdatos = this.mcampos;
    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        
        if (resp.cod === 'OK') {
        
          for (const i in resp.MARCADORES) {
            if (resp.MARCADORES.hasOwnProperty(i)) {
              const reg = resp.MARCADORES[i];
              this.addMarker(reg.position.lat,reg.position.lng,reg.title,reg.icon.url);
          
            }}      
          
        }
        

        },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }
  ngOnInit() {
    this.componentehijo = this;
    super.init();
   
   
    this.options = {
      center: {lat: -0.191453, lng: -78.4867467},
      zoom: 14
    };
  
    this.clear();
    this.consultar();
  
  }
  
  zoomIn(map) {
    map.setZoom(map.getZoom()+1);
}
addMarker(lat: any, long: any, label: string,icono:any) {
 
    this.overlays.push(new google.maps.Marker({
      position: {lat: lat, lng: long},
      label: label, draggable: false
      
    })
  );
  
}
manejaRespuesta(resp: any) {
  const msgs = [];
  if (resp.cod === 'OK') {
    this.overlays = resp.MARCADORES;
    
  }
  this.lconsulta = [];
}

zoomOut(map) {
    map.setZoom(map.getZoom()-1);
}

clear() {
    this.overlays = [];
}
  ngAfterViewInit() {
    
    this.infoWindow = new google.maps.InfoWindow();    
  }
 

  crearNuevo() {
   //No Aplica
  }

  actualizar() {
  //no aplica
  }

  eliminar() {
   // no aplica
  }

  cancelar() {
    //no aplica
  }


  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    //No aplica 
  }

  
  

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  

  
}
