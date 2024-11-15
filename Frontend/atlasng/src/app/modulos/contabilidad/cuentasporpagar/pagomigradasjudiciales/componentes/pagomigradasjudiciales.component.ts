import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovProveedoresComponent } from '../../../lov/proveedores/componentes/lov.proveedores.component';
import { SelectItem } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { CabeceraComponent } from '../submodulos/cabecera/componentes/_cabecera.component';
import { DetalleComponent } from '../submodulos/detalle/componentes/_detalle.component';

@Component({
  selector: 'app-pagomigradasjudiciales',
  templateUrl: 'pagomigradasjudiciales.html'
})
export class PagoMigradasJudicialesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovProveedoresComponent)

  @ViewChild(CabeceraComponent)
  cabeceraComponent: CabeceraComponent;

  @ViewChild(DetalleComponent)
  detalleComponent: DetalleComponent;

  lovproveedores: LovProveedoresComponent;
  selectedCXP: any = [];
  lregistrospendientes: any = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconcuentaporpagarmigrada', 'CABECERA', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    let finicio = new Date(this.anioactual, this.fechaactual.getMonth(), 1);
    this.consultarCatalogos();
    // this.mfiltros.fingresoini = finicio;
    // this.mfiltros.fingresofin = this.fechaactual;
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }


  //#region consultacuentasporpagar
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.estadocxpcdetalle = 'MIGRAD';
    this.mfiltros.tipocxp = 'LI'; //FILTRO PARA LIQUIDACION TOTAL DE REGISTRO
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cctaporpagarmigrada', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tperproveedor', 'nombre', 'nbeneficiario', 't.cpersona = i.cpersona and i.cliente = 1');
    consulta.addSubquery('tconcatalogo', 'nombre', 'ncuenta', 't.ccuentaafectacion = i.ccuenta ');
    consulta.cantidad = 500;
    this.addConsulta(consulta);
    return consulta;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }


  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  //#endregion


  //Inicia MANTENIMIENTO *********************
  grabar(): void {

    if (this.selectedCXP.length === 0 || this.estaVacio(this.selectedCXP)) {
      super.mostrarMensajeError("NO EXISTEN REGISTROS SELECCIONADOS PARA REALIZAR PAGOS");
      return;
    }

    if (this.selectedCXP.valorpagar < this.detalleComponent.totalDetalleCxp){
      super.mostrarMensajeError("VALOR INGRESADO PARA BENEFICIARIO ES MAYOR AL VALOR DE LA CUENTA POR PAGAR");
      return;
    }

    if (this.detalleComponent.lregistros.length > 1 ){
      super.mostrarMensajeError("SOLO PUEDE INGRESAR UN BENEFICIARIO");
      return;
    }

    if (super.estaVacio(this.mcampos.comentario)) {
      super.mostrarMensajeError("INGRESE EL COMENTARIO");
      return;
    }

    this.rqMantenimiento.mdatos.comentario = this.mcampos.comentario;
    this.crearDtoMantenimiento();
    super.grabar();
    this.lregistros = [];
  }

  public crearDtoMantenimiento() {
    this.lregistros = [];
    const reg = this.selectedCXP;
    reg.esnuevo = true;
    this.lregistros.push(reg);
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
    super.addMantenimientoPorAlias(this.detalleComponent.alias, this.detalleComponent.getMantenimiento(2));
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    this.lregistros = [];
    this.lregistrospendientes = [];
  }

  fijarLovProveedores(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.mcampos.nombre = reg.registro.nombre;
    }
  }

  mostrarlovproveedores(): void {
    this.lovproveedores.showDialog();
  }



  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.encerarMensajes();
          this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
          this.manejaRespuestaCatalogos(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  llenarConsultaCatalogos(): void {
    const mfiltroInsFin: any = { 'ccatalogo': 305,'activo': true };
    const consultaInsFin = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroInsFin, {});
    consultaInsFin.cantidad = 500;
    this.addConsultaPorAlias('INSFIN', consultaInsFin);

    const mfiltroTipoCuenta: any = { 'ccatalogo': 306 };
    const consultaTipoCuenta = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTipoCuenta, {});
    consultaTipoCuenta.cantidad = 20;
    this.addConsultaPorAlias('TIPCUENTA', consultaTipoCuenta);

  }


  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.detalleComponent.linstfinanciera, resp.INSFIN, 'cdetalle');
      this.llenaListaCatalogo(this.detalleComponent.ltipocuenta, resp.TIPCUENTA, 'cdetalle');
    }
    this.lconsulta = [];
  }
}
