import { Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { JasperComponent } from '../../../../../../util/componentes/jasper/componentes/jasper.component';
import { SelectItem } from 'primeng/primeng';


@Component({
  selector: 'app-beneficiario',
  templateUrl: 'beneficiario.html'
})
export class BeneficiarioComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();

  public lparentezco: SelectItem[] = [{ label: '...', value: null }];
  public lbancos: SelectItem[] = [{ label: '...', value: null }];
  public ltipocuenta: SelectItem[] = [{ label: '...', value: null }];
  public ltipoNovedad: SelectItem[] = [{ label: '...', value: null }];

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  fecha = new Date();
  mensaje = "";
  public edited = false;
  public requerido = false;
  public mostrarEditar = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tprebeneficiario', 'BENEFICIARIOS', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
    //this.mfiltros.cpersona = 0;
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.ccatalogoparentesco = 1126;
    this.registro.cdetalleparentesco = '0';
    this.registro.tipoinstitucionccatalogo = 305
    this.registro.tipocuentaccatalogo = 306
    this.registro.pagoexterno = false;
    this.registro.estado = true;
    this.registro.curador = false;
    this.registro.curtipoinstitucionccatalogo=305;
    this.registro.curtipocuentaccatalogo=306;
  }

  actualizar() {
    super.actualizar();
    //  this.grabar();
    this.registro.curtipocuentaccatalogo = 306;
    this.registro.curtipoinstitucionccatalogo = 305;
    this.registrarEtiqueta(this.registro, this.lparentezco, 'cdetalleparentesco', 'nparentezco');
    this.registrarEtiqueta(this.registro, this.lbancos, 'tipoinstitucioncdetalle', 'nbanco');
    this.registrarEtiqueta(this.registro, this.ltipocuenta, 'tipocuentacdetalle', 'ncuenta');
    if (this.mcampos.bandeja) {
      this.registro.secuencia = this.mcampos.secuencia;
      this.grabar();
    }

  }

  eliminar() {
    super.eliminar();
    if (this.mcampos.bandeja) {
      this.grabar();
    }
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  cancelar() {
    super.cancelar();
  }


  // Inicia CONSULTA *********************
  consultar() {
    if (this.mcampos.cdetalleetapa === '4') {
      this.editable = true;
      this.mostrarEditar = true;
    }

    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.codigobeneficiario', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nparentezco', 'i.ccatalogo = t.ccatalogoparentesco and i.cdetalle = t.cdetalleparentesco');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nbanco', 'i.ccatalogo = t.tipoinstitucionccatalogo and i.cdetalle = t.tipoinstitucioncdetalle');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ncuenta', 'i.ccatalogo = t.tipocuentaccatalogo and i.cdetalle = t.tipocuentacdetalle');
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.pagoexterno = false;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    // this.obtenertotal();
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
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
    this.eventoCliente.emit({ registro: true });

  }

  descargaReporte(registro: any) {
    this.jasper.parametros['@i_identificacion'] = this.mcampos.identificacion;
    this.jasper.parametros['@i_beneficiario'] = registro.codigobeneficiario;
    this.jasper.parametros['@w_usuario'] = this.dtoServicios.mradicacion.np;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestaciones/Carta';
    this.jasper.formatoexportar = 'pdf';
    this.jasper.generaReporteCore();
  }
}
