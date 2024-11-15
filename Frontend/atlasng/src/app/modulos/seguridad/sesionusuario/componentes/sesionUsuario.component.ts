import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';
import {CatalogoDetalleComponent} from '../../../generales/catalogos/componentes/_catalogoDetalle.component';

@Component({
  selector: 'app-sesion-usuario',
  templateUrl: 'sesionUsuario.html'
})
export class SesionUsuarioComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public ldiassemana: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TsegUsuarioSession', 'SESIONUSUARIOS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
    this.mfiltrosesp.cusuario="NOT IN (\'"+this.dtoServicios.mradicacion.cusuario+"\')";
    this.consultar();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    // NO APLICA A ESTA PAGINA
  }

  actualizar() {
    // NO APLICA A ESTA PAGINA
  }

  eliminar() {
    // NO APLICA A ESTA PAGINA
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

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.fultimaaccion', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad=500;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);

    if (resp.cod !== 'OK') {
      return;
    }
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if(this.estaVacio(reg.fultimaaccion)){
          continue;
        }
        // A la fecha de javascript hay que restar 5 horas, por GMT-5
        const now = Date.now();
        const fecha = new Date(reg.fultimaaccion);
        const frestante = now - fecha.getTime();
        if (frestante > 0) {
          reg.mdatos.minutosinactividad = ((frestante) / 60000).toFixed(2);
        }
      }
    }
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
  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();
    
    const mfiltrosDiaSem: any = {'ccatalogo': 5};
    const consultaDiaSem = new Consulta('tgencatalogodetalle', 'Y', 't.clegal', mfiltrosDiaSem, {});
    consultaDiaSem.cantidad = 500;
    this.addConsultaCatalogos('DIASSEMANA', consultaDiaSem, this.ldiassemana, super.llenaListaCatalogo, 'clegal');

    this.ejecutarConsultaCatalogos();
  }

}
