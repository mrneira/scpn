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

@Component({
  selector: 'app-pagomigradas',
  templateUrl: 'pagomigradas.html'
})
export class PagoMigradasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  @ViewChild(LovProveedoresComponent)
  lovproveedores: LovProveedoresComponent;
  selectedRegistros: any = [];
  lregistrospendientes: any = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconcuentaporpagarmigrada', 'tconcuentaporpagarmigrada', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    let finicio = new Date(this.anioactual, this.fechaactual.getMonth(), 1);
    // this.mfiltros.fingresoini = finicio;
    // this.mfiltros.fingresofin = this.fechaactual;
    this.consultar();
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
    this.mfiltros.tipocxp = 'LT'; //FILTRO PARA LIQUIDACION TOTAL DE REGISTRO
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cctaporpagarmigrada', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tperproveedor','nombre','nbeneficiario','t.cpersona = i.cpersona and i.cliente = 0');
    consulta.addSubquery('tconcatalogo','nombre','ncuenta','t.ccuentaafectacion = i.ccuenta ');
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
  
  aprobarEtapa() {
    if (this.selectedRegistros.length === 0 || this.estaVacio(this.selectedRegistros)) {
      super.mostrarMensajeError("NO EXISTEN REGISTROS SELECCIONADOS PARA REALIZAR PAGOS");
      return;
    }
    this.mcampos.msg = "INGRESE EL COMENTARIO PARA GENERAR EL COMPROBANTE ";
    this.mostrarDialogoGenerico = true;
  }
  //Inicia MANTENIMIENTO *********************
  grabar(): void {

    
    this.mostrarDialogoGenerico = false;
    this.crearDtoMantenimiento();
    super.grabar();
    this.lregistros=[];
  }

  public crearDtoMantenimiento() {
    // tslint:disable-next-line:forin
    this.lregistros = [];
    for (const i in this.selectedRegistros) {
      const reg = this.selectedRegistros[i];
      reg.esnuevo = true;
      reg.estadocxpcdetalle = 'PAGADA';
      this.lregistros.push(reg);
    }
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    this.lregistros = [];
    this.lregistrospendientes = [];
    if(resp.mayorizado==="OK"){
      this.recargar();
    }

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
}
