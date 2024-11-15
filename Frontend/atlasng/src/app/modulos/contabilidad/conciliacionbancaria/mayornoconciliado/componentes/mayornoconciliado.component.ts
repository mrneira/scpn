import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  HostListener
} from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { DtoServicios } from "../../../../../util/servicios/dto.servicios";
import { Consulta } from "../../../../../util/dto/dto.component";
import { Mantenimiento } from "../../../../../util/dto/dto.component";
import { BaseComponent } from "../../../../../util/shared/componentes/base.component";
import { SelectItem, DataTable } from "primeng/primeng";
import { LovCuentasContablesComponent } from "../../../lov/cuentascontables/componentes/lov.cuentasContables.component";
import { ConfirmationService } from "primeng/primeng";
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

export enum KEY_CODE {
  FLECHA_ABAJO = 40
}

@Component({
  selector: "app-mayornoconciliado",
  templateUrl: "mayornoconciliado.html"
})
export class MayornoconciliadoComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  @ViewChild("formFiltros") formFiltros: NgForm;

  @ViewChild(LovCuentasContablesComponent)
  lovCuentasContables: LovCuentasContablesComponent;

  @ViewChild("dtMB") dtMB: DataTable;
  @ViewChild("dtEB") dtEB: DataTable;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  fecha = new Date();
  public lregistrosmayor: any = [];
  public lregistrosextracto: any = [];
  public lregistrosconciliado: any = [];
  public lmesesini: SelectItem[] = [{label: '...', value: null}];
  public conciliado:boolean;

  public coloractual: string;

  public ccuenta: string;
  public ncuenta: string;
  public sortF: string = '';

  constructor(
    router: Router,
    dtoServicios: DtoServicios,
    private confirmationService: ConfirmationService
  ) {
    super(
      router,
      dtoServicios,
      "tconconciliacionbancaria",
      "MAYORNOCONCILIADO",
      false
    );
    this.componentehijo = this;
   
  }

  ngOnInit() {
    //this.obtenerParametros();
    super.init(this.formFiltros);
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
    this.conciliado=true
   
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

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  crearNuevo() {
    super.crearNuevo();
    this.mostrarDialogoGenerico = true;
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

  changeSort(event) {
    if (!event.order) {
      this.sortF = 'fecha';
    } else {
      this.sortF = event.field;
    }
  }

  public imprimir(resp: any): void {
    let estadoConciliado:number
    this.jasper.nombreArchivo = 'MAYORCONCILIADO';

    // Agregar parametros
    this.jasper.parametros['@i_cuenta'] = this.mcampos.ccuenta;
    this.jasper.parametros['@i_anio'] = this.mfiltros.anio;
    this.jasper.parametros['@i_mes'] = this.mfiltros.finicio;
    if(this.conciliado){
      estadoConciliado = 1
    }
    else{
      estadoConciliado = 2
    }
    this.jasper.parametros['@i_check'] = estadoConciliado;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConMayorNoConciliado';
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
