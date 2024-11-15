import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ResumenvarNacionalRoutingModule } from './resumenvarnacional.routing';

import { ResumenvarNacionalComponent } from './componentes/resumenvarnacional.component'
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';


@NgModule({
  imports: [SharedModule, ResumenvarNacionalRoutingModule, JasperModule, TipoProductoModule ],
  declarations: [ResumenvarNacionalComponent]

})
export class ResumenvarNacionalModule { }
