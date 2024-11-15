import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';

import { LovPaisesModule } from '../../../../../generales/lov/paises/lov.paises.module';

import { ConocimientoComponent } from '../conocimiento/conocimiento/conocimiento.component'

import { OverlayPanelModule } from 'primeng/primeng';
@NgModule({
  imports: [SharedModule, LovPaisesModule ,OverlayPanelModule],
  declarations: [ConocimientoComponent],
  exports: [ConocimientoComponent]
})
export class ConocimientoModule { }
