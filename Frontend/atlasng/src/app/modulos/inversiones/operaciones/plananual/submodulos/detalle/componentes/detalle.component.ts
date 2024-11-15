import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
@Component({
  selector: 'app-detalle',
  templateUrl: 'detalle.html'
})
export class DetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoPorcentaje = new EventEmitter();
  public maxpuntaje: number;

  public ltipo: SelectItem[] = [{ label: '...', value: null }];


  public lproducto: SelectItem[] = [{ label: '...', value: null }];
  public ltipoproducto: SelectItem[] = [{ label: '...', value: null }];

  public ltipoproductogen: any = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tinvplananualdetalle', 'PLANANUALDETALLE', false, false);
    this.componentehijo = this;
  }

  agregarlinea() {
    if (this.estaVacio(this.mcampos.tipocdetalle)) {
      super.mostrarMensajeError("NO SE HA DEFINIDO LOS PARÁMETROS DE LA PLANIFICACIÓN ANUAL");
      return;
    }
    super.crearnuevoRegistro();
    this.registro.tipocdetalle = this.mcampos.tipocdetalle;
    this.registro.cmodulo = this.mcampos.cmodulo;
    this.registro.anio = this.mcampos.anio;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.fingreso = this.fechaactual;
    this.actualizar();

  }
  ngOnInit() {
    this.del = true;
  }

  ngAfterViewInit() {
  }
  validarRegistros(): string {
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (this.estaVacio(reg.participacion)) {
          return 'NO SE HA DEFINIDO LA PARTICIPACIÓN EN EL REGISTRO ' + (Number(i) + 1);
        }

      }
    }
    return "";
  }
  crearNuevo() {
    if (this.estaVacio(this.mcampos.tipocdetalle)) {
      super.mostrarMensajeError("NO SE HA DEFINIDO LOS PARÁMETROS DE LA PLANIFICACIÓN ANUAL");
      return;
    }
    super.crearNuevo();
    this.registro.tipocdetalle = this.mcampos.tipocdetalle;
    this.registro.cmodulo = this.mcampos.cmodulo;
    this.registro.anio = this.mcampos.anio;
    this.registro.tipoccatalogo = 1226;
    this.registro.participacion = 0;
    this.registro.pproyectada = 0;
    this.registro.pproyectadareal = 0;
    this.registro.incremento=0;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.fingreso = this.fechaactual;
    this.registro.validacion = true;

    this.actualizarTotales();
  }

  actualizar() {
    super.actualizar();
    this.actualizarTotales();
  }

  eliminar() {
    super.eliminar();
    this.actualizarTotales();
  }

  cancelar() {
    super.cancelar();
    this.actualizarTotales();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.estaVacio(this.mcampos.tipocdetalle)) {
      this.mostrarMensajeError('ELIJA PLAN ANUAL PARA REALIZAR EL MANTENIMIENTO');
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cplandetalle', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgenproducto', 'nombre', 'nproducto', 'i.cproducto = t.cproducto and i.cmodulo = t.cmodulo');
    consulta.addSubquery('tgentipoproducto', 'nombre', 'ntipoproducto', 'i.cproducto = t.cproducto and i.cmodulo = t.cmodulo and t.ctipoproducto=i.ctipoproducto');
    consulta.cantidad = 100;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.tipocdetalle = this.mcampos.tipocdetalle;
    this.mfiltros.anio = this.mcampos.anio;
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




  /**Retorno de lov de personas. */
  fijarLovFuncionarioSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.registro.cfuncionario = reg.registro.cfuncionario;
      this.mcampos.nfuncionario = reg.registro.primernombre + " " + reg.registro.primerapellido;
      this.registro.mdatos.nnombre = reg.registro.primernombre;
      this.registro.mdatos.napellido = reg.registro.primerapellido;
    }
  }
  actualizarTotales() {
    for (const i in this.lregistros) {
      this.actualizarTotal(Number(i));
    }
  }

  actualizarTotalIndv(index: number) {

    let participacion = this.lregistros[index].participacion;
    let totalregistros = this.lregistros.length;
    let total = Number(participacion) + ((this.mcampos.pparticipacion * participacion) / 100);
    let incremento=0;
    if(this.lregistros[index].incremento){
       incremento =  this.lregistros[index].incremento ;
       //incremento =  ((this.lregistros[index].incremento * participacion) / 100);
     
       incremento = this.redondear(incremento, 7);
    }
    total=total+incremento;
    total = this.redondear(total, 2);
    this.lregistros[index].pproyectada = total;
    this.mcampos.ptotal = this.sumarProyectada();
    let preal = (total / this.mcampos.ptotal) * 100;
    preal = this.redondear(preal, 7);
    this.lregistros[index].pproyectadareal = preal
    this.mcampos.pparticipaciontotal = this.sumar();

    this.actualizarTotales();

    this.eventoPorcentaje.emit();

  }

  actualizarTotal(index: number) {

    let participacion = this.lregistros[index].participacion;
    let totalregistros = this.lregistros.length;
    let total = Number(participacion) + ((this.mcampos.pparticipacion * participacion) / 100);
    let incremento=0;
    if(this.lregistros[index].incremento){
       incremento =  (this.lregistros[index].incremento);
       //incremento =  ((this.lregistros[index].incremento * participacion) / 100);
     
       incremento = this.redondear(incremento, 7);
       
    }
    total=total+incremento;
    total = this.redondear(total, 2);
    this.lregistros[index].pproyectada = total;
    this.mcampos.ptotal = this.sumarProyectada();
    let preal = (total / this.mcampos.ptotal) * 100;
    preal = this.redondear(preal, 7);
    this.lregistros[index].pproyectadareal = preal
    this.mcampos.pparticipaciontotal = this.sumar();


    this.eventoPorcentaje.emit();

  }
  sumar(): number {
    let total = 0;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (reg.pproyectadareal)
          total = total + reg.pproyectadareal;
      }
    }
    return total;
  }
  sumarProyectada(): number {
    let total = 0;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (reg.pproyectada)
          total = total + reg.pproyectada;
      }
    }
    return total;
  }



  consultartipo(producto: any) {
    this.ltipoproducto = [{ label: '...', value: null }];
    for (const i in this.ltipoproductogen) {
      if (this.ltipoproductogen.hasOwnProperty(i)) {
        const reg = this.ltipoproductogen[i];
        if (reg.cproducto === producto.cproducto && reg.cmodulo === producto.cmodulo) {
          if (!this.existeLista(reg.cproducto, reg.ctipoproducto)) {
            this.ltipoproducto.push({ label: reg.nombre, value: reg.ctipoproducto });
          }
        }
      }
    }
  }
  existeLista(cproducto: any, ctipoproducto: any): boolean {
    let existe = false;
    if (this.lregistros === undefined) {
      return false;
    }
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (reg.ctipoproducto === ctipoproducto && reg.cproducto === cproducto) {
          existe = true;
          break;
        }
      }
    }
    return existe;
  }


}
