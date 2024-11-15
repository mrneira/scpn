import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ResumenBatchRoutingModule } from './ResumenBatch.routing';

import { ResumenBatchComponent } from './componentes/resumenBatch.component'
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';


@NgModule({
  imports: [SharedModule, ResumenBatchRoutingModule, JasperModule, TipoProductoModule ],
  declarations: [ResumenBatchComponent]

})
export class ResumenBatchModule { }
