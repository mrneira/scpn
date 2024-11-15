import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ImpuestoRentaRoutingModule } from './impuestorenta.routing';

import { ImpuestoRentaComponent } from './componentes/impuestorenta.component';

import{LovFuncionariosModule} from '../../lov/funcionarios/lov.funcionarios.module';

import { GestorDocumentalModule } from '../../../gestordocumental/gestordocumental.module';

@NgModule({
  imports: [SharedModule, ImpuestoRentaRoutingModule, LovFuncionariosModule,GestorDocumentalModule],
  declarations: [ImpuestoRentaComponent]
})
export class ImpuestoRentaModule { }
