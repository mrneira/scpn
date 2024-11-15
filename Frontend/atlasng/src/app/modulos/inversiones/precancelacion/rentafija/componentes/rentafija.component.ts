
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { LovInversionesComponent } from '../../../../inversiones/lov/inversiones/componentes/lov.inversiones.component';

@Component({
  selector: 'app-rentafija',
  templateUrl: 'rentafija.html'
})
export class RentafijaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovInversionesComponent)
  lovInversiones: LovInversionesComponent;

  fecha = new Date();

  public edited = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tinvprecancelacion', 'PRECANCELARF', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultar();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {

    super.crearNuevo();
    this.mcampos.ncodigotitulo = null;
    this.registro.estadoccatalogo = 1204;
    this.registro.estadocdetalle = 'ING';
    this.registro.fingreso = this.fecha;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;

  }

  actualizar() {

    if (this.estaVacio(this.mcampos.montopagado) || this.mcampos.montopagado == 0 )
    {
      this.mostrarMensajeError("EL MONTO A PAGAR DEBE SER IGUAL O MAYOR AL SALDO DE CAPITAL");
      return;
    }

    this.encerarMensajes();
    super.actualizar();
    this.registro.capital = this.mcampos.saldocapital;
    this.registro.interes = this.mcampos.montopagado > this.mcampos.saldocapital ? this.mcampos.montopagado - this.mcampos.saldocapital : null;

    this.registro.mdatos.nValornominal = this.mcampos.valornominal;

  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
    this.mcampos.ncodigotitulo = this.registro.mdatos.ncodigotitulo;

    this.mcampos.valornominal = registro.mdatos.nValornominal;
    this.mcampos.saldocapital = this.estaVacio(registro.mdatos.nValornominal) || registro.mdatos.nValornominal == 0 ? 0 : Number(registro.mdatos.nValornominal);
    if (!this.estaVacio(registro.mdatos.nCapitalPagado) && Number(registro.mdatos.nCapitalPagado) != 0) this.mcampos.saldocapital = this.mcampos.saldocapital - Number(registro.mdatos.nCapitalPagado);
    this.mcampos.interestranscurrido = registro.mdatos.nInteresTranscurrido;
    this.obtenerTotalAPagar();

    this.mcampos.montopagado = this.estaVacio(registro.capital) || registro.capital == 0 ? 0 : Number(registro.capital);

    if (!this.estaVacio(registro.interes) || registro.interes != 0) this.mcampos.montopagado = this.mcampos.montopagado + Number(registro.interes);

  }

  // Inicia CONSULTA *********************
  consultar() {
    if (!this.validaFiltrosConsulta()) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    this.mfiltrosesp.cinversion="NOT IN (SELECT cinversion FROM tinvinversion WHERE estadocdetalle ='CAN')";
    const consulta = new Consulta(this.entityBean, 'Y', 't.cinversion desc', this.mfiltros, this.mfiltrosesp);
    consulta.addSubqueryPorSentencia('select i.nombre from tinvinversion j inner join tgencatalogodetalle i on j.emisorccatalogo = i.ccatalogo and j.emisorcdetalle = i.cdetalle where j.cinversion = t.cinversion', 'nEmisor');
    consulta.addSubqueryPorSentencia('select i.nombre from tinvinversion j inner join tgencatalogodetalle i on j.instrumentoccatalogo = i.ccatalogo and j.instrumentocdetalle = i.cdetalle where j.cinversion = t.cinversion', 'nInstrumento');
    consulta.addSubquery("tinvinversion","valornominal","nValornominal","i.cinversion = t.cinversion");
    consulta.addSubqueryPorSentencia("isnull((select sum(i.proyeccioncapital) from tinvtablaamortizacion i where i.cinversion = t.cinversion and i.estadocdetalle in ('PRECAN','PAG')),0)","nCapitalPagado");
    consulta.addSubqueryPorSentencia("isnull((select sum(i.acumuladoaccrual) from tinvtablaamortizacion i where i.cinversion = t.cinversion and i.estadocdetalle not in ('PRECAN','PAG')) ,0)","nInteresTranscurrido");

    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {

    this.mfiltros.estadocdetalle = 'ING';
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
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {

    super.postCommitEntityBean(resp);
  }

  mostrarLovInversiones(): void {
    this.lovInversiones.pEsPrecancelacion = true;
    this.lovInversiones.mfiltrosesp.cinversion = " in (select distinct s.cinversion from tinvinversion s inner join tinvtablaamortizacion a on s.cinversion = a.cinversion where s.estadocdetalle = 'APR' and s.tasaclasificacioncdetalle = 'FIJA' group by s.cinversion , s.valornominal having s.valornominal > sum(a.proyeccioncapital)) ";
    this.lovInversiones.showDialog();
  }

  fijarLovInversionesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cinversion = reg.registro.cinversion;

      this.mcampos.ncodigotitulo = reg.registro.codigotitulo;
      this.mcampos.valornominal = reg.registro.valornominal;
      this.mcampos.saldocapital = reg.registro.mdatos.nSaldoCapital;
      this.mcampos.interestranscurrido = reg.registro.mdatos.nInteresTranscurrido;


     

      this.obtenerTotalAPagar();

      this.registro.mdatos.nEmisor = reg.registro.mdatos.nnombre;

      this.registro.mdatos.nInstrumento = reg.registro.mdatos.nInstrumento;

      this.mcampos.montopagado = this.mcampos.totalapagar;

    }
  }

  private obtenerTotalAPagar()
  {
    this.mcampos.totalapagar = 0;

    if (!this.estaVacio(this.mcampos.saldocapital) && this.mcampos.saldocapital != 0) this.mcampos.totalapagar = Number(this.mcampos.saldocapital);

    if (!this.estaVacio(this.mcampos.interestranscurrido) && this.mcampos.interestranscurrido != 0) this.mcampos.totalapagar = this.mcampos.totalapagar + Number(this.mcampos.interestranscurrido);
    
  }

}
