import {Component,OnInit,AfterViewInit,ViewChild} from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { DtoServicios } from "../../../../../util/servicios/dto.servicios";
import { Consulta } from "../../../../../util/dto/dto.component";
import { Mantenimiento } from "../../../../../util/dto/dto.component";
import { BaseComponent } from "../../../../../util/shared/componentes/base.component";
import { SelectItem } from "primeng/primeng";
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: "app-cedulaPresupuestariaGastoConsulta",
  templateUrl: "cedulaPresupuestariaGastoConsulta.html"
})
export class CedulaPresupuestariaGastoConsultaComponent extends BaseComponent implements OnInit, AfterViewInit {
 
  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  fecha = new Date();

  public lmesesini: SelectItem[] = [{label: '...', value: null}];
  public lestados: SelectItem[] = [{ label: '...', value: null }];
  public lmodulos: SelectItem[] = [{ label: '...', value: null }];
  
  constructor(router: Router,dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'RPTMOVIMIENTOPARTIDAGASTO', false);
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
   
  }

  ngAfterViewInit() {
  
  }
 
  public imprimir(resp: any): void {
    this.jasper.nombreArchivo = 'rptPptCedPresupuestariGastoMes';
    // Agregar parametros
    this.jasper.parametros['@i_anio'] = this.mfiltros.anio;
    this.jasper.parametros['@i_mes'] = this.mfiltros.finicio;
    
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Presupuesto/rptPptCedPresupuestariGastoMes';
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
