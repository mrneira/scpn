import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CotizadorSegurosRoutingModule } from './cotizadorSeguros.routing';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

import { CotizadorSegurosComponent } from './componentes/cotizadorSeguros.component';
import { DatosGeneralesComponent } from './componentes/_datosGenerales.component';
import { ProductoModule } from '../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { TipoSeguroModule } from '../../../seguros/parametros/tipoSeguro/tipoSeguro.module';

@NgModule({
  imports: [SharedModule, CotizadorSegurosRoutingModule, ProductoModule,
    TipoProductoModule, LovPersonasModule, JasperModule],
  declarations: [CotizadorSegurosComponent, DatosGeneralesComponent]
})
export class CotizadorSegurosModule { }
