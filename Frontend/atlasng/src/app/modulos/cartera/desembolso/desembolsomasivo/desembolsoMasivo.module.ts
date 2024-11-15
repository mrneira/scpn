import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DesembolsoMasivoRoutingModule } from './desembolsoMasivo.routing';
import { DesembolsoMasivoComponent } from './componentes/desembolsoMasivo.component';

@NgModule({
  imports: [SharedModule, DesembolsoMasivoRoutingModule],
  declarations: [DesembolsoMasivoComponent]
})
export class DesembolsoMasivoModule { }
