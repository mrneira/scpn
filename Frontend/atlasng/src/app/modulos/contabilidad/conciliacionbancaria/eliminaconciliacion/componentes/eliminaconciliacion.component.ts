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

export enum KEY_CODE {
  FLECHA_ABAJO = 40
}

@Component({
  selector: "app-eliminaconciliacion",
  templateUrl: "eliminaconciliacion.html"
})
export class EliminaconciliacionComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  @ViewChild("formFiltros") formFiltros: NgForm;

  @ViewChild(LovCuentasContablesComponent)
  lovCuentasContables: LovCuentasContablesComponent;

  @ViewChild("dtMB") dtMB: DataTable;
  @ViewChild("dtEB") dtEB: DataTable;

  fecha = new Date();
  public lregistrosmayor: any = [];
  public lregistrosextracto: any = [];
  public lregistrosconciliado: any = [];

  public lmesesini: SelectItem[] = [{label: '...', value: null}];

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
      "tconconciliacionbancos",
      "CONCILIACIONBANCARIA",
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

  grabar(): void {
    if (this.mfiltros.finicio === undefined || this.mcampos.ccuenta === undefined || this.mfiltros.anio === undefined)
    {
        this.mostrarMensajeError("Debe seleccionar el año, mes y la cuenta");
        return;
    }
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.mdatos.anio = this.mfiltros.anio;
    this.rqMantenimiento.mdatos.mes = this.mfiltros.finicio;
    this.rqMantenimiento.mdatos.ccuenta = this.mcampos.ccuenta;
    this.crearDtoMantenimiento();
    super.grabar();
  }

  public crearDtoMantenimiento() {
    super.addMantenimientoPorAlias(this.alias, this.getMantenimiento(1));
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === "OK") {
    }
  }
}
