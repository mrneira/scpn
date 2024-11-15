import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { LovPersonasComponent } from './../../../../personas/lov/personas/componentes/lov.personas.component';
//import { LovFuncionariosComponent } from '../../../lov/funcionarios/componentes/lov.funcionarios.component';

import { MenuItem } from 'primeng/components/common/menuitem';
import { flatten } from '@angular/compiler';
@Component({
  selector: 'app-novedades',
  templateUrl: 'novedades.html'
})
export class PagoNovedadesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  //  @ViewChild(LovFuncionariosComponent)
  // private lovFuncionarios: LovFuncionariosComponent;

  public ltipo: SelectItem[] = [{ label: '...', value: null }];

  public lmeses: SelectItem[] = [{ label: '...', value: null }];

  public lbancos: SelectItem[] = [{ label: '...', value: null }];

  public ltipocuenta: SelectItem[] = [{ label: '...', value: null }];
  public ldatos: any = [];
  public cerrar: boolean = false;
  public aprobada: boolean = false;
  selectedRegistros;
  public mostrarDialogoPago = false;
  @ViewChild(LovPersonasComponent)
  private lovSocios: LovPersonasComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tsocnovedadades', 'NOVEDADES', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    // this.consultar();  // para ejecutar consultas automaticas.
    this.consultarCatalogos();
  }
  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();


    const mfiltroslbanco: any = { 'ccatalogo': 305, 'activo': true };
    const consultaBanco = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltroslbanco, {});
    consultaBanco.cantidad = 200;
    this.addConsultaCatalogos('TIPOBANCO', consultaBanco, this.lbancos, super.llenaListaCatalogo, 'cdetalle');

    const mfiltrosTipo: any = { 'ccatalogo': 306 };
    const consultaTipo = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosTipo, {});
    consultaTipo.cantidad = 200;
    this.addConsultaCatalogos('TNTIPOCUENTA', consultaTipo, this.ltipocuenta, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }
  mostrarLovPersonas(): void {
    // this.lovSocios.mfiltros.csocio = 1;
    this.lovSocios.mcampos.identificacion = undefined;
    this.lovSocios.mcampos.nombre = undefined;
    this.lovSocios.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovSociosSelec(reg: any): void {

    if (reg.registro !== undefined) {
      this.mcampos.cdetalletipoexp = null
      // this.collapsed = false;
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.npersona = reg.registro.nombre;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.mfiltros.cpersona = reg.registro.cpersona;
      this.consultar();
    }
  }
  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.justificada = false;
    this.registro.fingreso = this.fechaactual;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
  }

  actualizar() {
    if(this.estaVacio(this.registro.supa)){
      this.registro.supa=false;
    }
    super.actualizar();    
    this.grabar();
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

  // Inicia CONSULTA *********************
  consultar() {

    this.crearDtoConsulta();
    super.consultar();

  }

  public obtenertotal(resp: any): number {
    const valorliquidacion = this.redondear(resp.totalingresos, 2);//this.valoresExpediente.regDatosExp.subtotal;
    let valor = 0;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        if (this.lregistros[i].estado === 'ACT') {
          if (this.lregistros[i].porcentajeretencion > 0) {
            this.lregistros[i].valor = (valorliquidacion * this.lregistros[i].porcentajeretencion) / 100;
          }
          this.lregistros[i].valor = this.redondear(this.lregistros[i].valor, 2);
          let vret = (valorliquidacion * this.lregistros[i].porcentajeretencion) / 100;
          vret = this.redondear(vret, 2);
          valor = valor + vret;
        }
      }
    }
    this.mcampos.total = valor;
    // this.valoresExpediente.regDatos.tretenciones = valor;
    // this.valoresExpediente.calcularTotalLiquidacion(false,'');
    return valor
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();


    const consulta = new Consulta(this.entityBean, 'Y', 't.cnovedad', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ntiponovedad', 'i.ccatalogo = t.ccatalogonovedad and i.cdetalle = t.cdetallenovedad');

    consulta.orderby = 'cnovedad desc';
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }


  private fijarFiltrosConsulta() {

    //VALIDAR FILTRO ESTADO "ACT"
    this.mfiltros.retencion = false;
    this.mfiltros.pagado = false;
    this.mfiltrosesp.valor = " > 0";
    this.mfiltrosesp.cdetallenovedad = "not in ('PAGEXT','20','19','1','ANTCLA','ANTOFI')";
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************
  aprobarEtapa() {
    this.mcampos.msg = "INGRESE EL COMENTARIO PARA GENERAR PAGO";
    this.mostrarDialogoPago = true;
  }
  aprobarpago() {


    if (this.aprobarSolicitud()) {
      this.rqMantenimiento.mdatos.ldatos = this.ldatos;
      this.rqMantenimiento.mdatos.cpersona = this.mfiltros.cpersona;
      // this.rqMantenimiento.mdatos.tipocdetalle = this.mfiltros.tipocdetalle;
      this.grabar();

    } else {
      super.mostrarMensajeError("NO SE HAN SELECIONADO REGISTROS PARA GENERAR EL PAGO, O AÚN NO SE HA INGRESADO LOS DATOS BANCARIOS DE ALGÚN REGISTRO");
    }
  }

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    super.grabar();
  }



  negarSolicitud(): boolean {
    // let mensaje: string = '';
    this.cerrar = false;
    this.ldatos = [];
    this.aprobada = false;
    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];

        this.ldatos.push(reg);
        this.cerrar = true;
      }
    }
    if (this.selectedRegistros != null && this.selectedRegistros.length == 0) {
      this.cerrar = false;
      return false;

    }
    return true;
  }
  getTotal(): Number {
    let total = 0;

    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];
        total = super.redondear(total + reg.valor, 2);
      }
    }

    if (total > 0) {
      this.mcampos.total = total;
    }

    return total;
  }
  aprobarSolicitud() {
    // let mensaje: string = '';
    this.cerrar = false;
    this.ldatos = [];
    this.aprobada = true;
    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];
        if (!this.estaVacio(reg.cdetalletipocuenta) && !this.estaVacio(reg.cdetallebanco) && !this.estaVacio(reg.cuenta) && !this.estaVacio(reg.novedad) && !this.estaVacio(reg.identificacion)) {
          this.ldatos.push(reg);
        } else {
          this.mostrarMensajeError("EXISTEN DATOS SIN INFORMACIÓN BANCARIA PARA PROCESAR");

          this.cerrar = false;
          return false;
        }
        this.cerrar = true;
      }
    }
    if (this.ldatos != null && this.ldatos.length == 0) {
      this.cerrar = false;
      return false;

    }
    return true;
  }
  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod != 'OK') {
      super.mostrarMensajeError(resp.msgusu);
    }
    if (resp.VALIDADO) {
      this.recargar();
    }

  }
  datossupa() {

    if (this.registro.supa) {


      this.rqConsulta.CODIGOCONSULTA = 'DATOS-PAGO-SUPA';
      this.msgs = [];
      this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
        .subscribe(
          resp => {

            if (resp.cod != 'OK') {
              this.limpiardatos();
              super.mostrarMensajeError(resp.msgusu);
            } else {
              this.registro.beneficiario = resp.beneficiario;
              this.registro.cdetalletipocuenta = resp.cdetalletipocuenta;
              this.registro.cuenta = resp.cuenta;
              this.registro.identificacion=resp.identificacion;
              this.registro.cdetallebanco = resp.cdetallebanco;
            }
          })
    }
    else {

      this.limpiardatos();
    }
  }
  limpiardatos() {
    this.registro.identificacion=null;
    this.registro.beneficiario = null;
    this.registro.cdetalletipocuenta = null;
    this.registro.cuenta = null;
    this.registro.cdetallebanco = null;
  }
}
