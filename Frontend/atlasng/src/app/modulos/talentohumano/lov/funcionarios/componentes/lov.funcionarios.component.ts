import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';

@Component({
  selector: 'app-lov-funcionarios',
  templateUrl: 'lov.funcionarios.html'
})
export class LovFuncionariosComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();
  @Output() eventoSinCoincidencias = new EventEmitter();
  public ltipopersonal: SelectItem[] = [{ label: '...', value: null }];
  displayLov = false;

  consultado = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthfuncionariodetalle', 'LOVFUNCIONARIO', false, false);
  }

  ngOnInit() {
    this.formFiltrosBase = this.formFiltros;
    this.componentehijo = this;
    // En los lov va 0 para no grabar log de transaccion.
    this.rqConsulta.grabarlog = '0';
    this.mfiltros.activo= true;
    this.consultarCatalogos();
  }

  consultar() {
    this.crearDtoConsulta();
    const consulta: Consulta = this.getConsulta();
    this.consultado = true;
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cfuncionario', this.mfiltros, this.mfiltrosesp);
    // consulta.addSubquery('tthdepartamento','nombre','departamento','i.cdepartamento=t.cdepartamento');
    // consulta.addSubquery('tthproceso','nombre','nombrearea','i.carea = t.carea');
    consulta.addSubqueryPorSentencia("select concat(o.primerapellido, ' ', o.primernombre) from " + this.obtenerBean("tthfuncionariodetalle") + " o where o.cfuncionario=t.cfuncionario and o.verreg=0 and t.verreg=0", "nombre");
    consulta.addSubquery('tthcontratodetalle', 'ccargo', 'ccargo', 'i.cfuncionario = t.cfuncionario AND i.verreg = 0');
    consulta.addSubquery('tthcontratodetalle', 'fvinculacion', 'fvinculacion', 'i.cfuncionario = t.cfuncionario AND i.verreg = 0');
    consulta.addSubqueryPorSentencia("SELECT c.nombre FROM " + this.obtenerBean("tthcargo") + " c JOIN " + this.obtenerBean("tthcontratodetalle") + " cd ON c.ccargo = cd.ccargo WHERE cd.cfuncionario =  t.cfuncionario AND cd.verreg = 0", "ncargo");
    consulta.addSubqueryPorSentencia("SELECT d.nombre FROM " + this.obtenerBean("tthproceso") + " p JOIN " + this.obtenerBean("tthdepartamento") + " d ON p.cproceso = d.cproceso JOIN " + this.obtenerBean("tthcargo") + " c ON d.cdepartamento = c.cdepartamento  JOIN " + this.obtenerBean("tthcontratodetalle") + " cd ON c.ccargo = cd.ccargo WHERE cd.cfuncionario =  t.cfuncionario AND cd.verreg = 0", "nproceso");    
    consulta.addSubqueryPorSentencia("SELECT d.cdepartamento FROM " + this.obtenerBean("tthdepartamento") + " d JOIN " + this.obtenerBean("tthcargo") + " c ON d.cdepartamento = c.cdepartamento  JOIN " + this.obtenerBean("tthcontratodetalle") + " cd ON c.ccargo = cd.ccargo WHERE cd.cfuncionario =  t.cfuncionario AND cd.verreg = 0", "cproceso");
    consulta.setCantidad(15);
    this.addConsulta(consulta);
    return consulta;
  }

  public getConsulta(): Consulta {
    const consulta = super.getConsulta(this.alias);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.verreg = 0;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);

    if (this.lregistros.length == 0 && this.mfiltros.documento != undefined) {
      this.eventoSinCoincidencias.emit();
    }
  }
  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosTipoPersonal: any = {'ccatalogo': 1113};
    const consultaTipoPersonal = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosTipoPersonal, {});
    consultaTipoPersonal.cantidad = 50;
    this.addConsultaCatalogos('TIPOPERSONAL', consultaTipoPersonal, this.ltipopersonal, super.llenaListaCatalogo, 'cdetalle');
    
      
    this.ejecutarConsultaCatalogos();
  }

  seleccionaRegistro(evento: any) {
    evento.data.mdatos.nombre =      
      (evento.data.primerapellido != undefined ? evento.data.primerapellido : "") + " " +
      (evento.data.segundoapellido != undefined ? evento.data.segundoapellido : "") + " " +
      (evento.data.primernombre != undefined ? evento.data.primernombre : "") + " " +
      (evento.data.segundonombre != undefined ? evento.data.segundonombre : "");
    this.eventoCliente.emit({ registro: evento.data });
    // para oculatar el dialogo.
    this.displayLov = false;
  }

  showDialog() {
    this.displayLov = true;
  }
}
