import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ResumenExteriorRoutingModule } from './resumenExterior.routing';

import { ResumenExteriorComponent } from './componentes/resumenExterior.component'
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';


@NgModule({
  imports: [SharedModule, ResumenExteriorRoutingModule, JasperModule, TipoProductoModule ],
  declarations: [ResumenExteriorComponent]

})
export class ResumenExteriorModule { }