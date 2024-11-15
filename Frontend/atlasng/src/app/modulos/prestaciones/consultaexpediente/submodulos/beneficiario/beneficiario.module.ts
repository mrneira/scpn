import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { BeneficiarioRoutingModule } from './beneficiario.routing';

import { BeneficiarioComponent } from './componentes/beneficiario.component';

import { LovPersonasModule } from '../../../../personas/lov/personas/lov.personas.module';

@NgModule({
  imports: [SharedModule, BeneficiarioRoutingModule, LovPersonasModule ],
  declarations: [BeneficiarioComponent],
  exports: [BeneficiarioComponent]
})
export class BeneficiarioModule { }
