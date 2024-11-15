import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RiesgoemisorRoutingModule } from './riesgoemisor.routing';
import { RiesgoemisorComponent } from './componentes/riesgoemisor.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovInversionesModule } from '../../../inversiones/lov/inversiones/lov.inversiones.module';
import { LovRentavariableModule } from '../../../inversiones/lov/rentavariable/lov.rentavariable.module';
import { SpinnerModule } from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, RiesgoemisorRoutingModule, LovInversionesModule, JasperModule, LovRentavariableModule, SpinnerModule ],
  declarations: [RiesgoemisorComponent]
})
export class RiesgoemisorModule { }
