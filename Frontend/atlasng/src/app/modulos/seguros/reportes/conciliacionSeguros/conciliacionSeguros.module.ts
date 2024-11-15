import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConciliacionSegurosRoutingModule } from './conciliacionSeguros.routing';
import { ConciliacionSegurosComponent } from './componentes/conciliacionSeguros.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { ProductoModule } from '../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';

@NgModule({
  imports: [SharedModule, ConciliacionSegurosRoutingModule, JasperModule, ProductoModule, TipoProductoModule],
  declarations: [ConciliacionSegurosComponent]

})
export class ConciliacionSegurosModule { }
