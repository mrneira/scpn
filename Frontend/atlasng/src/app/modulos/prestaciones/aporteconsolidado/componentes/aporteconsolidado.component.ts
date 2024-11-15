import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from './../../../personas/lov/personas/componentes/lov.personas.component';

import { LovAportesComponent } from './../../lov/aportes/componentes/lov.aportes.component'
import { JasperComponent } from '../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-aporteconsolidado',
  templateUrl: 'aporteconsolidado.html'
})
export class AporteConsolidadoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild('personas')
  private lovSocios: LovPersonasComponent;
  @ViewChild(LovAportesComponent)
  private lovAporte: LovAportesComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;
  public mostrarDialogoGenericoBusqueda: boolean;
  public fechaaporte: Date;
  public lparametros: any = [];
  public lmeses: SelectItem[] = [{ label: "...", value: null }];
  public mostrarDialogoComentario: boolean;
  public tiposmenu: SelectItem[];
  public totalAportePersonal: Number = 0;
  public totalAportePatronal: Number = 0;
  public totalRegistros = 0;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tpreaporte', 'APORTES', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
    this.consultarCatalogosGenerales();
    this.mcampos.anio = this.anioactual;
    this.mostrarDialogoComentario = false;
    this.tiposmenu = [];
    this.tiposmenu.push({ label: 'Aporte Nuevo', value: false });
    this.tiposmenu.push({ label: 'Aporte Adicional', value: true });
  }

  aceptarGrabar() {
    if (this.lregistros.length > 0) {
      this.mostrarDialogoComentario = true;

    } else {
      this.mostrarMensajeError("NO SE HAN INGRESADO APORTES");
    }
  }
  ngAfterViewInit() {
  }

  crearNuevo() {
    this.mcampos.mes = null;
    super.crearNuevo();
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.cpersona = this.mcampos.cpersona;
    this.registro.ajuste = 0;
    this.registro.activo = true;
    this.registro.valido = true;
    this.registro.descripcion = "CARGA MANUAL";
    this.registro.ajustepatronal = 0;
    this.registro.cusuariocrea = this.dtoServicios.mradicacion.cusuario;
    this.registro.fechahoracrea = this.fechaactual;
    this.registro.mdatos.eshoja = false;
  }

  cambiar(event) {
    this.registro.mdatos.eshoja = event.value;
  }

  actualizar() {
    super.actualizar();
    this.registro.fechaaporte = this.mcampos.anio + this.mcampos.mes;
    this.calcularTotalesMayor(this.lregistros);
  }

  eliminar() {
    super.eliminar();
    this.calcularTotalesMayor(this.lregistros);
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
    // this.registro.fechaaporte = this.integerToDate(registro.fechaaporte);
    this.mcampos.anio = this.integerToYear(registro.fechaaporte).toString();
    this.mcampos.mes = this.StringToMounth(registro.fechaaporte).toString();
  }
  // Inicia CONSULTA *********************
  consultar() {
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.fechaaporte desc', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 7;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.valido = true;
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    if (this.estaVacio(this.rqMantenimiento.numerodocumentobancario) && this.tran=="50") {
      super.mostrarMensajeError("INGRESE EL NÚMERO DE DOCUMENTO BANCARIO");
      return;
    }
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    //this.fechaporte = this.registro.fechaaporte;
    this.mostrarDialogoComentario = false;
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (!this.estaVacio(resp.ccomprobante)) {
      this.mcampos.ccomprobante = resp.ccomprobante;
      this.descargarReporteComprobanteContable();
      this.recargar();
    }
  }

  descargarReporteComprobanteContable(): void {
    let tipoComprobante = '';
  
    tipoComprobante =(this.tran==50)? 'Ingreso':'Diario';
    // Agregar parametros
    this.jasper.parametros['@i_ccomprobante'] = this.mcampos.ccomprobante;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/ComprobanteContable' + tipoComprobante;
    this.jasper.generaReporteCore();
  }

  /**Muestra lov de personas */
  mostrarLovPersonas(): void {
    this.lovSocios.mfiltros.csocio = 1;
    this.lovSocios.mcampos.identificacion = undefined;
    this.lovSocios.mcampos.nombre = undefined;
    this.lovSocios.showDialog();
  }
  mostrarLovAportes(): void {
    this.lovAporte.showDialog();
  }


  /**Retorno de lov de personas. */
  fijarLovSociosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cpersona = reg.registro.cpersona;
      this.registro.mdatos.npersona = reg.registro.nombre;
      this.registro.mdatos.identificacion = reg.registro.identificacion;

      this.consultar();
    }
  }

  fijarLovAportesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cpersona = reg.registro.cpersona;
      this.registro= reg.registro;
      
      this.registro.actualizar= true;
      this.registro.esnuevo=true;
      this.registro.idreg = Math.floor((Math.random() * 100000) + 1);
      this.mcampos.anio = this.integerToYear(reg.registro.fechaaporte).toString();
      this.mcampos.mes = this.StringToMounth(reg.registro.fechaaporte).toString();
     

    }
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuestaCatalogos(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  llenarConsultaCatalogos(): void {
    const mfiltrosespParam = { 'codigo': `in ('POR-APORTE-PATRONO','POR-APORTE-PERSONAL')` };
    const consultaParam = new Consulta('tpreparametros', 'Y', 't.nombre', {}, mfiltrosespParam);
    consultaParam.cantidad = 10;
    this.addConsultaPorAlias('PARAMETROS', consultaParam);

  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.lparametros = resp.PARAMETROS;
    }
    this.lconsulta = [];
  }

  Calcular() {
    this.Sueldo();
    this.AportePatronal();
  }

  Sueldo() {
    const param = 'POR-APORTE-PERSONAL';
    const valor = this.FijarParametros(param);
    this.registro.sueldo = this.registro.aportepersonal / (valor / 100);
    this.registro.sueldo = this.redondear(this.registro.sueldo, 2);
  }

  AportePatronal() {
    const param = 'POR-APORTE-PATRONO';
    const valor = this.FijarParametros(param);
    this.registro.aportepatronal = this.registro.sueldo * (valor / 100);
    this.registro.aportepatronal = this.redondear(this.registro.aportepatronal, 2);
  }
  AportePatronalAjuste() {
    if (!this.estaVacio(this.registro.ajuste)) {
      const param = 'POR-APORTE-PATRONO';
      const patronal = this.FijarParametros(param);
      const param2 = 'POR-APORTE-PERSONAL';
      const personal = this.FijarParametros(param2);
      this.registro.ajustepatronal = this.registro.ajuste * (patronal / personal)
      this.registro.ajustepatronal = this.redondear(this.registro.ajustepatronal, 2);
    } else {
      this.registro.ajustepatronal = 0;
    }
  }

  FijarParametros(param: string): number {
    for (const i in this.lparametros) {
      if (this.lparametros.hasOwnProperty(i)) {
        const reg: any = this.lparametros[i];
        if (reg !== undefined && reg.codigo === param) {
          return reg.numero;
        }
      }
    }
  }

  consultarCatalogosGenerales() {
    const mfiltrosMes: any = { 'ccatalogo': 4 };
    const consultaMes = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMes, {});
    consultaMes.cantidad = 20;
    this.addConsultaCatalogos('MESES', consultaMes, this.lmeses, super.llenaListaCatalogo, 'cdetalle');
    this.ejecutarConsultaCatalogos();
  }

  public calcularTotalesMayor(lista: any) {
    this.totalAportePatronal = 0;
    this.totalAportePersonal = 0;
    this.totalRegistros = 0;
    for (const i in this.lregistros) {
      const reg = this.lregistros[i];
      this.totalAportePatronal += reg.aportepatronal;
      this.totalAportePersonal += reg.aportepersonal;
      this.totalRegistros += 1;
    }
  }
}
