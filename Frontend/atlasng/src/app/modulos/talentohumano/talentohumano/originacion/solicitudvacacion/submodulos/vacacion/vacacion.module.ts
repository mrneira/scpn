import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../../util/shared/shared.module';
import { VacacionRoutingModule } from './vacacion.routing';

import { VacacionComponent} from './componentes/vacacion.component';

import { LovFuncionariosModule } from '../../../../../lov/funcionarios/lov.funcionarios.module';
import { GestorDocumentalModule } from '../../../../../../gestordocumental/gestordocumental.module';

@NgModule({
  imports: [SharedModule, VacacionRoutingModule, LovFuncionariosModule,GestorDocumentalModule],
  declarations: [VacacionComponent],
  exports:[VacacionComponent]
})
export class VacacionModule { }
