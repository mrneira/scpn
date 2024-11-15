import { Injectable } from '@angular/core';

@Injectable()
export class DtoConsulta {
  alias: string;
  consulta: Consulta;

  constructor(alias: string, consulta: Consulta) {
    this.alias = alias;
    this.consulta = consulta;
  }
}

@Injectable()
export class DtoMantenimiento {
  alias: string;
  mantenimiento: Mantenimiento;

  constructor(alias: string, mantenimiento: Mantenimiento) {
    this.alias = alias;
    this.mantenimiento = mantenimiento;
  }
}

@Injectable()
export class Filtro {
  campo: string;
  valor: string;
  condicion: string;

  constructor(campo: string, valor: string) {
    this.campo = campo;
    this.valor = valor;
  }

  public setCondicion(condicion: string) {
    this.condicion = condicion;
  }
}

@Injectable()
export class FiltroEspecial {
  campo: string;
  condicion: string;
  constructor(campo: string, condicion: string) {
    this.campo = campo;
    this.condicion = condicion;
  }

}

@Injectable()
export class Subquery {
  bean: string;
  campo: string;
  alias: string;
  filtro: string;
  sentencia: string;
  constructor(bean: string, campo: string, alias: string, filtro: string) {
    this.bean = bean;
    this.campo = campo;
    this.alias = alias;
    this.filtro = filtro;
  }

}

@Injectable()
export class Consulta {
  /**Nombre del bean. */
  bean: string;
  /** Y indica que es un lsita de datoa, N es un solo registro.*/
  lista: string;
  /**Campos por los que se ordena la consulta */
  orderby: string;
  /**Numero de pagina en la que se encuenta la consulta 0 es la primera pagina*/
  pagina = 0;
  /**Numero de registros por a consultar por pagina, por defecto trae 10 registros */
  cantidad = 10;
  /**Filtros a aplicar en la consulta identificacion = 12 */
  filtro: Filtro[] = [];
  /**Filtros a aplicar en la consulta identificacion = 12 */
  filtroEspecial: FiltroEspecial[] = [];
  /**Subqueries de otras tablas con los cuales se arma subquierires corelacionados */
  subquery: Subquery[] = [];

  constructor(bean: string, lista: string, orderby: string, mfiltros: any, mfiltrosesp: any, mfiltrosigual: any = null) {
    this.bean = bean.toLocaleLowerCase();
    this.lista = lista;
    this.orderby = orderby;
    this.llenarFiltrosConsulta(mfiltros, mfiltrosigual);
    this.llenarFiltrosEspecialesConsulta(mfiltrosesp);
  }

  addSubquery(bean: string, campo: string, alias: string, filtro: string) {
    bean = bean.toLocaleLowerCase();
    const subquery = new Subquery(bean, campo, alias, filtro);
    this.subquery.push(subquery);
  }

  addSubqueryPorSentencia(sentencia: string, alias: string) {
    const subquery = new Subquery('', '', alias, '');
    subquery.sentencia = sentencia;
    this.subquery.push(subquery);
  }

  /**Enterga arreglo con objetos Filtro con los cuales se ejecuta una consulta. */
  llenarFiltrosConsulta(mfiltros: any, mfiltrosigual: any) {
    for (const i in mfiltros) {
      // elimina filtros previso que estan el map de filtros.
      if (mfiltros.hasOwnProperty(i)) {
        this.eliminarFiltro(i);
      }
    }
    for (const i in mfiltrosigual) {
      // elimina filtros previso que estan el map de filtros.
      if (mfiltrosigual.hasOwnProperty(i)) {
        this.eliminarFiltro(i);
      }
    }
    for (const i in mfiltros) {
      if (mfiltros.hasOwnProperty(i)) {
        const valor = mfiltros[i];
        if (valor !== undefined && valor !== '') {
          const f = new Filtro(i, valor);
          this.filtro.push(f);
        }
      }
    }
    for (const i in mfiltrosigual) {
      if (mfiltrosigual.hasOwnProperty(i)) {
        const valor = mfiltrosigual[i];
        if (valor !== undefined && valor !== '') {
          this.addFiltroCondicion(i, valor, '=');
        }
      }
    }

  }

