  import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
  import { Router } from '@angular/router';
  import { NgForm } from '@angular/forms';
  import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
  import { Consulta } from '../../../../../util/dto/dto.component';
  import { Mantenimiento } from '../../../../../util/dto/dto.component';
  import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
  import { SelectItem } from 'primeng/primeng';
  import { LovFuncionariosComponent } from '../../../lov/funcionarios/componentes/lov.funcionarios.component';


  @Component({
    selector: 'app-impuestorenta',
    templateUrl: 'impuestorenta.html'
  })
  export class ImpuestoRentaComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;
    @ViewChild(LovFuncionariosComponent)
    private lovFuncionario: LovFuncionariosComponent;

    public visible = true;
    public ltipo: SelectItem[] = [{ label: '...', value: null }];
    

    constructor(router: Router, dtoServicios: DtoServicios) {
      super(router, dtoServicios, 'tnompagoimpuestorenta', 'IMPUESTORENTA', false, false);
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
      this.registro.fingreso = this.fechaactual;
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
      const consulta = new Consulta(this.entityBean, 'Y', 't.cimpuesto', this.mfiltros, this.mfiltrosesp);
      consulta.addSubquery('tthfuncionariodetalle', 'primernombre + \' \' + primerapellido', 'nfuncionario', 'i.cfuncionario= t.cfuncionario and i.verreg = 0');
     
      consulta.cantidad = 50;
      this.addConsulta(consulta);
      return consulta;
    }
    

    private fijarFiltrosConsulta() {
    }

    validaFiltrosConsulta(): boolean {
      return super.validaFiltrosConsulta();
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
 

    mostrarLovFuncionario(): void {
      this.lovFuncionario.showDialog();
    }
  
    /**Retorno de lov de personas. */
    fijarLovFuncionarioSelec(reg: any): void {

      if (reg.registro !== undefined) {
        this.registro.mdatos.nfuncionario = reg.registro.primernombre + " " + reg.registro.primerapellido;
        this.registro.cfuncionario = reg.registro.cfuncionario;
      }
    }

  }
