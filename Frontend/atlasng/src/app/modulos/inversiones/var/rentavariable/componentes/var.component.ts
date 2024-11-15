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
  templateUrl: 'var.html'
})
export class VarReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

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
  public lemisor: SelectItem[] = [{ label: '...', value: null }];
  public ltipoplancuentas: SelectItem[] = [{ label: '...', value: null }];
  public lperiodo: SelectItem[] = [{ label: '...', value: null }];
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


  fmax = new Date();
  ngOnInit() {
    super.init();
    this.mcampos.fcorte = new Date();
    this.fmax = new Date();

    this.fmax.setDate(this.fmax.getDate());
    this.mcampos.fcorte = this.fmax;
    this.consultarCatalogos();
  }
  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();
    const mfiltrosTipo: any = { 'ccatalogo': 1213 };
    const consultaTipo = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosTipo, {});
    consultaTipo.cantidad = 100;
    this.addConsultaCatalogos('EMISORES', consultaTipo, this.lemisor, super.llenaListaCatalogo, 'cdetalle', this.componentehijo, true);

    this.ejecutarConsultaCatalogos();
  }
  ngAfterViewInit() {
  }





  imprimir(resp: any): void {
    this.mcampos.tipo = resp;
    this.generarVar();
  }



  generarVar() {
    this.rqConsulta.CODIGOCONSULTA = 'VARRENTAVARIABLE';
    this.rqConsulta.mdatos.lregistros = this.lregistros;
    this.rqConsulta.mdatos.tipo = this.mcampos.tipo;
    this.rqConsulta.mdatos.finicio=this.fechaToInteger(this.mcampos.finicio);
    this.rqConsulta.mdatos.ffin=this.fechaToInteger(this.mcampos.ffin);
    

    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {

          if (resp.cod === 'OK') {

            this.descargarBytes(resp.ARCHIVOVAR);

            super.mostrarMensajeSuccess(resp.msgusu);
          } else {
            super.mostrarMensajeError(resp.msgusu);
          }

        },
        error => {
          this.dtoServicios.manejoError(error);
        });

  }

  descargarBytes(bytes: any): void {
    const linkElement = document.createElement('a');
    try {
      let contenttype = '';
      if (this.mcampos.tipo === 'PDF') {
        contenttype = 'application/pdf';
      } else if (this.mcampos.tipo === 'EXCEL') {
        contenttype = 'application/vnd.ms-excel';
      } else {
        contenttype = 'application/octet-stream';
      }
      var blob = new Blob([this.base64ToArrayBuffer(bytes)], { type: contenttype });
      const bloburl = URL.createObjectURL(blob);

      if (this.mcampos.tipo === 'PDF') {
        window.open(bloburl);
        return;
      } else {
        linkElement.href = bloburl;
        if (this.mcampos.tipo === 'xls') {
          linkElement.download = "VAR" + '.' + "xls";
        } else {
          linkElement.download = "VAR" + '.' + this.mcampos.tipo;

        }

        const clickEvent = new MouseEvent('click', {
          'view': window,
          'bubbles': true,
          'cancelable': false
        });
        linkElement.dispatchEvent(clickEvent);

      }

    } catch (ex) {
    }
  }
}
