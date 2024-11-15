import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { MetadetalleRoutingModule } from './metadetalle.routing';

import { MetaDetalleComponent } from './componentes/metadetalle.component';



@NgModule({
  imports: [SharedModule, MetadetalleRoutingModule],
  declarations: [MetaDetalleComponent],
  exports: [MetaDetalleComponent]
})
export class MetaDetalleModule { }
