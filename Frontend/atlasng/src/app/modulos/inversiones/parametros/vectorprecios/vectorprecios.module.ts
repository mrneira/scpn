import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { VectorpreciosRoutingModule } from './vectorprecios.routing';
import { LovInversionesModule } from '../../../inversiones/lov/inversiones/lov.inversiones.module';
import { VectorpreciosComponent } from './componentes/vectorprecios.component';

@NgModule({
  imports: [SharedModule, VectorpreciosRoutingModule, LovInversionesModule],
  declarations: [VectorpreciosComponent]
})
export class VectorpreciosModule { }
