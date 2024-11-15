import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

declare var google: any;

@Component({
  selector: 'app-lov-maps',
  templateUrl: 'lov.maps.html'
})
export class LovMapsComponent extends BaseComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();
  @Input() draggable: boolean;

  displayLov = false;
  options: any;
  overlays: any[];
  maxMarkers: number;
  controles = true;
  latDefault = -0.191453;
  lonDefault = -78.4867467;
  latTemp: any;
  lngTemp: any;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'LOVMAPCHOOSER', false);
  }

  ngOnInit() {
    this.maxMarkers = 1;
    this.options = {
      center: { lat: -0.191453, lng: -78.4867467 },
      zoom: 14
    };
    this.clearAll();
  }

  public inicializar(lat: any, long: any) {
    this.maxMarkers = 1;
    this.options = {
      center: { lat: this.estaVacio(lat) ? this.latDefault : lat, lng: this.estaVacio(long) ? this.lonDefault : long },
      zoom: 14
    };
    this.clearAll();
  }

  handleMapClick(event) {
    if (this.maxMarkers == 1 && this.overlays.length == 1) {
      this.clearAll();
    }

    if (this.controles) {
      this.latTemp = event.latLng.lat();
      this.lngTemp = event.latLng.lng();
      this.addMarker(event.latLng.lat(), event.latLng.lng(), 'Confirme la posición');
    } else {
      this.eventoCliente.emit({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      this.hideDialog();
    }
  }

  confirm() {
    this.eventoCliente.emit({ lat: this.latTemp, lng: this.lngTemp });
    this.hideDialog();
  }

  showDialog() {
    this.displayLov = true;
  }

  hideDialog() {
    this.displayLov = false;
  }

  zoomIn(map) {
    map.setZoom(map.getZoom() + 1);
  }

  zoomOut(map) {
    map.setZoom(map.getZoom() - 1);
  }

  clearAll() {
    this.overlays = [];
  }

  addMarker(lat: any, long: any, label: string) {
    if (this.maxMarkers != -1 && this.overlays.length == this.maxMarkers) {
      this.mostrarMensajeError('SE HA SUPERADO EL LIMITE DE MARCADORES');
    } else {
      this.overlays.push(new google.maps.Marker({
        position: { lat: lat, lng: long },
        label: label, draggable: false
      }));
    }
  }
}
