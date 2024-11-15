import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovFuncionariosComponent } from '../../../lov/funcionarios/componentes/lov.funcionarios.component';
import { LovBeneficioComponent } from '../../../lov/beneficio/componentes/lov.beneficio.component';

import { ParametroanualComponent } from '../../../lov/parametroanual/componentes/lov.parametroanual.component';
@Component({
  selector: 'app-saldosoperativos',
  templateUrl: 'saldosoperativos.html'
})
export class SaldosOperativoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(ParametroanualComponent)
  private lovParametro: ParametroanualComponent;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;
  @ViewChild(LovBeneficioComponent)
  private lovBeneficios: LovFuncionariosComponent;

  public ltipo: SelectItem[] = [{ label: '...', value: null }];
  totalmonto = 0;
  totalvencido = 0;
  public lcosto: SelectItem[] = [{ label: '...', value: null }];
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tnommovimiento', 'BENEFICIO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  

  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    
    super.crearNuevo();
    
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

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }
  mostrarLovParametro(): void {
    this.lovParametro.mfiltros.verreg = 0;
    this.lovParametro.showDialog();
  }

  /**Retorno de lov de paises. */
  fijarLovParametroSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.anio = reg.registro.anio;
    }
  }
  public obtenertotal(): number {
    let valor = 0;
    let vencido = 0;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        if(!this.lregistros[i].debito){
          valor += this.lregistros[i].monto;
         
        }else{
          vencido += this.lregistros[i].monto;
        }
       
      }
    }
    this.totalmonto = valor;
    this.totalvencido = vencido;
    return valor
  }
  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.secmensaje', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ntipo', 'i.ccatalogo=t.saldoccatalogo and i.cdetalle=t.saldocdetalle');
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ncentro', 'i.ccatalogo=t.centrocostoccatalogo and i.cdetalle=t.centrocostocdetalle');
    consulta.addSubquery('tconcatalogo', 'nombre', 'ncuenta', 'i.ccuenta = t.ccuenta');
    consulta.addSubquery('tgentransaccion', 'nombre', 'ntransacion', 'i.ctransaccion = t.ctransaccionorigen and i.cmodulo=t.cmodulo');
  
    consulta.cantidad = 200;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    if (this.estaVacio(this.mfiltros.saldocdetalle)) {
      super.mostrarMensajeError("NO HA SELECIONADO UN SALDO VÁLIDO");
      return;
    }
    if (!this.estaVacio(this.mcampos.fcontable)) {
      this.mfiltros.fcontable=this.fechaToInteger(this.mcampos.fcontable);
    }
   

  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.obtenertotal();
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosMes: any = { 'ccatalogo': 1002 };
    const consultaMes = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMes, {});
    consultaMes.cantidad = 50;
    this.addConsultaCatalogos('MESES', consultaMes, this.lcosto, super.llenaListaCatalogo, 'cdetalle');

    const mfiltrosTipo: any = { 'ccatalogo': 1145 };
    const consultaTipo = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosTipo, {});
    consultaTipo.cantidad = 50;
    this.addConsultaCatalogos('TIPOBENEFICIO', consultaTipo, this.ltipo, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }
  mostrarLovFuncionarios(): void {
    this.lovFuncionarios.showDialog();
  }

  /**Retorno de lov de funcionarios. */
  fijarLovFuncionariosSelect(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.nfuncionario = reg.registro.mdatos.nombre;
      this.registro.cfuncionario = reg.registro.cfuncionario;


    }
  }
  mostrarLovBeneficios(): void {
    this.lovBeneficios.mfiltrosigual.aportepatrono = false;
    this.lovBeneficios.mfiltrosigual.asignacion = true;

    this.lovBeneficios.showDialog();

  }

  /**Retorno de lov de funcionarios. */
  fijarLovBeneficiosSelect(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.nbeneficio = reg.registro.nombre;
      this.registro.cbeneficio = reg.registro.cbeneficio;


    }
  }
}
