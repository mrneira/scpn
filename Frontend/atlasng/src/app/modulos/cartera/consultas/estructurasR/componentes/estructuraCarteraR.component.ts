import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { SelectItem } from 'primeng/primeng';
import { isArray, isObject } from 'util';

declare var JSZip:any;

@Component({
  selector: 'app-estructura-cartera-r',
  templateUrl: 'estructuraCarteraR.html'
})
export class EstructuraCarteraRComponent extends BaseComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public lanios: SelectItem[] = [{ label: '...', value: null }];
  public lmeses: SelectItem[] = [{ label: '...', value: null }];
  public lregistrosestructuras = [];
  public mangerFilter = {year: null, month: null};
  private meses = [
    { label: '...', value: null },
    { label: 'ENERO', value: '01' },
    { label: 'FEBRERO', value: '02' },
    { label: 'MARZO', value: '03' },
    { label: 'ABRIL', value: '04' },
    { label: 'MAYO', value: '05' },
    { label: 'JUNIO', value: '06' },
    { label: 'JULIO', value: '07' },
    { label: 'AGOSTO', value: '08' },
    { label: 'SEPTIEMBRE', value: '09' },
    { label: 'OCTUBRE', value: '10' },
    { label: 'NOVIEMBRE', value: '11' },
    { label: 'DICIEMBRE', value: '12' }
  ];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'ESTRUCTURACARTERAR', false, true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
    this.iniciarDatos();
  }

  /** Iniciar datos */
  iniciarDatos(): any {
    this.lregistrosestructuras.push(
      {name: "R81", description: "SUJETOS DE RIESGOS", year: "-", month: "-"},
      {name: "R82", description: "OPERACIONES CONCEDIDAS", year: "-", month: "-"},
      {name: "R83", description: "OPERACIONES ANTERIORES", year: "-", month: "-"},
      {name: "R84", description: "SALDOS", year: "-", month: "-"},
      {name: "R85", description: "OPERACIONES CANCELADAS", year: "-", month: "-"}
    );
    for(let i = 2019; i <= new Date().getFullYear(); i++){
      this.lanios.push({ label: i.toString(), value: i.toString() });
    }
  }

  downloadEstructura(registro: any) {
    if(registro["month"] != "-" && registro["year"] != "-"){
      super.encerarMensajes();
      super.encerarConsulta();
      this.rqConsulta = { 'mdatos': {} };
      this.rqConsulta.parametro_tipoEstructura = String(registro["name"]);
      this.rqConsulta.parametro_anio = String(registro["year"]);
      this.rqConsulta.parametro_mes = String(registro["month"]);
      this.rqConsulta.mdatos.CODIGOCONSULTA = 'ESTRUCTURACARTERAR';
      this.rqConsulta.storeprocedure = "sp_EstructurasCartera";
      super.consultar();
    }else{
      this.dtoServicios.manejoError({message: "CAR 777 - DEBE SELECCIONAR UN AÑO Y UN MES"});
    }
  }

  eventoSelectYear(){
    for (let index = 0; index < this.lregistrosestructuras.length; index++) {
      this.lregistrosestructuras[index]["year"] = "-";
      this.lregistrosestructuras[index]["month"] = "-";
    }
    this.lmeses = [{ label: '...', value: null }];
    if(this.lanios.find(a=>(a["value"] == String(this.mangerFilter.year)))){
      for (let index = 0; index < this.lregistrosestructuras.length; index++) {
        this.lregistrosestructuras[index]["year"] = String(this.mangerFilter.year);
      }
      let dateNow = new Date();
      if(String(this.mangerFilter.year) == String(dateNow.getFullYear())){
        for (let i = 1; i <= (dateNow.getMonth() + 1); i++) {
          this.lmeses.push(this.meses[i]);
        }
      }else{
        this.lmeses = this.meses;
      }
      this.mangerFilter.month = "-";
    }
  }

  eventoSelectMes(){;
    if(this.lmeses.find(m=>(m["value"] == String(this.mangerFilter.month)))){
      for (let index = 0; index < this.lregistrosestructuras.length; index++) {
        this.lregistrosestructuras[index]["month"] = String(this.mangerFilter.month);
      }
    }else{
      for (let index = 0; index < this.lregistrosestructuras.length; index++) {
        this.lregistrosestructuras[index]["month"] = "-";
      }
    }
  }


  public postQuery(resp: any) {
    if (resp["cod"] === "OK" && resp["ESTRUCTURACARTERAR"]) {
      this.dtoServicios.llenarMensaje(resp, true, true);
      this.registro = { 'mdatos': {} };
      this.registro.nombre = resp["ESTRUCTURACARTERAR"]["nombre"];
      this.registro.tipo = resp["ESTRUCTURACARTERAR"]["tipo"];
      this.registro.archivoDescarga = resp["ESTRUCTURACARTERAR"]["contenido"];
      this.registro.extension = resp["ESTRUCTURACARTERAR"]["extension"];
      this.descargaAdjunto(this.registro);
    }
  }

  descargaAdjunto(registro: any) {
    const linkElement = document.createElement("a");
    let bytes = registro.archivoDescarga;
    var blob = new Blob([this.base64ToArrayBuffer(bytes)], {
      type: registro.tipo
    });
    const bloburl = URL.createObjectURL(blob);
    linkElement.href = bloburl;
    linkElement.download = registro.nombre;
    const clickEvent = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: false
    });
    linkElement.dispatchEvent(clickEvent);
  }

  base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
}