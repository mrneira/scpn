import { Component, OnInit, Output, Input, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { LovClientesComponent } from '../../../lov/clientes/componentes/lov.clientes.component';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';

@Component({
  selector: 'app-lov-cuentas-por-cobrar',
  templateUrl: 'lov.cuentasporcobrar.html'
})
export class LovCuentasPorCobrarComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
    
  @ViewChild(LovClientesComponent)
  private lovClientesComponent: LovClientesComponent;

  @Output() eventoCliente = new EventEmitter();
  
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconcuentaporcobrar', 'LOVCXC', false);    
  }

  ngOnInit() {
    this.formFiltrosBase = this.formFiltros;
    this.componentehijo = this;
    this.rqConsulta.grabarlog = '0';
  }

  consultar() {
    if(this.mcampos.ccodfactura === undefined || this.mcampos.ccodfactura === ''){
      this.mfiltros.ccodfactura = '';
    }
    else{
      this.mfiltros.ccodfactura = this.mcampos.ccodfactura;
    }
           
    if(this.mcampos.cctaporcobrar === undefined || this.mcampos.cctaporcobrar === ''){
      this.mfiltros.cctaporcobrar = '';
    }
    else{
      this.mfiltros.cctaporcobrar = this.mcampos.cctaporcobrar;
    }
    
    if(this.mcampos.cpersona === undefined || this.mcampos.cpersona === ''){
      this.mfiltros.cpersona = '';
    }
    else{
      this.mfiltros.cpersona = this.mcampos.cpersona;
    }

    if(this.mcampos.fdocumento === undefined || this.mcampos.fdocumento === '' || this.mcampos.fdocumento === null){
      this.mfiltros.fdocumento = '';
    }
    else{
      const s = this.mcampos.fdocumento.toISOString();
      this.mfiltros.fdocumento = s.substr(0, 10);
    }

    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.crearDtoConsulta();
    const consulta: Consulta = this.getConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    const consulta = new Consulta(this.entityBean, 'Y', 't.cctaporcobrar', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'estadocxccdetalle', 'ccatalogo = 1012 and i.cdetalle = t.estadocdetalle');
    consulta.addSubquery('tperproveedor', 'nombre', 'nombreCliente', 'i.cpersona = t.cpersona');
    
    consulta.setCantidad(15);
    this.addConsulta(consulta);
    return consulta;
  }

  public getConsulta(): Consulta {
    const consulta = super.getConsulta(this.alias);
    return consulta;
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  seleccionaRegistro(evento: any) {
    this.eventoCliente.emit({ registro: evento.data });
    // para oculatar el dialogo.
    this.displayLov = false;
  }

  showDialog() {
    this.displayLov = true;
  }

  /**Muestra lov de clientes */
  mostrarLovClientesFiltro(): void {
    this.lovClientesComponent.showDialog();
  }

  /**Retorno de lov de clientes. */
  fijarLovClientesFiltroSelect(reg: any): void {
    if (reg.registro !== undefined) {
        this.mcampos.ccodfactura = reg.registro.ccodfactura;
        this.mcampos.cctaporcobrar = reg.registro.cctaporcobrar;        

        this.mcampos.cpersonaFiltro = reg.registro.cpersona;
        this.mcampos.identificacionFiltro = reg.registro.identificacion;
        this.mcampos.npersonaFiltro = reg.registro.nombre;

        this.mcampos.cpersona = reg.registro.cpersona;
    }
  }  
}
