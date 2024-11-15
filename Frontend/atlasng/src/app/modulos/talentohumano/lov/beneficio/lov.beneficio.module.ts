import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovBeneficioRoutingModule } from './lov.beneficio.routing';
import { LovBeneficioComponent } from './componentes/lov.beneficio.component';

@NgModule({
  imports: [SharedModule, LovBeneficioRoutingModule],
  declarations: [LovBeneficioComponent],
  exports: [LovBeneficioComponent]
})
export class LovBeneficioModule { }

