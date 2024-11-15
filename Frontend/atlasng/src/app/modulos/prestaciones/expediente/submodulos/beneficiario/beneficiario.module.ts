import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { BeneficiarioRoutingModule } from './beneficiario.routing';

import { BeneficiarioComponent } from './componentes/beneficiario.component';

import { LovPersonasModule } from '../../../../personas/lov/personas/lov.personas.module';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, BeneficiarioRoutingModule, LovPersonasModule, JasperModule ],
  declarations: [BeneficiarioComponent],
  exports: [BeneficiarioComponent]
})
export class BeneficiarioModule { }
