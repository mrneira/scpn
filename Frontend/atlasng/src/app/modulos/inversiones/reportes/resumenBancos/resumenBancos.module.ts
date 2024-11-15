import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ResumenBancosRoutingModule } from './resumenBancos.routing';

import { ResumenBancosComponent } from './componentes/resumenBancos.component'
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';


@NgModule({
  imports: [SharedModule, ResumenBancosRoutingModule, JasperModule, TipoProductoModule ],
  declarations: [ResumenBancosComponent]

})
export class ResumenBancosModule { }
