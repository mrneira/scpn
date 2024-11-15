import {Component,OnInit,AfterViewInit,ViewChild} from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { DtoServicios } from "../../../../../util/servicios/dto.servicios";
import { Consulta } from "../../../../../util/dto/dto.component";
import { Mantenimiento } from "../../../../../util/dto/dto.component";
import { BaseComponent } from "../../../../../util/shared/componentes/base.component";
import { SelectItem } from "primeng/primeng";

import { LovPartidaGastoComponent } from "../../../lov/partidagasto/componentes/lov.partidagasto.component";
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: "app-pptconsultaAfecha",
  templateUrl: "consultaAfecha.html"
})
export class ConsultaAfechaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(LovPartidaGastoComponent)
  lovPartidaGastoComponent: LovPartidaGastoComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  fecha = new Date();

  public lmesesini: SelectItem[] = [{label: '...', value: null}];
  public lmodulos: SelectItem[] = [{ label: '...', value: null }];

  public ccuenta: string;
  public ncuenta: string;
  public sortF: string = '';
  public tipoReporte: string = 'Partida'; //RRO 20220114
  public verReporte = 0; //RRO 20220114
  
  constructor(router: Router,dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'REPORTESALDOAFECHA', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    //this.obtenerParametros();
     this.mcampos.finicio = new Date(
      Number(
        this.dtoServicios.mradicacion.fcontable.toString().substring(0, 4)
      ),
      Number(
        this.dtoServicios.mradicacion.fcontable.toString().substring(4, 6)
      ) - 1,
      1
    );
    this.mcampos.ffin = this.stringToFecha(
      this.integerToFormatoFecha(this.dtoServicios.mradicacion.fcontable)
    );
    this.ccuenta = "";
    this.ncuenta = "";

    this.fijarListaMeses();
    this.consultarCatalogos();
  }

  fijarListaMeses() {
    this.lmesesini.push({ label: "ENERO", value: 1 });
    this.lmesesini.push({ label: "FEBRERO", value: 2 });
    this.lmesesini.push({ label: "MARZO", value: 3 });
    this.lmesesini.push({ label: "ABRIL", value: 4 });
    this.lmesesini.push({ label: "MAYO", value: 5 });
    this.lmesesini.push({ label: "JUNIO", value: 6 });
    this.lmesesini.push({ label: "JULIO", value: 7 });
    this.lmesesini.push({ label: "AGOSTO", value: 8 });
    this.lmesesini.push({ label: "SEPTIEMBRE", value: 9 });
    this.lmesesini.push({ label: "OCTUBRE", value: 10 });
    this.lmesesini.push({ label: "NOVIEMBRE", value: 11 });
    this.lmesesini.push({ label: "DICIEMBRE", value: 12 });
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    const mfiltrosMod: any = { activo: true, negocio: true };
    const conModulo = new Consulta('tgenmodulo', 'Y', 't.nombre', mfiltrosMod, {});
    conModulo.cantidad = 300;
    this.addConsultaCatalogos('MODULOS', conModulo, this.lmodulos, super.llenaListaCatalogo, 'cmodulo');

    this.ejecutarConsultaCatalogos();
  }

  ngAfterViewInit() {
  
  }


  mostrarLovPartidaGasto(): void {
    this.lovPartidaGastoComponent.showDialog();
  }

  
  fijarLovPartidaGastoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.msgs = [];
      this.mcampos.ccuenta = reg.registro.cpartidagasto;
      this.mcampos.ncuenta = reg.registro.nombre;
      this.ccuenta = reg.registro.cpartidagasto;
      this.ncuenta = reg.registro.nombre;
    }
  }
  
   
  public imprimir(resp: any): void {
    let estado:string;
    this.jasper.nombreArchivo = 'SALDOAFECHA';

    // Agregar parametros
    this.jasper.parametros['@i_cuenta'] = this.mcampos.ccuenta;
    this.jasper.parametros['@i_fecha'] = this.fechaToInteger(this.mcampos.fecha);

    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Presupuesto/rptPptSaldoAFecha';
    this.jasper.formatoexportar = resp;
    this.jasper.generaReporteCore();
  }
  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === "OK") {
      this.enproceso = false;
    }
  }

  //RRO 20220114
  /*las dos funciones siguientes*/
  public imprimirReporteConcialiacion(resp: any): void {   
    if(/*this.mcampos.cpartidagasto == null || */this.mcampos.aniofiscal == null || this.mcampos.mes == null)
      {
        super.mostrarMensajeError('Ingrese todos los parámetros requeridos');
        return;
      }
      
      let fechaActual = new Date()
      let dia: string =  fechaActual.getDate() < 10 ? `0${fechaActual.getDate()}` : `${fechaActual.getDate()}`;
      let mes: string = fechaActual.getMonth()+1 < 10 ? `0${fechaActual.getMonth()+1}` : `${fechaActual.getMonth()+1}`;
      let anio: string = fechaActual.getFullYear().toString();      
      let fechaHoraActual: string = anio + mes + dia + '_' + fechaActual.getHours().toString() + '' + fechaActual.getMinutes().toString();
      this.jasper.nombreArchivo = this.tipoReporte == "Partida" ? 'CONCILIACION_' + fechaHoraActual : 'CONCILIACION_DETALLE_' + fechaHoraActual;

      // Agregar parametros
      this.jasper.parametros['@parametro'] = "";
      this.jasper.parametros['@aniofiscal'] = this.mcampos.aniofiscal;
      this.jasper.parametros['@mes'] = this.mcampos.mes < 10 ? '0' + this.mcampos.mes : this.mcampos.mes;
      this.jasper.parametros['@responsable'] = this.dtoServicios.mradicacion.np;
      this.jasper.parametros['archivoReporteUrl'] = this.tipoReporte == "Partida" ? '/CesantiaReportes/Presupuesto/rptConciliacionPresupuestoContabilidad' : '/CesantiaReportes/Presupuesto/rptConciliacionPresupuestoContabilidadDetalle';
      this.jasper.formatoexportar = resp;
      this.jasper.generaReporteCore();    
  }
  private mostrar = false;
  seleccionar(event) {

    this.mcampos.cpartidagasto = null;
    this.mcampos.aniofiscal = null;
    this.mcampos.mes = null;
    this.verReporte = event;
    //CCA 20240716
    if(this.verReporte == 1){
      this.tipoReporte = "Partida"
       this.mostrar = false;
       }
     else{
       this.tipoReporte = "Cuenta"; 
       this.mostrar = false; 
     }
  }
}
