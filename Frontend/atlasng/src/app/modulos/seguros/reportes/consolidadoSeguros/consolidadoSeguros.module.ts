import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConsolidadoSegurosRoutingModule } from './consolidadoSeguros.routing';
import { ConsolidadoSegurosComponent } from './componentes/consolidadoSeguros.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { ProductoModule } from '../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';

@NgModule({
  imports: [SharedModule, ConsolidadoSegurosRoutingModule, JasperModule, ProductoModule, TipoProductoModule],
  declarations: [ConsolidadoSegurosComponent]

})
export class ConsolidadoSegurosModule { }
