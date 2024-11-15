import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { AppService } from 'app/util/servicios/app.service';
@Component({
  selector: 'app-funcionarionomina',
  templateUrl: 'funcionarionomina.html'
})
export class FuncionarionominaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public lmeses: SelectItem[] = [{ label: '...', value: null }];
  public totalvalidos: number = 0;
  public totalinvalidos: number = 0;
  public total: number = 0;
  public centrocostocdetalle: string;
  public ldatos: any = [];
  selectedRegistros;
  public totalnegados: number = 0;
  constructor(router: Router, dtoServicios: DtoServicios, public appService: AppService) {
    super(router, dtoServicios, 'ABSTRACT', 'FUNCIONARIOSNOMINA', false);
    this.componentehijo = this;
  }

  ngOnInit() {


    super.init(this.formFiltros, this.route);

    this.obtnerdatos();
  }
  obtnerdatos() {

    this.rqConsulta.CODIGOCONSULTA = 'LISTAPERSONAL';
    //this.rqConsulta.parametro_centrocostocdetalle = this.centrocostocdetalle;
    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.lregistros = [];
          if (resp.cod === 'OK') {
            this.lregistros = resp.LISTAPERSONAL;
            for (let i in this.lregistros) {
              let reg = this.lregistros[i];
              if (reg.avisoentrada == 0) {
                this.totalinvalidos = this.totalinvalidos + 1;
              } else {
                this.totalvalidos = this.totalvalidos + 1;
              }
            }
            this.total = this.totalinvalidos + this.totalvalidos;
          }

          //   this.cargadatos();
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }
  getTotal(): Number {
    let total = 0;
    this.totalvalidos=0;
    this.totalinvalidos=0;
    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];
        if (reg.avisoentrada != 0) {
      
          this.totalvalidos = this.totalvalidos + 1;
        } else {
          this.totalinvalidos = this.totalinvalidos + 1;
        }
       
      }
    }

    if (total > 0) {
      this.mcampos.total = total;
    }

    return this.totalvalidos;
  }

  getColorAprobadoPresupuesto(x, reg) {
    var color: string;
    if (!reg.avisoentrada) {
      color = 'lightgreen';
   
    } else {
      color = 'red';
    }
    x.parentNode.parentNode.style.background = color; 
  }

  aprobarListado() {

    this.ldatos = [];
    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];
        if (reg.avisoentrada != 0) {
          this.ldatos.push(reg);
          this.totalvalidos = this.totalvalidos + 1;
        } else {
          this.totalinvalidos = this.totalinvalidos + 1;
        }
      }
    }
    if (this.totalvalidos<= 0) {
      return false;

    }
    return true;
  }
  ngAfterViewInit() {
  }

  crearNuevo() {

  }

  actualizar() {
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

  public nuevaNomina() {
    if (this.totalvalidos <= 0) {
      super.mostrarMensajeError("NO HAY PERSONAS PARA REALIZAR LA NÓMINA");
      return;
    }
   if (!this.aprobarListado()){
    
    super.mostrarMensajeError("NO HAY PERSONAS PARA REALIZAR LA NÓMINA");
    
   }
    const opciones = {};
    const tran = 413;
    opciones['path'] = sessionStorage.getItem('m') + '-' + tran;
    opciones['tit'] = this.titulo;
    opciones['mod'] = sessionStorage.getItem('m');
    opciones['tran'] = tran;
    opciones['ac'] = 'false';
    opciones['ins'] = 'true';
    opciones['del'] = 'true';
    opciones['upd'] = 'true';

    sessionStorage.setItem('titulo', opciones['tit']);
    sessionStorage.setItem('m', opciones['mod']);
    sessionStorage.setItem('t', opciones['tran']);
    sessionStorage.setItem('ac', opciones['ac']);
    sessionStorage.setItem('ins', opciones['ins']);
    sessionStorage.setItem('del', opciones['del']);
    sessionStorage.setItem('upd', opciones['upd']);

    sessionStorage.setItem('path', opciones['path']);
    this.router.navigate([opciones['path']], {
      skipLocationChange: true, queryParams: {
        sol: JSON.stringify({
          ldatos: this.ldatos,
          estado: 'GEN',
          nuevaNomina: true
        })
      }
    });
    this.appService.titulopagina = opciones['tit'];
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



  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }




}
