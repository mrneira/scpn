import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovActasComponent } from '../../../lov/actas/componentes/lov.actas.component';
import { last } from 'rxjs/operator/last';

@Component({
  selector: 'app-consultaEntregas',
  templateUrl: 'consultaEntregas.html'
})
export class ConsultaEntregasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;


  @ViewChild(LovActasComponent)
  private lovactas: LovActasComponent;

  public ltipodoc: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tacfkardexprodcodi', 'CONSULTAENTREGAS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);

  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }
  consultar(): void {
    if(!this.validaFiltrosConsulta()){
      return;
    }
    this.consultarFuncionariosActa();   
  }

  
  mostrarlovactas(): void {   
    this.lovactas.mfiltros.tipomovimiento = "ENTREG";
    this.lovactas.showDialog(true);
  }


  /**Retorno de lov de EGRESOS. */
  fijarLovActasSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.cusuarioasignado = reg.registro.cusuarioasignado;   
      this.registro.mdatos.nfuncionario = reg.registro.mdatos.nfuncionario;     
      this.consultar();
    }
  }

  //MÉTODO PARA CONSULTAR LISTADO DE PRODUCTOS ASIGNADOS A FUNCIONARIOS -- COMPONENTE DE CONSULTA
  consultarFuncionariosActa() {
    this.rqConsulta.CODIGOCONSULTA = 'AF_CONSULTAENTREGAS';
    this.rqConsulta.storeprocedure = "sp_AcfConActaEntrega";
    this.rqConsulta.parametro_cusuarioasignado = this.mfiltros.cusuarioasignado;
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaDocumentos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuestaDocumentos(resp: any) {
    this.lregistros = [];
    if (resp.cod === 'OK') {
      this.lregistros = resp.AF_CONSULTAENTREGAS;
    }
  }


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


}
