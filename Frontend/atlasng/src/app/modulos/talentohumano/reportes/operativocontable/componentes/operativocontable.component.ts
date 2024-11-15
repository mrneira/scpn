import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component'
import { LovCuentasContablesComponent } from '../../../../contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component';

@Component({
  selector: 'app-usuario-reporte',
  templateUrl: 'operativocontable.html'
})
export class OperativocontableReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPersonasComponent)
  public lovPersonas: LovPersonasComponent;

  @ViewChild(LovCuentasContablesComponent)
  lovCuentasContables: LovCuentasContablesComponent;

  ccuenta = '';
  public diasDeshabilidatos: any = [];
  public diasDeshabilidatosfin: any = [];

  lcuentas: SelectItem[] = [];
  selectedCuentas: string[] = [];
  
  selectedCentro: string[] = [];
  
  selectedMes: string[] = [];
   selecttempMes: string[] = [];
  public lniveles: SelectItem[] = [{ label: '...', value: null }];
  public ltipoplancuentas: SelectItem[] = [{ label: '...', value: null }];
  public lcentros: SelectItem[] = [{ label: '...', value: null }];
  public lCcostocdetalle: SelectItem[] = [{ label: '...', value: null }];
  public mostrarFechas: boolean;

  private catalogoCcostoDetalle: CatalogoDetalleComponent;

  public valoradio = null;
  selectedmodelo: string;
  consaldo = "";
  connotas = "";
  index = 0;
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'REPORTEBALANCEGENERAL', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.anio = this.anioactual;
    //  this.consultarCatalogos();
    this.consultarCatalogosGenerales();
  }

  ngAfterViewInit() {
  }

  handleChange(e) {
    this.index = e.index;
  }
  mostrarLovCuentasContables(): void {
    this.lovCuentasContables.showDialog(true); // con true solo muestra cuentas de movimiento.
  }

  fijarLovCuentasContablesSelec(reg: any): void {

    if (reg.registro !== undefined) {
      this.msgs = [];
      this.registro.ccuenta = reg.registro.ccuenta;
      this.mcampos.ccuenta = reg.registro.ccuenta;
      this.mcampos.ncuenta = reg.registro.nombre;
      this.rqMantenimiento.ccuenta = this.mcampos.ccuenta;

    }
  }
  cuentaBlur(event) {

    if (event.srcElement.value === '') {
      return;
    }

    if (event.srcElement.value === this.ccuenta) {
      return;
    }

    this.borrarParametros();
    this.rqConsulta.CODIGOCONSULTA = 'CONSULTACUENTACONTABLE';
    this.rqConsulta.storeprocedure = "sp_ConConsultarCuentaContable";
    this.rqConsulta.parametro_ccuenta = event.srcElement.value;
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuesta(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
    this.rqConsulta.CODIGOCONSULTA = null;
  }
  borrarParametros() {
    this.rqConsulta.CODIGOCONSULTA = undefined;
    this.rqConsulta.storeprocedure = undefined;
    this.rqConsulta.parametro_ccuenta = undefined;
    this.rqConsulta.parametro_ccuenta = undefined;
    this.rqConsulta.parametro_finicio = undefined;
    this.rqConsulta.parametro_ffin = undefined;
    this.rqConsulta.parametro_ccosto = undefined;

  }
  private manejaRespuesta(resp: any) {
    let cuentacontable;
    if (resp.CONSULTACUENTACONTABLE.length === 1) {
      cuentacontable = resp.CONSULTACUENTACONTABLE;
      this.mcampos.ncuenta = cuentacontable[0].nombre;
      this.mcampos.tipo = cuentacontable[0].tipo;
      this.ccuenta = this.mcampos.ccuenta;
    } else {
      this.mcampos.ccuenta = undefined;
      this.mcampos.ncuenta = undefined;
      this.mostrarMensajeError("CUENTA CONTABLE NO EXISTE");
    }
    this.rqConsulta.CODIGOCONSULTA = null;
  }

  consultarCatalogosGenerales() {
    const mfiltrosMes: any = { 'ccatalogo': 4 };
    const consultaMes = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMes, {});
    consultaMes.cantidad = 50;
    this.addConsultaCatalogos('MESES', consultaMes, this.lmeses, super.llenaListaCatalogo, 'cdetalle', this.componentehijo, false);


    const mfiltrosRubros: any = { 'ccatalogo': 1145 };
    const consultaRubros = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosRubros, {});
    consultaRubros.cantidad = 50;
    this.addConsultaCatalogos('RUBROS', consultaRubros, this.lCcostocdetalle, super.llenaListaCatalogo, 'cdetalle', this.componentehijo, false);

    const mfiltrosCentro: any = { 'ccatalogo': 1002 };
    const consultaCentros = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosCentro, {});
    consultaCentros.cantidad = 50;
    this.addConsultaCatalogos('CENTROS', consultaCentros, this.lcentros, super.llenaListaCatalogo, 'cdetalle', this.componentehijo, false);


    this.ejecutarConsultaCatalogos();
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  imprimir(resp: any): void {
    this.jasper.nombreArchivo = 'OperativoContable';
    this.jasper.parametros['@i_ccuenta'] = undefined;
    this.jasper.parametros['@i_particion'] = undefined;
    this.jasper.parametros['@i_cmodulo'] = undefined;
    this.jasper.parametros['@i_csaldo'] = undefined;
    this.jasper.parametros['@i_ccentro'] = undefined;
    this.jasper.parametros['archivoReporteUrl'] = undefined;
   this.selecttempMes=[];
    let mensaje = "";
    
    switch (this.index) {
      case 0:
        mensaje = this.validarAcumulado();
        if (mensaje !== "") {
          super.mostrarMensajeError(mensaje);
          return;
        }
        for (const i in this.selectedMes) {
          if (this.selectedMes.hasOwnProperty(i)) {
            let reg =this.selectedMes[i]; 
            this.selecttempMes.push( this.mcampos.anio+reg);
          }
        }
        this.jasper.parametros['@i_particion'] =this.selecttempMes;
        this.jasper.parametros['@i_cmodulo'] = 11;

        this.jasper.parametros['@i_ccuenta'] = (!this.estaVacio(this.mcampos.ccuenta)) ? this.mcampos.ccuenta : 'V';

        this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/rptTthMovimientosContables';
        break;



        
      case 1:
        mensaje = this.validarAcumuladoCuentas();
        if (mensaje !== "") {
          super.mostrarMensajeError(mensaje);
          return;
        }
        for (const i in this.selectedMes) {
          if (this.selectedMes.hasOwnProperty(i)) {
            let reg =this.selectedMes[i]; 
            this.selecttempMes.push( this.mcampos.anio+reg);
          }
        }
        this.jasper.parametros['@i_particion'] = this.selecttempMes; 
        this.jasper.parametros['@i_ccuenta'] = (!this.estaVacio(this.mcampos.ccuenta)) ? this.mcampos.ccuenta : 'V';
        this.jasper.parametros['@i_csaldo'] = this.selectedCuentas;
        this.jasper.parametros['@i_ccentro'] = this.selectedCentro;
        this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/rptTthMovimientosContablesCuenta';
        break;
      case 2:
        mensaje = this.validarAcumuladoCuentas();
        if (mensaje !== "") {
          super.mostrarMensajeError(mensaje);
          return;
        }
      
        for (const i in this.selectedMes) {
          if (this.selectedMes.hasOwnProperty(i)) {
            let reg =this.selectedMes[i]; 
            this.selecttempMes.push( this.mcampos.anio+reg);
          }
        }
        this.jasper.parametros['@i_particion'] =this.selecttempMes;
        this.jasper.parametros['@i_ccuenta'] = (!this.estaVacio(this.mcampos.ccuenta)) ? this.mcampos.ccuenta : 'V';
        this.jasper.parametros['@i_csaldo'] = this.selectedCuentas;
        this.jasper.parametros['@i_ccentro'] = this.selectedCentro;
        this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/rptTthMovimientosContablesRubro';


        break;
    }

    this.jasper.formatoexportar = resp;

    this.jasper.generaReporteCore();

    //this.mcampos.fperiodo = new Date().getFullYear();
  }

  validarAcumulado(): string {
    let mensaje = "";
    mensaje = this.validarFormulario();
    if (this.estaVacio(this.mcampos.anio)) mensaje += "INGRESE EL AÑO  <br />";
    if (this.estaVacio(this.selectedMes)) mensaje += "SELECCIONE EL MES  <br />";
    return mensaje;
  }

  validarAcumuladoCuentas(): string {
    let mensaje = "";
    mensaje = this.validarFormulario();
    if (this.estaVacio(this.mcampos.anio)) mensaje += "INGRESE EL AÑO  <br />";
    if (this.estaVacio(this.selectedMes)) mensaje += "SELECCIONE EL MES  <br />";
    if (this.estaVacio(this.selectedCuentas)) mensaje += "SELECCIONE AL MENOS UN RUBRO  <br />";
    if (this.estaVacio(this.selectedCentro)) mensaje += "SELECCIONE AL MENOS UN CENTRO DE COSTOS  <br />";
    
    return mensaje;
  }

  validarFormulario(): string {
    let mensaje = "";
    return mensaje;
  }

  public cambiaRadio() {
    this.mostrarFechas = !this.mostrarFechas;
    if (this.mostrarFechas) {
      this.mcampos.fperiodo = new Date().getFullYear();

    }
  }

  /**Muestra lov de personas */
  mostrarLovPersonas(): void {
    this.lovPersonas.mfiltros.tipodepersona = 'N';
    this.lovPersonas.showDialog();
  }




}
