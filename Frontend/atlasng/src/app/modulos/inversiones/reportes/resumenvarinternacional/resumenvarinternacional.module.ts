import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ResumenvarInternacionalRoutingModule } from './resumenvarinternacional.routing';

import { ResumenvarInternacionalComponent } from './componentes/resumenvarinternacional.component'
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';


@NgModule({
  imports: [SharedModule, ResumenvarInternacionalRoutingModule, JasperModule, TipoProductoModule ],
  declarations: [ResumenvarInternacionalComponent]

})
export class ResumenvarInternacionalModule { }
