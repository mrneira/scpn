import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovFuncionariosComponent } from '../../../lov/funcionarios/componentes/lov.funcionarios.component';
import { LovPeriodoComponent } from '../../../lov/periodo/componentes/lov.periodo.component';

@Component({
  selector: 'app-sanciones',
  templateUrl: 'sanciones.html'
})
export class SancionesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild('lovFiltro')
  private lovFuncionariosFiltro: LovFuncionariosComponent;
  @ViewChild('lovFuncionario')
  private lovFuncionarios: LovFuncionariosComponent;

  @ViewChild(LovPeriodoComponent)
  private lovPeriodo: LovPeriodoComponent;

  public ltipo: SelectItem[] = [{ label: '...', value: null }];
  public ltipoamonestacion: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthsancion', 'SANCION', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);

    this.consultarCatalogos();
   // this.consultar();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.estaVacio(sessionStorage.getItem("cfuncionario")) || sessionStorage.getItem("cfuncionario") === '0') {
      super.mostrarMensajeError("NO ESTA AUTORIZADO PARA REALIZAR ESTA SANCIÓN");
      return;
    }
    if (this.estaVacio(this.mcampos.cperiodo)) {
      this.mostrarMensajeError("ELIJA PRIMERO UN PERÍODO PARA REALIZAR LA ASIGNACIÓN");
      return;
    }
   
    super.crearNuevo();
    this.registro.cperiodo = this.mcampos.cperiodo;
    
    this.registro.sancionadorcfuncionario = sessionStorage.getItem('cfuncionario');
   

    this.registro.tiposancionccatalogo = 1120;
    this.registro.tipoamonestacionccatalogo = 1112;

    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.fingreso = this.fechaactual;
    this.registro.valordescuento=0;

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
  public fijarFiltrosConsulta() {
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    var consultafuncionario = "CONCAT(primernombre,' ',primerapellido) AS nsancionado";
    const consulta = new Consulta(this.entityBean, 'Y', 't.csancion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ntiposancion', 'i.ccatalogo = t.tiposancionccatalogo and i.cdetalle = t.tiposancioncdetalle');
    consulta.addSubquery('tthfuncionariodetalle', 'primernombre', 'nombre', 'i.cfuncionario = t.sancionadocfuncionario and i.verreg = 0');
    consulta.addSubquery('tthfuncionariodetalle', 'primerapellido', 'apellido', 'i.cfuncionario = t.sancionadocfuncionario and i.verreg = 0');

    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }



  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************
  validaFiltrosConsulta(): boolean {
    return true;
  }
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
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaCatalogos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }
  llenarConsultaCatalogos(): void {
    const mfiltrostipo: any = { 'ccatalogo': 1120 };
    const consultatipo = new Consulta('tgencatalogodetalle', 'Y', 't.cdetalle', mfiltrostipo, {});
    consultatipo.cantidad = 500;
    this.addConsultaPorAlias('TIPO', consultatipo);

    const mfiltrosAmonestacion: any = { 'ccatalogo': 1112 };
    const consultaAmonestacion = new Consulta('tgencatalogodetalle', 'Y', 't.cdetalle', mfiltrosAmonestacion, {});
    consultaAmonestacion.cantidad = 500;
    this.addConsultaPorAlias('AMONESTACION', consultaAmonestacion);


  }
  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {


      this.llenaListaCatalogo(this.ltipo, resp.TIPO, 'cdetalle');
      this.llenaListaCatalogo(this.ltipoamonestacion, resp.AMONESTACION, 'cdetalle');
    }
    this.lconsulta = [];
  }

  mostrarLovFuncionario(): void {
    this.lovFuncionarios.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovFuncionarioSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.sancionadocfuncionario = reg.registro.cfuncionario;
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.mcampos.nombre = reg.registro.primernombre + " " + reg.registro.primerapellido;
      this.registro.mdatos.nombre = reg.registro.primernombre;
      this.registro.mdatos.apellido = reg.registro.primerapellido;
    }
  }
  mostrarLovFuncionarioF(): void {
    this.lovFuncionariosFiltro.showDialog();
  }
  mostrarLovPeriodo(): void {
    this.lovPeriodo.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovFuncionarioSelecF(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.sancionadocfuncionario = reg.registro.cfuncionario;
      this.mcampos.nfuncionariofiltro = reg.registro.primernombre + " " + reg.registro.primerapellido;
      
    }
  }
  validar() {
    if (!this.registro.aplicadescuento) {
      this.registro.valordescuento = 0;
    }
  }
  fijarLovPeriodoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cperiodo = reg.registro.cperiodo;
      this.registro.cperiodo = reg.registro.cperiodo;
      this.mcampos.nperiodo = reg.registro.nombre;
      this.mcampos.fdesde = reg.registro.fdesde;
      this.mcampos.fhasta = reg.registro.fhasta;
      this.consultar();
    }
  }

}
