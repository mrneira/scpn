import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PerfilContableProductoRoutingModule } from './perfilContableProducto.routing';

import { PerfilContableProductoComponent } from './componentes/perfilContableProducto.component';
import { LovProductoModule } from '../../../generales/lov/producto/lov.producto.module';
import { LovTipoProductoModule } from '../../../generales/lov/tipoproducto/lov.tipoProducto.module';


@NgModule({
  imports: [SharedModule, PerfilContableProductoRoutingModule, LovProductoModule, LovTipoProductoModule ],
  declarations: [PerfilContableProductoComponent]
})
export class PerfilContableProductoModule { }
