import {Component,OnInit,AfterViewInit,ViewChild} from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { DtoServicios } from "../../../../../util/servicios/dto.servicios";
import { Consulta } from "../../../../../util/dto/dto.component";
import { Mantenimiento } from "../../../../../util/dto/dto.component";
import { BaseComponent } from "../../../../../util/shared/componentes/base.component";
import { SelectItem } from "primeng/primeng";
import { LovCuentasContablesComponent } from "../../../lov/cuentascontables/componentes/lov.cuentasContables.component";
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: "app-extractonoconciliado",
  templateUrl: "extractonoconciliado.html"
})
export class ExtractonoconciliadoComponent extends BaseComponent implements OnInit, AfterViewInit {
 

  @ViewChild(LovCuentasContablesComponent)
  lovCuentasContables: LovCuentasContablesComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  fecha = new Date();
  public lregistrosmayor: any = [];
  public lregistrosextracto: any = [];
  public lregistrosconciliado: any = [];

  public lmesesini: SelectItem[] = [{label: '...', value: null}];
  public lestados: SelectItem[] = [{ label: '...', value: null }];
  public lmodulos: SelectItem[] = [{ label: '...', value: null }];

  public ccuenta: string;
  public ncuenta: string;
  public sortF: string = '';
  
  constructor(router: Router,dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'REPORTEEXTRACTONOCONCILIADO', false);
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

    const mfiltrosEstado: any = {ccatalogo: 1020};
    const conEstado = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstado, {});
    conEstado.cantidad = 300;
    this.addConsultaCatalogos('ESTADOCONCILIACION', conEstado, this.lestados, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }

  ngAfterViewInit() {
  
  }


  mostrarLovCuentasContables(): void {
    this.lovCuentasContables.showDialog(true);
  }

  fijarLovCuentasContablesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.msgs = [];
      this.mcampos.ccuenta = reg.registro.ccuenta;
      this.mcampos.ncuenta = reg.registro.nombre;
      this.ccuenta = reg.registro.ccuenta;
      this.ncuenta = reg.registro.nombre;
    }
  }
  
 
  public imprimir(resp: any): void {
    let estado:string;
    this.jasper.nombreArchivo = 'EXTRACTONOCONCILIADO';

    // Agregar parametros
    this.jasper.parametros['@i_cuenta'] = this.mcampos.ccuenta;
    this.jasper.parametros['@i_anio'] = this.mfiltros.anio;
    this.jasper.parametros['@i_mes'] = this.mfiltros.finicio;
    if(this.mfiltros.cestado==1){
      estado="CONCILIADO OK"
    }
    else{
      estado="CONCILIADO PENDIENTE"
    }
    this.jasper.parametros['@i_estado'] = estado
    //this.jasper.parametros['@i_estado'] = this.mfiltros.cestado;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConExtractoNoConciliado';
    this.jasper.formatoexportar = resp;
    this.jasper.generaReporteCore();
  }
  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === "OK") {
      this.enproceso = false;
    }
  }
}
