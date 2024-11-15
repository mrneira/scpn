import {DatePipe} from '@angular/common';
import {Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter, Input, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';
import {CatalogoDetalleComponent} from '../../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import {LovEtapaExpedienteComponent} from '../../../../lov/etapaexpediente/componentes/lov.etapaexpediente.component';


@Component({
  selector: 'app-socios',
  template: ''

})
export class SociosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  private catalogoDetalle: CatalogoDetalleComponent;

  @ViewChild(LovEtapaExpedienteComponent)
  private lovEtapaExpediente: LovEtapaExpedienteComponent;
  estadoListaTipos = false;
  bandeja = false;

  public linstfinanciera: SelectItem[] = [{label: '...', value: null}];
  public ltipocuenta: SelectItem[] = [{label: '...', value: null}];

  public letapas: any = [];


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'DATOSSOCIO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
    this.formvalidado = true;
  }

  // Inicia CONSULTA *********************

  consultar() {
    this.rqConsulta.cmodulo = 28;
    this.rqConsulta.ctransaccion = 201;
    this.rqConsulta.CODIGOCONSULTA = 'DATOSEXPEDIENTE';
    this.rqConsulta.cpersona = this.mfiltros.cpersona;
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.dtoServicios.llenarMensaje(resp, false);
        if (resp.cod === 'OK') {
          this.manejaRespuestaDatosSocio(resp);
        }
      },
      error => {
        this.dtoServicios.manejoError(error);
      });

  }

  public crearDtoConsulta() {

  }



  public fijarFiltrosConsulta() {

  }


  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  public postQuery(resp: any) {
   // this.manejaRespuestaDatosSocio(resp);
  }
  // Fin CONSULTA *********************

  manejaRespuestaDatosSocio(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      const msocio = resp.DATOSSOCIO[0];
      this.registro.mdatos.identificacion = msocio.identificacion;
      this.mcampos.fechaAlta = msocio.falta;
      this.registro.mdatos.jerarquia = msocio.jerarquia;
      this.registro.mdatos.cjerarquia = msocio.cjerarquia;
      this.mcampos.fechaBaja = new Date(msocio.fbaja);
      this.mcampos.fnacimiento = msocio.fnacimiento;
      this.mcampos.tiemposervicio = msocio.tiemposervico;
      this.mcampos.edad = msocio.edad;
      this.mcampos.coeficiente = msocio.coeficiente;
      this.mcampos.tipobaja = msocio.tipobaja;
      if (!this.estaVacio(this.mcampos.tipobaja) && !this.bandeja) {
        this.estadoListaTipos = true;
      }
      this.mcampos.estadoSocio = msocio.estadosocio;
      this.registro.mdatos.genero = msocio.genero;
      this.mcampos.numaportaciones = msocio.totalaportes;
      this.mcampos.aporteacumulado = msocio.acumuladoaportes;
    }
    this.lconsulta = [];
  }

  /**Muestra las Etapas del expediente */
  mostrarLovEtapaExpediente(): void {
    this.lovEtapaExpediente.mfiltros.cexpediente = this.mcampos.cexpediente;
    this.lovEtapaExpediente.consultar();
    this.lovEtapaExpediente.showDialog();
  }



  fijarTiempo(): void {
    if (this.estaVacio(this.mcampos.fechaBaja)) {
      this.mcampos.tiemposervicio = this.calcularAnios(this.mcampos.fechaAlta, Date.now());
    }

    else {
      this.mcampos.tiemposervicio = this.calcularAnios(this.mcampos.fechaAlta, this.mcampos.fechaBaja);
    }

    if (!super.estaVacio(this.registro.mdatos.fnacimiento)) {
      this.mcampos.edad = this.calcularAnios(this.registro.mdatos.fnacimiento, Date.now()).substring(0, 7);
      // this.mcampos.fnacimiento = this.registro.mdatos.fnacimiento.substring(0, 10);
    }
  }






  //fijar Valores solo para simulacion.
  fijaDatosBajaSimulacion() {
    const d = new Date();

  }


  //fijar valores de datosHistoricos en fechas
  fijarValoresHistoricos(resp: any): void {
    const rows: number = Object.keys(resp).length - 1;
    this.mcampos.fechaAlta = resp[0].festado;
    this.mcampos.estadoSocio = resp[rows].mdatos.nestado;
    if (!this.estaVacio(this.registro.csubestado)) {
      this.mcampos.tipobaja = resp[rows].mdatos.ntipobaja;
      const fechabaja = new Date(resp[rows].festado);
      this.mcampos.fechaBaja = fechabaja;
      //fechabaja.getFullYear() + "/" + fechabaja.getUTCMonth() + "/" + fechabaja.getUTCDay();
    }
  }

  fijartiposLiquidacion(resp: any): void {




  }


  //enviardatosExpediente
  EnviarDatosGrabar() {

  }


}
