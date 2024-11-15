import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovCuentasContablesComponent } from '../../../../contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component';

@Component({
  selector: 'app-reporte-consolidado-seguros',
  templateUrl: 'cuentasbatch.html'
})
export class ConsolidadoSegurosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;
  @ViewChild(LovCuentasContablesComponent)
  lovCuentasContables: LovCuentasContablesComponent;

  public ltiposeguro: SelectItem[] = [{ label: '...', value: null }];
  public lestados: SelectItem[] = [{ label: '...', value: null },{ label: 'CONSOLIDADO', value: 'CONS' },{label: 'POR USUARIO', value: 'USR'}];

  public estadoincremento: string;
  public estadorenovacion: string;
  public estadopago: string;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CONSOLIDADOSEGUROS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  imprimir(tipo: any): void {

   

   
      if (this.estaVacio(this.mcampos.tipo)){
        this.mostrarMensajeError("NO SE HA SELECCIONADO EL TIPO DE REPORTE");
        return;
      }
      if (this.estaVacio(this.mcampos.fcorte)){
        this.mostrarMensajeError("NO SE HA SELECCIONADO LA FECHA DE CORTE");
        return;
      }
      if (this.estaVacio(this.mcampos.ccuenta)){
        this.mostrarMensajeError("NO SE HA SELECCIONADO LA CUENTA CONTABLE");
        return;
      }

      let cusuario =(this.mcampos.tipo=="CONS")?"":this.dtoServicios.mradicacion.cusuario;

    this.jasper.nombreArchivo = 'ReporteConsolidadoSeguros-' + this.fechaToInteger(this.mcampos.fcorte);
    this.jasper.parametros['@i_ccuenta'] = this.mcampos.ccuenta;
    this.jasper.parametros['@i_fcorte']	= this.fechaToInteger(this.mcampos.fcorte);
    this.jasper.parametros['@i_usuario']	=cusuario
   
    this.jasper.formatoexportar = tipo;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Seguros/rptSgsDetalleBatch';

    this.jasper.generaReporteCore();
  }

  mostrarLovCuentasContables(): void {
    this.lovCuentasContables.showDialog(true); // con true solo muestra cuentas de movimiento.
  }

  fijarLovCuentasContablesSelec(reg: any): void {

    if (reg.registro !== undefined) {
      this.msgs = [];
    
      this.mcampos.ccuenta = reg.registro.ccuenta;
      this.mcampos.ncuenta = reg.registro.nombre;
     

    }
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const mfiltrosTipoSeguro: any = { verreg: 0 };
    const conTipoSeguro = new Consulta('TsgsTipoSeguroDetalle', 'Y', 't.nombre', mfiltrosTipoSeguro, {});
    conTipoSeguro.cantidad = 100;
    this.addConsultaCatalogos('TIPOSEGURO', conTipoSeguro, this.ltiposeguro, super.llenaListaCatalogo, 'ctiposeguro');

    this.ejecutarConsultaCatalogos();
  }

}

