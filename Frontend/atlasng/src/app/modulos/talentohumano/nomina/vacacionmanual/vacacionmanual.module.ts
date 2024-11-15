import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { VacacionmanualRoutingModule } from './vacacionmanual.routing';

import { VacacionManualComponent } from './componentes/vacacionmanual.component';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';
import {LovDescuentoModule} from '../../lov/descuento/lov.descuento.module';

import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import{ParametroAnualModule} from '../../lov/parametroanual/lov.parametroanual.module';

@NgModule({
  imports: [SharedModule, VacacionmanualRoutingModule,LovFuncionariosModule,LovDescuentoModule,ParametroAnualModule,JasperModule ],
  declarations: [VacacionManualComponent]
})
export class VacacionManualModule { }
