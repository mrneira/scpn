import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';

@Component({
  selector: 'app-renovacion-poliza-masiva',
  templateUrl: 'renovacionPolizaMasiva.html'
})
export class RenovacionPolizaMasivaComponent extends BaseComponent implements OnInit, AfterViewInit {
  
  @ViewChild('inputFile') inputFile: ElementRef;
  
  private dataInsert = [];
  private pathFileTmp = null;
  public statusGrabar = false;
  public lregistros = null;
  public msgProccess = "Seleccione un archivo .xls";

  //MNE 20240205
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TsgsSeguro', 'LOVPERSONADETALLE', true, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }
  ngAfterViewInit() {
  }

  uploadHandler(event) {
    this.msgProccess = "Cargando el archivo " + event.files[0].name;
    this.encerarMensajes();
    this.lregistros = null;
    this.statusGrabar = false;
    this.pathFileTmp = null;
    this.rqConsulta.narchivo = event.files[0].name;
    this.rqConsulta.cargaarchivo = 'upload';
    this.getBase64(event);
  }

  getBase64(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.propagateChange(myReader.result);
    }
    myReader.readAsDataURL(file);
  }

  propagateChange = (value: any) => {
    this.rqConsulta.CODIGOCONSULTA = 'POLIZAMASIVA';
    this.rqConsulta.cmodulo = 6;
    this.rqConsulta.ctransaccion = 7;
    this.rqConsulta.SOCIOS = value;
    const consulta = this.getRequestConsulta('C');
    this.encerarConsulta();
    this.dtoServicios.ejecutarConsultaRest(consulta).subscribe(
      resp => {
        if(resp["DATA_PROCCESS"] && resp["DATA_PROCCESS"].length > 0){
          this.lregistros = resp["DATA_PROCCESS"];
        }else{
          this.lregistros = null;
        }
        if(resp["INSPOLIZA"] && resp["INSPOLIZA"].length > 0){
          this.statusGrabar = true;
          this.dataInsert = resp["INSPOLIZA"];
        }else{
          this.dataInsert = [];
          this.statusGrabar = false;
        }
        if(this.lregistros){
          this.msgProccess = resp["message"] + " (REGISTROS CORRECTOS: " + (this.dataInsert).length + " DE " + (this.lregistros).length + " | REGISTROS INCORRECTOS: " + ((this.lregistros).length - (this.dataInsert).length) + " DE " + (this.lregistros).length + ")";
        }else{
          this.msgProccess = resp["message"];
        }
        if(resp['cod'] === "OK"){
          this.dtoServicios.llenarMensaje(resp, true, true);
        }else{
          this.dtoServicios.manejoError({message: resp["message"]});
        }
        this.pathFileTmp = resp["FILE_TMP"];
      },
      error => {
        this.dtoServicios.manejoError(error);
      }
    );
  };

  cancelarSubir() {
    this.msgProccess = "Seleccione un archivo .xls";
    this.limpiarCampos();
  }

  limpiarCampos() {
    this.rqMantenimiento.narchivo = '';
  }

  grabar(): void {
    if(this.pathFileTmp != null){
      this.lmantenimiento = []; // Encerar Mantenimiento
      this.esform = false;
      this.rqMantenimiento.mdatos.nameFile = this.pathFileTmp;
      this.rqMantenimiento["POLIZA"] = {
        ins: this.dataInsert,
        upd: [],
        del: [],
        esMonetario: false,
        enviarSP: false,
        bean: "tsgspoliza",
        pos: 1
      };
      super.grabar();
    }else{
      this.dtoServicios.manejoError({message: "NO ES POSIBLE ENVIAR LOS DATOS DE POLIZA A GRABAR; POR FAVOR, VERIFIQUE SI EXISTE EL ARCHIVO TEMPORAL"});
    }
  }
  public postCommit(resp: any) {
    if(resp["OK"]){
      this.cancelarSubir();
      this.lregistros = null;
      this.statusGrabar = false;
    }
  }


}