  /**Elimina un filtro dado el nombre del campo. */
  private eliminarFiltro(campo: string) {
    let j = 0;
    let existe = false;
    for (const i in this.filtro) {
      if (this.filtro.hasOwnProperty(i)) {
        const f = this.filtro[i];
        if (f.campo === campo) {
          existe = true;
          break;
        }
        j = j + 1;
      }

    }
    if (existe) {
      this.filtro.splice(j, 1);
    }

  }

  /**Adicona un objeto filtro, en los componentes los filtros siempre se asocian a mfiltros. */
  public addFiltro(campo: string, valor: string) {
    const filtro = new Filtro(campo, valor);
    this.filtro.push(filtro);
    return filtro;
  }

  public addFiltroCondicion(campo: string, valor: any, condicion: string) {
    const filtro = this.addFiltro(campo, valor);
    if (condicion !== undefined) {
      filtro.setCondicion(condicion);
    }
  }

  /**Enterga arreglo con objetos Filtro con los cuales se ejecuta una consulta. */
  llenarFiltrosEspecialesConsulta(mfiltros: any) {
    for (const i in mfiltros) {
      // elimina filtros previso que estan el map de filtros.
      if (mfiltros.hasOwnProperty(i)) {
        this.eliminarFiltro(i);
      }
    }
    for (const i in mfiltros) {
      if (mfiltros.hasOwnProperty(i)) {
        const valor = mfiltros[i];
        if (valor !== undefined && valor !== '') {
          this.addFiltroEspecial(i, valor);
        }
      }
    }
  }

  /**Adicona un objeto filtro, en los componentes los filtros siempre se asocian a mfiltros. */
  public addFiltroEspecial(campo: string, condicion: string) {
    const filtroEsp = new FiltroEspecial(campo, condicion);
    this.filtroEspecial.push(filtroEsp);
    return filtroEsp;
  }

  /**Fija el numero de registros a obener del core */
  setCantidad(cantidad: number) {
    this.cantidad = cantidad;
  }

  setPagina(tipo: string) {
    switch (tipo) {
      case 'A':
        // pagina anterior
        this.pagina = this.pagina - this.cantidad;
        this.pagina = this.pagina < 0 ? 0 : this.pagina;
        break;
      case 'S':
        // pagina siguiente
        this.pagina = this.pagina + this.cantidad;
        break;
      default:
        this.pagina = 0;
    }
  }
}

@Injectable()
export class Mantenimiento {
  /**Nombre del bean. */
  bean: string;
  /**Orden de grabado en la base de datos. */
  pos: number;
  /**Registros a insertar en la base de datos. */
  ins: Array<any> = [];
  /**Registros a actualizar en la base de datos. */
  upd: Array<any> = [];
  /**Registros a eliminar en la base de datos. */
  del: Array<any> = [];
  /**true, indica que el mantenimeinto tiene rubros monetarios. */
  esMonetario = false;
  /**true, indica que los datos del mantenimiento se envian a un store procedure. */
  enviarSP = false;

  constructor(bean: string, posicion: number) {
    this.bean = bean;
    this.pos = posicion;
  }

  /**Encera registros a insertar y actualizar, para crear con los nuevos datos tomados de la lista de registros. */
  encerar() {
    this.ins = [];
    this.upd = [];
  }

  /**Verifica si el mantenimiento tiene algo que enviar al core. */
  tieneCambios() {
    let tienecambios = false;
    if (this.ins.length > 0) {
      tienecambios = true;
    }
    if (this.upd.length > 0) {
      tienecambios = true;
    }
    if (this.del.length > 0) {
      tienecambios = true;
    }
    return tienecambios;
  }

