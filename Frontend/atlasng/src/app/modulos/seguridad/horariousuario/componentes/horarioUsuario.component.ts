import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../util/dto/dto.component';
import {Mantenimiento, Filtro} from '../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';
import {LovUsuariosComponent} from '../../lov/usuarios/componentes/lov.usuarios.component';

@Component({
  selector: 'app-horario-usuario',
  templateUrl: 'horarioUsuario.html'
})
export class HorarioUsuarioComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild('lovusuariosautomatico')
  private lovusuariosautomatico: LovUsuariosComponent;

  @ViewChild('lovusuariosregistro')
  private lovusuariosregistro: LovUsuariosComponent;

  public ldiassemana: SelectItem[] = [{label: '...', value: null}];

  public horario = true;

  public mostrarDialogoHrario = false;

  public camapo1: number;
  public camapo2: number;
  public camapo3: number;
  public camapo4: number;

  

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TsegHorarioUsuario', 'HORARIOUSUARIO', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.consultarCatalogos();
    this.rqMantenimiento.mdatos.horario = false;
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.mcampos.cusuario1 === '' || this.mcampos.cusuario1 === undefined) {
      this.mostrarMensajeError('DEBE SELECCIONAR USUARIO');
      return;

    }
    super.crearNuevo();
    this.horario = true;
    this.rqMantenimiento.mdatos.horario = false;
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.verreg = 0;
    this.registro.cusuario = this.mcampos.cusuario1;
    this.registro.ccatalogodiasemana = 5;

  }

  actualizar() {
    this.encerarMensajes();
    if (!this.horario) {
      if (!this.validarhorario(this.mcampos.horaini, this.mcampos.horafin)) {
        return;
      }
      this.rqMantenimiento.mdatos.cusuario = this.mcampos.cusuario1;
      this.rqMantenimiento.mdatos.horaini = this.mcampos.horaini;
      this.rqMantenimiento.mdatos.horafin = this.mcampos.horafin;
      this.rqMantenimiento.mdatos.ccompania = this.dtoServicios.mradicacion.ccompania;
      this.rqMantenimiento.mdatos.observacion = this.mcampos.observacion;
      this.rqMantenimiento.mdatos.horario = true;
      this.mcampos.cusuario = this.mcampos.cusuario1;
      this.mostrarDialogoHrario = false;
    }
    else {
      if (!this.validarhorario(this.registro.horaini, this.registro.horafin)) {
        return;
      }
      super.actualizar();
      this.registro.cdetallediasemana = this.registro.diasemana;
      this.rqMantenimiento.mdatos.horario = false;
    }
  }

  private validarhorario(horaini: any, horafin: any): boolean {
    var ban: boolean;
    ban = true;
    this.camapo1 = this.splitValor(horaini, ':', 0);
    this.camapo2 = this.splitValor(horaini, ':', 1);
    this.camapo3 = this.splitValor(horafin, ':', 0);
    this.camapo4 = this.splitValor(horafin, ':', 1);

    if (this.camapo1 > 24) {
      this.mostrarMensajeError('HORA DE INICIO ' + horaini + ' NO PUEDE SER MAYOY A 24:00');
      ban = false;
    }

    if (this.camapo3 > 24) {
      this.mostrarMensajeError('HORA DE FIN ' + horafin + ' NO PUEDE SER MAYOY A 24:00');
      ban = false;
    }

    if (this.camapo2 > 59) {
      this.mostrarMensajeError('VALOR INCORRECTO EN HORA DE INICIO ' + horaini);
      ban = false;
    }

    if (this.camapo4 > 59) {
      this.mostrarMensajeError('VALOR INCORRECTO EN HORA DE INICIO ' + horafin);
      ban = false;
    }

    if (this.camapo2 === this.camapo4) {
      if (this.camapo1 > this.camapo3) {
        this.mostrarMensajeError('HORA DE INICIO ' + horaini + ' NO PUEDE SER MAYOR A: ' + horafin);
        ban = false;
      }

    }
    return ban;
  }

  private splitValor(obj: any, split: string, posicion: number): number {
    var valor: number;
    valor = 0;
    if (obj.indexOf(split) > 0) {
      const arrpks = obj.split(split);
      valor = arrpks[posicion];
    }
    return valor
  }

  eliminar() {
    super.eliminar();
    this.rqMantenimiento.mdatos.horario = false;
  }

  cancelar() {
    this.encerarMensajes();
    this.mostrarDialogoHrario = false;
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
    this.rqMantenimiento.mdatos.horario = false;
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
    /* consulta.addSubqueryPorSentencia('select pd.nombre from tperpersonadetalle pd, tsegusuariodetalle tu where ' +
       ' pd.cpersona = tu.cpersona and pd.verreg = 0 and tu.verreg = 0 and tu.ccompania = pd.ccompania ' +
       ' and tu.cusuario=t.cusuario', 'npersona');*/
    consulta.addFiltroCondicion("cusuario", this.mcampos.cusuario1, "=");
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
      this.mostrarMensajeError('DEBE SELECCIONAR USUARIO');
      return;
    }

    if (this.lregistros.length === 0 && this.rqMantenimiento.mdatos.horario === false) {
      this.mostrarMensajeError('NO EXISTE DATOS PARA GUARDAR');
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

    if (this.rqMantenimiento.mdatos.horario === false) {
      this.enproceso = true;
    } else {
      this.enproceso = false;
    }
    this.consultar();
  }

  /**Mostrar dialog Horario de Acceso */
  mostrarHorario() {
    this.lregistros = [];
    if (this.mcampos.cusuario1 === undefined || this.mcampos.cusuario1 === '') {
      this.mostrarMensajeError('USUARIO REQUERIDO');
      return;
    }
    this.mcampos.horaini = '';
    this.mcampos.horafin = '';
    this.horario = false;
    this.mostrarDialogoHrario = true;
  }



  /**Muestra lov de usuarios automatico */
  mostrarLovUsuariosAuto(): void {
    this.lovusuariosautomatico.showDialog();
  }

  /**Retorno de lov de usuarios. automatico */
  fijarLovUsuariosAutoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cusuario1 = reg.registro.mdatos.cusuario;
      this.mcampos.npersona = reg.registro.mdatos.npersona;
      //this.registro.cusuario = reg.registro.mdatos.cusuario;
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
