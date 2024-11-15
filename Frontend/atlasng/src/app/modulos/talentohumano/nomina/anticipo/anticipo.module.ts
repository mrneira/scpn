import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AnticipoRoutingModule } from './anticipo.routing';

import { AnticipoComponent } from './componentes/anticipo.component';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';


import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

import{ParametroAnualModule} from '../../lov/parametroanual/lov.parametroanual.module';

@NgModule({
  imports: [SharedModule, AnticipoRoutingModule,LovFuncionariosModule,ParametroAnualModule,JasperModule ],
  declarations: [AnticipoComponent]
})
export class AnticipoModule { }
