import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ResumenBonosRoutingModule } from './resumenBonos.routing';

import { ResumenBonosComponent } from './componentes/resumenBonos.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';


@NgModule({
  imports: [SharedModule, ResumenBonosRoutingModule, JasperModule, TipoProductoModule ],
  declarations: [ResumenBonosComponent]

})
export class ResumenBonosModule { }
