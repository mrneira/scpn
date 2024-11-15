import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../util/shared/componentes/base.component';

@Component({
  selector: 'app-perfiles',
  templateUrl: 'perfiles.html'
})
export class PerfilesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TsegRol', 'ROL', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.optlock = 0;
  }

  actualizar() {
    this.registro.mdatos.nrol = this.registro.nombre;
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

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 'nombre', this.mfiltros, this.mfiltrosesp);

    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    if (resp.cod === 'OK') {
      for (const i in this.lregistros) {
        if (this.lregistros.hasOwnProperty(i)) {
          const reg = this.lregistros[i];
          reg.mdatos.nrol = reg.nombre;
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

  public consultarPerfiles(pLista: any, agregaRegistroVacio: boolean): any {
    while (pLista.length > 0) {
      pLista.pop();
    }
    const consulta = this.crearDtoConsulta();
    consulta.cantidad = 1000;
    const rq = this.getRequestConsulta('C');
    return this.dtoServicios.ejecutarConsultaRest(rq).subscribe(
      resp => {
        if (resp.cod === 'OK') {
          if (agregaRegistroVacio) {
            pLista.push({label: '...', value: null});
          }
          const lista = resp[this.alias];
          for (const i in lista) {
            if (lista.hasOwnProperty(i)) {
              const reg = lista[i];
              pLista.push({label: reg.nombre, value: reg.crol});
            }
          }
        } else {
          this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
        }
      }, error => {
        this.dtoServicios.manejoError(error);
      }
    );
  }

}
