import { Component, OnInit, Output, Input, EventEmitter, ViewChild,HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { LovProcesoComponent } from '../../../lov/proceso/componentes/lov.proceso.component';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';

@Component({
  selector: 'app-lov-tth-departamentos',
  templateUrl: 'lov.departamentos.html'
})
export class LovDepartamentosComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  @ViewChild(LovProcesoComponent) private LovProceso: LovProcesoComponent;

  @Output() eventoCliente = new EventEmitter();
  displayLov = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthDepartamento', 'LOVDEPARTAMENTOS', false, false);
  }

  ngOnInit() {
    this.formFiltrosBase = this.formFiltros;
    this.componentehijo = this;
    // En los lov va 0 para no grabar log de transaccion.
    this.rqConsulta.grabarlog = '0';
  }

  consultar() {
    this.crearDtoConsulta();
    const consulta: Consulta = this.getConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    const consulta = new Consulta(this.entityBean, 'Y', 'cdepartamento', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tthproceso', 'nombre', 'nproceso', 'i.cproceso = t.cproceso');
    consulta.addSubquery('tthfuncionariodetalle','primernombre + \' \' + primerapellido','nfuncionario','i.cfuncionario = t.cfuncionario and verreg=0');
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
  /**Muestra lov de proceso */
  mostrarLovProceso(): void {
    this.LovProceso.showDialog();
  }

  /**Retorno de lov de proceso. */
  fijarLovProceso(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.cproceso = reg.registro.cproceso;
      this.mcampos.nproceso = reg.registro.nombre;
    }
  }
}