  completarInsUpdDel(registros: any, registrosOriginales: any, registrosEliminados: any) {
    this.encerar(); // Encerar insert y update, el delete se encera en el postCommit.
    this.adicionaEliminados(registrosEliminados); // Adiciona registros a eliminar.
    if (this.esMonetario) {
      for (const i in registros) {
        if (registros.hasOwnProperty(i)) {
          const reg = registros[i];
          const r = {};
          if (reg.monto !== undefined && reg.monto !== null) {
            r[reg.rubro] = reg.monto;
            this.ins.push(r);
          }
        }
      }
    } else {
      for (const i in registros) {
        if (registros.hasOwnProperty(i)) {
          const reg = registros[i];
          // Clona el registro a realizar insert o update para no afectar la funcionalidad de primeng
          const r = JSON.parse(JSON.stringify(reg));
          if (r.hasOwnProperty('_$visited')) {
            delete r._$visited;
          }
          // Los nuevos van primero
          if (r.hasOwnProperty('esnuevo') && reg.esnuevo) {
            this.ins.push(r);
            continue;
          }
          if (this.existeCambiosRegistro(registrosOriginales, r)) {
            r.actualizar = true;
            reg.actualizar = true;
            this.upd.push(r);
            continue;
          }
        }
      }
    }
  }

  /**Adiciona registros a eliminar. */
  private adicionaEliminados(registrosEliminados: any) {
    for (const i in registrosEliminados) {
      if (registrosEliminados.hasOwnProperty(i)) {
        const reg = registrosEliminados[i];
        this.del.push(reg);
      }
    }
  }

  /**Verifica que existan cambios en los registros. */
  private existeCambiosRegistro(registrosOriginales: any, registro: any) {
    let existeCambios = false;
    let aux: any;
    if (registrosOriginales === undefined) {
      return existeCambios;
    }
    for (const i in registrosOriginales) {
      if (registrosOriginales.hasOwnProperty(i)) {
        const reg = registrosOriginales[i];
        if (reg.idreg === registro.idreg) {
          aux = reg;
          break;
        }
      }
    }
    if (aux === undefined) {
      return existeCambios;
    }
    const a = JSON.stringify(registro);
    const b = JSON.stringify(aux);
    if (a !== b) {
      existeCambios = true;
    }
    return existeCambios;
  }

  /**Actualiza optlock, veractual y pk de los registros nuevos o actualizados. */
  postCommit(registros: any, registrosRespuesta: any) {
    // Actualiza optlock y veractual de los registros creados o actualizados.
    for (const i in registros) {
      if (registros.hasOwnProperty(i)) {
        const reg = registros[i];
        if (reg.esnuevo || reg.actualizar) {
          if (reg.hasOwnProperty('optlock') && reg.actualizar) {
            reg.optlock = reg.optlock + 1;
          }
          if (reg.hasOwnProperty('optlock') && reg.esnuevo) {
            reg.optlock = 0;
          }
          if (reg.hasOwnProperty('veractual')) {
            if (reg.veractual === undefined) {
              reg.veractual = 0;
            } else {
              reg.veractual = reg.veractual + 1;
            }
          }
        }
        if (registrosRespuesta !== undefined) {
          this.postCommitPk(reg, registrosRespuesta);
        }
        reg.esnuevo = false;
        reg.actualizar = false;
        // encera registros eliminados.
        this.del = [];
      }
    }
  }

  /**Actualiza pk del registro, seimepre y cuando el core retorne un objeto con el pk de la tabla. */
  private postCommitPk(reg: any, registrosRespuesta: any) {
    if (!reg.hasOwnProperty('idreg')) {
      return;
    }
    for (const i in registrosRespuesta) {
      if (registrosRespuesta.hasOwnProperty(i)) {
        const resp = registrosRespuesta[i];
        if (resp.idreg !== reg.idreg) {
          continue;
        }
        this.postCommitPkRegistro(reg, resp);
      }
    }
  }

  /**Actualiza pk del registro, seimepre y cuando el core retorne un objeto con el pk de la tabla. */
  private postCommitPkRegistro(reg: any, registrosRespuesta: any) {
    for (const campo in registrosRespuesta) {
      if (registrosRespuesta.hasOwnProperty(campo)) {
        const valor = registrosRespuesta[campo];
        if (campo.startsWith('idreg')) {
          continue;
        }
        reg[campo] = valor;
      }
    }
  }

}
