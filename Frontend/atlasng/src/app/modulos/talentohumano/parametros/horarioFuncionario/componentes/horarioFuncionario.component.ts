import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento, Filtro} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';
import {LovFuncionariosComponent} from '../../../lov/funcionarios/componentes/lov.funcionarios.component';

@Component({
  selector: 'app-horario-funcionario',
  templateUrl: 'horarioFuncionario.html'
})
export class HorarioFuncionarioComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild('lovfuncionariosautomatico')
  private lovfuncionariosautomatico: LovFuncionariosComponent;

  @ViewChild('lovusuariosregistro')
  private lovusuariosregistro: LovFuncionariosComponent;

  public ldiassemana: SelectItem[] = [{label: '...', value: null}];

  public horario = true;


  public camapo1: number;
  public camapo2: number;
  public camapo3: number;
  public camapo4: number;


  constructor(router: Router, dtoServicios: DtoServicios) {
  super(router, dtoServicios, 'TsegHorarioUsuario', 'HORARIOFUNCIONARIO', false);

  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.mcampos.cusuario1 === '' || this.mcampos.cusuario1 === undefined) {
      this.mostrarMensajeError('DEBE SELECCIONAR EL FUNCIONARIO');
      return;

    }
    super.crearNuevo();
    this.horario = true;
    this.rqMantenimiento.mdatos.horario = false;
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.verreg = 0;
    this.registro.cusuario = this.mcampos.cusuario1;
  }

  actualizar() {
    if (!this.horario) {

      if (this.mcampos.horaini.indexOf(':') > 0) {
        const arrpks = this.mcampos.horaini.split(':');
        this.camapo1 = arrpks[0];
        this.camapo2 = arrpks[1];
      }

      if (this.mcampos.horafin.indexOf(':') > 0) {
        const arrpks = this.mcampos.horafin.split(':');
        this.camapo3 = arrpks[0];
        this.camapo4 = arrpks[1];
      }

      if (this.camapo2 > this.camapo4) {
        this.mostrarMensajeError('HORA DE INICIO ' + this.mcampos.horaini + ' NO PUEDE SER MAYOR A: ' + this.mcampos.horafin);
        return;
      }

      if (this.camapo2 === this.camapo4) {
        if (this.camapo1 > this.camapo3) {
          this.mostrarMensajeError('HORA DE INICIO ' + this.mcampos.horaini + ' NO PUEDE SER MAYOR A: ' + this.mcampos.horafin);
          return;
        }

      }

      if (this.camapo1 >= 24) {
        this.mostrarMensajeError('HORA DE INICIO ' + this.mcampos.horaini + ' NO PUEDE SER MAYOY A 24:00');
        return;
      }

      if (this.camapo3 >= 24) {
        this.mostrarMensajeError('HORA DE FIN ' + this.mcampos.horafin + ' NO PUEDE SER MAYOY A 24:00');
        return;
      }



      this.rqMantenimiento.mdatos.cusuario = this.mcampos.cusuario1;
    
      this.rqMantenimiento.mdatos.horaini = this.mcampos.horaini;
      this.rqMantenimiento.mdatos.horafin = this.mcampos.horafin;
      this.rqMantenimiento.mdatos.ccompania = this.dtoServicios.mradicacion.ccompania;
      this.rqMantenimiento.mdatos.horario = true;
      this.mcampos.cusuario = this.mcampos.cusuario1;
    }
    else {
      if (this.registro.horaini.indexOf(':') > 0) {
        const arrpks = this.registro.horaini.split(':');
        this.camapo1 = arrpks[0];
        this.camapo2 = arrpks[1];
      }

      if (this.registro.horafin.indexOf(':') > 0) {
        const arrpks = this.registro.horafin.split(':');
        this.camapo3 = arrpks[0];
        this.camapo4 = arrpks[1];
      }

      if (this.camapo2 > this.camapo4) {
        this.mostrarMensajeError('HORA DE INICIO ' + this.registro.horaini + ' NO PUEDE SER MAYOR A: ' + this.registro.horafin);
        return;
      }

      if (this.camapo2 === this.camapo4) {
        if (this.camapo1 > this.camapo3) {
          this.mostrarMensajeError('HORA DE INICIO ' + this.registro.horaini + ' NO PUEDE SER MAYOR A: ' + this.registro.horafin);
          return;
        }

      }

      if (this.camapo1 >= 24) {
        this.mostrarMensajeError('HORA DE INICIO ' + this.registro.horaini + ' NO PUEDE SER MAYOY A 24:00');
        return;
      }

      if (this.camapo3 >= 24) {
        this.mostrarMensajeError('HORA DE FIN ' + this.registro.horafin + ' NO PUEDE SER MAYOY A 24:00');
        return;
      }
      super.actualizar();
      this.rqMantenimiento.mdatos.horario = false;
    }

  }

  eliminar() {
    super.eliminar();
    this.rqMantenimiento.mdatos.horario = false;
  }

  cancelar() {
    super.cancelar();
    this.rqMantenimiento.mdatos.horario = false;
  }

  public selectRegistro(registro: any) {
    this.horario = true;
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.mcampos.cusuario1 === undefined || this.mcampos.cusuario1 === '') {
      this.mostrarMensajeError('FILTROS DE CONSULTA REQUERIDOS');
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public consultarAnterior() {
    if (this.mcampos.cusuario1 === undefined || this.mcampos.cusuario1 === '') {
      this.mostrarMensajeError('FILTROS DE CONSULTA REQUERIDOS');
      return;
    }
    super.consultarAnterior();
  }

  public consultarSiguiente() {
    if (this.mcampos.cusuario1 === undefined || this.mcampos.cusuario1 === '') {
      this.mostrarMensajeError('FILTROS DE CONSULTA REQUERIDOS');
      return;
    }
    super.consultarSiguiente();
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.diasemana, t.cusuario', this.mfiltros, this.mfiltrosesp);
    consulta.addFiltroCondicion("cfuncionario", this.mcampos.cusuario1, "=");
    

    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.mfiltros.verreg = 0;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    if (this.mcampos.cusuario1 === '' || this.mcampos.cusuario1 === undefined) {
      this.mostrarMensajeError('DEBE SELECCIONAR EL FUNCIONARIO');
      return;

    }

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
    super.postCommitEntityBean(resp, this.getDtoMantenimiento(this.alias));
    if (resp.cod !== 'OK') {
      return;
    }
    this.enproceso = false;
    this.consultar();
  }

  /**Mostrar dialog Horario de Acceso */
  mostrarHorario() {
    if (this.mcampos.cusuario1 === undefined || this.mcampos.cusuario1 === '') {
      this.mostrarMensajeError('FUNCIONARIO REQUERIDO');
      return;
    }
    this.mcampos.horaini = '';
    this.mcampos.horafin = '';
    this.horario = false;
  }



  mostrarLovFuncionariosAuto(): void {
    this.lovfuncionariosautomatico.showDialog();
  }

  /**Retorno de lov de usuarios. automatico */
  fijarLovFuncionariosAutoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cusuario1 = reg.registro.mdatos.cusuario;
      this.mcampos.npersona = reg.registro.mdatos.npersona;
    }
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
    const mfiltrosDiaSem: any = {'ccatalogo': 5};
    const consultaDiaSem = new Consulta('tgencatalogodetalle', 'Y', 't.cdetalle', mfiltrosDiaSem, {});
    consultaDiaSem.cantidad = 50;
    this.addConsultaPorAlias('DIASSEMANA', consultaDiaSem);
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.ldiassemana, resp.DIASSEMANA, 'cdetalle');

    }
    this.lconsulta = [];
  }

  obtenerDiaSemana(cod) {
    for (const i in this.ldiassemana) {
      if (this.ldiassemana[i]['value'] === cod + '') {
        return this.ldiassemana[i]['label'];
      }
    }
  }

}
