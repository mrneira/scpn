import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';
import {CatalogoDetalleComponent} from '../../../generales/catalogos/componentes/_catalogoDetalle.component';
import {LovTransaccionesComponent} from '../../../generales/lov/transacciones/componentes/lov.transacciones.component';

@Component({
  selector: 'app-audit',
  templateUrl: 'auditGeneral.html'
})
export class AuditGeneralComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovTransaccionesComponent)
  private lovtransacciones: LovTransaccionesComponent;

  public lcampospks = [];

  public lcampos = [];

  public lcamposet = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TsegAuditoriaInsDel', 'AUDIT', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
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

  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
    this.lcampospks = [];
    this.lcampos = [];
    this.lcamposet = [];

    const fpk = JSON.parse(registro.pkregistro)['f'];
    for (const i in fpk) {
      if (fpk.hasOwnProperty(i)) {
        this.lcampospks.push(fpk[i]);
      }
    }

    const f = JSON.parse(registro.valorregistro)['f'];
    for (const i in f) {
      if (f.hasOwnProperty(i)) {
        this.lcampos.push(f[i]);
      }
    }

    if (!this.estaVacio(registro.valoretiqueta)) {
      const et = JSON.parse(registro.valoretiqueta);
      for (const key in et) {
        if (et.hasOwnProperty(key)) {
          this.lcamposet.push({ce: key, ve: et[key]});
        }
      }
    }
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.rqConsulta.CODIGOCONSULTA = 'CONSULTAAUDIT';
    this.crearDtoConsulta();
    super.consultar();
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.fecha', this.mfiltros, this.mfiltrosesp, this.mfiltrosigual);
    consulta.addSubquery('TgenTransaccion', 'nombre', 'nt', 'i.cmodulo = t.cmodulo and i.ctransaccion = t.ctransaccion');
    consulta.cantidad = 25;

    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {

  }

  /**Muestra lov de transacciones */
  mostrarLovTransacciones(): void {
    this.lovtransacciones.showDialog();
  }

  /**Retorno de lov de transacciones. */
  fijarLovTransaccionesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nmodulo = reg.registro.mdatos.nmodulo;
      this.mcampos.ntransaccion = reg.registro.nombre;
      this.mfiltrosigual.cmodulo = reg.registro.cmodulo;
      this.mfiltrosigual.ctransaccion = reg.registro.ctransaccion;
    }
  }

}
