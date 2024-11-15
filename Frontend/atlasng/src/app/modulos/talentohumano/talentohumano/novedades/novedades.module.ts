import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { NovedadesRoutingModule } from './novedades.routing';

import { NovedadesComponent } from './componentes/novedades.component';

import{LovFuncionariosModule} from '../../lov/funcionarios/lov.funcionarios.module';

import { GestorDocumentalModule } from '../../../gestordocumental/gestordocumental.module';

@NgModule({
  imports: [SharedModule, NovedadesRoutingModule, LovFuncionariosModule,GestorDocumentalModule],
  declarations: [NovedadesComponent]
})
export class NovedadModule { }
