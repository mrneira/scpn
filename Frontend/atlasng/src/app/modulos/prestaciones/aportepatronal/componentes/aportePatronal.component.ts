import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { FieldsetModule } from 'primeng/primeng';
import { LovPersonasComponent } from './../../../personas/lov/personas/componentes/lov.personas.component';
import { AportesComponent } from './../submodulos/aportes/componentes/aportes.component';

import { AppService } from '../../../../util/servicios/app.service';
import { MenuItem } from 'primeng/components/common/menuitem';

@Component({
  selector: 'app-aporte-patronal',
  templateUrl: 'aportePatronal.html'
})
export class AportePatronalComponent extends BaseComponent implements OnInit, AfterViewInit {
  atencioncliente: any;

  @ViewChild('formFiltros') formFiltros: NgForm;


  @ViewChild(LovPersonasComponent)
  private lovSocios: LovPersonasComponent;

  @ViewChild(AportesComponent)
  aportesComponent: AportesComponent;


  public collapsed = false;

  constructor(router: Router, dtoServicios: DtoServicios, public route: ActivatedRoute, public appService: AppService) {
    super(router, dtoServicios, 'ABSTRACT', 'APORTEPATRONAL', false);

  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros, this.route);
  }

  ngAfterViewInit() {

  }

  crearNuevo() {

  }
  // Inicia CONSULTA *********************

  recargar() {
    super.recargar();
  }

  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  consultaDatos() {
    this.collapsed = true;
    this.fijarFiltrosConsulta();
    this.aportesComponent.consultar();

  }

  public crearDtoConsulta() {
    this.consultaDatos();
  }

  private fijarFiltrosConsulta() {

  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  public postQuery(resp: any) {
  }
  // Fin CONSULTA *********************
  /**Muestra lov de personas */
  mostrarLovPersonas(): void {
    this.lovSocios.mfiltros.csocio = 1;
    this.lovSocios.mcampos.identificacion = undefined;
    this.lovSocios.mcampos.nombre = undefined;
    this.lovSocios.showDialog();
  }
  /**Retorno de lov de personas. */
  fijarLovSociosSelec(reg: any): void {

    if (reg.registro !== undefined) {
      this.mcampos.cdetalletipoexp = null
      this.collapsed = false;
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.npersona = reg.registro.nombre;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.aportesComponent.mcampos.identificacion = reg.registro.identificacion;
      this.aportesComponent.mfiltros.cpersona = reg.registro.cpersona;

      this.consultar();


    }
  }
}
