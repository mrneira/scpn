
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem, DataTable } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'app/util/servicios/app.service';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovCuentasContablesComponent } from '../../../../contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component';


@Component({
  selector: 'app-libromayor',
  templateUrl: 'libromayor.html'
})
export class LibromayorComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;
  @ViewChild(LovCuentasContablesComponent)
  lovCuentasContables: LovCuentasContablesComponent;

  @ViewChild("dtLM") dLM: DataTable;
  public loficinas: SelectItem[] = [{ label: '...', value: null }];
  public lcentrocostos: SelectItem[] = [{ label: '...', value: null }];
  public ltipoplan: SelectItem[] = [{ label: '...', value: null }];

  public lCcostocdetalle: SelectItem[] = [{ label: '...', value: null }];
  private catalogoCcostoDetalle: CatalogoDetalleComponent;
  public sortF: string = '';

  ccuenta = '';
  public diasDeshabilidatos: any = [];
  public diasDeshabilidatosfin: any = [];


  constructor(router: Router, dtoServicios: DtoServicios, public route: ActivatedRoute, public appService: AppService) {
    super(router, dtoServicios, 'tconcomprobantedetalle', 'REPORTELIBROMAYOR', false, false);
    this.componentehijo = this;
  }



  ngOnInit() {
    super.init(null, this.route);


    this.mcampos.anioi = this.anioactual;
    this.mcampos.aniof = this.anioactual;
    this.mcampos.mesi = "01";
    this.mcampos.mesf = this.mesactual;

    this.consultarCatalogosGenerales();
  }

  consultarCatalogosGenerales() {
    const mfiltrosMes: any = { 'ccatalogo': 4 };
    const consultaMes = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMes, {});
    consultaMes.cantidad = 50;
    this.addConsultaCatalogos('MESES', consultaMes, this.lmeses, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoCcostoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoCcostoDetalle.mfiltros.ccatalogo = 1002;
    const Ccosto = this.catalogoCcostoDetalle.crearDtoConsulta();
    this.addConsultaCatalogos('CENTROCOSTO', Ccosto, this.lCcostocdetalle, super.llenaListaCatalogo, 'cdetalle');
    this.ejecutarConsultaCatalogos();

    //this.ejecutarConsultaCatalogos();

  }


  ngAfterViewInit() {
    this.route['queryParams'].subscribe((p: any) => {
      if (p.comprobante) {
        const comprobante = JSON.parse(p.comprobante);
        this.mcampos.anioi = comprobante.anioi;
        this.mcampos.aniof = comprobante.aniof;
        this.mcampos.mesi = comprobante.mesi;
        this.mcampos.mesf = comprobante.mesf;
        this.mcampos.ccuenta = comprobante.ccuenta;
        this.mcampos.ncuenta = comprobante.ncuenta;
        this.mcampos.tipo = comprobante.tipo;
        this.ccuenta = comprobante.ccuenta;
        this.generaLibro();
      }
    });
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  consultar() {
    this.generaLibro();
  }

  imprimir(resp: any): void {
    if (!this.estaVacio(this.mcampos.anioi) &&
      !this.estaVacio(this.mcampos.aniof) &&
      !this.estaVacio(this.mcampos.mesi) &&
      !this.estaVacio(this.mcampos.mesf) &&
      !this.estaVacio(this.mcampos.ccuenta)) {
      this.jasper.nombreArchivo = 'rptConLibroMayor';
      const Finicio = this.mcampos.anioi + '-' + this.mcampos.mesi + '-' + "01";

      var d = new Date(this.mcampos.anioi, (this.mcampos.mesf), 0)
      //d.setDate(d.getDate() - 1);
      const FFin = this.mcampos.anioi + '-' + this.mcampos.mesf + '-' + d.getDate();

      this.jasper.parametros['@i_ccuenta'] = this.mcampos.ccuenta;
      this.jasper.parametros['@i_finicio'] = (Finicio);
      this.jasper.parametros['@i_ffin'] = (FFin);
      this.jasper.parametros['@i_ccosto'] = (this.registro.centrocostoscdetalle === undefined) ? "" : this.registro.centrocostoscdetalle;
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConLibroMayor';

      this.jasper.formatoexportar = resp;
      this.jasper.generaReporteCore();
    } else {

      super.mostrarMensajeError("NO SE HAN DEFINIDO LOS FILTROS DE BUSQUEDA");
    }

  }


  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.loficinas, resp.OFICINA, 'cagencia');
      this.llenaListaCatalogo(this.lcentrocostos, resp.CENTROCOSTO, 'cdetalle');
      this.llenaListaCatalogo(this.ltipoplan, resp.TIPOPLAN, 'cdetalle');
      this.llenaListaCatalogo(this.lCcostocdetalle, resp.CENTROCOSTO, 'cdetalle');
    }
    this.lconsulta = [];
  }
  /**Muestra lov de cuentas contables */

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



  public generaLibro() {


    if (!this.estaVacio(this.mcampos.anioi) &&
      !this.estaVacio(this.mcampos.aniof) &&
      !this.estaVacio(this.mcampos.mesi) &&
      !this.estaVacio(this.mcampos.mesf) &&
      !this.estaVacio(this.mcampos.ccuenta)) {

      const rqConsulta: any = new Object();

      const Finicio = this.mcampos.anioi + this.mcampos.mesi + "01";

      var d = new Date(this.mcampos.anioi, (this.mcampos.mesf), 0)
      //d.setDate(d.getDate()-1);
      const FFin = this.mcampos.anioi + this.mcampos.mesf + d.getDate();

      this.borrarParametros();
      rqConsulta.storeprocedure = "sp_ConRptLibroMayor";
      rqConsulta.CODIGOCONSULTA = 'LIBROMAYOR';
      rqConsulta.parametro_ccuenta = this.mcampos.ccuenta;
      rqConsulta.parametro_finicio = this.integerToDate(Number(Finicio));
      rqConsulta.parametro_ffin = this.integerToDate(Number(FFin));
      rqConsulta.parametro_ccosto = this.registro.centrocostoscdetalle === null ? undefined : this.registro.centrocostoscdetalle;

      if (this.estaVacio(this.registro.oficina)) {
        rqConsulta.oficina = -1;
      }
      else {
        rqConsulta.oficina = this.registro.oficina;
      }


      this.dtoServicios.ejecutarConsultaRest(rqConsulta)
        .subscribe(
          resp => {
            this.dtoServicios.llenarMensaje(resp, false);
            if (resp.cod !== 'OK') {
              return;
            }
            this.lregistros = resp.LIBROMAYOR;
          },
          error => {
            this.dtoServicios.manejoError(error);
          });

    } else {
      super.mostrarMensajeError("NO SE HAN DEFINIDO LOS FILTROS DE BUSQUEDA");
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

  IrAComprobanteContable(reg) {
    const opciones = {};
    const tran = 2;
    opciones['path'] = sessionStorage.getItem('m') + '-' + tran;
    opciones['tit'] = sessionStorage.getItem('m') + '-' + tran + ' Acciones';
    opciones['mod'] = sessionStorage.getItem('m');
    opciones['tran'] = tran;
    opciones['ac'] = 'false';
    opciones['ins'] = 'true';
    opciones['del'] = 'true';
    opciones['upd'] = 'true';

    sessionStorage.setItem('titulo', opciones['tit']);
    sessionStorage.setItem('m', opciones['mod']);
    sessionStorage.setItem('t', opciones['tran']);
    sessionStorage.setItem('ac', opciones['ac']);
    sessionStorage.setItem('ins', opciones['ins']);
    sessionStorage.setItem('del', opciones['del']);
    sessionStorage.setItem('upd', opciones['upd']);
    sessionStorage.setItem('path', opciones['path']);

    this.router.navigate([opciones['path']], {
      skipLocationChange: true,
      queryParams: {
        comprobante:
          JSON.stringify({
            ccomprobante: reg.secuencia,
            cmodulo: 10,
            anioi: this.mcampos.anioi,
            aniof: this.mcampos.anioi,
            mesi: this.mcampos.mesi,
            mesf: this.mcampos.mesf,
            ccuenta: this.mcampos.ccuenta,
            ncuenta: this.mcampos.ncuenta,
            tipo: this.mcampos.tipo
          })
      }
    });
    this.appService.titulopagina = opciones['tit'];
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

  changeSort(event) {
    if (!event.order) {
      this.sortF = 'fecha';
    } else {
      this.sortF = event.field;
    }
  }


}
