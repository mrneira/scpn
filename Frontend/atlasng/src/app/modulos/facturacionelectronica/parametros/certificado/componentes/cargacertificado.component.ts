import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-cargacertificado',
  templateUrl: 'cargacertificado.html'
})
export class CargaCertificadoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;


  public ltipo: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tcelcertificado', 'INFOCERTIFICADO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);

  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    this.mostrarDialogoGenerico = true;
    super.crearNuevo();
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    //super.eliminar();
  }

  cancelar() {
    //super.cancelar();
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  private fijarFiltrosConsulta() {
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.ccertificado', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }


  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.rqMantenimiento.mdatos.extension = this.registro.extension;
    this.rqMantenimiento.mdatos.nombrecertificado = this.registro.nombrecertificado;
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);

  }
  onSelectArchivo(event) {
    this.registro.nombrecertificado = event.files[0].name;
    this.registro.extension = event.files[0].name.substr(event.files[0].name.lastIndexOf('.') + 1);
    this.obtenerArchivoBase64(event);
  }
  // actualizaArchivo = (event) => {
  //   this.registro.firma = event.srcElement.result.split('base64,')[1];
  // }

  ValidarInformacion() {
    if (this.estaVacio(this.registro.clave)) {
      this.registro.rclave = null;
      return;
    }
    if (this.registro.clave != this.registro.rclave) {
      this.registro.rclave = undefined;
      this.mostrarMensajeError("LA CLAVE Y LA VERIFICACIÓN NO COINCIDEN");
      return;
    }
    else {
      this.consultarCertificado();
    }
  }

  //MÉTODO PARA CONSULTAR DATOS DEL CERTIFICADO -- COMPONENTE DE CONSULTA
  consultarCertificado() {
    this.rqConsulta.CODIGOCONSULTA = 'VALIDARINFORMACIONCERTIFICADO';
    this.rqConsulta.mdatos.clave = this.registro.clave;
    this.rqConsulta.mdatos.firma = this.registro.firma;
    this.rqConsulta.mdatos.extension = '.' + this.registro.extension;
    this.rqConsulta.mdatos.nombrecertificado = this.registro.nombrecertificado;
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuestaCertificado(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  private manejaRespuestaCertificado(resp: any) {
    if (resp.cod === 'OK') {
      if (resp.esvalida === 'OK') {
        this.registro.fechainicio = resp.fechaInicio;
        this.registro.fechafin = resp.fechaFin;
        this.registro.activo = true;
        this.registro.fingreso = this.fechaactual;
        this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
        this.mostrarMensajeSuccess("INFORMACIÓN CORRECTA, CONTINUAR");
      }
      else {
        this.registro.clave = undefined;
        this.registro.rclave = undefined;
        this.mostrarMensajeError("LA CLAVE DEL CERTIFICADO ES INCORRECTA");
      }
    }
  }

  obtenerArchivoBase64(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.propagateChange(myReader.result);
    }
    myReader.readAsDataURL(file);
  }

  propagateChange = (value: any) => {
    this.registro.firma = value;
    this.registro.firma= this.registro.firma.split('base64,')[1];
  };
}

