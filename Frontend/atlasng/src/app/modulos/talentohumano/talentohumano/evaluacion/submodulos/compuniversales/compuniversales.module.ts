import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { CompuniversalesRoutingModule } from './compuniversales.routing';

import { CompuniversalesComponent } from './componentes/compuniversales.component';

import { OverlayPanelModule } from 'primeng/primeng';


@NgModule({
  imports: [SharedModule, CompuniversalesRoutingModule,OverlayPanelModule],
  declarations: [CompuniversalesComponent],
  exports: [CompuniversalesComponent]
})
export class CompuniversalesModule { }
