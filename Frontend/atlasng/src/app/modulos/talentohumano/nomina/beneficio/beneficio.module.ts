import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { BeneficioRoutingModule } from './beneficio.routing';

import { BeneficioComponent } from './componentes/beneficio.component';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';
import {LovBeneficioModule } from '../../lov/beneficio/lov.beneficio.module';


import{ParametroAnualModule} from '../../lov/parametroanual/lov.parametroanual.module';

@NgModule({
  imports: [SharedModule, BeneficioRoutingModule,LovFuncionariosModule,LovBeneficioModule,ParametroAnualModule ],
  declarations: [BeneficioComponent]
})
export class BeneficioModule { }
