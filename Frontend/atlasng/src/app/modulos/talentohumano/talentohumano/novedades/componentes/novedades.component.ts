  import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
  import { Router } from '@angular/router';
  import { NgForm } from '@angular/forms';
  import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
  import { Consulta } from '../../../../../util/dto/dto.component';
  import { Mantenimiento } from '../../../../../util/dto/dto.component';
  import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
  import { SelectItem } from 'primeng/primeng';
  import { LovFuncionariosComponent } from '../../../lov/funcionarios/componentes/lov.funcionarios.component';
  import { GestorDocumentalComponent } from '../../../../gestordocumental/componentes/gestordocumental.component';
  import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';


  @Component({
    selector: 'app-novedades',
    templateUrl: 'novedades.html'
  })
  export class NovedadesComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;
    @ViewChild(LovFuncionariosComponent)
    private lovFuncionario: LovFuncionariosComponent;
    @ViewChild(GestorDocumentalComponent)
    private lovGestor: GestorDocumentalComponent;
    public visible = true;
    public ltipo: SelectItem[] = [{ label: '...', value: null }];
    private catalogoDetalle: CatalogoDetalleComponent

    constructor(router: Router, dtoServicios: DtoServicios) {
      super(router, dtoServicios, 'tnomfuncionarionovedad', 'NOVEDADES', false, false);
      this.componentehijo = this;
    }

    ngOnInit() {
      super.init(this.formFiltros);
      this.consultar();
      this.consultarCatalogos();

    }

    ngAfterViewInit() {
    }

    crearNuevo() {
      super.crearNuevo();
      this.registro.tipoccatalogo = 1141;
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
      const consulta = new Consulta(this.entityBean, 'Y', 't.cnovedad', this.mfiltros, this.mfiltrosesp);
      consulta.addSubquery('tthfuncionariodetalle', 'primernombre + \' \' + primerapellido', 'nfuncionario', 'i.cfuncionario= t.cfuncionario and i.verreg = 0');
      consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ntipo', 'i.ccatalogo= t.tipoccatalogo and i.cdetalle = t.tipocdetalle');

      consulta.cantidad = 50;
      this.addConsulta(consulta);
      return consulta;
    }
    consultarCatalogos(): void {
      this.encerarConsultaCatalogos();
      this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
      this.catalogoDetalle.mfiltros.ccatalogo = 1141;
      const conNovedad = this.catalogoDetalle.crearDtoConsulta();
      conNovedad.cantidad = 20;
      this.addConsultaCatalogos('TIPONOVEDAD', conNovedad, this.ltipo, super.llenaListaCatalogo, 'cdetalle');
      this.ejecutarConsultaCatalogos();
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
    mostrarLovGestorDocumental(reg: any): void {
      this.selectRegistro(reg);
      this.mostrarDialogoGenerico = false;
      this.lovGestor.showDialog(reg.cgesarchivo);
    }
    /**Retorno de lov de Gestión Documental. */
    fijarLovGestorDocumental(reg: any): void {
      if (reg !== undefined) {
        this.registro.cgesarchivo = reg.cgesarchivo;
        this.registro.mdatos.ndocumento = reg.ndocumento;
        this.actualizar();

        this.grabar();
        this.visible = true;

      }
    }


    mostrarLovFuncionario(): void {
      this.lovFuncionario.showDialog();
 
    }
    descargarArchivo(cgesarchivo: any): void {
      this.lovGestor.consultarArchivo(cgesarchivo, true);
    }
    /**Retorno de lov de personas. */
    fijarLovFuncionarioSelec(reg: any): void {

      if (reg.registro !== undefined) {


        this.registro.mdatos.nfuncionario = reg.registro.primernombre + " " + reg.registro.primerapellido;
        this.registro.cfuncionario = reg.registro.cfuncionario;
      }
    }

  }
