
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';

@Component({
  selector: 'app-reverso',
  templateUrl: 'reverso.html'
})
export class ReversoComponent extends BaseComponent implements OnInit, AfterViewInit {



  mDatos: any = [];

  @ViewChild('formFiltros') formFiltros: NgForm;
  fecha = new Date();

  constructor(router: Router, dtoServicios: DtoServicios, private confirmationService: ConfirmationService) {
    super(router, dtoServicios, 'tinvcontabilizacion', 'REVERSORENTAFIJA', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultar();
    this.limpiar();
  }

  ngAfterViewInit() {
  }

  actualizar() {
  }

  eliminar() {
  }

  cancelar() {
  }

  public selectRegistro(registro: any) {
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.lregistros = [];
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {

    this.mfiltrosesp.cinvcontabilizacion = " IN (select max(a.cinvcontabilizacion) from tinvcontabilizacion a inner join tconcomprobante b on a.ccomprobante = b.ccomprobante where a.ccomprobante is not null and b.anulado = 0 and b.eliminado = 0 and cast(b.fingreso as date) = cast(getdate() as date) group by a.ccomprobante) ";

    const consulta = new Consulta(this.entityBean, 'Y', 't.fcontable DESC', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 1000000;
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'noperacion', 'i.ccatalogo = t.procesoccatalogo and i.cdetalle = t.procesocdetalle');
    consulta.addSubqueryPorSentencia('select j.nombre from tinvinversion i inner join tgencatalogodetalle j on i.tasaclasificacionccatalogo = j.ccatalogo and i.tasaclasificacioncdetalle = j.cdetalle where i.cinversion = t.cinversion', 'ntasaclasificacion');
    consulta.addSubqueryPorSentencia('select j.nombre from tinvinversion i inner join tgencatalogodetalle j on i.emisorccatalogo = j.ccatalogo and i.emisorcdetalle = j.cdetalle where i.cinversion = t.cinversion', 'nemisor');
    consulta.addSubqueryPorSentencia('select j.nombre from tinvinversion i inner join tgencatalogodetalle j on i.instrumentoccatalogo = j.ccatalogo and i.instrumentocdetalle = j.cdetalle where i.cinversion = t.cinversion', 'ninstrumento');
    consulta.addSubquery('tinvinversion', 'valornominal', 'nvalornominal', 'i.cinversion = t.cinversion');
    consulta.addSubqueryPorSentencia('select isnull(sum(j.proyeccioninteres),0) from tinvtablaamortizacion j where t.cinversion = j.cinversion', 'nInteres');
    consulta.addSubquery('tinvinversion', 'fvencimiento', 'nfvencimientoinversion', 'i.cinversion = t.cinversion');
    consulta.addSubquery('tinvtablaamortizacion', 'finicio', 'nfiniciodividendo', 'i.cinvtablaamortizacion = t.cinvtablaamortizacion');
    consulta.addSubquery('tinvtablaamortizacion', 'plazo', 'nplazodividendo', 'i.cinvtablaamortizacion = t.cinvtablaamortizacion');
    consulta.addSubquery('tinvtablaamortizacion', 'fvencimiento', 'nfvencimientodividendo', 'i.cinvtablaamortizacion = t.cinvtablaamortizacion');
    consulta.addSubquery('tinvtablaamortizacion', 'proyeccioncapital', 'ncapitaldividendo', 'i.cinvtablaamortizacion = t.cinvtablaamortizacion');
    consulta.addSubquery('tinvtablaamortizacion', 'proyeccioninteres', 'ninteresdividendo', 'i.cinvtablaamortizacion = t.cinvtablaamortizacion');
    consulta.addSubquery('tinvtablaamortizacion', 'valormora', 'nmoradividendo', 'i.cinvtablaamortizacion = t.cinvtablaamortizacion');
    consulta.addSubqueryPorSentencia('select isnull(sum(j.proyeccioncapital),0) + isnull(sum(j.proyeccioninteres),0) + isnull(sum(j.valormora),0) from tinvtablaamortizacion j where t.cinvtablaamortizacion = j.cinvtablaamortizacion', 'nTotalDividendo');

    this.addConsulta(consulta);
    return consulta;
  }

  validaFiltrosConsulta(): boolean {
    return true;
   
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {

    if (this.estaVacio(this.mDatos.cinversion)) {
      this.mostrarMensajeError("SELECCIONE UNA TRANSACCIÓN");
      return;
    }
    this.encerarMensajes();

    this.confirmationService.confirm({
      message: 'Está seguro de anular el comprobante?',
      header: 'Confirmation',
      icon: 'fa fa-question-circle',
      accept: () => {

        if (this.mDatos.noperacion.substring(0, 6) == "COMPRA") {
          this.rqMantenimiento.cinversion = this.mDatos.cinversion;
        }
        this.mDatos = [];
        
        this.rqMantenimiento.anular = true;
        this.rqMantenimiento.mdatos.ccomprobante = this.mcampos.ccomprobante;
        this.rqMantenimiento.mdatos.fcontable = this.mcampos.fcontable;
        this.rqMantenimiento.mdatos.ccompania = this.mcampos.ccompania;
        this.rqMantenimiento.mdatos.actualizarsaldos = true;

     


        this.crearDtoMantenimiento();

      },
      reject: () => {
      }
    });
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
    super.grabar();

    this.limpiar();

  }

  public postCommit(resp: any) {

    this.mcampos.ccomprobanteEspejo = resp.ccomprobanteEspejo;
    this.mcampos.numerocomprobantecesantiaEspejo = resp.numerocomprobantecesantiaEspejo;

    super.postCommitEntityBean(resp);
  }

  limpiaComprobante() {

    this.mcampos.ccomprobante = null;
    this.mcampos.fcontable = null;
    this.mcampos.ccompania = null;

    this.mcampos.ccomprobanteEspejo = null;
    this.mcampos.numerocomprobantecesantiaEspejo = null;
  }


  edit(row: any, index: number) {

    if (!this.estaVacio(this.mDatos.cinversion) && Number(this.mDatos.cinversion) > 0) {
      this.mostrarMensajeError("YA EXISTE UNA APROBACIÓN EN PROCESO");
      return;
    }

    this.limpiaComprobante();
    this.encerarMensajes();
    this.mDatos = this.lregistros[index];

    this.mDatos.noperacion = this.lregistros[index].mdatos.noperacion;
    this.mDatos.ntasaclasificacion = this.lregistros[index].mdatos.ntasaclasificacion;
    this.mDatos.nemisor = this.lregistros[index].mdatos.nemisor;
    this.mDatos.ninstrumento = this.lregistros[index].mdatos.ninstrumento;
    this.mDatos.nvalornominal = this.lregistros[index].mdatos.nvalornominal;
    this.mDatos.nInteres = this.lregistros[index].mdatos.nInteres;
    this.mDatos.nfvencimientoinversion = this.lregistros[index].mdatos.nfvencimientoinversion;
    this.mDatos.nfiniciodividendo = this.lregistros[index].mdatos.nfiniciodividendo;
    this.mDatos.nplazodividendo = this.lregistros[index].mdatos.nplazodividendo;
    this.mDatos.nfvencimientodividendo = this.lregistros[index].mdatos.nfvencimientodividendo;
    this.mDatos.ncapitaldividendo = this.lregistros[index].mdatos.ncapitaldividendo;
    this.mDatos.ninteresdividendo = this.lregistros[index].mdatos.ninteresdividendo;
    this.mDatos.nmoradividendo = this.lregistros[index].mdatos.nmoradividendo;
    this.mDatos.nTotalDividendo = this.lregistros[index].mdatos.nTotalDividendo;

    this.mcampos.ccomprobante = this.lregistros[index].ccomprobante;
    this.mcampos.fcontable = this.lregistros[index].fcontable;
    this.mcampos.ccompania = this.lregistros[index].ccompania;

    this.lregistros.splice(index, 1);


  }

  cancelarPago() {

    this.encerarMensajes();

    let lIndiceExtracto = this.lregistros.length;

    this.lregistros.push({

      optlock: 0

    });

    this.lregistros[lIndiceExtracto] = [];
    this.lregistros[lIndiceExtracto] = this.mDatos;

    this.lregistros[lIndiceExtracto].mdatos = [];

    this.lregistros[lIndiceExtracto].mdatos.noperacion = this.mDatos.noperacion;
    this.lregistros[lIndiceExtracto].mdatos.ntasaclasificacion = this.mDatos.ntasaclasificacion;
    this.lregistros[lIndiceExtracto].mdatos.nemisor = this.mDatos.nemisor;
    this.lregistros[lIndiceExtracto].mdatos.ninstrumento = this.mDatos.ninstrumento;
    this.lregistros[lIndiceExtracto].mdatos.nvalornominal = this.mDatos.nvalornominal;
    this.lregistros[lIndiceExtracto].mdatos.nInteres = this.mDatos.nInteres;
    this.lregistros[lIndiceExtracto].mdatos.nfvencimientoinversion = this.mDatos.nfvencimientoinversion;
    this.lregistros[lIndiceExtracto].mdatos.nfiniciodividendo = this.mDatos.nfiniciodividendo;
    this.lregistros[lIndiceExtracto].mdatos.nplazodividendo = this.mDatos.nplazodividendo;
    this.lregistros[lIndiceExtracto].mdatos.nfvencimientodividendo = this.mDatos.nfvencimientodividendo;
    this.lregistros[lIndiceExtracto].mdatos.ncapitaldividendo = this.mDatos.ncapitaldividendo;
    this.lregistros[lIndiceExtracto].mdatos.ninteresdividendo = this.mDatos.ninteresdividendo;
    this.lregistros[lIndiceExtracto].mdatos.nmoradividendo = this.mDatos.nmoradividendo;
    this.lregistros[lIndiceExtracto].mdatos.nTotalDividendo = this.mDatos.nTotalDividendo;
    this.limpiar();
    this.limpiaComprobante();

  }

  limpiar() {
    
    this.mDatos = [];
  }
}
