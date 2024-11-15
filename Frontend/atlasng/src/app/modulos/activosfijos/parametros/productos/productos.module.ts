import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ProductosRoutingModule } from './productos.routing';

import { ProductosComponent } from './componentes/productos.component';
import { LovProductosModule } from '../../lov/productos/lov.productos.module';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';
import { AccionesArbolModule } from '../../../../util/componentes/accionesarbol/accionesArbol.module';

import { LovTransaccionesModule } from '../../../generales/lov/transacciones/lov.transacciones.module';
import { TreeTableModule} from 'primeng/primeng';
import { SelectButtonModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, ProductosRoutingModule, AccionesArbolModule, TreeTableModule, SelectButtonModule,
  LovProductosModule, LovCuentasContablesModule, LovTransaccionesModule ],
  declarations: [ProductosComponent]
})
export class ProductosModule { }
