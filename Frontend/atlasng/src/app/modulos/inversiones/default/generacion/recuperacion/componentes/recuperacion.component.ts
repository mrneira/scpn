import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovDefaultComponent } from '../../../../lov/default/componentes/lov.default.component'
import { ConfirmationService } from 'primeng/primeng';
@Component({
  selector: 'app-recuperacion',
  templateUrl: 'recuperacion.html'
})
export class RecuperacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;


  @ViewChild(LovDefaultComponent)
  private lovDefault: LovDefaultComponent;


  public ltipo: SelectItem[] = [{ label: '...', value: null }];

  public lmeses: SelectItem[] = [{ label: '...', value: null }];
  constructor(router: Router, dtoServicios: DtoServicios,private confirmationService: ConfirmationService) {
    super(router, dtoServicios, 'tinvdefaultdetalle', 'TINVINVERSIONDETALLE', true, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.mcampos.femision =null;
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    this.registro.estadoccatalogo=1204;
    this.registro.rubroccatalogo=1219;
    this.registro.estadocdetalle='ENVAPR';
    this.registro.cusuarioing= this.dtoServicios.mradicacion.cusuario;
   
   
    
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
  mostrarLovParametro(): void {
    this.lovDefault.mfiltros.verreg = 0;
    this.lovDefault.showDialog();
  }

  /**Retorno de lov de paises. */
  fijarLovDefault(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cdefault = reg.registro.cdefault;
      this.mcampos.nemisor = reg.registro.mdatos.nemisor;
      this.mcampos.ninstrumento = reg.registro.mdatos.ninstrumento;
      
      this.mcampos.nsector = reg.registro.mdatos.nsector;
      this.mcampos.femision = reg.registro.femision;
      this.mcampos.plazo = reg.registro.plazo;
      
      
    }
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cdefault', this.mfiltros, this.mfiltrosesp);
   
    consulta.cantidad = 300;
    this.addConsulta(consulta);
    return consulta;
  }
  ajustar(){
    if (!this.validaGrabar()) {
      return;
    }
    this.confirmationService.confirm({
      message: 'Usted está generando un pago desea continuar a su aprobación?',
      header: 'Confirmación',
      accept: () => {
        this.grabar();
      }
    });
  }
  private fijarFiltrosConsulta() {
  
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
    this.rqMantenimiento.mdatos.ajuste= this.registro;
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
    if(!this.estaVacio(resp.TINVINVERSIONDETALLE)){
      this.recargar();
    }
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosMes: any = { 'ccatalogo': 4 };
    const consultaMes = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMes, {});
    consultaMes.cantidad = 50;
    this.addConsultaCatalogos('MESES', consultaMes, this.lmeses, super.llenaListaCatalogo, 'cdetalle');

    const mfiltrosTipo: any = { 'ccatalogo': 1219 };
    const consultaTipo = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosTipo, {});
    consultaTipo.cantidad = 200;
    this.addConsultaCatalogos('TIPOMOVIMIENTO', consultaTipo, this.ltipo, super.llenaListaCatalogo, 'cdetalle');

    

    this.ejecutarConsultaCatalogos();
  }
  mostrarLovDefault(): void {
    this.lovDefault.showDialog();
  }

  /**Retorno de lov de funcionarios. */
  fijarLovFuncionariosSelect(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.nfuncionario = reg.registro.mdatos.nombre;
      this.registro.cfuncionario = reg.registro.cfuncionario;


    }
  }

  

 
}
