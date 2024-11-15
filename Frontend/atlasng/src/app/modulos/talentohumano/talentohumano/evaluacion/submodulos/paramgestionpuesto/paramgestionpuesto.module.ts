import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';

import { LovPaisesModule } from '../../../../../generales/lov/paises/lov.paises.module';

import { ParamgestionpuestoComponent } from './componentes/paramgestionpuesto.component';

import { OverlayPanelModule } from 'primeng/primeng';
@NgModule({
  imports: [SharedModule, LovPaisesModule ,OverlayPanelModule],
  declarations: [ParamgestionpuestoComponent],
  exports: [ParamgestionpuestoComponent]
})
export class ParamgestionpuestoModule { }
