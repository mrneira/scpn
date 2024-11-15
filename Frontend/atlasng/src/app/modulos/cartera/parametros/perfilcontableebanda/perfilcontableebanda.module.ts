import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PerfilContableEbandaRoutingModule } from './perfilcontableebanda.routing';

import { PerfilContableEbandaComponent } from '././componentes/perfilcontableebanda.component';
import { LovProductoModule } from '../../../generales/lov/producto/lov.producto.module';
import { LovTipoProductoModule } from '../../../generales/lov/tipoproducto/lov.tipoProducto.module';


@NgModule({
  imports: [SharedModule, PerfilContableEbandaRoutingModule, LovProductoModule, LovTipoProductoModule ],
  declarations: [PerfilContableEbandaComponent]
})
export class PerfilContableEbandaModule { }
