import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { SegmentosRoutingModule } from './segmentos.routing';

import { SegmentosComponent } from './componentes/segmentos.component';


@NgModule({
  imports: [SharedModule, SegmentosRoutingModule ],
  declarations: [SegmentosComponent]
})
export class SegmentosModule { }
