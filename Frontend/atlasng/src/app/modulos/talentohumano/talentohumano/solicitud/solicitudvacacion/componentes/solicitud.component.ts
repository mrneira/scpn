import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovCapacitacionComponent } from '../../../../lov/capacitacion/componentes/lov.capacitacion.component';
import { CatalogoDetalleComponent } from '../../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { VacacionComponent } from '../submodulos/vacacion/componentes/vacacion.component';
import { ConfirmationService } from 'primeng/primeng';
import { LovFuncionariosComponent } from '../../../../lov/funcionarios/componentes/lov.funcionarios.component';

@Component({
  selector: 'app-solicitud',
  templateUrl: 'solicitud.html'
})
export class SolicitudComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(VacacionComponent)
  private tablaVacacion: VacacionComponent;



  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;

  public ltipo: SelectItem[] = [{ label: '...', value: null }];
  public nuevo = true;
  public funcionario = true;
  private catalogoDetalle: CatalogoDetalleComponent;
  public lparametro: any = [];
  public lparametrorrh: any = [];
  constructor(router: Router, dtoServicios: DtoServicios, private confirmationService: ConfirmationService) {
    super(router, dtoServicios, 'tnomsolicitud', 'SOLVACACION', true);
  }

  solicitar() {
    if (this.estaVacio(this.registro.cfuncionario)) {
      this.mostrarMensajeError("NO SE HA SELECCIONADO UN FUNCIONARIO");
      return;
    }

    if (!this.validaGrabar()) {
      return;
    }
    this.confirmationService.confirm({
      message: 'Usted está seguro/a de enviar la solicitud de vacación?',
      header: 'Confirmación',
      accept: () => {
        this.grabar();
      }
    });
  }
  validaGrabar() {
    return this.tablaVacacion.validaGrabar();
  }
  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.consultarCatalogos();
 
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    this.registro.tipoccatalogo = 1139;
    this.registro.tipocdetalle = 'VAC';
    this.registro.estado = true;
    this.registro.estadoccatalogo = 1138;
    this.registro.estadocdetalle = 'GEN';
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
  }

  cancelar() {
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.estaVacio(this.mcampos.cinstruccion)) {
      this.mostrarMensajeError('ELIJA UNA CAPACITACIÓN PARA REALIZAR EL MANTENIMIENTO');
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
  }
  private fijarFiltrosConsulta() {
  }
  consultarCatalogos(): void {
    const mfiltrosparam = { 'codigo': 'CFUNDIREJECUTIVO' };
    const consultarParametro = new Consulta('tthparametros', 'Y', 't.codigo', mfiltrosparam, null);
    consultarParametro.cantidad = 100;
    this.addConsultaCatalogos('TABL', consultarParametro, this.lparametro, super.llenaListaCatalogo, 'numero');
    const mfiltrosparamRRH = { 'codigo': 'USRRRH' };
    const consultarParametroRRH = new Consulta('tthparametros', 'Y', 't.codigo', mfiltrosparam, null);
    consultarParametroRRH.cantidad = 100;
    this.addConsultaCatalogos('CFUNRRH', consultarParametroRRH, this.lparametrorrh, super.llenaListaCatalogo, 'numero');

      this.ejecutarConsultaCatalogos();
  }


  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.nuevo = false;
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {

    this.lmantenimiento = []; // Encerar Mantenimiento


    this.crearDtoMantenimiento();
    if (this.nuevo) {
      this.selectRegistro(this.registro);
      this.actualizar();
      this.registro.fingreso = this.fechaactual;
      this.registro.arrhh = false;
      this.registro.ajefe = false;
      this.registro.adir = false;
      this.registro.finalizada = false;
      let con = this.lparametro[1].value;
      let RRH = this.lparametrorrh[1].value;
      this.registro.cfuncionarioejecutivo = con;
      this.registro.cusuariorrh = RRH;
      this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    } else {
    }
    super.addMantenimientoPorAlias(this.alias, this.getMantenimiento(1));

    super.grabar();
  }

  recargar() {
    this.router.navigate([''], { skipLocationChange: true });
  }
  public postCommit(resp: any) {

    if (resp.cod === 'OK') {
      if (!this.estaVacio(resp.SOLVACACION)) {
        this.mcampos.csolicitud = resp.SOLVACACION[0].csolicitud;
        this.grabarDetalle();
      }
      if (!this.estaVacio(resp.FINALIZADA)) {
        if (resp.FINALIZADA = 'OK') {
          this.recargar();
        }
      }

    }


  }
  grabarDetalle() {
    this.lmantenimiento = [];
    this.tablaVacacion.registro.csolicitud = this.mcampos.csolicitud;
    this.rqMantenimiento.mdatos.registro = this.tablaVacacion.registro;
    this.rqMantenimiento.mdatos.csolicitud = this.mcampos.csolicitud;
    this.rqMantenimiento.mdatos.archivo = this.tablaVacacion.mcampos.archivo;
    this.rqMantenimiento.mdatos.narchivo = this.tablaVacacion.mcampos.narchivo;
    this.rqMantenimiento.mdatos.tipo = this.tablaVacacion.mcampos.tipo;
    this.rqMantenimiento.mdatos.tamanio = this.tablaVacacion.mcampos.tamanio;
    this.rqMantenimiento.mdatos.extension = this.tablaVacacion.mcampos.extension;
    this.rqMantenimiento.mdatos.cfuncionario = this.mcampos.cfuncionario;

    this.enproceso = false;
    super.grabar();

  }


  mostrarLovFuncionario(): void {
    this.lovFuncionarios.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovFuncionarioSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.registro.cfuncionario = reg.registro.cfuncionario;
      this.mcampos.nfuncionario = reg.registro.primernombre + " " + reg.registro.primerapellido;
      this.registro.cfuncionariojefe = reg.registro.jefecfuncionario;
    }
  }
  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }
  
}
