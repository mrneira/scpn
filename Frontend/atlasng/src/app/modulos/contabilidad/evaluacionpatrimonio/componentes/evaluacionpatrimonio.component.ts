import {Component,OnInit,AfterViewInit,ViewChild} from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { DtoServicios } from "../../../../util/servicios/dto.servicios";
import { Consulta } from "../../../../util/dto/dto.component";
import { Mantenimiento } from "../../../../util/dto/dto.component";
import { BaseComponent } from "../../../../util/shared/componentes/base.component";
import { SelectItem } from "primeng/primeng";
import { JasperComponent } from '../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: "app-evaluacionpatrimonio",
  templateUrl: "evaluacionpatrimonio.html"
})
export class EvaluacionPatrimonioComponent extends BaseComponent implements OnInit, AfterViewInit {
 
  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  
  constructor(router: Router,dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'REPORTEEVALUACIONPATRIMONIO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
  
  }

  ngAfterViewInit(){}

  public imprimir(resp: any): void {
    this.jasper.nombreArchivo = 'EVALUACIONPATRIMONIO';

    // Agregar parametros
    this.jasper.parametros['@i_anio'] = this.mfiltros.anio;

    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConEstadoPatrimonio';
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
