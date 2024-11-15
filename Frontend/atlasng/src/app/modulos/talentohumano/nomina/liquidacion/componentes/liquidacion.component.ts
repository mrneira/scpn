import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { AppService } from 'app/util/servicios/app.service';
import { LovFuncionariosComponent } from '../../../lov/funcionarios/componentes/lov.funcionarios.component';
import { DatosgeneralesComponent } from "../submodulos/datosgenerales/componentes/datosgenerales.component";
import { DetalleComponent } from "../submodulos/detalle/componentes/detalle.component";
import { IngresoComponent } from "../submodulos/ingreso/componentes/ingreso.component";
import { EgresoComponent } from "../submodulos/egreso/componentes/egreso.component";

@Component({
  selector: 'app-liquidacion',
  templateUrl: 'liquidacion.html'
})
export class LiquidacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;


  @ViewChild(DatosgeneralesComponent)
  tablaCabecera: DatosgeneralesComponent;

  @ViewChild(DetalleComponent)
  private tablaDetalle: DetalleComponent;

  @ViewChild(IngresoComponent)
  public tablaIngreso: IngresoComponent;

  @ViewChild(EgresoComponent)
  public tablaEgreso: EgresoComponent;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;

  public ltipo: SelectItem[] = [{ label: '...', value: null }];
  public nuevo = true;
  public cerrada = false;
  public nuevaLiquidacion = false;

  public ldatos: any = [];
  constructor(router: Router, dtoServicios: DtoServicios, public route: ActivatedRoute, public appService: AppService) {
    super(router, dtoServicios, 'ABSTRACT', 'LIQUIDACIONGENERAL', false);
  }
  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros, this.route);
    this.consultarCatalogos();
    this.tablaDetalle.ins = true;
    this.tablaDetalle.editable = true;
    this.tablaDetalle.del = true;
  }

  ngAfterViewInit() {
    this.route['queryParams'].subscribe((p: any) => {
      if (p.sol) {
        const sol = JSON.parse(p.sol);
        this.ldatos = sol.ldatos;
        this.tablaCabecera.registro.cliquidacion = sol.cliquidacion;
        this.componentehijo.mcampos.cliquidacion = sol.cliquidacion;
        this.componentehijo.nuevaLiquidacion=  sol.nuevaLiquidacion;
        this.tablaCabecera.nuevo = sol.nuevaNomina;
        this.componentehijo.cerrada = sol.cerrada;
        //this.mfiltros = sol.mfiltros;

        this.nuevaLiquidacion = sol.nuevaliquidacion;

      }
    });
    this.consultarGeneral();
  }
  consultarGeneral() {
    if (this.nuevaLiquidacion) {
      this.componentehijo.nuevo = true;
    } else {
      this.consultar();
      this.componentehijo.nuevo = false;

    }
  }
  crearNuevo() {

  }

  actualizar() {
  }

  eliminar() {
  }

  cancelar() {
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.estaVacio(this.mcampos.cliquidacion)) {
      this.mostrarMensajeError('ELIJA UNA LIQUIDACIÓN PARA REALIZAR EL MANTENIMIENTO');
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }
  consultarDetalle(reg: any) {

    this.crearDtoConsultaDetalle(reg);
    super.consultar();
  }
  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();

    const consCabecera = this.tablaCabecera.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaCabecera.alias, consCabecera);

    const consEgreso = this.tablaEgreso.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaEgreso.alias, consEgreso);

    const consIngreso = this.tablaIngreso.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaIngreso.alias, consIngreso);

  }
  public crearDtoConsultaDetalle(reg: any) {
    this.fijarFiltrosConsultaDetalle(reg);
    const consIngreso = this.tablaIngreso.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaIngreso.alias, consIngreso);

    const consEgreso = this.tablaEgreso.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaEgreso.alias, consEgreso);

  }
  private fijarFiltrosConsulta() {
    this.tablaCabecera.mfiltros.cliquidacion = this.mcampos.cliquidacion;
    this.tablaCabecera.mcampos.cliquidacion = this.mcampos.cliquidacion;
    this.tablaEgreso.mfiltros.cliquidacion = this.mcampos.cliquidacion;
    this.tablaEgreso.mcampos.cliquidacion = this.mcampos.cliquidacion;
    this.tablaIngreso.mfiltros.cliquidacion = this.mcampos.cliquidacion;
    this.tablaIngreso.mcampos.cliquidacion = this.mcampos.cliquidacion;
    //ASIGNAR A DETALLE DE LIQUIDACIONES
    this.tablaDetalle.mcampos.cliquidacion = this.mcampos.cliquidacion;

  }
  private fijarFiltrosConsultaDetalle(reg: any) {
    this.tablaIngreso.mfiltros.ingreso = true;
    this.tablaEgreso.mfiltros.ingreso = false;
  }


  guardarCambios() {
    this.grabar();
  }
  finalizarIngreso(): void {
    let mensaje = ''//this.validarGrabar();
    if (mensaje !== '') {
      super.mostrarMensajeError(mensaje);
      return;

    }
    this.rqMantenimiento.mdatos={};
    this.rqMantenimiento.mdatos.cerrada = true;
    this.rqMantenimiento.mdatos.ING = this.tablaIngreso.lregistros;
    this.rqMantenimiento.mdatos.EGR = this.tablaEgreso.lregistros;
    this.rqMantenimiento.mdatos.registro= this.tablaCabecera.registro;
    this.tablaCabecera.registro.cerrada = true;

    super.grabar();
  }
  validaFiltrosConsulta(): boolean {
    return (
      this.tablaCabecera.validaFiltrosRequeridos() &&
      this.tablaEgreso.validaFiltrosRequeridos() &&
      this.tablaIngreso.validaFiltrosRequeridos()

    );
  }


  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.tablaCabecera.postQuery(resp);
    // this.tablaDetalle.postQuery(resp);
    this.tablaIngreso.postQuery(resp);
    this.tablaEgreso.postQuery(resp);
    this.nuevo = false;
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.rqMantenimiento.mdatos={};
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    if (this.nuevo) {
      this.tablaCabecera.selectRegistro(this.tablaCabecera.registro);
      this.tablaCabecera.actualizar();

    } else {
      this.tablaCabecera.registro.actualizar = true;
      this.tablaCabecera.registro.cusuariomod = this.dtoServicios.mradicacion.cusuario;
      this.tablaCabecera.registro.fmodificacion = this.fechaactual;
    }
    this.rqMantenimiento.mdatos.nuevo = this.nuevo;
    this.rqMantenimiento.mdatos.registro = this.tablaCabecera.registro;

    super.addMantenimientoPorAlias(this.tablaCabecera.alias, this.tablaCabecera.getMantenimiento(1));
    //super.addMantenimientoPorAlias(this.tablaDetalle.alias, this.tablaDetalle.getMantenimiento(2));
    super.addMantenimientoPorAlias(this.tablaIngreso.alias, this.tablaIngreso.getMantenimiento(2));
    super.addMantenimientoPorAlias(this.tablaEgreso.alias, this.tablaEgreso.getMantenimiento(3));

    super.grabar();
  }
  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosMes: any = { 'ccatalogo': 4 };
    const consultaMes = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMes, {});
    consultaMes.cantidad = 50;
    this.addConsultaCatalogos('MESES', consultaMes, this.tablaCabecera.lmeses, super.llenaListaCatalogo, 'cdetalle');
    const mfiltrosTipo: any = { 'ccatalogo': 1152 };
    const consultaTipo = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosTipo, {});
    consultaTipo.cantidad = 50;
    this.addConsultaCatalogos('TIPO', consultaTipo, this.tablaDetalle.ltipo, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }
  
  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  obtnerdatos(reg: any) {
    this.rqConsulta.CODIGOCONSULTA = 'TLIQUIDACION';
    this.rqConsulta.mdatos.registro = this.tablaCabecera.registro;
    this.rqConsulta.mdatos.consulta = reg.registro;
    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.lregistros = [];
          if (resp.cod === 'OK') {
            const reg = resp.DATOS[0];
            reg.esnuevo = true;
            reg.actualizar = false;
            reg.idreg = Math.floor((Math.random() * 100000) + 1);
            this.tablaIngreso.selectRegistro(reg);
            this.tablaIngreso.actualizar();
          }else{
            super.mostrarMensajeError(resp.msgusu);
          }

          //   this.cargadatos();
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }
  public postCommit(resp: any) {

    if (resp.cod === 'OK') {

      this.tablaCabecera.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaCabecera.alias));
      this.tablaIngreso.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaIngreso.alias));
      this.tablaEgreso.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaEgreso.alias));

    }

    if (!this.estaVacio(resp.LIQUIDACIOND)) {
      this.mcampos.cliquidacion = resp.LIQUIDACIOND.cliquidacion;

      this.tablaCabecera.mcampos.cliquidacion = this.mcampos.cliquidacion;
      this.tablaDetalle.mcampos.cliquidacion = this.mcampos.cliquidacion;
      this.tablaIngreso.mcampos.cliquidacion = this.mcampos.cliquidacion;
      this.tablaEgreso.mcampos.cliquidacion = this.mcampos.cliquidacion;
      this.nuevo = false;
      this.enproceso=false;
      this.consultar();
    }
    
    
    if (resp.cerrada) {
      this.cerrada = true;
    }
  }


  mostrarLovFuncionario(): void {
    this.lovFuncionarios.showDialog();
  }

  validaGrabar() {
    return this.tablaCabecera.validaGrabar()
  }
  /**Retorno de lov de personas. */
  fijarLovFuncionarioSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.registro.cfuncionario = reg.registro.cfuncionario;
      this.mcampos.nfuncionario = reg.registro.primernombre + " " + reg.registro.primerapellido;
      this.registro.mdatos.nnombre = reg.registro.primernombre;
      this.registro.mdatos.napellido = reg.registro.primerapellido;
    }
  }



}
