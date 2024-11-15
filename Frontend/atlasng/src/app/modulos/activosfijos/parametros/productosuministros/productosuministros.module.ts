import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ProductoSuministrosRoutingModule } from './productosuministros.routing';

import { ProductoSuministrosComponent } from './componentes/productosuministros.component';
import { LovProductosModule } from '../../lov/productos/lov.productos.module';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';
import { AccionesArbolModule } from '../../../../util/componentes/accionesarbol/accionesArbol.module';

import { LovTransaccionesModule } from '../../../generales/lov/transacciones/lov.transacciones.module';
import { TreeTableModule} from 'primeng/primeng';
import { SelectButtonModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, ProductoSuministrosRoutingModule, AccionesArbolModule, TreeTableModule, SelectButtonModule,
  LovProductosModule, LovCuentasContablesModule, LovTransaccionesModule ],
  declarations: [ProductoSuministrosComponent]
})
export class ProductoSuministrosModule { }
