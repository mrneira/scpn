import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';
import { find } from 'rxjs/operator/find';
import { LovDefaultComponent } from '../../../lov/default/componentes/lov.default.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-consultadefault',
  templateUrl: 'consultadefault.html'
})
export class ConsultadefaultComponent extends BaseComponent implements OnInit, AfterViewInit {

  public lista: any;

  @ViewChild(LovDefaultComponent)
  private lovdefault: LovDefaultComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CONSULTADEFAULT', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mfiltros.cinversion = "";
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  mostrarlovdefault(): void {
    this.lovdefault.showDialog();
  }

  /**Retorno de lov de productos. */
fijarlovdefaultSelec(reg: any): void {
  if (reg.registro !== undefined) {

    this.registro.mdatos.nproducto = reg.registro.mdatos.nemisor;
    this.mfiltros.cdefault = reg.registro.cdefault;
    
  }
}

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
        .subscribe(
        resp => {
            this.encerarMensajes();
            this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
        },
        error => {
            this.dtoServicios.manejoError(error);
        });
}

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
  
  }
  
  public imprimir(resp: any): void {
    this.jasper.nombreArchivo = 'rptInvConsultaDefault';

    // Agregar parametros
    this.jasper.parametros['@i_cdefault'] = this.mfiltros.cdefault;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvConsultaDefault';
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
