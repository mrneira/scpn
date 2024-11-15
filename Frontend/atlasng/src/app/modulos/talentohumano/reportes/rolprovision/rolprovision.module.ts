import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RolprovisionRoutingModule } from './rolprovision.routing';

import { RolprovisionComponent } from './componentes/rolprovision.component';
import {ParametroAnualModule} from '../../lov/parametroanual/lov.parametroanual.module'
import { LovNominaModule } from '../../lov/nomina/lov.nomina.module';
import {JasperModule} from '../../../../util/componentes/jasper/jasper.module';


@NgModule({
  imports: [SharedModule, RolprovisionRoutingModule,ParametroAnualModule ,LovNominaModule,JasperModule],
  declarations: [RolprovisionComponent]
})
export class RolProvisionModule { }
